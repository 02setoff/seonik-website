import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "면책 조항 | 선익 SEONIK",
  description: "선익(SEONIK) 서비스의 면책 조항입니다. 브리핑 콘텐츠는 정보 제공 목적으로만 제공됩니다.",
};

const EFFECTIVE_DATE = "2026년 3월 7일";
const EMAIL = "seonik.official@gmail.com";

export default function DisclaimerPage() {
  const h2Style: React.CSSProperties = {
    fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)",
    borderBottom: "2px solid var(--text-primary)", paddingBottom: "8px", marginBottom: "16px",
  };
  const pStyle: React.CSSProperties = {
    fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)",
    lineHeight: "1.85", marginBottom: "10px",
  };
  const section: React.CSSProperties = { marginBottom: "48px" };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.12em", marginBottom: "12px" }}>
          DISCLAIMER
        </p>
        <h1 style={{ fontSize: "28px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          면책 조항
        </h1>
        <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)" }}>
          시행일: {EFFECTIVE_DATE}
        </p>
      </div>

      {/* 핵심 경고 박스 */}
      <div style={{ ...pStyle, marginBottom: "48px", padding: "20px 24px", backgroundColor: "var(--bg-subtle)", borderLeft: "3px solid var(--text-primary)" }}>
        선익(SEONIK)이 제공하는 모든 브리핑 콘텐츠는 <strong style={{ color: "var(--text-primary)" }}>정보 제공 목적으로만 제공</strong>됩니다.
        본 콘텐츠는 투자 권유, 법률 자문, 세무 조언, 경영 컨설팅이 아니며, 이를 기반으로 한 의사결정의 결과에 대해 회사는 어떠한 법적 책임도 지지 않습니다.
      </div>

      {/* 제1조 */}
      <div style={section}>
        <h2 style={h2Style}>제1조. 콘텐츠의 성격 및 한계</h2>
        <p style={pStyle}>
          선익(SEONIK, 이하 &ldquo;회사&rdquo;)이 제공하는 RADAR·CORE·FLASH 브리핑 콘텐츠는 공개 출처 정보(OSINT, Open Source Intelligence) 및 인공지능(AI) 분석을 기반으로 제작됩니다. 콘텐츠는 다음과 같은 한계를 가질 수 있습니다.
        </p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "AI 분석 특성상 사실과 다른 내용이 포함될 수 있습니다.",
            "공개 출처 정보를 기반으로 하므로, 비공개 정보나 내부 데이터를 반영하지 않습니다.",
            "시장 상황, 법령, 규제는 빠르게 변동될 수 있어 발행 시점 이후 내용이 달라질 수 있습니다.",
            "특정 산업이나 시장에 대한 예측은 실제 결과와 다를 수 있습니다.",
            "한국어 및 한국 시장 적용 분석은 참고용이며 전문 자문을 대체하지 않습니다.",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제2조 */}
      <div style={section}>
        <h2 style={h2Style}>제2조. 투자·재무 관련 면책</h2>
        <p style={pStyle}>
          선익의 콘텐츠는 <strong style={{ color: "var(--text-primary)" }}>어떠한 경우에도 투자 권유, 투자 조언, 금융 상품 추천으로 해석되어서는 안 됩니다.</strong>
        </p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "모든 투자 결정은 이용자 본인의 판단과 책임 하에 이루어져야 합니다.",
            "투자에는 원금 손실의 위험이 있으며, 과거의 성과가 미래의 수익을 보장하지 않습니다.",
            "주식, 채권, 부동산, 암호화폐 등 특정 자산에 대한 분석은 매수·매도 추천이 아닙니다.",
            "투자 전 반드시 전문 금융 투자업자(증권사, PB 등)의 자문을 받으시기 바랍니다.",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제3조 */}
      <div style={section}>
        <h2 style={h2Style}>제3조. 법률·세무·경영 관련 면책</h2>
        <p style={pStyle}>
          선익의 콘텐츠에 포함된 법률·세무·경영 관련 정보는 <strong style={{ color: "var(--text-primary)" }}>일반적인 참고 정보</strong>로, 변호사·공인회계사·세무사 등 전문가의 법적 자문을 대체하지 않습니다.
        </p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "법령, 세법, 규제는 지속적으로 개정되므로 최신 정보는 반드시 관할 기관 또는 전문가를 통해 확인하시기 바랍니다.",
            "특정 사업 또는 계약에 관한 법적 판단은 반드시 법률 전문가에게 문의하시기 바랍니다.",
            "세무 신고, 세금 계산, 절세 전략 등은 공인된 세무 전문가와 상담 후 진행하시기 바랍니다.",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제4조 */}
      <div style={section}>
        <h2 style={h2Style}>제4조. 정확성·완전성 보증 불가</h2>
        <p style={pStyle}>
          회사는 콘텐츠의 정확성, 완전성, 최신성, 적시성에 대해 명시적 또는 묵시적 보증을 하지 않습니다. 이용자는 콘텐츠를 활용하기 전에 독립적으로 사실 확인(fact-check)을 수행할 책임이 있습니다.
        </p>
        <p style={pStyle}>
          회사는 다음으로 인해 발생하는 손해에 대해 책임을 지지 않습니다.
        </p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "콘텐츠의 오류, 누락, 부정확한 정보",
            "콘텐츠를 기반으로 한 사업적·투자적 의사결정의 결과",
            "서비스 이용 중단, 지연, 시스템 오류로 인한 손해",
            "이용자 간 또는 제3자와의 분쟁으로 인한 손해",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제5조 */}
      <div style={section}>
        <h2 style={h2Style}>제5조. 외부 링크 면책</h2>
        <p style={pStyle}>
          선익의 콘텐츠는 외부 뉴스 기사, 보고서, 웹사이트 등을 참조하거나 링크를 포함할 수 있습니다. 회사는 해당 외부 사이트의 콘텐츠, 정확성, 안전성, 저작권에 대해 책임을 지지 않습니다. 외부 링크 방문은 이용자 본인의 판단에 따른 것입니다.
        </p>
      </div>

      {/* 제6조 */}
      <div style={section}>
        <h2 style={h2Style}>제6조. 수익 보증 불가</h2>
        <p style={pStyle}>
          선익이 제공하는 비즈니스 인텔리전스 정보를 활용한다고 해서 특정 사업 성과, 매출 증가, 투자 수익이 보장되지 않습니다. 회사는 이용자가 서비스를 통해 기대하는 수익이나 결과를 보증하지 않으며, 이에 따른 어떠한 손실에도 책임을 지지 않습니다.
        </p>
      </div>

      {/* 제7조 */}
      <div style={section}>
        <h2 style={h2Style}>제7조. 콘텐츠 변경 및 중단</h2>
        <p style={pStyle}>
          회사는 사전 고지 없이 언제든지 콘텐츠를 수정, 삭제, 중단할 수 있습니다. 특정 콘텐츠의 지속적인 제공을 보장하지 않으며, 서비스 중단으로 인해 발생하는 불이익에 대해 회사는 책임을 지지 않습니다.
        </p>
      </div>

      {/* 제8조 */}
      <div style={section}>
        <h2 style={h2Style}>제8조. 준거법 및 관할</h2>
        <p style={pStyle}>
          본 면책 조항은 대한민국 법률을 준거법으로 합니다. 본 면책 조항과 관련한 분쟁은 대한민국 법원을 관할 법원으로 합니다. 본 면책 조항이 관련 법령에 위반되는 경우, 해당 부분만 무효로 하며 나머지 조항의 효력에는 영향을 미치지 않습니다.
        </p>
      </div>

      {/* 문의 */}
      <div style={section}>
        <h2 style={h2Style}>문의</h2>
        <div style={{ padding: "20px 24px", backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
          <p style={{ ...pStyle, margin: 0 }}>
            <strong style={{ color: "var(--text-primary)" }}>서비스명:</strong> 선익 (SEONIK)<br />
            <strong style={{ color: "var(--text-primary)" }}>이메일:</strong>{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: "#3B82F6" }}>{EMAIL}</a>
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
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
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
