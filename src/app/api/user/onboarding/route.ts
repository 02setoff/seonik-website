import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { region, affiliation, startupStage } = await req.json();

  if (!region || !affiliation || !startupStage) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { region, affiliation, startupStage, onboarded: true },
    select: { region: true, affiliation: true, startupStage: true, onboarded: true },
  });

  return NextResponse.json(user);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { region: true, affiliation: true, startupStage: true, onboarded: true },
  });

  return NextResponse.json(user ?? {});
}
