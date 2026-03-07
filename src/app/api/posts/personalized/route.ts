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

/** 같은 occupation/joinReason 유저들이 많이 본 글 → fallback: 전체 인기글 */
async function getPopularPosts(field: PostField, value: string | null, excludeUserId: string) {
  if (!value) return { posts: [], isFallback: true };

  // 1차: 같은 특성 유저들의 PostView 집계
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

  // Fallback: viewCount 기준 전체 인기글
  const fallback = await prisma.post.findMany({
    where: { published: true },
    orderBy: { viewCount: "desc" },
    take: 4,
    select: POST_SELECT,
  });

  return { posts: fallback, isFallback: true };
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
    getPopularPosts("occupation", user.occupation, user.id),
    getPopularPosts("joinReason", user.joinReason, user.id),
  ]);

  return NextResponse.json({
    byOccupation: occResult.posts,
    byJoinReason: joinResult.posts,
    byOccupationFallback: occResult.isFallback,
    byJoinReasonFallback: joinResult.isFallback,
    userOccupation: user.occupation,
    userJoinReason: user.joinReason,
  });
}
