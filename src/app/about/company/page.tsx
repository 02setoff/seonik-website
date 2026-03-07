import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "회사명 | 선익 SEONIK",
  description: "선익(先益)이라는 이름에 담긴 의미 — 먼저 알아야 먼저 이긴다.",
};

const NAV = [
  { label: "미션", href: "/about/mission" },
  { label: "비전", href: "/about/vision" },
  { label: "회사명", href: "/about/company" },
  { label: "슬로건", href: "/about/slogan" },
  { label: "연혁", href: "/about/history" },
];

export default function CompanyPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* About 서브 네비 */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "48px", borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              color: item.href === "/about/company" ? "#0F172A" : "#94A3B8",
              fontWeight: item.href === "/about/company" ? 700 : 400,
              textDecoration: "none",
              borderBottom: item.href === "/about/company" ? "2px solid #0F172A" : "2px solid transparent",
              paddingBottom: "16px", marginBottom: "-17px",
            }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.15em", marginBottom: "12px" }}>
          COMPANY NAME
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "0" }}>
          회사명
        </h1>
      </div>

      {/* 이름 전시 */}
      <div style={{ padding: "40px", backgroundColor: "#0F172A", marginBottom: "48px", textAlign: "center" }}>
        <p style={{ fontSize: "56px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "white", lineHeight: 1, marginBottom: "12px" }}>
          先益
        </p>
        <p style={{ fontSize: "22px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#64748B", letterSpacing: "0.3em", marginBottom: "20px" }}>
          SEONIK
        </p>
        <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#475569", fontStyle: "italic", margin: 0 }}>
          [선·익] — seon·ik
        </p>
      </div>

      {/* 어원 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          이름의 의미
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
          <div style={{ border: "1px solid #E2E8F0", padding: "28px 24px", textAlign: "center" }}>
            <p style={{ fontSize: "40px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "12px" }}>先</p>
            <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "8px" }}>FIRST</p>
            <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>먼저</p>
            <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.6", margin: 0 }}>
              남보다 먼저 알고, 먼저 움직인다
            </p>
          </div>
          <div style={{ border: "1px solid #E2E8F0", padding: "28px 24px", textAlign: "center" }}>
            <p style={{ fontSize: "40px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "12px" }}>益</p>
            <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "8px" }}>BENEFIT</p>
            <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>이롭다</p>
            <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.6", margin: 0 }}>
              알면 이롭고, 이기고, 성장한다
            </p>
          </div>
        </div>
        <div style={{ padding: "24px 28px", borderLeft: "3px solid #0F172A", backgroundColor: "#F8F9FA" }}>
          <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A", lineHeight: "1.8", margin: 0 }}>
            <strong>先益(선익)</strong>은 &ldquo;먼저 알아야 먼저 이긴다&rdquo;는 철학을 담고 있습니다.
            정보의 시간차가 곧 비즈니스의 승패를 결정짓는 시대에,
            선익은 모든 실행가가 <strong>先</strong>을 쥘 수 있도록 합니다.
          </p>
        </div>
      </div>

      {/* 영문 표기 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          영문 표기 — SEONIK
        </h2>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", marginBottom: "16px" }}>
          영문 표기 <strong style={{ color: "#0F172A", fontFamily: "Inter, sans-serif" }}>SEONIK</strong>은 한국어 발음 &ldquo;선익&rdquo;을 로마자 표기한 것으로,
          국제 시장에서도 직관적으로 읽힐 수 있도록 설계했습니다.
        </p>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9" }}>
          세계 무대에서 한국의 지식 인텔리전스를 대표하는 브랜드로 성장하겠습니다.
        </p>
      </div>

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/about/vision" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
          ← 비전
        </Link>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
          先益 — Know First, Win First.
        </p>
        <Link href="/about/slogan" style={{ fontSize: "13px", color: "#0F172A", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>
          슬로건 →
        </Link>
      </div>
    </div>
  );
}
