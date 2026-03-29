"use client";

import { useState } from "react";
import Link from "next/link";
import ContactModal from "./ContactModal";

export default function FeedFooter() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer>
        <div
          style={{
            backgroundColor: "#060E1C",
            padding: "56px 0 96px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* 브랜드 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
            <p style={{
              fontSize: "22px", fontFamily: "'Pretendard', sans-serif",
              fontWeight: 800, color: "white", lineHeight: 1, margin: 0,
            }}>
              선익
            </p>
            <p style={{
              fontSize: "11px", fontFamily: "Inter, sans-serif",
              fontWeight: 700, color: "#475569",
              letterSpacing: "0.18em", lineHeight: 1, margin: 0,
            }}>
              SEONIK
            </p>
          </div>

          {/* 구분선 */}
          <div style={{ width: "32px", height: "1px", backgroundColor: "#1E293B" }} />

          {/* 저작권 + 모토 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{
              fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
              color: "#475569", margin: 0,
            }}>
              &copy; 2026 SEONIK 선익. All rights reserved.
            </p>
            <p style={{
              fontSize: "12px", fontFamily: "Inter, sans-serif",
              color: "#334155", margin: 0, letterSpacing: "0.02em",
            }}>
              先益 — 앞서나가는 정보로 실행가들을 이롭게
            </p>
          </div>

          {/* 법적 링크 */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {[
              { href: "/terms", label: "이용약관" },
              { href: "/privacy", label: "개인정보처리방침" },
              { href: "/disclaimer", label: "면책 조항" },
            ].map((item, i, arr) => (
              <span key={item.href} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Link
                  href={item.href}
                  style={{
                    fontSize: "12px", fontFamily: "Inter, sans-serif",
                    color: "#475569", textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; }}
                >
                  {item.label}
                </Link>
                {i < arr.length - 1 && (
                  <span style={{ fontSize: "12px", color: "#1E293B" }}>|</span>
                )}
              </span>
            ))}
          </div>

          {/* 이메일 */}
          <button
            onClick={() => setIsContactOpen(true)}
            style={{
              fontSize: "12px", fontFamily: "Inter, sans-serif",
              color: "#475569", background: "none", border: "none",
              cursor: "pointer", transition: "color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
          >
            seonik.official@gmail.com
          </button>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
