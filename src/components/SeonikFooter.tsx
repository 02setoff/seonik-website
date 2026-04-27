export default function SeonikFooter() {
  return (
    <footer style={{
      borderTop: "1px solid #E2E8F0",
      backgroundColor: "#FFFFFF",
      padding: "24px",
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: "#0F172A",
        }}>
          SEONIK
        </span>
        <span style={{
          fontFamily: "'Pretendard', sans-serif",
          fontSize: "12px",
          color: "#94A3B8",
        }}>
          © {new Date().getFullYear()} 선익. 공고 정보는 K-스타트업 · 기업마당에서 자동 수집됩니다.
        </span>
      </div>
    </footer>
  );
}
