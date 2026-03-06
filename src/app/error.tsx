"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        ERROR
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
        오류가 발생했습니다
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
        일시적인 오류가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 24px",
            backgroundColor: "#0F172A",
            color: "white",
            border: "none",
            fontSize: "13px",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
        <Link
          href="/"
          style={{
            padding: "10px 24px",
            backgroundColor: "white",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            fontSize: "13px",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
