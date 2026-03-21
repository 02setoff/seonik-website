"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// 빠르게 가속 후 부드럽게 감속하는 스프링형 커브
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface IntroAnimationProps {
  onEnterFeed?: () => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export default function IntroAnimation({ onEnterFeed, isLoggedIn, onLoginClick, onSignupClick }: IntroAnimationProps) {
  const hasEnteredFeed = useRef(false);
  const { theme, toggleTheme } = useTheme();

  // 로그인된 경우에만 휠 / 키보드로 피드 진입
  useEffect(() => {
    if (!isLoggedIn || !onEnterFeed) return;

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
  }, [onEnterFeed, isLoggedIn]);

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "100vh", backgroundColor: "var(--bg-primary)" }}
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
              className="font-bold leading-none"
              style={{ fontSize: "48px", fontFamily: "'Pretendard', sans-serif", letterSpacing: "0.15em", color: "var(--text-primary)" }}
            >
              선 익
            </span>
            <motion.span
              className="font-semibold leading-none"
              style={{ fontSize: "27px", marginTop: "6px", fontFamily: "Inter, sans-serif", letterSpacing: "0.22em", color: "var(--text-primary)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
            >
              SEONIK
            </motion.span>
          </motion.div>

          {/* 데스크톱 세로 구분선 */}
          <motion.div
            className="hidden md:block w-px shrink-0"
            style={{ height: "60px", margin: "0 30px", originY: 0.5, backgroundColor: "var(--text-disabled)" }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.52, duration: 0.35, ease: EASE }}
          />

          {/* 모바일 가로 구분선 */}
          <motion.div
            className="md:hidden h-px shrink-0"
            style={{ width: "80px", margin: "22px 0", originX: 0.5, backgroundColor: "var(--text-disabled)" }}
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
              className="font-medium"
              style={{ fontSize: "24px", lineHeight: 1.45, fontFamily: "'Pretendard', sans-serif", color: "var(--text-primary)" }}
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
          {isLoggedIn ? (
            /* 로그인 상태: 브리핑 열람하기 */
            <>
              <button
                onClick={onEnterFeed}
                className="px-8 py-4 font-medium text-base transition-colors duration-200 md:w-auto w-[calc(100vw-40px)]"
                style={{
                  fontFamily: "'Pretendard', sans-serif", borderRadius: 0, fontSize: "16px",
                  border: "1px solid var(--text-primary)",
                  color: "var(--text-primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--text-primary)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--bg-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
              >
                브리핑 열람하기
              </button>

              {/* 바운싱 화살표 */}
              <motion.div
                style={{ marginTop: "16px", color: "var(--text-placeholder)" }}
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
            </>
          ) : (
            /* 비로그인 상태: 회원가입 + 로그인 */
            <div
              className="flex md:flex-row flex-col items-center"
              style={{ gap: "12px" }}
            >
              {/* 회원가입하기 — 채워진 버튼 (주요 액션) */}
              <button
                onClick={onSignupClick}
                className="px-8 py-4 font-medium text-base transition-colors duration-200 md:w-auto w-[calc(100vw-40px)]"
                style={{
                  fontFamily: "'Pretendard', sans-serif", borderRadius: 0, fontSize: "16px",
                  border: "1px solid var(--text-primary)",
                  color: "var(--bg-primary)",
                  backgroundColor: "var(--text-primary)",
                  minWidth: "160px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.82";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                회원가입하기
              </button>

              {/* 로그인하기 — 아웃라인 버튼 */}
              <button
                onClick={onLoginClick}
                className="px-8 py-4 font-medium text-base transition-colors duration-200 md:w-auto w-[calc(100vw-40px)]"
                style={{
                  fontFamily: "'Pretendard', sans-serif", borderRadius: 0, fontSize: "16px",
                  border: "1px solid var(--text-primary)",
                  color: "var(--text-primary)",
                  backgroundColor: "transparent",
                  minWidth: "160px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--text-primary)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--bg-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
              >
                로그인하기
              </button>
            </div>
          )}
        </motion.div>

      </div>

      {/* 테마 토글 버튼 — 우측 하단 고정 (SEONIK 브랜드 스타일) */}
      <motion.button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          bottom: "clamp(20px, 4vw, 32px)",
          right: "clamp(16px, 4vw, 32px)",
          border: "1px solid var(--text-placeholder)",
          padding: "7px 16px",
          fontSize: "10px",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-placeholder)",
          background: "none",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-secondary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-placeholder)";
        }}
        aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      >
        {theme === "light" ? "◐ DARK MODE" : "◑ LIGHT MODE"}
      </motion.button>
    </div>
  );
}
