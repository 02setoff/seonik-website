import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "공지사항 | 선익 SEONIK",
  description: "선익(SEONIK)의 서비스 공지사항, 약관 변경 안내, 업데이트 소식입니다.",
};

export const dynamic = "force-dynamic";

const TYPE_STYLES: Record<string, React.CSSProperties> = {
  "서비스": { backgroundColor: "#0F172A", color: "white" },
  "약관": { backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)" },
  "업데이트": { backgroundColor: "#F0FDF4", color: "#16A34A" },
  "긴급": { backgroundColor: "#FEF2F2", color: "#DC2626" },
};

function formatDate(d: Date) {
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\. /g, ".").replace(/\.$/, "");
}

export default async function NoticePage() {
  const notices = await prisma.notice.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "clamp(40px,8vw,64px) clamp(20px,5vw,40px) 96px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.15em", marginBottom: "12px" }}>
          NOTICE
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          공지사항
        </h1>
        <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)" }}>
          서비스 업데이트, 약관 변경, 운영 안내를 확인하세요.
        </p>
      </div>

      {/* 공지 목록 */}
      {notices.length === 0 ? (
        <div style={{ padding: "64px", textAlign: "center", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "14px", color: "var(--text-disabled)", fontFamily: "'Pretendard', sans-serif" }}>
            등록된 공지사항이 없습니다.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {notices.map((notice, idx) => (
            <div
              key={notice.id}
              style={{
                borderTop: idx === 0 ? "2px solid var(--text-primary)" : "1px solid var(--border)",
                padding: "24px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                <span style={{
                  fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                  letterSpacing: "0.08em", padding: "3px 8px",
                  ...(TYPE_STYLES[notice.type] || TYPE_STYLES["서비스"]),
                  flexShrink: 0,
                }}>
                  {notice.type.toUpperCase()}
                </span>
                {notice.important && (
                  <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", color: "#EF4444", fontWeight: 700 }}>
                    ● 중요
                  </span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
                    {notice.title}
                  </p>
                  <pre style={{
                    fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)",
                    lineHeight: "1.85", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0,
                  }}>
                    {notice.content}
                  </pre>
                </div>
                <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", flexShrink: 0 }}>
                  {formatDate(notice.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      )}

      {/* 하단 */}
      <div style={{ marginTop: "48px", borderTop: "1px solid var(--border-light)", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontSize: "12px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif" }}>
          先益 — 앞서나가는 정보로 실행가들을 이롭게
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/terms" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            이용약관
          </Link>
          <Link href="/privacy" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            개인정보처리방침
          </Link>
        </div>
      </div>
    </div>
  );
}
