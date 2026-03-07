"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import IntroAnimation from "@/components/intro/IntroAnimation";
import FeedHeader from "@/components/layout/Header";
import FeedSection from "@/components/feed/FeedSection";
import FeedFooter from "@/components/layout/Footer";

export default function Home() {
  const introRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [showUnsubscribed, setShowUnsubscribed] = useState(false);
  const [feedActive, setFeedActive] = useState(false);

  const scrollToFeed = useCallback(() => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" });
    // 부드러운 스크롤 완료 후 인트로 숨김 + 피드를 최상단으로 고정
    setTimeout(() => {
      setFeedActive(true);
      window.scrollTo({ top: 0 });
    }, 650);
  }, []);

  // 로고 클릭: 피드 진입 전이면 인트로로 스크롤, 진입 후면 새로고침으로 인트로 재표시
  const scrollToIntro = useCallback(() => {
    if (feedActive) {
      window.location.reload();
    } else {
      introRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [feedActive]);

  // ?unsubscribed=1 파라미터 처리 - 수신거부 완료 알림
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("unsubscribed") === "1") {
        setShowUnsubscribed(true);
        // URL에서 파라미터 제거 (히스토리 오염 방지)
        window.history.replaceState({}, "", "/");
        // 5초 후 자동 닫기
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

      {/* 인트로 영역 — 피드 진입 후 숨김 (DOM에서 제거해 스크롤 역방향 차단) */}
      {!feedActive && (
        <div ref={introRef}>
          <IntroAnimation onEnterFeed={scrollToFeed} />
        </div>
      )}

      <div ref={feedRef}>
        <FeedHeader onLogoClick={scrollToIntro} />
        <FeedSection />
        <FeedFooter />
      </div>
    </>
  );
}
