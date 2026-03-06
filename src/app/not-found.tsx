import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "120px 40px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.15em",
          color: "#94A3B8",
          marginBottom: "16px",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "28px",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 700,
          color: "#0F172A",
          marginBottom: "12px",
        }}
      >
        페이지를 찾을 수 없습니다
      </h1>
      <p
        style={{
          fontSize: "14px",
          fontFamily: "'Pretendard', sans-serif",
          color: "#64748B",
          marginBottom: "40px",
          lineHeight: "1.7",
        }}
      >
        요청하신 페이지가 존재하지 않거나
        <br />
        이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "10px 32px",
          backgroundColor: "#0F172A",
          color: "white",
          fontSize: "13px",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
