"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import IntroAnimation from "@/components/intro/IntroAnimation";
import FeedHeader from "@/components/layout/Header";
import FeedSection from "@/components/feed/FeedSection";
import FeedFooter from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";

export default function Home() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const introRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [showUnsubscribed, setShowUnsubscribed] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "signup" }>({
    open: false,
    tab: "login",
  });

  // 인트로 → 피드: 부드럽게 스크롤
  const scrollToFeed = useCallback(() => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // 로고 클릭 → 인트로로 스크롤 (언제나 가능)
  const scrollToIntro = useCallback(() => {
    introRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // 로그인 상태이면 피드로 즉시 이동
  useEffect(() => {
    if (isLoggedIn) {
      feedRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [isLoggedIn]);

  // ?unsubscribed=1 파라미터 처리 - 수신거부 완료 알림
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("unsubscribed") === "1") {
        setShowUnsubscribed(true);
        window.history.replaceState({}, "", "/");
        setTimeout(() => setShowUnsubscribed(false), 5000);
      }
    } catch {}
  }, []);

  return (
    <>
      {/* 수신거부 완료 알림 배너 */}
      {showUnsubscribed && (
        <div style={{
          position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          zIndex: 500, backgroundColor: "#0F172A", color: "white",
          padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)", maxWidth: "90vw",
        }}>
          <span style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
            이메일 수신거부가 처리되었습니다. 더 이상 알림 메일을 받지 않으십니다.
          </span>
          <button
            onClick={() => setShowUnsubscribed(false)}
            style={{
              background: "none", border: "none", color: "#94A3B8",
              cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: 0, flexShrink: 0,
            }}
          >×</button>
        </div>
      )}

      {/* 인트로 영역 — 항상 DOM에 유지 */}
      <div ref={introRef}>
        <IntroAnimation
          onEnterFeed={isLoggedIn ? scrollToFeed : undefined}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setAuthModal({ open: true, tab: "login" })}
          onSignupClick={() => setAuthModal({ open: true, tab: "signup" })}
        />
      </div>

      {/* 피드 영역 — 로그인한 사용자만 */}
      {isLoggedIn && (
        <div ref={feedRef}>
          <FeedHeader onLogoClick={scrollToIntro} />
          <FeedSection />
          <FeedFooter />
        </div>
      )}

      {/* 인트로 화면용 Auth 모달 */}
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))}
        defaultTab={authModal.tab}
      />
    </>
  );
}
