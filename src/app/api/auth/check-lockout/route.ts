import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// GET /api/auth/check-lockout?email=xxx
// 로그인 잠금 상태 확인 (AuthModal에서 UI 표시용)
export async function GET(request: NextRequest) {
  // Rate limit: 30회 / 10분 per IP (이메일 열거 방지)
  const ip = getClientIp(request);
  const limited = rateLimit(`check-lockout:${ip}`, 30, 10 * 60 * 1000);
  if (limited) {
    return NextResponse.json({ locked: false }, { status: 429 });
  }

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
