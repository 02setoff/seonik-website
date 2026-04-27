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
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* 로고 */}
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            letterSpacing: "0.05em",
            color: "#0F172A",
          }}>
            SEONIK
          </span>
          <span style={{
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            color: "#94A3B8",
            letterSpacing: "0.02em",
          }}>
            선익
          </span>
        </a>

        {/* 배지 */}
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#1E40AF",
          backgroundColor: "#EFF6FF",
          border: "1px solid #BFDBFE",
          padding: "4px 10px",
        }}>
          창업 공고 피드
        </span>
      </div>
    </header>
  );
}
