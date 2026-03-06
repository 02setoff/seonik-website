import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "관리자 — 선익 SEONIK" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8F9FA" }}>
      {/* 관리자 상단 바 */}
      <div className="bg-[#0F172A] text-white" style={{ padding: "0 40px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <span style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}>
            SEONIK ADMIN
          </span>
          <nav style={{ display: "flex", gap: "24px" }}>
            <Link href="/admin" className="text-[#94A3B8] hover:text-white transition-colors duration-150"
              style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
              대시보드
            </Link>
            <Link href="/admin/posts/new" className="text-[#94A3B8] hover:text-white transition-colors duration-150"
              style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
              새 글 작성
            </Link>
            <Link href="/admin/contacts" className="text-[#94A3B8] hover:text-white transition-colors duration-150"
              style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
              문의함
            </Link>
            <Link href="/admin/users" className="text-[#94A3B8] hover:text-white transition-colors duration-150"
              style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
              회원 관리
            </Link>
            <Link href="/admin/stats" className="text-[#94A3B8] hover:text-white transition-colors duration-150"
              style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
              통계
            </Link>
            <Link href="/" className="text-[#94A3B8] hover:text-white transition-colors duration-150"
              style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
              사이트 보기 →
            </Link>
          </nav>
        </div>
        <span style={{ fontSize: "12px", color: "#475569", fontFamily: "'Pretendard', sans-serif" }}>
          {session.user?.email}
        </span>
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        {children}
      </div>
    </div>
  );
}
