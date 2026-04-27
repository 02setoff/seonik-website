export default function SeonikHeader() {
  return (
    <header style={{
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "0 24px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          {/* 화살표 심볼 */}
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 21L21 7M21 7H9M21 7V19" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.08em",
            color: "#0F172A",
          }}>
            SEONIK
          </span>
        </a>

        <span style={{
          fontFamily: "'Pretendard', sans-serif",
          fontSize: "12px",
          color: "#94A3B8",
          letterSpacing: "0.02em",
        }}>
          창업 공고 피드
        </span>
      </div>
    </header>
  );
}
