import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "미션 | 선익 SEONIK",
  description: "정보 비대칭의 장벽을 파괴하여, 대한민국의 저성장을 돌파할 실행가들을 무장시킨다.",
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "clamp(40px,8vw,64px) clamp(20px,5vw,40px) 96px" }}>
      {/* About 서브 네비 */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "48px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              color: item.href === "/about/mission" ? "var(--text-primary)" : "var(--text-placeholder)",
              fontWeight: item.href === "/about/mission" ? 700 : 400,
              textDecoration: "none",
              borderBottom: item.href === "/about/mission" ? "2px solid var(--text-primary)" : "2px solid transparent",
              paddingBottom: "16px", marginBottom: "-17px",
            }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.15em", marginBottom: "12px" }}>
          OUR MISSION
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)" }}>
          미션
        </h1>
      </div>

      {/* 미션 선언 — 브랜드 블록 (다크 고정) */}
      <div style={{ padding: "32px 40px", backgroundColor: "#0F172A", marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#64748B", letterSpacing: "0.15em", marginBottom: "20px" }}>
          MISSION STATEMENT
        </p>
        <blockquote style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "white", lineHeight: "1.7", margin: 0 }}>
          &ldquo;정보 비대칭의 장벽을 파괴하여,<br />
          대한민국의 저성장을 돌파할<br />
          실행가들을 무장시킨다.&rdquo;
        </blockquote>
      </div>

      {/* 정보 비대칭의 장벽 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)", borderBottom: "2px solid var(--text-primary)", paddingBottom: "8px", marginBottom: "24px" }}>
          정보 비대칭의 잔혹한 현실
        </h2>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.9", marginBottom: "20px" }}>
          현대 비즈니스는 총성 없는 전쟁터입니다. 대기업은 맥킨지·BCG 같은 컨설팅 펌에 수억~수십억 원을 지불하고 글로벌 시장의 미세한 진동조차 감지하여 데이터 기반의 의사결정을 내립니다.
        </p>
        <div style={{ padding: "24px 28px", borderLeft: "3px solid var(--text-primary)", backgroundColor: "var(--bg-subtle)", marginBottom: "20px" }}>
          <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
            1인 사업자·소규모 창업가는?
          </p>
          <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0 }}>
            구조적으로 이와 같은 수준의 전략 컨설팅에 접근하지 못합니다. 결국 유튜브, 파편화된 블로그, 그리고 &ldquo;감&rdquo;에 의존하여 회사의 명운이 걸린 결정을 내립니다.
          </p>
        </div>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.9" }}>
          이것은 정보의 양 문제가 아닙니다. 정보는 존재하지만 <strong style={{ color: "var(--text-primary)" }}>4가지 거대한 장벽</strong>에 가로막혀 있습니다.
        </p>
      </div>

      {/* 4가지 장벽 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)", borderBottom: "2px solid var(--text-primary)", paddingBottom: "8px", marginBottom: "24px" }}>
          4가지 정보 비대칭 장벽
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          {[
            { no: "01", title: "비용의 장벽", desc: "고급 리포트에 접근하기 위한 압도적인 자본의 격차" },
            { no: "02", title: "언어의 장벽", desc: "실리콘밸리·런던 등 영어권 중심으로 쏟아지는 원천 데이터" },
            { no: "03", title: "시간의 장벽", desc: "당장 오늘의 생존을 위해 뛰느라 리서치에 투자할 물리적 시간 부족" },
            { no: "04", title: "해석의 장벽", desc: "정보를 모았어도 내 사업에 어떻게 적용할지 모르는 막막함" },
          ].map((item) => (
            <div key={item.no} style={{ border: "1px solid var(--border)", padding: "20px", backgroundColor: "var(--bg-card)" }}>
              <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)", fontWeight: 700, marginBottom: "10px" }}>{item.no}</p>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{item.title}</p>
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 파괴·무장 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)", borderBottom: "2px solid var(--text-primary)", paddingBottom: "8px", marginBottom: "24px" }}>
          개선이 아닌 파괴, 그리고 무장
        </h2>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.9", marginBottom: "16px" }}>
          선익은 이 장벽을 단순히 줄이는(Reduce) 수준에 머물지 않습니다. 장벽을 줄인다는 것은 기존의 불공정한 질서를 인정하면서 점진적인 개선을 도모하겠다는 타협에 불과합니다. 우리의 미션은 이 장벽을 철저히 <strong style={{ color: "var(--text-primary)" }}>파괴(Destroy)</strong>하는 것입니다.
        </p>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.9" }}>
          선익은 고객을 &ldquo;돕거나(Help)&rdquo; &ldquo;지원(Support)&rdquo;하지 않습니다. 우리는 실행가들을 철저히 <strong style={{ color: "var(--text-primary)" }}>무장(Arming)</strong>시킵니다. 정보는 곧 무기이며, 분석은 전략이 되고, 실행 가이드는 전술이 됩니다.
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "12px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif" }}>
          先益 — 앞서나가는 정보로 실행가들을 이롭게
        </p>
        <Link href="/about/vision" style={{ fontSize: "13px", color: "var(--text-primary)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>
          비전 →
        </Link>
      </div>
    </div>
  );
}
