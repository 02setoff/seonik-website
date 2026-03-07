import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PostField = "occupation" | "joinReason";

async function getPopularPosts(field: PostField, value: string | null, excludeUserId: string) {
  if (!value) return [];

  const sameUsers = await prisma.user.findMany({
    where: { [field]: value, id: { not: excludeUserId } },
    select: { id: true },
  });
  if (sameUsers.length === 0) return [];

  const userIds = sameUsers.map((u) => u.id);

  const viewCounts = await prisma.postView.groupBy({
    by: ["postId"],
    where: { userId: { in: userIds } },
    _count: { postId: true },
    orderBy: { _count: { postId: "desc" } },
    take: 4,
  });
  if (viewCounts.length === 0) return [];

  const postIds = viewCounts.map((v) => v.postId);
  const posts = await prisma.post.findMany({
    where: { id: { in: postIds }, published: true },
    select: {
      id: true, title: true, summary: true, content: true,
      category: true, createdAt: true, viewCount: true,
      _count: { select: { likes: true } },
    },
  });

  // postView 정렬 순서 유지
  const postMap = new Map(posts.map((p) => [p.id, p]));
  return viewCounts.map((v) => postMap.get(v.postId)).filter(Boolean);
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

  const [byOccupation, byJoinReason] = await Promise.all([
    getPopularPosts("occupation", user.occupation, user.id),
    getPopularPosts("joinReason", user.joinReason, user.id),
  ]);

  return NextResponse.json({
    byOccupation,
    byJoinReason,
    userOccupation: user.occupation,
    userJoinReason: user.joinReason,
  });
}
