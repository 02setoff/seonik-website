import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const take = parseInt(searchParams.get("take") ?? "0");
  const cursor = searchParams.get("cursor");

  // 페이지네이션 모드: take > 0
  if (take > 0) {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: take + 1, // 다음 페이지 여부 확인용 (+1)
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true, title: true, summary: true, content: true, category: true, createdAt: true,
        viewCount: true, _count: { select: { likes: true } },
      },
    });

    const hasMore = posts.length > take;
    const items = hasMore ? posts.slice(0, take) : posts;

    return NextResponse.json({
      posts: items.map(p => ({
        id: p.id, title: p.title, summary: p.summary, content: p.content,
        category: p.category, createdAt: p.createdAt.toISOString(),
        viewCount: p.viewCount, likeCount: p._count.likes,
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  }

  // 기존 모드: 전체 반환 (FeedSection 호환성 유지)
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, summary: true, content: true, category: true, createdAt: true,
      viewCount: true, _count: { select: { likes: true } },
    },
  });

  return NextResponse.json(posts);
}
