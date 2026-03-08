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
      <div className="bg-[#0F172A] text-white" style={{ flexShrink: 0 }}>
        {/* 1행: 브랜드 + 이메일 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(16px, 4vw, 40px)", height: "48px",
          borderBottom: "1px solid #1E293B",
        }}>
          <span style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", color: "white" }}>
            SEONIK ADMIN
          </span>
          <span style={{
            fontSize: "11px", color: "#475569", fontFamily: "Inter, sans-serif",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px",
          }}>
            {session.user?.email}
          </span>
        </div>

        {/* 2행: 네비게이션 (가로 스크롤) */}
        <nav style={{
          display: "flex", gap: "0",
          padding: "0 clamp(16px, 4vw, 40px)",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {[
            { href: "/admin", label: "대시보드" },
            { href: "/admin/posts/new", label: "새 글 작성" },
            { href: "/admin/notices", label: "공지사항" },
            { href: "/admin/contacts", label: "문의함" },
            { href: "/admin/users", label: "회원 관리" },
            { href: "/admin/stats", label: "통계" },
            { href: "/", label: "사이트 보기 →" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#94A3B8] hover:text-white transition-colors duration-150"
              style={{
                fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
                padding: "12px 14px", whiteSpace: "nowrap", display: "block",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div style={{ flex: 1, padding: "clamp(16px, 4vw, 40px)" }}>
        {children}
      </div>
    </div>
  );
}
