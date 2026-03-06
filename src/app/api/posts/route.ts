import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

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
