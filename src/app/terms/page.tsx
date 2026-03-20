import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | 선익 SEONIK",
  description: "선익(SEONIK) 서비스 이용약관입니다.",
};

const EFFECTIVE_DATE = "2026년 3월 7일";
const EMAIL = "seonik.official@gmail.com";

export default function TermsPage() {
  const h2Style: React.CSSProperties = {
    fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)",
    borderBottom: "2px solid var(--text-primary)", paddingBottom: "8px", marginBottom: "16px",
  };
  const h3Style: React.CSSProperties = {
    fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
    color: "var(--text-primary)", marginBottom: "8px", marginTop: "20px",
  };
  const pStyle: React.CSSProperties = {
    fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)",
    lineHeight: "1.85", marginBottom: "10px",
  };
  const section: React.CSSProperties = { marginBottom: "48px" };
  const tdStyle: React.CSSProperties = { padding: "10px 14px", color: "var(--text-secondary)", border: "1px solid var(--border)", verticalAlign: "top" };
  const thStyle: React.CSSProperties = { padding: "10px 14px", backgroundColor: "var(--bg-subtle)", fontWeight: 700, color: "var(--text-primary)", textAlign: "left", border: "1px solid var(--border)" };
  const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginBottom: "16px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif" };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.12em", marginBottom: "12px" }}>
          TERMS OF SERVICE
        </p>
        <h1 style={{ fontSize: "28px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          이용약관
        </h1>
        <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)" }}>
          시행일: {EFFECTIVE_DATE}
        </p>
      </div>

      <div style={{ ...pStyle, marginBottom: "48px", padding: "20px 24px", backgroundColor: "var(--bg-subtle)", borderLeft: "3px solid var(--text-primary)" }}>
        선익(SEONIK, 이하 &ldquo;회사&rdquo;)가 제공하는 AI 기반 비즈니스 인텔리전스 브리핑 서비스(이하 &ldquo;서비스&rdquo;)를 이용함으로써 본 약관에 동의한 것으로 간주합니다. 본 약관을 주의 깊게 읽어 주시기 바랍니다.
      </div>

      {/* 제1조 */}
      <div style={section}>
        <h2 style={h2Style}>제1조. 목적</h2>
        <p style={pStyle}>
          이 약관은 선익(SEONIK, 이하 &ldquo;회사&rdquo;)이 제공하는 비즈니스 인텔리전스 브리핑 서비스(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
        </p>
        <p style={pStyle}>
          선익은 &ldquo;정보 비대칭의 장벽을 파괴하여, 대한민국의 저성장을 돌파할 실행가들을 무장시킨다&rdquo;는 미션 아래, 1인 사업자·소규모 창업가·중소기업에게 기관급 비즈니스 인텔리전스를 제공합니다.
        </p>
      </div>

      {/* 제2조 */}
      <div style={section}>
        <h2 style={h2Style}>제2조. 용어의 정의</h2>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "\"서비스\"란 회사가 운영하는 선익(SEONIK) 웹사이트 및 앱을 통해 제공하는 브리핑 콘텐츠 열람, 저장, 개인화 추천 등 일체의 서비스를 말합니다.",
            "\"브리핑\"이란 회사가 AI 및 편집 과정을 통해 제작하는 비즈니스 인텔리전스 콘텐츠로, 트렌드 분석·비즈니스 모델 해부·긴급 인사이트 등을 포함하는 통합 브리핑 형식으로 제공됩니다.",
            "\"이용자\"란 본 약관에 따라 서비스를 이용하는 모든 자를 말합니다.",
            "\"회원\"이란 회원가입 절차를 완료하고 이용 자격을 부여받은 이용자를 말합니다.",
            "\"실행가\"란 예비 창업가, 1인 사업자, 솔로프리너, N잡러, 중소기업 운영진 등 서비스의 주요 타겟 이용자를 통칭합니다.",
            "\"계정\"이란 회원이 서비스를 이용하기 위해 등록한 이메일 주소와 비밀번호의 조합을 말합니다.",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제3조 */}
      <div style={section}>
        <h2 style={h2Style}>제3조. 약관의 효력 및 변경</h2>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.",
            "회사는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있습니다.",
            "약관이 변경되는 경우, 변경 사유 및 적용일자를 명시하여 변경 적용일 7일 전(불이익한 변경의 경우 30일 전)부터 공지합니다.",
            "이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다. 공지 기간 내 이의를 제기하지 않은 경우 동의한 것으로 간주합니다.",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제4조 */}
      <div style={section}>
        <h2 style={h2Style}>제4조. 회원가입</h2>
        <h3 style={h3Style}>가입 절차</h3>
        <p style={pStyle}>
          이용자는 이메일 주소 인증, 이름·비밀번호 등 필수 정보 입력, 개인정보처리방침 동의, 추가 정보(직업·가입 이유 등) 입력의 순서로 회원가입을 신청할 수 있습니다. 회사가 신청을 승낙함으로써 회원가입이 완료됩니다.
        </p>
        <h3 style={h3Style}>가입 거부 사유</h3>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "허위 정보를 기재하거나 타인의 명의를 이용한 경우",
            "본 약관에 의하여 이전에 회원자격을 상실한 경우",
            "만 14세 미만인 경우",
            "기타 서비스 운영상 지장이 있다고 회사가 합리적으로 판단하는 경우",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
        <h3 style={h3Style}>연령 확인</h3>
        <p style={pStyle}>
          서비스는 만 14세 이상만 이용할 수 있습니다 (「정보통신망법」 제31조). 가입 시 본인이 만 14세 이상임을 확인하는 절차를 거칩니다.
          <strong style={{ color: "var(--text-primary)" }}> 만 14세 미만임을 허위 기재하여 가입한 경우, 회사는 해당 사실 확인 즉시 계정을 정지하거나 삭제할 수 있습니다.</strong>
        </p>
        <h3 style={h3Style}>계정 보안</h3>
        <p style={pStyle}>
          회원은 계정 정보(이메일·비밀번호)를 안전하게 관리할 책임이 있습니다. 비밀번호를 10회 이상 연속으로 틀린 경우 계정이 일시적으로 잠길 수 있습니다. 계정 도용이 의심되는 경우 즉시 비밀번호를 변경하고 회사에 신고하시기 바랍니다.
        </p>
      </div>

      {/* 제5조 */}
      <div style={section}>
        <h2 style={h2Style}>제5조. 서비스의 제공 및 변경</h2>
        <h3 style={h3Style}>서비스 브리핑</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>형식</th>
              <th style={thStyle}>내용</th>
              <th style={thStyle}>특징</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}><strong>BRIEFING</strong></td>
              <td style={tdStyle}>트렌드 분석, 비즈니스 모델 해부, 긴급 인사이트 등을 포함하는 통합 비즈니스 인텔리전스 콘텐츠</td>
              <td style={tdStyle}>OSINT 기반 AI 분석, 실행가 맞춤 인사이트 제공</td>
            </tr>
          </tbody>
        </table>

        <h3 style={h3Style}>서비스 이용 조건</h3>
        <p style={pStyle}>현재 브리핑 콘텐츠 열람은 회원에게 무료로 제공됩니다. 향후 유료 구독 서비스(월 정기 구독, 연간 구독 등)가 도입될 수 있으며, 이 경우 사전에 이용자에게 충분히 공지합니다.</p>

        <h3 style={h3Style}>서비스 변경 및 중단</h3>
        <p style={pStyle}>
          회사는 운영·기술·사업상 이유로 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다. 중요한 변경이 있을 경우 사전에 공지합니다. 단, 천재지변·시스템 장애 등 불가항력의 경우 사전 공지 없이 중단될 수 있습니다.
        </p>
      </div>

      {/* 제6조 */}
      <div style={section}>
        <h2 style={h2Style}>제6조. 회원의 권리와 의무</h2>
        <h3 style={h3Style}>회원의 권리</h3>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "회원은 서비스를 이용하고 브리핑 콘텐츠를 열람할 권리를 갖습니다.",
            "회원은 마이페이지에서 자신의 개인정보를 열람·수정하고, 언제든지 회원 탈퇴를 신청할 수 있습니다.",
            "회원은 서비스 이용에 관한 불만·문의 사항을 회사에 제기하고 처리 결과를 통보받을 권리를 갖습니다.",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>

        <h3 style={h3Style}>회원의 의무 — 금지 행위</h3>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "타인의 계정을 도용하거나 부정하게 사용하는 행위",
            "회사의 사전 서면 동의 없이 브리핑 콘텐츠를 복제·배포·전송·출판·방송하거나 상업적으로 활용하는 행위",
            "회사 및 제3자의 저작권·지식재산권·명예·프라이버시를 침해하는 행위",
            "서비스의 정상 운영을 방해하거나 서버에 과도한 부하를 주는 행위(크롤링, 자동화 수집 등 포함)",
            "허위 정보 기재, 다른 회원을 속이는 행위",
            "기타 관련 법령 및 본 약관을 위반하는 행위",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제7조 */}
      <div style={section}>
        <h2 style={h2Style}>제7조. 지식재산권 및 콘텐츠</h2>
        <h3 style={h3Style}>회사의 지식재산권</h3>
        <p style={pStyle}>
          서비스 내 회사가 제작한 모든 브리핑 콘텐츠, 분석 프레임워크, 디자인, 로고, 텍스트 등에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.
        </p>
        <p style={pStyle}>
          이용자는 서비스를 통해 제공되는 콘텐츠를 <strong style={{ color: "var(--text-primary)" }}>개인적, 비상업적 목적</strong>으로만 이용할 수 있습니다. 회사의 사전 서면 동의 없이 상업적으로 이용하거나 제3자에게 재배포하는 것을 금지합니다.
        </p>
        <h3 style={h3Style}>콘텐츠의 성격</h3>
        <p style={pStyle}>
          선익의 브리핑 콘텐츠는 공개 출처 정보(OSINT) 및 AI 분석을 기반으로 제작되며, <strong style={{ color: "var(--text-primary)" }}>정보 제공 목적</strong>으로만 제공됩니다. 투자 권유, 법률 자문, 세무 조언 등으로 해석될 수 없으며, 해당 콘텐츠를 기반으로 한 사업 결정의 결과에 대한 책임은 이용자 본인에게 있습니다.
        </p>
      </div>

      {/* 제8조 */}
      <div style={section}>
        <h2 style={h2Style}>제8조. 회원 탈퇴 및 자격 제한</h2>
        <h3 style={h3Style}>회원 탈퇴</h3>
        <p style={pStyle}>
          회원은 마이페이지에서 언제든지 회원 탈퇴를 신청할 수 있으며, 회사는 즉시 처리합니다. 탈퇴 시 수집된 개인정보는 즉시 삭제되며, 단 법령에 따라 보존 의무가 있는 정보(이메일 수신 동의 기록 등)는 해당 기간 동안 보관됩니다.
        </p>
        <h3 style={h3Style}>회원 자격 제한</h3>
        <p style={pStyle}>
          회사는 회원이 본 약관을 위반하거나 서비스 운영을 방해한 경우, 사전 통보 후 이용 정지·영구 이용 중지 등의 조치를 취할 수 있습니다. 다만, 법령 위반, 타인의 명백한 피해 발생 등 긴급한 경우 사전 통보 없이 조치할 수 있습니다. 특히 다음의 경우 즉시 조치할 수 있습니다.
        </p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "가입 시 허위 정보를 제공하거나 타인의 정보를 도용한 경우",
            "만 14세 미만임을 허위 기재하여 가입한 사실이 확인된 경우",
            "서비스 내 콘텐츠를 무단으로 크롤링·복제·재배포한 경우",
            "기타 관련 법령을 위반하거나 타인에게 명백한 피해를 끼친 경우",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제9조 */}
      <div style={section}>
        <h2 style={h2Style}>제9조. 책임의 제한</h2>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "회사는 천재지변, 불가항력적 사유, 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.",
            "서비스의 브리핑 콘텐츠는 정보 제공 목적으로만 제공됩니다. 투자·사업 결정 등에 대한 최종 책임은 이용자 본인에게 있으며, 콘텐츠 내용의 정확성·완전성을 보증하지 않습니다.",
            "회사는 회원이 서비스를 이용하여 기대하는 수익이나 결과를 보증하지 않습니다.",
            "회사는 이용자 상호 간 또는 이용자와 제3자 간에 발생한 분쟁에 개입하지 않으며, 이로 인한 손해를 배상할 의무가 없습니다.",
            "회사가 제공하는 서비스를 통해 연결된 외부 링크 및 제3자 서비스에 대해 회사는 책임을 지지 않습니다.",
          ].map((item, i) => (
            <li key={i} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제10조 */}
      <div style={section}>
        <h2 style={h2Style}>제10조. 개인정보 보호</h2>
        <p style={pStyle}>
          회사는 이용자의 개인정보를 「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따라 보호합니다. 개인정보의 수집·이용·보관·파기에 관한 세부 사항은 별도로 공시된{" "}
          <Link href="/privacy" style={{ color: "#3B82F6", textDecoration: "underline" }}>개인정보처리방침</Link>에 따릅니다.
        </p>
      </div>

      {/* 제11조 */}
      <div style={section}>
        <h2 style={h2Style}>제11조. 이메일 알림 서비스</h2>
        <p style={pStyle}>
          회사는 회원가입 시 이메일 수신에 명시적으로 동의한 회원에 한하여 새 브리핑 발행 알림을 이메일로 발송합니다. 이용자는 마이페이지 또는 이메일 하단의 수신거부 링크를 통해 언제든지 수신을 거부할 수 있습니다.
        </p>
      </div>

      {/* 제12조 */}
      <div style={section}>
        <h2 style={h2Style}>제12조. 분쟁 해결 및 준거법</h2>
        <p style={pStyle}>
          회사와 이용자 간에 발생한 분쟁은 원만한 합의를 통해 해결하는 것을 원칙으로 합니다.
          합의가 이루어지지 않을 경우, 대한민국 법률을 준거법으로 하며, 관할 법원은 민사소송법에 따른 법원으로 합니다.
        </p>
      </div>

      {/* 제13조 */}
      <div style={section}>
        <h2 style={h2Style}>제13조. 문의</h2>
        <p style={pStyle}>이용약관에 관한 문의는 아래 이메일로 연락주시기 바랍니다.</p>
        <div style={{ padding: "20px 24px", backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
          <p style={{ ...pStyle, margin: 0 }}>
            <strong style={{ color: "var(--text-primary)" }}>서비스명:</strong> 선익 (SEONIK)<br />
            <strong style={{ color: "var(--text-primary)" }}>운영 책임:</strong> 선익 운영팀<br />
            <strong style={{ color: "var(--text-primary)" }}>이메일:</strong>{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: "#3B82F6" }}>{EMAIL}</a>
          </p>
        </div>
      </div>

      {/* 개정 이력 */}
      <div style={section}>
        <h2 style={h2Style}>개정 이력</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {["버전", "시행일", "주요 변경 사항"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>v1.0</td>
              <td style={tdStyle}>{EFFECTIVE_DATE}</td>
              <td style={tdStyle}>최초 시행</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <p style={{ fontSize: "12px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif" }}>
          先益 — 앞서나가는 정보로 실행가들을 이롭게
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/privacy" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            개인정보처리방침
          </Link>
          <Link href="/disclaimer" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            면책 조항
          </Link>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
