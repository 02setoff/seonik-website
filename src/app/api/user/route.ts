import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
      postViews: {
        select: {
          postId: true,
          viewedAt: true,
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
        },
        orderBy: { viewedAt: "desc" },
        take: 100,
      },
    },
  });

  if (!user) return NextResponse.json(null);

  // 최근 읽은 글: 중복 제거 후 최신 20개
  const seenPostIds = new Set<string>();
  const recentViews = [];
  for (const v of user.postViews) {
    if (!seenPostIds.has(v.postId)) {
      seenPostIds.add(v.postId);
      recentViews.push({ post: v.post, viewedAt: v.viewedAt });
      if (recentViews.length >= 20) break;
    }
  }

  // 카테고리별 읽은 횟수 통계
  const categoryStats: Record<string, number> = {};
  for (const v of user.postViews) {
    const cat = v.post.category;
    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
  }
  const categoryStatsSorted = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  return NextResponse.json({
    ...user,
    recentViews,
    categoryStats: categoryStatsSorted,
    totalRead: seenPostIds.size,
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { name, occupation, howFound, joinReason, email, currentPassword, newPassword } = await request.json();

    // 이름 중복 확인
    if (name) {
      const existing = await prisma.user.findFirst({
        where: { name, NOT: { email: session.user.email } },
      });
      if (existing) {
        return NextResponse.json({ error: "이미 사용 중인 이름입니다." }, { status: 400 });
      }
    }

    // 이메일 변경
    if (email && email !== session.user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
      }
      const existing = await prisma.user.findFirst({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 400 });
      }
    }

    // 비밀번호 변경
    let hashedPassword: string | undefined;
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "현재 비밀번호를 입력해주세요." }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "새 비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
      }
      const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!currentUser?.password) {
        return NextResponse.json({ error: "비밀번호를 변경할 수 없습니다. (소셜 로그인 계정)" }, { status: 400 });
      }
      const isValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다." }, { status: 400 });
      }
      hashedPassword = await bcrypt.hash(newPassword, 12);
    }

    const updateData: Record<string, unknown> = {
      name: name || null,
      occupation: occupation || null,
      howFound: howFound || null,
      joinReason: joinReason || null,
    };
    if (email && email !== session.user.email) updateData.email = email;
    if (hashedPassword) updateData.password = hashedPassword;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
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
