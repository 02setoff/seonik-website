import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auth/check-lockout?email=xxx
// 로그인 잠금 상태 확인 (AuthModal에서 UI 표시용)
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ locked: false });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { loginAttempts: true, loginLockedUntil: true },
    });

    if (!user) return NextResponse.json({ locked: false });

    const now = new Date();
    if (user.loginLockedUntil && now < user.loginLockedUntil) {
      const remainingMs = user.loginLockedUntil.getTime() - now.getTime();
      return NextResponse.json({
        locked: true,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        attempts: user.loginAttempts,
      });
    }

    return NextResponse.json({
      locked: false,
      attempts: user.loginAttempts ?? 0,
    });
  } catch {
    return NextResponse.json({ locked: false });
  }
}
