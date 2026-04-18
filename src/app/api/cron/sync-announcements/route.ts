import { NextResponse } from "next/server";
import { syncAnnouncements } from "@/lib/sync-announcements";

export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncAnnouncements();
    console.log("[cron] 공고 동기화 완료:", result);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    console.error("[cron] 동기화 실패:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
