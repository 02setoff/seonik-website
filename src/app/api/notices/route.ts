import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const notices = await prisma.notice.findMany({
    where: {
      published: true,
      OR: [
        { scheduledAt: null },
        { scheduledAt: { lte: now } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notices);
}
