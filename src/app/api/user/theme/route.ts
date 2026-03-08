import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// GET /api/user/theme — 로그인 회원의 테마 설정 조회
export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`user-theme-get:${ip}`, 30, 10 * 60 * 1000);
  if (limited) return NextResponse.json({ theme: "light" }, { status: 429 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { theme: true },
    });
    return NextResponse.json({ theme: user?.theme ?? "light" });
  } catch {
    return NextResponse.json({ theme: "light" });
  }
}

// PATCH /api/user/theme — 테마 설정 저장
export async function PATCH(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`user-theme-patch:${ip}`, 30, 10 * 60 * 1000);
  if (limited) return NextResponse.json({ error: "요청이 너무 많습니다." }, { status: 429 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { theme } = await request.json();
    if (theme !== "light" && theme !== "dark") {
      return NextResponse.json({ error: "올바르지 않은 테마 값입니다." }, { status: 400 });
    }
    await prisma.user.update({
      where: { email: session.user.email },
      data: { theme },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
