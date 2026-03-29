"use client";

import { useState } from "react";
import Link from "next/link";
import ContactModal from "./ContactModal";

export default function FeedFooter() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer>
        {/* ── 하단 심플 바 ── */}
        <div
          className="bg-[#060E1C] flex flex-col items-center gap-4 px-5 md:px-10"
          style={{ padding: "36px 0", textAlign: "center" }}
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
              style={{ fontSize: "10px", marginTop: "4px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em" }}
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
              先益 — 앞서나가는 정보로 실행가들을 이롭게
            </p>
          </div>

          {/* 법적 링크 */}
          <div className="flex items-center gap-4">
            <Link href="/terms"
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              이용약관
            </Link>
            <span style={{ color: "#2D3748", fontSize: "12px" }}>|</span>
            <Link href="/privacy"
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              개인정보처리방침
            </Link>
            <span style={{ color: "#2D3748", fontSize: "12px" }}>|</span>
            <Link href="/disclaimer"
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              면책 조항
            </Link>
          </div>

          {/* 연락처 */}
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-[#475569] hover:text-white transition-colors duration-200"
            style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
          >
            seonik.official@gmail.com
          </button>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
