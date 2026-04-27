export default function SeonikHeader() {
  return (
    <header style={{
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #F1F5F9",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <path d="M7 21L21 7M21 7H9M21 7V19" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "0.1em",
            color: "#0F172A",
          }}>
            SEONIK
          </span>
        </a>
      </div>
    </header>
  );
}
