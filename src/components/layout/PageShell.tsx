"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  code: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export default function PageShell({ code, title, subtitle, backHref = "/", backLabel = "홈으로", children }: Props) {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "clamp(40px, 8vw, 64px) clamp(20px, 5vw, 40px) 96px" }}>

        {/* 상단 back */}
        <div style={{ marginBottom: "40px" }}>
          <Link href={backHref} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)",
            textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-placeholder)")}
          >
            <ArrowLeft size={13} strokeWidth={2} />
            {backLabel}
          </Link>
        </div>

        {/* 페이지 헤더 */}
        <div style={{ marginBottom: "48px", paddingBottom: "28px", borderBottom: "2px solid var(--text-primary)" }}>
          <p style={{
            fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
            letterSpacing: "0.2em", color: "var(--text-placeholder)", marginBottom: "12px",
          }}>
            {code}
          </p>
          <h1 style={{
            fontSize: "clamp(24px, 5vw, 32px)", fontFamily: "'Pretendard', sans-serif",
            fontWeight: 800, color: "var(--text-primary)", marginBottom: subtitle ? "10px" : "0",
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", lineHeight: "1.6" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* 콘텐츠 */}
        {children}

        {/* 하단 푸터 링크 */}
        <div style={{
          marginTop: "64px", paddingTop: "24px",
          borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "12px",
        }}>
          <p style={{ fontSize: "11px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif" }}>
            先益 — SEONIK
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            {[{ href: "/terms", label: "이용약관" }, { href: "/privacy", label: "개인정보처리방침" }, { href: "/disclaimer", label: "면책 조항" }].map(item => (
              <Link key={item.href} href={item.href} style={{
                fontSize: "12px", color: "var(--text-placeholder)", fontFamily: "'Pretendard', sans-serif",
                textDecoration: "none", transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-placeholder)")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
