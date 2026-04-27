export default function SeonikFooter() {
  return (
    <footer style={{ padding: "48px 24px", borderTop: "1px solid #F1F5F9" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", color: "#0F172A" }}>
          SEONIK
        </span>
        <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "12px", color: "#CBD5E1" }}>
          © {new Date().getFullYear()} 선익 · K-스타트업 · 기업마당 데이터 자동 수집
        </span>
      </div>
    </footer>
  );
}
