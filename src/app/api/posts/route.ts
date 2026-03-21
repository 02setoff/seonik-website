import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const take = parseInt(searchParams.get("take") ?? "0");
  const cursor = searchParams.get("cursor");

  const select = {
    id: true, code: true, title: true, summary: true, source: true,
    bmBreakdown: true, playbook: true, actionItems: true, content: true,
    category: true, isFree: true, isSubscriberOnly: true,
    createdAt: true, viewCount: true, _count: { select: { likes: true } },
  };

  // 페이지네이션 모드: take > 0
  if (take > 0) {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select,
    });

    const hasMore = posts.length > take;
    const items = hasMore ? posts.slice(0, take) : posts;

    return NextResponse.json({
      posts: items.map(p => ({
        id: p.id, code: p.code, title: p.title, summary: p.summary,
        source: p.source, bmBreakdown: p.bmBreakdown, playbook: p.playbook,
        actionItems: p.actionItems, content: p.content,
        category: p.category, isFree: p.isFree, isSubscriberOnly: p.isSubscriberOnly,
        createdAt: p.createdAt.toISOString(),
        viewCount: p.viewCount, likeCount: p._count.likes,
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  }

  // 기존 모드: 전체 반환
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    select,
  });

  return NextResponse.json(posts);
}
