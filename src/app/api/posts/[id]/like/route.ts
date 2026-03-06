import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const count = await prisma.like.count({ where: { postId: params.id } });

  if (!session?.user?.email) {
    return NextResponse.json({ liked: false, count });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ liked: false, count });

  const like = await prisma.like.findUnique({
    where: { userId_postId: { userId: user.id, postId: params.id } },
  });

  return NextResponse.json({ liked: !!like, count });
}

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: user.id, postId: params.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { userId_postId: { userId: user.id, postId: params.id } } });
    const count = await prisma.like.count({ where: { postId: params.id } });
    return NextResponse.json({ liked: false, count });
  } else {
    await prisma.like.create({ data: { userId: user.id, postId: params.id } });
    const count = await prisma.like.count({ where: { postId: params.id } });
    return NextResponse.json({ liked: true, count });
  }
}
