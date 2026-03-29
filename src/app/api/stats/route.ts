import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ userCount });
  } catch {
    return NextResponse.json({ userCount: null });
  }
}
