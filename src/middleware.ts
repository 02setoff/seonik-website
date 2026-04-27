import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // /admin 으로 시작하는 모든 경로 → 완전 차단 (빈 404, 아무 페이지도 렌더하지 않음)
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
