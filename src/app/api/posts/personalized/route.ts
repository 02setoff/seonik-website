import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const POST_SELECT = {
  id: true, title: true, summary: true, content: true,
  category: true, createdAt: true, viewCount: true,
  _count: { select: { likes: true } },
} as const;

type PostField = "occupation" | "joinReason";

/** 같은 occupation/joinReason 유저들이 많이 본 글 */
async function getPopularByPeers(field: PostField, value: string | null, excludeUserId: string) {
  if (!value) return { posts: [], isFallback: true };

  const sameUsers = await prisma.user.findMany({
    where: { [field]: value, id: { not: excludeUserId } },
    select: { id: true },
  });

  if (sameUsers.length > 0) {
    const userIds = sameUsers.map((u) => u.id);
    const viewCounts = await prisma.postView.groupBy({
      by: ["postId"],
      where: { userId: { in: userIds } },
      _count: { postId: true },
      orderBy: { _count: { postId: "desc" } },
      take: 4,
    });

    if (viewCounts.length > 0) {
      const postIds = viewCounts.map((v) => v.postId);
      const posts = await prisma.post.findMany({
        where: { id: { in: postIds }, published: true },
        select: POST_SELECT,
      });
      const postMap = new Map(posts.map((p) => [p.id, p]));
      const ordered = viewCounts.map((v) => postMap.get(v.postId)).filter(Boolean) as typeof posts;
      if (ordered.length > 0) return { posts: ordered, isFallback: false };
    }
  }

  return { posts: [], isFallback: true };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ byOccupation: [], byJoinReason: [], userOccupation: null, userJoinReason: null });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, occupation: true, joinReason: true },
  });
  if (!user) return NextResponse.json({ byOccupation: [], byJoinReason: [], userOccupation: null, userJoinReason: null });

  const [occResult, joinResult] = await Promise.all([
    getPopularByPeers("occupation", user.occupation, user.id),
    getPopularByPeers("joinReason", user.joinReason, user.id),
  ]);

  // fallback: 조회수 top 4 (occupation), 최신 top 4 (joinReason) - 서로 다른 데이터
  let byOccupation = occResult.posts;
  let byJoinReason = joinResult.posts;
  let byOccupationFallback = occResult.isFallback;
  let byJoinReasonFallback = joinResult.isFallback;

  if (occResult.isFallback) {
    byOccupation = await prisma.post.findMany({
      where: { published: true },
      orderBy: { viewCount: "desc" },
      take: 4,
      select: POST_SELECT,
    });
  }

  if (joinResult.isFallback) {
    byJoinReason = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: POST_SELECT,
    });
  }

  return NextResponse.json({
    byOccupation,
    byJoinReason,
    byOccupationFallback,
    byJoinReasonFallback,
    userOccupation: user.occupation,
    userJoinReason: user.joinReason,
  });
}
