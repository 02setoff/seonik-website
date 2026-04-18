import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function matchesFilter(value: string, userValue: string | null): boolean {
  if (value === "전체" || value === "전국") return true;
  if (!userValue) return true;
  return value.split(",").map((v) => v.trim()).includes(userValue);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const affiliation = searchParams.get("affiliation");
  const stage = searchParams.get("stage");
  const source = searchParams.get("source");

  const now = new Date();
  const all = await prisma.announcement.findMany({
    where: {
      published: true,
      OR: [{ deadline: null }, { deadline: { gte: now } }],
      ...(source ? { source } : {}),
    },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
  });

  const filtered = all.filter((a) => {
    if (region && !matchesFilter(a.region, region)) return false;
    if (affiliation && !matchesFilter(a.affiliation, affiliation)) return false;
    if (stage && !matchesFilter(a.stage, stage)) return false;
    return true;
  });

  return NextResponse.json(filtered);
}
