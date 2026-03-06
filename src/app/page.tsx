"use client";

import { useRef, useCallback } from "react";
import IntroAnimation from "@/components/intro/IntroAnimation";
import FeedHeader from "@/components/layout/Header";
import FeedSection from "@/components/feed/FeedSection";
import FeedFooter from "@/components/layout/Footer";

export default function Home() {
  const introRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const scrollToFeed = useCallback(() => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToIntro = useCallback(() => {
    introRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <div ref={introRef}>
        <IntroAnimation onEnterFeed={scrollToFeed} />
      </div>
      <div ref={feedRef}>
        <FeedHeader onLogoClick={scrollToIntro} />
        <FeedSection />
        <FeedFooter />
      </div>
    </>
  );
}
