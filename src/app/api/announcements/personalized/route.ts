import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function matchesFilter(announcementValue: string, userValue: string | null): boolean {
  if (announcementValue === "전체" || announcementValue === "전국") return true;
  if (!userValue) return true;
  return announcementValue.split(",").map((v) => v.trim()).includes(userValue);
}

export async function GET() {
  const session = await getServerSession(authOptions);

  const now = new Date();
  const all = await prisma.announcement.findMany({
    where: {
      published: true,
      OR: [{ deadline: null }, { deadline: { gte: now } }],
    },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
  });

  if (!session?.user?.email) {
    return NextResponse.json({ announcements: all, personalized: false, profile: null });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { region: true, affiliation: true, startupStage: true, onboarded: true, name: true },
  });

  if (!user?.onboarded) {
    return NextResponse.json({ announcements: all, personalized: false, profile: user });
  }

  const filtered = all.filter((a) => {
    if (!matchesFilter(a.region, user.region)) return false;
    if (!matchesFilter(a.affiliation, user.affiliation)) return false;
    if (!matchesFilter(a.stage, user.startupStage)) return false;
    return true;
  });

  return NextResponse.json({
    announcements: filtered.length > 0 ? filtered : all,
    personalized: filtered.length > 0,
    profile: user,
  });
}
