import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 30회 / 10분 per IP (이메일 열거 방지)
  const ip = getClientIp(request);
  const limited = rateLimit(`check-email:${ip}`, 30, 10 * 60 * 1000);
  if (limited) {
    return NextResponse.json({ available: false }, { status: 429 });
  }

  const email = request.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ available: false });

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
