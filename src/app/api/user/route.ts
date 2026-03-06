import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      occupation: true,
      howFound: true,
      joinReason: true,
      createdAt: true,
      likes: {
        select: {
          post: {
            select: {
              id: true,
              title: true,
              summary: true,
              content: true,
              category: true,
              createdAt: true,
              viewCount: true,
              _count: { select: { likes: true } },
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { name, occupation, howFound, joinReason } = await request.json();

    if (name) {
      const existing = await prisma.user.findFirst({
        where: { name, NOT: { email: session.user.email } },
      });
      if (existing) {
        return NextResponse.json({ error: "이미 사용 중인 이름입니다." }, { status: 400 });
      }
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || null,
        occupation: occupation || null,
        howFound: howFound || null,
        joinReason: joinReason || null,
      },
      select: { id: true, name: true, email: true, occupation: true, howFound: true, joinReason: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    await prisma.user.delete({ where: { email: session.user.email } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
