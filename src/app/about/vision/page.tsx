import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "비전 | 선익 SEONIK",
  description: "선익이 그리는 미래 — 모든 실행가가 기관급 인텔리전스로 무장한 세상.",
};

const NAV = [
  { label: "미션", href: "/about/mission" },
  { label: "비전", href: "/about/vision" },
  { label: "회사명", href: "/about/company" },
  { label: "슬로건", href: "/about/slogan" },
  { label: "연혁", href: "/about/history" },
];

export default function VisionPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* About 서브 네비 */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "48px", borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              color: item.href === "/about/vision" ? "#0F172A" : "#94A3B8",
              fontWeight: item.href === "/about/vision" ? 700 : 400,
              textDecoration: "none",
              borderBottom: item.href === "/about/vision" ? "2px solid #0F172A" : "2px solid transparent",
              paddingBottom: "16px", marginBottom: "-17px",
            }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.15em", marginBottom: "12px" }}>
          OUR VISION
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "0" }}>
          비전
        </h1>
      </div>

      {/* 비전 선언 */}
      <div style={{ padding: "32px 40px", backgroundColor: "#0F172A", marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#64748B", letterSpacing: "0.15em", marginBottom: "20px" }}>
          VISION STATEMENT
        </p>
        <blockquote style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "white", lineHeight: "1.7", margin: 0 }}>
          &ldquo;대한민국 1인 사업가와 소규모 창업자를 위한<br />
          No.1 AI 인텔리전스 플랫폼이 되어,<br />
          정보로 무장한 실행가 생태계를 구축합니다.&rdquo;
        </blockquote>
      </div>

      {/* 우리가 그리는 미래 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          우리가 그리는 미래
        </h2>
        <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", marginBottom: "24px" }}>
          선익의 비전은 단순한 뉴스 큐레이션이 아닙니다. 우리는 모든 실행가가
          AI로 무장한 인텔리전스 어드바이저를 곁에 두고 결정을 내릴 수 있는
          세상을 만들고 있습니다.
        </p>
        <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9" }}>
          5년 후, 선익의 인텔리전스를 활용한 사업가가 그렇지 않은 경쟁자보다
          더 빠르게, 더 정확하게, 더 자신 있게 움직이는 세상. 그것이 우리의 목표입니다.
        </p>
      </div>

      {/* 단계별 로드맵 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          성장 로드맵
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            { phase: "PHASE 01", period: "2026", title: "인텔리전스 브리핑 구축", desc: "RADAR·CORE·FLASH 3대 채널 정착, 핵심 독자 커뮤니티 형성" },
            { phase: "PHASE 02", period: "2027", title: "개인화 인텔리전스 고도화", desc: "업종·관심사 기반 맞춤형 브리핑, AI 분석 깊이 확대" },
            { phase: "PHASE 03", period: "2028+", title: "플랫폼 생태계 확장", desc: "B2B 엔터프라이즈 서비스, 파트너십 확대, 글로벌 진출 준비" },
          ].map((item, i, arr) => (
            <div key={item.phase} style={{ display: "flex", gap: "24px", paddingLeft: "0" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "2px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#0F172A", flexShrink: 0, marginTop: "24px" }} />
                {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "#E2E8F0", minHeight: "32px" }} />}
              </div>
              <div style={{ padding: "20px 0 28px", flex: 1 }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#CBD5E1", letterSpacing: "0.1em" }}>{item.phase}</span>
                  <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8" }}>{item.period}</span>
                </div>
                <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>{item.title}</p>
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.6", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/about/mission" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
          ← 미션
        </Link>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
          先益 — Know First, Win First.
        </p>
        <Link href="/about/company" style={{ fontSize: "13px", color: "#0F172A", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>
          회사명 →
        </Link>
      </div>
    </div>
  );
}
