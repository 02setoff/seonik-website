"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

// 빠르게 가속 후 부드럽게 감속하는 스프링형 커브
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface IntroAnimationProps {
  onEnterFeed: () => void;
}

export default function IntroAnimation({ onEnterFeed }: IntroAnimationProps) {
  const hasEnteredFeed = useRef(false);

  // 휠 / 키보드로 피드 진입 (최초 1회만)
  useEffect(() => {
    const enter = () => {
      if (hasEnteredFeed.current) return;
      hasEnteredFeed.current = true;
      onEnterFeed();
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && window.scrollY < 50) enter();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onEnterFeed]);

  return (
    <div
      className="relative bg-[#F8F9FA] flex items-center justify-center overflow-hidden"
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col items-center">

        {/* 로고 + 구분선 + 슬로건 — 가로(데스크톱) / 세로(모바일) */}
        <div className="flex md:flex-row flex-col items-center">

          {/* 선익 / SEONIK 로고 */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
          >
            <span
              className="font-bold text-[#0F172A] leading-none"
              style={{ fontSize: "48px", fontFamily: "'Pretendard', sans-serif", letterSpacing: "0.15em" }}
            >
              선 익
            </span>
            <motion.span
              className="font-semibold text-[#0F172A] leading-none"
              style={{ fontSize: "27px", marginTop: "6px", fontFamily: "Inter, sans-serif", letterSpacing: "0.22em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
            >
              SEONIK
            </motion.span>
          </motion.div>

          {/* 데스크톱 세로 구분선 */}
          <motion.div
            className="hidden md:block w-px bg-[#CBD5E1] shrink-0"
            style={{ height: "60px", margin: "0 30px", originY: 0.5 }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.52, duration: 0.35, ease: EASE }}
          />

          {/* 모바일 가로 구분선 */}
          <motion.div
            className="md:hidden h-px bg-[#CBD5E1] shrink-0"
            style={{ width: "80px", margin: "22px 0", originX: 0.5 }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.52, duration: 0.35, ease: EASE }}
          />

          {/* 슬로건 */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.58, duration: 0.55, ease: EASE }}
          >
            <motion.p
              className="font-medium text-[#0F172A]"
              style={{ fontSize: "24px", lineHeight: 1.45, fontFamily: "'Pretendard', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.45, ease: EASE }}
            >
              앞서나가는 정보로
              <br />
              실행가들을 이롭게
            </motion.p>
          </motion.div>
        </div>

        {/* CTA 버튼 */}
        <motion.div
          className="flex flex-col items-center"
          style={{ marginTop: "60px" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5, ease: EASE }}
        >
          <button
            onClick={onEnterFeed}
            className="px-8 py-4 border border-[#0F172A] text-[#0F172A] font-medium text-base hover:bg-[#0F172A] hover:text-white transition-colors duration-200 md:w-auto w-[calc(100vw-40px)]"
            style={{ fontFamily: "'Pretendard', sans-serif", borderRadius: 0, fontSize: "16px" }}
          >
            브리핑 열람하기
          </button>

          {/* 바운싱 화살표 */}
          <motion.div
            className="text-[#94A3B8]"
            style={{ marginTop: "16px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.4 }}
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 1.35 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
