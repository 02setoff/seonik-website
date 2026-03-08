import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/auth/change-password
// 로그인된 사용자의 비밀번호 변경 (임시 비밀번호 후 강제 재설정 포함)
export async function POST(request: Request) {
  try {
    // Rate limit: 10회 / 10분 per IP
    const ip = getClientIp(request);
    const limited = rateLimit(`change-password:${ip}`, 10, 10 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { newPassword, confirmPassword } = await request.json();

    if (!newPassword || !confirmPassword) {
      return NextResponse.json({ error: "모든 항목을 입력해 주세요." }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        password: hashed,
        mustResetPassword: false,
        loginAttempts: 0,
        loginLockedUntil: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
