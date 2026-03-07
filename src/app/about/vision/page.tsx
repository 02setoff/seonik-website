import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "비전 | 선익 SEONIK",
  description: "전 세계의 창업 정보를 누구보다 빠르게 수집하고 브리핑하는 제1의 민간 정보기관.",
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
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "48px", borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
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
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A" }}>
          비전
        </h1>
      </div>

      {/* 비전 선언 */}
      <div style={{ padding: "32px 40px", backgroundColor: "#0F172A", marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#64748B", letterSpacing: "0.15em", marginBottom: "20px" }}>
          VISION STATEMENT
        </p>
        <blockquote style={{ fontSize: "19px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "white", lineHeight: "1.7", margin: 0 }}>
          &ldquo;전 세계의 창업 정보를 누구보다 빠르게<br />
          수집하고 브리핑하는<br />
          제1의 민간 정보기관.&rdquo;
        </blockquote>
      </div>

      {/* 글로벌 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          전 세계(Global)의 데이터를 향한 첩보전
        </h2>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", marginBottom: "16px" }}>
          최신 스타트업, 마이크로 SaaS, 비즈니스 트렌드는 실리콘밸리를 비롯한 영어권 커뮤니티에서 가장 먼저 폭발합니다. Product Hunt, Indie Hackers, Hacker News, Crunchbase, Stratechery 등 수많은 글로벌 소스가 존재하지만, 한국의 사업자들은 언어·시간·맥락 해석의 장벽 때문에 이를 직접 활용하기 어렵습니다.
        </p>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9" }}>
          선익의 비전은 이 글로벌 정보의 격차를 완벽하게 소거하는 것입니다. OSINT(공개 출처 정보)를 기반으로 전 세계에 흩어진 데이터를 수집하여, 한국의 실행가들이 최전선에서 접할 수 있도록 국경을 초월한 정보 파이프라인을 구축합니다.
        </p>
      </div>

      {/* AI 네이티브 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          누구보다 빠른 속도 — AI 네이티브 운영
        </h2>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", marginBottom: "16px" }}>
          대형 컨설팅 기관은 거대한 인력 중심 구조 탓에 리포트 발행에 수주~수개월이 소요됩니다. 선익은 철저한 AI 네이티브 운영 방식을 채택합니다.
        </p>
        <div style={{ padding: "24px 28px", borderLeft: "3px solid #0F172A", backgroundColor: "#F8F9FA" }}>
          <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", margin: 0 }}>
            우리는 세상의 모든 정보를 다 다루지 않습니다. <strong style={{ color: "#0F172A" }}>&ldquo;창업·마이크로 SaaS·AI 비즈니스&rdquo;</strong>라는 뾰족한 니치(Niche)에 집중하여, 대형 기관보다 훨씬 빠르게 글로벌 소스를 모니터링하고 번역하며 패턴을 포착합니다. AI 에이전트를 활용한 고속 분석으로 실행 가능한 인텔리전스를 기존 기관과는 비교할 수 없는 속도로 제공합니다.
          </p>
        </div>
      </div>

      {/* 제1의 민간 정보기관 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          제1의 — 새로운 카테고리의 창조
        </h2>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", marginBottom: "16px" }}>
          선익은 기존 시장에서 점유율을 다투는 경쟁을 하지 않습니다. 현재 한국 시장에는 <strong style={{ color: "#0F172A" }}>1인 사업자와 중소기업에 특화된 정보기관</strong> 형태의 플레이어가 사실상 존재하지 않습니다.
        </p>
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9" }}>
          우리는 흔해 빠진 &ldquo;비즈니스 뉴스레터&rdquo;나 &ldquo;창업 커뮤니티&rdquo;의 틀을 부수고, <strong style={{ color: "#0F172A" }}>&ldquo;1인 사업자와 중소기업을 위한 민간 싱크탱크&rdquo;</strong>라는 독보적인 카테고리를 창조합니다. &ldquo;제1의&rdquo;라는 선언은 이 새로운 카테고리를 우리가 정의하고 이끌어가겠다는 카테고리 킹(Category King)으로서의 선언입니다.
        </p>
      </div>

      {/* 성장 단계 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          성장 로드맵
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            { phase: "PHASE 01", period: "2026", title: "선익 인텔리전스 — 리포트 구독", desc: "RADAR·CORE·FLASH 3대 브리핑 채널 정착, 핵심 독자 커뮤니티 형성" },
            { phase: "PHASE 02", period: "2027", title: "선익 아카데미 & 벤처스", desc: "창업 교육 프로그램, 투자 파트너십, 유료 구독 고도화" },
            { phase: "PHASE 03", period: "2028+", title: "선익 솔루션즈 & 재단", desc: "B2B 기업 자문, 글로벌 진출, UMBRA 홀딩스 체계 구축" },
          ].map((item, i, arr) => (
            <div key={item.phase} style={{ display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "2px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#0F172A", flexShrink: 0, marginTop: "22px" }} />
                {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "#E2E8F0", minHeight: "32px" }} />}
              </div>
              <div style={{ padding: "18px 0 26px", flex: 1 }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#CBD5E1", letterSpacing: "0.1em" }}>{item.phase}</span>
                  <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8" }}>{item.period}</span>
                </div>
                <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>{item.title}</p>
                <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", lineHeight: "1.6", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/about/mission" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>← 미션</Link>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>先益 — 앞서나가는 정보로 실행가들을 이롭게</p>
        <Link href="/about/company" style={{ fontSize: "13px", color: "#0F172A", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>회사명 →</Link>
      </div>
    </div>
  );
}
