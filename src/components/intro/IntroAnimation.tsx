"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}
// useCallback kept for onEnterFeed wrapper below
import { ChevronDown } from "lucide-react";
import { TIMING } from "@/lib/constants";

interface IntroAnimationProps {
  onEnterFeed: () => void;
}

// 0: 초기(숨김), 1: 로고 표시, 2: 슬로건 등장, 3: CTA 버튼 등장
type Phase = 0 | 1 | 2 | 3;

export default function IntroAnimation({ onEnterFeed }: IntroAnimationProps) {
  const [phase, setPhase] = useState<Phase>(0);
  const isMobile = useIsMobile();
  // 피드 진입 여부 추적 (휠/키 핸들러 중복 발동 방지)
  const hasEnteredFeed = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), TIMING.logoFadeDelay);
    const t2 = setTimeout(() => setPhase(2), TIMING.phase2Start);
    const t3 = setTimeout(() => setPhase(3), TIMING.phase3Start);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 휠/키보드로 피드 진입 (최초 1회만 발동)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && window.scrollY < 50 && !hasEnteredFeed.current) {
        hasEnteredFeed.current = true;
        onEnterFeed();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.key === "ArrowDown" || e.key === " ") &&
        window.scrollY < 50 &&
        !hasEnteredFeed.current
      ) {
        e.preventDefault();
        hasEnteredFeed.current = true;
        onEnterFeed();
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
    <div className="relative bg-[#F8F9FA] flex items-center justify-center overflow-hidden" style={{ height: "100vh" }}>

      {/* 메인 콘텐츠 컬럼 */}
      <div className="flex flex-col items-center">

        {/* ── 데스크톱: 가로 배치 / 모바일: 세로 배치 ── */}
        <motion.div
          layout
          transition={{ layout: { duration: 0.6, ease: "easeOut" } }}
          className="flex md:flex-row flex-col items-center"
        >
          {/* 로고 블록 */}
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{
              opacity: {
                duration: TIMING.logoFadeDuration / 1000,
                ease: "easeOut",
              },
              layout: { duration: TIMING.logoMoveDuration / 1000, ease: "easeOut" },
            }}
            className="flex flex-col items-center"
          >
            <span
              className="font-bold text-[#0F172A] tracking-[0.1em] leading-none"
              style={{
                fontSize: "48px",
                fontFamily: "'Pretendard', sans-serif",
                letterSpacing: "0.15em",
              }}
            >
              선 익
            </span>
            <span
              className="font-semibold text-[#0F172A] leading-none"
              style={{
                fontSize: "27px",
                marginTop: "6px",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.22em",
              }}
            >
              SEONIK
            </span>
          </motion.div>

          {/* 데스크톱: 세로 구분선 */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: TIMING.dividerDelay / 1000,
                duration: TIMING.dividerDuration / 1000,
                ease: "easeOut",
              }}
              className="hidden md:block w-px bg-[#E2E8F0] shrink-0"
              style={{ height: "60px", margin: "0 30px" }}
            />
          )}

          {/* 모바일: 가로 구분선 */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
              className="md:hidden h-px bg-[#E2E8F0] shrink-0"
              style={{ width: "80px", margin: "24px 0" }}
            />
          )}

          {/* 슬로건 */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, ...(isMobile ? { y: -20 } : { x: -20 }) }}
              animate={{ opacity: 1, ...(isMobile ? { y: 0 } : { x: 0 }) }}
              transition={{
                delay: TIMING.sloganDelay / 1000,
                duration: TIMING.sloganDuration / 1000,
                ease: "easeOut",
              }}
              className="text-center md:text-left"
            >
              <p
                className="font-medium text-[#0F172A]"
                style={{
                  fontSize: "24px",
                  lineHeight: 1.4,
                  fontFamily: "'Pretendard', sans-serif",
                }}
              >
                앞서나가는 정보로
                <br />
                실행가들을 이롭게
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* CTA 버튼 (Step 2.5) */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: TIMING.ctaDuration / 1000,
              ease: "easeOut",
            }}
            className="flex flex-col items-center"
            style={{ marginTop: "60px" }}
          >
            <button
              onClick={onEnterFeed}
              className="px-8 py-4 border border-[#0F172A] text-[#0F172A] font-medium text-base hover:bg-[#0F172A] hover:text-white transition-colors duration-200 md:w-auto w-[calc(100vw-40px)]"
              style={{
                fontFamily: "'Pretendard', sans-serif",
                borderRadius: 0,
                fontSize: "16px",
              }}
            >
              브리핑 열람하기
            </button>

            {/* 바운싱 화살표 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#94A3B8]"
              style={{ marginTop: "16px" }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
