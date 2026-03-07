import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 선익 SEONIK",
  description: "선익(SEONIK)의 개인정보처리방침입니다.",
};

const EFFECTIVE_DATE = "2025년 1월 1일";
const COMPANY = "선익(SEONIK)";
const EMAIL = "seonik.official@gmail.com";

export default function PrivacyPage() {
  const sectionStyle: React.CSSProperties = {
    marginBottom: "48px",
  };
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
  const tableStyle: React.CSSProperties = {
    width: "100%", borderCollapse: "collapse", marginBottom: "16px", fontSize: "13px",
    fontFamily: "'Pretendard', sans-serif",
  };
  const thStyle: React.CSSProperties = {
    padding: "10px 14px", backgroundColor: "#F8F9FA", fontWeight: 700,
    color: "#0F172A", textAlign: "left", border: "1px solid #E2E8F0",
  };
  const tdStyle: React.CSSProperties = {
    padding: "10px 14px", color: "#475569", border: "1px solid #E2E8F0", verticalAlign: "top",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.12em", marginBottom: "12px" }}>
          PRIVACY POLICY
        </p>
        <h1 style={{ fontSize: "28px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>
          개인정보처리방침
        </h1>
        <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>
          시행일: {EFFECTIVE_DATE}
        </p>
      </div>

      <div style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.85", marginBottom: "48px", padding: "20px 24px", backgroundColor: "#F8F9FA", borderLeft: "3px solid #0F172A" }}>
        {COMPANY}(이하 "회사")는 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하게 처리합니다.
      </div>

      {/* 제1조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제1조. 수집하는 개인정보 항목</h2>
        <p style={pStyle}>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>구분</th>
              <th style={thStyle}>수집 항목</th>
              <th style={thStyle}>수집 목적</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>필수</td>
              <td style={tdStyle}>이름, 이메일 주소, 비밀번호(암호화)</td>
              <td style={tdStyle}>회원 식별 및 서비스 제공</td>
            </tr>
            <tr>
              <td style={tdStyle}>필수</td>
              <td style={tdStyle}>직업, 선익을 알게 된 경로, 가입 이유</td>
              <td style={tdStyle}>맞춤형 콘텐츠 추천 및 서비스 개선</td>
            </tr>
            <tr>
              <td style={tdStyle}>선택</td>
              <td style={tdStyle}>이메일 수신 동의 여부 및 동의 일시</td>
              <td style={tdStyle}>새 브리핑 발행 이메일 알림 발송</td>
            </tr>
            <tr>
              <td style={tdStyle}>자동</td>
              <td style={tdStyle}>서비스 이용 기록, 콘텐츠 열람 이력</td>
              <td style={tdStyle}>서비스 개선 및 통계 분석</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 제2조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제2조. 개인정보 수집 및 이용 목적</h2>
        <ul style={{ paddingLeft: "20px", listStyle: "disc", marginBottom: "10px" }}>
          {[
            "회원 가입 및 관리: 회원 식별, 서비스 이용 자격 확인",
            "서비스 제공: 브리핑 콘텐츠 열람, 저장(체크), 개인화 추천",
            "이메일 알림 (선택 동의자): 새 브리핑 발행 시 이메일 발송",
            "고객 지원: 문의 접수 및 처리",
            "서비스 개선: 이용 패턴 분석, 통계 작성",
          ].map((item) => (
            <li key={item} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제3조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제3조. 개인정보 보유 및 이용 기간</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>항목</th>
              <th style={thStyle}>보유 기간</th>
              <th style={thStyle}>근거</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>회원 정보</td>
              <td style={tdStyle}>회원 탈퇴 시 즉시 삭제</td>
              <td style={tdStyle}>이용자 요청</td>
            </tr>
            <tr>
              <td style={tdStyle}>이메일 수신 동의 기록</td>
              <td style={tdStyle}>수신거부 후 6개월</td>
              <td style={tdStyle}>정보통신망법 제50조의5</td>
            </tr>
            <tr>
              <td style={tdStyle}>서비스 이용 기록</td>
              <td style={tdStyle}>회원 탈퇴 시 즉시 삭제</td>
              <td style={tdStyle}>이용자 요청</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 제4조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제4조. 이메일 광고성 정보 전송</h2>
        <p style={pStyle}>
          회사는 회원가입 시 이메일 수신에 동의한 이용자에 한하여 새 브리핑 발행 알림 이메일을 발송합니다.
        </p>
        <h3 style={h3Style}>수신 동의 및 거부</h3>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "동의: 회원가입 시 '새 브리핑 발행 시 이메일로 알림 받기' 체크박스를 통해 동의",
            "동의 철회: 수신된 이메일 하단의 '수신거부' 링크 클릭 시 즉시 처리",
            "대체 수단: 마이페이지 > 프로필 수정에서도 수신 여부를 변경할 수 있습니다",
          ].map((item) => (
            <li key={item} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
        <p style={{ ...pStyle, marginTop: "12px", color: "#94A3B8", fontSize: "12px" }}>
          * 수신 동의 일시는 법적 근거로 보관됩니다 (정보통신망법 제50조의5).
        </p>
      </div>

      {/* 제5조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제5조. 개인정보의 제3자 제공</h2>
        <p style={pStyle}>
          회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.
        </p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "이용자가 사전에 동의한 경우",
            "법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우",
          ].map((item) => (
            <li key={item} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제6조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제6조. 개인정보 처리 위탁</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>수탁업체</th>
              <th style={thStyle}>위탁 업무</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}>Vercel Inc.</td><td style={tdStyle}>서비스 호스팅 및 운영</td></tr>
            <tr><td style={tdStyle}>Neon Inc.</td><td style={tdStyle}>데이터베이스 관리</td></tr>
            <tr><td style={tdStyle}>Google LLC (Gmail)</td><td style={tdStyle}>이메일 발송 서비스</td></tr>
            <tr><td style={tdStyle}>Vercel Blob (Vercel Inc.)</td><td style={tdStyle}>이미지 파일 저장</td></tr>
          </tbody>
        </table>
      </div>

      {/* 제7조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제7조. 이용자의 권리</h2>
        <p style={pStyle}>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul style={{ paddingLeft: "20px", listStyle: "disc" }}>
          {[
            "개인정보 열람 요청: 마이페이지에서 직접 확인 가능",
            "개인정보 수정: 마이페이지 > 프로필 수정",
            "회원 탈퇴(삭제): 마이페이지 > 회원 탈퇴 (즉시 처리)",
            "이메일 수신 거부: 이메일 하단 수신거부 링크 또는 마이페이지",
          ].map((item) => (
            <li key={item} style={{ ...pStyle, marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 제8조 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>제8조. 개인정보 보호책임자</h2>
        <p style={pStyle}>개인정보 관련 문의사항은 아래로 연락주시기 바랍니다.</p>
        <div style={{ padding: "20px 24px", backgroundColor: "#F8F9FA", border: "1px solid #E2E8F0" }}>
          <p style={{ ...pStyle, margin: 0 }}>
            <strong style={{ color: "#0F172A" }}>개인정보 보호책임자:</strong> 선익 운영팀<br />
            <strong style={{ color: "#0F172A" }}>이메일:</strong>{" "}
            <a href={`mailto:${EMAIL}`} style={{ color: "#3B82F6" }}>{EMAIL}</a>
          </p>
        </div>
      </div>

      {/* 개정 이력 */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>개정 이력</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>버전</th>
              <th style={thStyle}>시행일</th>
              <th style={thStyle}>주요 변경 사항</th>
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

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
          先益 — Know First, Win First.
        </p>
        <Link href="/" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
          ← 홈으로
        </Link>
      </div>
    </div>
  );
}
