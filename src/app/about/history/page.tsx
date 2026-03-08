import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "연혁 | 선익 SEONIK",
  description: "선익의 발자취 — 설립부터 현재까지의 주요 마일스톤.",
};

const NAV = [
  { label: "미션", href: "/about/mission" },
  { label: "비전", href: "/about/vision" },
  { label: "회사명", href: "/about/company" },
  { label: "슬로건", href: "/about/slogan" },
  { label: "연혁", href: "/about/history" },
];

const MILESTONES = [
  {
    date: "2026.03",
    title: "선익 창업",
    desc: "정보 비대칭 해소를 목표로 선익(SEONIK) 창업. AI 네이티브 비즈니스 인텔리전스 브리핑 서비스 개발 시작.",
    tag: "FOUNDED",
  },
  {
    date: "2026.03",
    title: "선익 웹사이트 런칭",
    desc: "RADAR·CORE·FLASH 3대 브리핑 채널 오픈. 이메일 인증 기반 회원 서비스 정식 시작.",
    tag: "LAUNCH",
  },
];

export default function HistoryPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "clamp(40px,8vw,64px) clamp(20px,5vw,40px) 96px" }}>
      {/* About 서브 네비 */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "48px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              color: item.href === "/about/history" ? "var(--text-primary)" : "var(--text-placeholder)",
              fontWeight: item.href === "/about/history" ? 700 : 400,
              textDecoration: "none",
              borderBottom: item.href === "/about/history" ? "2px solid var(--text-primary)" : "2px solid transparent",
              paddingBottom: "16px", marginBottom: "-17px",
            }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.15em", marginBottom: "12px" }}>
          MILESTONES
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)" }}>
          연혁
        </h1>
      </div>

      {/* 타임라인 */}
      <div style={{ marginBottom: "56px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)", borderBottom: "2px solid var(--text-primary)", paddingBottom: "8px", marginBottom: "32px" }}>
          주요 마일스톤
        </h2>

        <div>
          {MILESTONES.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "24px" }}>
              {/* 타임라인 선 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12px" }}>
                <div style={{
                  width: "12px", height: "12px", borderRadius: "50%",
                  backgroundColor: "var(--text-primary)",
                  border: "2px solid var(--bg-primary)",
                  boxShadow: "0 0 0 2px var(--text-primary)",
                  flexShrink: 0, marginTop: "20px",
                }} />
                {i < MILESTONES.length - 1 && (
                  <div style={{ width: "2px", flex: 1, backgroundColor: "var(--border)", minHeight: "40px" }} />
                )}
              </div>

              {/* 내용 */}
              <div style={{ paddingBottom: i < MILESTONES.length - 1 ? "32px" : "0", flex: 1, paddingLeft: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "var(--text-primary)" }}>{item.date}</span>
                  <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "var(--text-placeholder)", letterSpacing: "0.08em", backgroundColor: "var(--bg-subtle)", padding: "2px 8px" }}>{item.tag}</span>
                </div>
                <p style={{ fontSize: "17px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>{item.title}</p>
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 현재 상태 — 브랜드 블록 (다크 고정) */}
      <div style={{ padding: "32px", backgroundColor: "#0F172A", marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#64748B", letterSpacing: "0.15em", marginBottom: "16px" }}>
          CURRENT STATUS
        </p>
        <p style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "white", marginBottom: "12px" }}>
          지금, 선익은 성장 중입니다.
        </p>
        <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.8", margin: 0 }}>
          초기 단계로서 핵심 독자 커뮤니티를 구축하고 인텔리전스 브리핑의 질을 높이는 데 집중하고 있습니다.
          함께 성장해 주시는 모든 회원분께 감사드립니다.
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/about/slogan" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>← 슬로건</Link>
        <p style={{ fontSize: "12px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif" }}>先益 — 앞서나가는 정보로 실행가들을 이롭게</p>
        <Link href="/about/mission" style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>미션 ↑</Link>
      </div>
    </div>
  );
}
