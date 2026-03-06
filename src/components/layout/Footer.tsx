"use client";

import { useState } from "react";
import { Instagram } from "lucide-react";
import ContactModal from "./ContactModal";

export default function FeedFooter() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer>
        {/* ── Instagram CTA 섹션 ── */}
        <div
          className="bg-[#0F172A] flex flex-col items-center justify-center text-center"
          style={{ padding: "64px 40px" }}
        >
          <p
            className="text-white font-medium"
            style={{
              fontSize: "clamp(16px, 3vw, 22px)",
              fontFamily: "'Pretendard', sans-serif",
              marginBottom: "10px",
            }}
          >
            인스타그램에서 선익의 인사이트를 먼저 만나보세요.
          </p>
          <p
            className="text-[#475569]"
            style={{
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.06em",
              marginBottom: "32px",
            }}
          >
            Intelligence that moves before the market does.
          </p>
          <a
            href="https://instagram.com/seonik_official"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-white text-white font-medium hover:bg-white hover:text-[#0F172A] transition-colors duration-200"
            style={{
              padding: "14px 32px",
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "15px",
              borderRadius: 0,
            }}
          >
            <Instagram size={18} />
            @seonik_official 팔로우
          </a>
        </div>

        {/* ── 하단 심플 바 ── */}
        <div
          className="bg-[#060E1C] flex flex-col items-center gap-4"
          style={{ padding: "36px 40px", textAlign: "center" }}
        >
          {/* 브랜드 */}
          <div className="flex flex-col items-center">
            <p
              className="font-bold text-white leading-none"
              style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif" }}
            >
              선익
            </p>
            <p
              className="font-semibold text-[#475569] leading-none"
              style={{ fontSize: "11px", marginTop: "3px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em" }}
            >
              SEONIK
            </p>
          </div>

          {/* 저작권 + 모토 */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-[#475569]" style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif" }}>
              &copy; 2026 SEONIK 선익. All rights reserved.
            </p>
            <p className="text-[#475569]" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              先益 — Know First, Win First.
            </p>
          </div>

          {/* 연락처 */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
            >
              seonik.official@gmail.com
            </button>
            <a
              href="https://instagram.com/seonik_official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
            >
              @seonik_official
            </a>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
