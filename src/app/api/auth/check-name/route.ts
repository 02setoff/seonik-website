import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/auth/check-name
// 회원가입 시 이름 중복 여부 실시간 확인
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`check-name:${ip}`, 30, 10 * 60 * 1000); // 10분에 30회
    if (!rl.allowed) {
      return NextResponse.json({ error: "요청이 너무 많습니다." }, { status: 429 });
    }

    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ taken: false });
    }

    const existing = await prisma.user.findFirst({
      where: { name: name.trim() },
      select: { id: true },
    });

    return NextResponse.json({ taken: !!existing });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
