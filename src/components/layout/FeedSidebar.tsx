"use client";

import { useState, useCallback } from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import SearchModal from "./SearchModal";
import PostModal, { PostItem } from "@/components/feed/PostModal";

interface Props {
  onLogoClick?: () => void;
}

export default function FeedSidebar({ onLogoClick }: Props) {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const handleSelectPost = useCallback((post: PostItem) => setSelectedPost(post), []);

  return (
    <>
      {/* ── 데스크탑 우측 사이드바 ───────────────────────────── */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: "220px",
          flexShrink: 0,
          position: "sticky",
          top: "24px",
          height: "fit-content",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          backgroundColor: "var(--bg-card)",
          padding: "20px 12px",
          marginTop: "24px",
        }}
      >
        {/* 로고 */}
        <button
          onClick={onLogoClick}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 12px", textAlign: "left", marginBottom: "20px",
            width: "100%",
          }}
        >
          <span style={{
            fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
            color: "var(--text-primary)", display: "block", lineHeight: 1,
          }}>
            선익 인텔리전스
          </span>
          <span style={{
            fontSize: "8px", fontFamily: "Inter, sans-serif", fontWeight: 600,
            color: "var(--text-placeholder)", letterSpacing: "0.12em",
            marginTop: "4px", display: "block",
          }}>
            SEONIK Intelligence
          </span>
        </button>

        {/* 네비게이션 */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>

          {/* Notice */}
          <Link
            href="/notice"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "12px 12px", borderRadius: "0",
                color: "var(--text-secondary)",
                cursor: "pointer", transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-hover)";
                (e.currentTarget as HTMLDivElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLDivElement).style.color = "var(--text-secondary)";
              }}
            >
              <Bell size={22} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500 }}>
                Notice
              </span>
            </div>
          </Link>

          {/* 검색하기 */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "12px 12px",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-secondary)", width: "100%", textAlign: "left",
              transition: "background 0.12s, color 0.12s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            }}
          >
            <Search size={22} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500 }}>
              검색하기
            </span>
          </button>
        </nav>

        {/* 유저 섹션 */}
        {session && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
            <Link
              href="/mypage"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "12px 12px",
                  color: "var(--text-primary)",
                  cursor: "pointer", transition: "background 0.12s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-hover)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
              >
                <User size={22} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                <span style={{
                  fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </span>
              </div>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "12px 12px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-placeholder)", width: "100%", textAlign: "left",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)";
              }}
            >
              <LogOut size={22} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 400 }}>
                로그아웃
              </span>
            </button>
          </div>
        )}
      </aside>

      {/* ── 모바일 상단 바 ────────────────────────────────────── */}
      <div
        className="md:hidden sticky top-0 z-50 flex items-center justify-between"
        style={{
          height: "52px",
          backgroundColor: "var(--header-bg)",
          borderBottom: "1px solid var(--header-border)",
          padding: "0 16px",
        }}
      >
        <button
          onClick={onLogoClick}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}
        >
          <span style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>선익 인텔리전스</span>
          <span style={{ fontSize: "7px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "var(--text-placeholder)", letterSpacing: "0.12em", marginTop: "3px" }}>SEONIK Intelligence</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            aria-label="검색"
          >
            <Search size={20} strokeWidth={1.8} />
          </button>
          {session && (
            <>
              <Link
                href="/mypage"
                style={{ padding: "6px 8px", display: "flex", alignItems: "center", color: "var(--text-primary)" }}
                aria-label="마이페이지"
              >
                <User size={20} strokeWidth={1.8} />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", display: "flex", alignItems: "center", color: "var(--text-placeholder)" }}
                aria-label="로그아웃"
              >
                <LogOut size={20} strokeWidth={1.8} />
              </button>
            </>
          )}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelectPost={handleSelectPost} />
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
