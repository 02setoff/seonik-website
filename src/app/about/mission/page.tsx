import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "미션 | 선익 SEONIK",
  description: "정보 비대칭 장벽을 파괴하여 모든 사업가가 공정하게 경쟁할 수 있는 세상을 만듭니다.",
};

const NAV = [
  { label: "미션", href: "/about/mission" },
  { label: "비전", href: "/about/vision" },
  { label: "회사명", href: "/about/company" },
  { label: "슬로건", href: "/about/slogan" },
  { label: "연혁", href: "/about/history" },
];

export default function MissionPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* About 서브 네비 */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "48px", borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              color: item.href === "/about/mission" ? "#0F172A" : "#94A3B8",
              fontWeight: item.href === "/about/mission" ? 700 : 400,
              textDecoration: "none",
              borderBottom: item.href === "/about/mission" ? "2px solid #0F172A" : "2px solid transparent",
              paddingBottom: "16px", marginBottom: "-17px",
            }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.15em", marginBottom: "12px" }}>
          OUR MISSION
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "0" }}>
          미션
        </h1>
      </div>

      {/* 미션 선언 */}
      <div style={{ padding: "32px 40px", backgroundColor: "#0F172A", marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#64748B", letterSpacing: "0.15em", marginBottom: "20px" }}>
          MISSION STATEMENT
        </p>
        <blockquote style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "white", lineHeight: "1.6", margin: 0 }}>
          &ldquo;정보 비대칭 장벽을 파괴하여<br />
          모든 사업가가 공정하게 경쟁할 수 있는<br />
          세상을 만듭니다.&rdquo;
        </blockquote>
      </div>

      {/* 배경 설명 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          배경
        </h2>
        <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", marginBottom: "20px" }}>
          지금 이 순간에도, 대기업은 수십억 원의 컨설팅 비용을 들여 시장 정보와 경쟁사 분석을 받고 있습니다.
          맥킨지, BCG, 골드만삭스의 리서치는 오직 그들만이 볼 수 있습니다.
        </p>
        <div style={{ padding: "24px 28px", borderLeft: "3px solid #0F172A", backgroundColor: "#F8F9FA", marginBottom: "20px" }}>
          <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
            1인 사업자와 소규모 창업자는?
          </p>
          <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.7", margin: 0 }}>
            혼자서 구글링하고, 감으로 결정하고, 실패하고 있습니다. 이것이 <strong style={{ color: "#0F172A" }}>정보 비대칭</strong>입니다.
          </p>
        </div>
        <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9" }}>
          선익은 이 불공정한 게임의 규칙을 바꿉니다. 기관급 인텔리전스를 모든 실행가에게. 알면 이기는 세상을 만듭니다.
        </p>
      </div>

      {/* 핵심 가치 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          우리가 추구하는 것
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { no: "01", title: "정보 민주화", desc: "기관급 인텔리전스를 모든 규모의 사업가에게 동등하게 제공합니다." },
            { no: "02", title: "실행 가능한 인사이트", desc: "단순한 뉴스가 아닌, 즉시 비즈니스에 적용할 수 있는 분석을 제공합니다." },
            { no: "03", title: "공정한 경쟁", desc: "정보 접근성의 차이로 인한 구조적 불평등을 해소합니다." },
          ].map((item) => (
            <div key={item.no} style={{ border: "1px solid #E2E8F0", padding: "24px" }}>
              <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#CBD5E1", fontWeight: 700, marginBottom: "12px" }}>{item.no}</p>
              <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>{item.title}</p>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
          先益 — Know First, Win First.
        </p>
        <Link href="/about/vision" style={{ fontSize: "13px", color: "#0F172A", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>
          비전 →
        </Link>
      </div>
    </div>
  );
}
