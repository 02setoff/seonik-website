import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | 선익 SEONIK",
  description: "선익(SEONIK) 서비스 이용약관입니다.",
};

const EFFECTIVE_DATE = "2026년 3월 7일";
const COMPANY = "선익(SEONIK)";
const EMAIL = "seonik.official@gmail.com";

export default function TermsPage() {
  const sectionStyle: React.CSSProperties = { marginBottom: "48px" };
  const h2Style: React.CSSProperties = {
    fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A",
    borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "16px",
  };
  const h3Style: React.CSSProperties = {
    fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
    color: "#0F172A", marginBottom: "8px", marginTop: "20px",
  };
  const pStyle: React.CSSProperties = {
    fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#475569",
    lineHeight: "1.85", marginBottom: "10px",
  };
  const liStyle: React.CSSProperties = { ...pStyle, marginBottom: "6px" };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.12em", marginBottom: "12px" }}>
          TERMS OF SERVICE
        </p>
        <h1 style={{ fontSize: "28px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>
          이용약관
        </h1>
        <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>
          시행일: {EFFECTIVE_DATE}
        </p>
      </div>

      <div style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.85", marginBottom: "48px", padding: "20px 24px", backgroundColor: "#F8F9FA", borderLeft: "3px solid #0F172A" }}>
        본 이용약관은 {COMPANY}(이하 &ldquo;회사&rdquo;)가 제공하는 선익 서비스(이하 &ldquo;서비스&rdquo;)의 이용 조건 및 절차에 관한 사항을 규정합니다.
        서비스를 이용함으로써 본 약관에 동의한 것으로 간주합니다.
      </div>

      {/* 제1조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제1조. 목적</h2>
        <p style={pStyle}>
          이 약관은 {COMPANY}(이하 &ldquo;회사&rdquo;)가 제공하는 AI 기반 비즈니스 인텔리전스 브리핑 서비스(이하 &ldquo;서비스&rdquo;)의
          이용과 관련하여 회사와 이용자의 권리·의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </div>

      {/* 제2조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제2조. 용어의 정의</h2>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "\"서비스\"란 회사가 제공하는 선익(SEONIK) 브리핑 콘텐츠 열람, 저장, 개인화 추천 등 일체의 서비스를 말합니다.",
            "\"이용자\"란 본 약관에 따라 서비스를 이용하는 모든 자를 말합니다.",
            "\"회원\"이란 서비스에 회원가입하고 이용 자격을 부여받은 이용자를 말합니다.",
            "\"브리핑\"이란 회사가 AI 및 편집 과정을 통해 제작·제공하는 비즈니스 인텔리전스 콘텐츠를 말합니다.",
            "\"계정\"이란 회원이 서비스를 이용하기 위해 등록한 이메일 주소와 비밀번호의 조합을 말합니다.",
          ].map((item, i) => (
            <li key={i} style={liStyle}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제3조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제3조. 약관의 효력 및 변경</h2>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.",
            "회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 7일이 경과한 날부터 효력이 발생합니다.",
            "이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.",
          ].map((item, i) => (
            <li key={i} style={liStyle}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제4조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제4조. 회원가입</h2>
        <h3 style={h3Style}>가입 절차</h3>
        <p style={pStyle}>
          이용자는 이메일 주소, 이름, 비밀번호 등 필요한 정보를 입력하고 이메일 인증을 완료한 후 회원가입을 신청할 수 있습니다.
          회사는 신청에 대해 승낙함으로써 회원가입이 완료됩니다.
        </p>
        <h3 style={h3Style}>가입 거부 사유</h3>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "가입 신청자가 본 약관에 의하여 이전에 회원자격을 상실한 경우",
            "실명이 아니거나 타인의 명의를 이용한 경우",
            "허위의 정보를 기재하거나 회사가 제시하는 내용을 기재하지 않은 경우",
            "만 14세 미만인 경우",
            "기타 회원가입 신청이 서비스 운영상 지장이 있다고 판단되는 경우",
          ].map((item, i) => (
            <li key={i} style={liStyle}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제5조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제5조. 서비스의 제공 및 변경</h2>
        <h3 style={h3Style}>서비스 내용</h3>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "RADAR: 시장 동향 및 최신 트렌드 인텔리전스 브리핑",
            "CORE: 비즈니스 모델 심층 분석 브리핑",
            "FLASH: 긴급 이슈 및 속보 인텔리전스 브리핑",
            "개인화 콘텐츠 추천 서비스",
            "회원 전용 콘텐츠 열람 서비스",
          ].map((item, i) => (
            <li key={i} style={liStyle}>{item}</li>
          ))}
        </ul>
        <h3 style={h3Style}>서비스 변경 및 중단</h3>
        <p style={pStyle}>
          회사는 서비스의 내용, 운영상·기술상 이유로 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.
          서비스의 중요한 변경이 있을 경우 사전에 공지합니다.
        </p>
      </div>

      {/* 제6조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제6조. 회원의 의무</h2>
        <p style={pStyle}>회원은 다음 행위를 하여서는 안 됩니다.</p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "타인의 계정을 도용하거나 부정하게 사용하는 행위",
            "서비스에서 얻은 정보를 회사의 사전 동의 없이 상업적으로 활용하거나 타인에게 전달·재배포하는 행위",
            "회사 및 제3자의 저작권, 지식재산권을 침해하는 행위",
            "회사의 서비스 운영을 방해하거나 시스템에 과부하를 주는 행위",
            "불법적이거나 타인에게 해를 끼치는 정보를 게시·전달하는 행위",
            "허위 정보를 제공하거나 다른 회원을 속이는 행위",
            "기타 관련 법령 및 본 약관을 위반하는 행위",
          ].map((item, i) => (
            <li key={i} style={liStyle}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제7조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제7조. 지식재산권</h2>
        <p style={pStyle}>
          서비스 내 회사가 제작한 모든 브리핑 콘텐츠, 디자인, 로고, 텍스트 등에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.
        </p>
        <p style={pStyle}>
          이용자는 서비스를 통해 제공되는 콘텐츠를 개인적, 비상업적 목적으로만 이용할 수 있습니다.
          회사의 사전 서면 동의 없이 콘텐츠를 복제, 배포, 전송, 출판, 방송, 상업적으로 이용하는 것을 금지합니다.
        </p>
      </div>

      {/* 제8조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제8조. 책임 제한</h2>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "회사는 천재지변, 불가항력적 사유, 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.",
            "서비스의 브리핑 콘텐츠는 정보 제공 목적으로만 제공되며, 투자·사업 결정 등에 대한 책임은 이용자 본인에게 있습니다.",
            "회사는 회원이 서비스를 통해 기대하는 수익이나 결과에 대해 보증하지 않습니다.",
            "회사는 이용자 상호 간 또는 이용자와 제3자 간에 발생한 분쟁에 개입하지 않습니다.",
          ].map((item, i) => (
            <li key={i} style={liStyle}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제9조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제9조. 회원 탈퇴 및 자격 상실</h2>
        <h3 style={h3Style}>회원 탈퇴</h3>
        <p style={pStyle}>
          회원은 언제든지 마이페이지에서 회원 탈퇴를 신청할 수 있으며, 회사는 즉시 처리합니다.
          탈퇴 시 개인정보는 즉시 삭제되며, 이메일 수신 동의 기록은 법령에 따라 일정 기간 보관될 수 있습니다.
        </p>
        <h3 style={h3Style}>회원 자격 박탈</h3>
        <p style={pStyle}>
          회사는 회원이 본 약관을 위반하거나 서비스 운영을 방해한 경우, 경고·이용 정지·영구 이용 중지 등의 조치를 취할 수 있습니다.
        </p>
      </div>

      {/* 제10조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제10조. 분쟁 해결 및 준거법</h2>
        <p style={pStyle}>
          서비스 이용과 관련한 분쟁은 대한민국 법률을 준거법으로 하여 해결합니다.
          회사와 이용자 간에 발생한 분쟁은 원만한 합의를 통해 해결하는 것을 원칙으로 하며,
          합의가 이루어지지 않을 경우 관할 법원은 회사의 소재지를 관할하는 법원으로 합니다.
        </p>
      </div>

      {/* 제11조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제11조. 문의</h2>
        <p style={pStyle}>이용약관에 관한 문의사항은 아래 이메일로 연락주시기 바랍니다.</p>
        <div style={{ padding: "20px 24px", backgroundColor: "#F8F9FA", border: "1px solid #E2E8F0" }}>
          <p style={{ ...pStyle, margin: 0 }}>
            <strong style={{ color: "#0F172A" }}>이메일:</strong>{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: "#3B82F6" }}>{EMAIL}</a>
          </p>
        </div>
      </div>

      {/* 개정 이력 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>개정 이력</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
          <thead>
            <tr>
              {["버전", "시행일", "주요 변경 사항"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", backgroundColor: "#F8F9FA", fontWeight: 700, color: "#0F172A", textAlign: "left", border: "1px solid #E2E8F0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px 14px", color: "#475569", border: "1px solid #E2E8F0" }}>v1.0</td>
              <td style={{ padding: "10px 14px", color: "#475569", border: "1px solid #E2E8F0" }}>{EFFECTIVE_DATE}</td>
              <td style={{ padding: "10px 14px", color: "#475569", border: "1px solid #E2E8F0" }}>최초 시행</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
          先益 — Know First, Win First.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/privacy" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            개인정보처리방침
          </Link>
          <Link href="/" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
