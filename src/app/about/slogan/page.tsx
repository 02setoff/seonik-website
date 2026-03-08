import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "슬로건 | 선익 SEONIK",
  description: "앞서나가는 정보로 실행가들을 이롭게 — 선익의 공식 슬로건과 마케팅 슬로건.",
};

const NAV = [
  { label: "미션", href: "/about/mission" },
  { label: "비전", href: "/about/vision" },
  { label: "회사명", href: "/about/company" },
  { label: "슬로건", href: "/about/slogan" },
  { label: "연혁", href: "/about/history" },
];

export default function SloganPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "clamp(40px,8vw,64px) clamp(20px,5vw,40px) 96px" }}>
      {/* About 서브 네비 */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "48px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              color: item.href === "/about/slogan" ? "var(--text-primary)" : "var(--text-placeholder)",
              fontWeight: item.href === "/about/slogan" ? 700 : 400,
              textDecoration: "none",
              borderBottom: item.href === "/about/slogan" ? "2px solid var(--text-primary)" : "2px solid transparent",
              paddingBottom: "16px", marginBottom: "-17px",
            }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.15em", marginBottom: "12px" }}>
          SLOGAN
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)" }}>
          슬로건
        </h1>
      </div>

      {/* 공식 슬로건 */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          {/* OFFICIAL 배지 — 브랜드 블록 (다크 고정) */}
          <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "white", backgroundColor: "#0F172A", padding: "3px 10px", letterSpacing: "0.08em" }}>OFFICIAL</span>
          <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>공식 슬로건</h2>
        </div>
        {/* 공식 슬로건 박스 — 브랜드 블록 (다크 고정) */}
        <div style={{ padding: "40px", backgroundColor: "#0F172A", textAlign: "center" }}>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#64748B", letterSpacing: "0.15em", marginBottom: "20px" }}>OFFICIAL SLOGAN</p>
          <p style={{ fontSize: "26px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "white", lineHeight: "1.5", marginBottom: "12px" }}>
            앞서나가는 정보로<br />실행가들을 이롭게
          </p>
          <p style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", color: "#475569", margin: 0, letterSpacing: "0.1em" }}>
            先益 (SEONIK)
          </p>
        </div>
        <div style={{ padding: "20px 24px", backgroundColor: "var(--bg-subtle)", borderLeft: "3px solid var(--text-primary)" }}>
          <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.85", margin: 0 }}>
            공식 슬로건은 회사명 <strong style={{ color: "var(--text-primary)" }}>先益(선익)</strong>의 뜻 — &ldquo;먼저 알아서 이롭게 한다&rdquo;를 완벽하게 담아낸 문장입니다.
            정보의 민주화를 통해 실행가들이 앞서나가고 이롭게 성장할 수 있도록 한다는 선익의 핵심 철학을 표현합니다.
          </p>
        </div>
      </div>

      {/* 마케팅 슬로건 */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          {/* MARKETING 배지 — UI 요소 */}
          <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "var(--text-primary)", backgroundColor: "var(--bg-subtle)", padding: "3px 10px", letterSpacing: "0.08em", border: "1px solid var(--border)" }}>MARKETING</span>
          <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>마케팅 슬로건</h2>
        </div>
        <div style={{ padding: "40px", border: "2px solid var(--text-primary)", textAlign: "center", backgroundColor: "var(--bg-card)" }}>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.15em", marginBottom: "20px" }}>MARKETING SLOGAN</p>
          <p style={{ fontSize: "30px", fontFamily: "Inter, sans-serif", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "14px" }}>
            Know First,<br />Win First.
          </p>
          <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", margin: 0 }}>
            먼저 아는 자가 이긴다
          </p>
        </div>
        <div style={{ padding: "20px 24px", backgroundColor: "var(--bg-subtle)", borderLeft: "3px solid var(--border)" }}>
          <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.85", margin: 0 }}>
            마케팅 슬로건은 선익의 공식 슬로건 철학을 영어로 표현한 것으로, 외부 커뮤니케이션과 브랜드 인지도 형성을 위해 사용됩니다. 비즈니스라는 전장에서 정보의 선점이 곧 승리임을 직관적으로 전달합니다.
          </p>
        </div>
      </div>

      {/* 슬로건 철학 심층 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)", borderBottom: "2px solid var(--text-primary)", paddingBottom: "8px", marginBottom: "24px" }}>
          슬로건에 담긴 철학
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { ko: "앞서나가는 정보로", en: "Know First", desc: "정보의 시간차가 곧 비즈니스의 승패를 결정합니다. 경쟁자보다 단 하루 먼저 시장의 변화를 감지하면 전략적 우위를 선점할 수 있습니다." },
            { ko: "실행가들을 이롭게", en: "Win First", desc: "지식은 실행으로 이어질 때 의미를 갖습니다. 선익의 인텔리전스는 단순한 정보가 아닌, 즉시 사업에 적용할 수 있는 실행 가이드를 제공합니다." },
          ].map((item) => (
            <div key={item.ko} style={{ display: "flex", gap: "0", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
              <div style={{ width: "4px", backgroundColor: "var(--text-primary)", flexShrink: 0 }} />
              <div style={{ padding: "22px 24px", flex: 1 }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)" }}>{item.ko}</span>
                  <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>= {item.en}</span>
                </div>
                <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/about/company" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>← 회사명</Link>
        <p style={{ fontSize: "12px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif" }}>先益 — 앞서나가는 정보로 실행가들을 이롭게</p>
        <Link href="/about/history" style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>연혁 →</Link>
      </div>
    </div>
  );
}
