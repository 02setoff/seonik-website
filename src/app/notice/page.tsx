import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "공지사항 | 선익 SEONIK",
  description: "선익(SEONIK)의 서비스 공지사항, 약관 변경 안내, 업데이트 소식입니다.",
};

const NOTICES = [
  {
    id: 1,
    type: "서비스",
    date: "2026.03.07",
    title: "선익 웹사이트 정식 오픈 안내",
    content: `선익(SEONIK) 웹사이트가 정식으로 오픈되었습니다.

RADAR · CORE · FLASH 3대 브리핑 채널을 통해 전 세계 창업·비즈니스 인텔리전스를 빠르게 제공합니다.

앞으로 선익과 함께 앞서나가는 정보로 실행가들을 이롭게 하겠습니다.

감사합니다.

— 선익 운영팀`,
    important: true,
  },
  {
    id: 2,
    type: "약관",
    date: "2026.03.07",
    title: "이용약관 및 개인정보처리방침 최초 시행 안내",
    content: `선익 서비스 이용약관 및 개인정보처리방침이 2026년 3월 7일부로 최초 시행됩니다.

주요 내용:
• 서비스 이용 조건 및 금지 행위
• 콘텐츠 이용 및 지식재산권 정책
• 개인정보 수집·이용·보관 기준
• 이메일 수신 동의 및 거부 절차

자세한 내용은 이용약관 및 개인정보처리방침 페이지를 확인해 주세요.

이후 약관 변경이 발생하는 경우, 불이익한 변경은 30일 전, 그 외 변경은 7일 전에 본 공지사항을 통해 사전 안내드립니다.`,
    important: false,
  },
];

const TYPE_STYLES: Record<string, React.CSSProperties> = {
  "서비스": { backgroundColor: "#0F172A", color: "white" },
  "약관": { backgroundColor: "#F1F5F9", color: "#475569" },
  "업데이트": { backgroundColor: "#F0FDF4", color: "#16A34A" },
  "긴급": { backgroundColor: "#FEF2F2", color: "#DC2626" },
};

export default function NoticePage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.15em", marginBottom: "12px" }}>
          NOTICE
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>
          공지사항
        </h1>
        <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>
          서비스 업데이트, 약관 변경, 운영 안내를 확인하세요.
        </p>
      </div>

      {/* 공지 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {NOTICES.map((notice, idx) => (
          <div key={notice.id}
            style={{
              borderTop: idx === 0 ? "2px solid #0F172A" : "1px solid #E2E8F0",
              padding: "24px 0",
            }}>
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
                <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>
                  {notice.title}
                </p>
                <pre style={{
                  fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#475569",
                  lineHeight: "1.85", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0,
                }}>
                  {notice.content}
                </pre>
              </div>
              <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8", flexShrink: 0 }}>
                {notice.date}
              </p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #E2E8F0" }} />
      </div>

      {/* 하단 */}
      <div style={{ marginTop: "48px", borderTop: "1px solid #F1F5F9", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
          先益 — 앞서나가는 정보로 실행가들을 이롭게
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/terms" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            이용약관
          </Link>
          <Link href="/privacy" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            개인정보처리방침
          </Link>
        </div>
      </div>
    </div>
  );
}
