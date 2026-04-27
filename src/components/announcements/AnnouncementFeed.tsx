"use client";

import { useState, useEffect, useCallback } from "react";
import { AnnouncementItem } from "./AnnouncementCard";
import AnnouncementRow from "./AnnouncementCard";

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const STAGES  = ["전체", "예비창업자", "초기창업자", "성장기창업자"];
const PAGE_SIZE = 30;

export default function AnnouncementFeed() {
  const [items, setItems]               = useState<AnnouncementItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterRegion, setFilterRegion] = useState("전체");
  const [filterStage, setFilterStage]   = useState("전체");
  const [page, setPage]                 = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, filterRegion, filterStage]);

  const filtered = items.filter((a) => {
    if (filterRegion !== "전체" && !a.region.includes(filterRegion) && a.region !== "전국") return false;
    if (filterStage  !== "전체" && !a.stage.includes(filterStage) && a.stage !== "전체") return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !(a.organization ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px 80px" }}>

      {/* ── 히어로 ── */}
      <div style={{ padding: "64px 0 40px" }}>
        <h1 style={{
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(28px, 5vw, 40px)",
          color: "#0F172A",
          margin: "0 0 12px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>
          창업 공고
        </h1>
        <p style={{
          fontFamily: "'Pretendard', sans-serif",
          fontSize: "16px",
          color: "#94A3B8",
          margin: 0,
          lineHeight: 1.6,
        }}>
          {loading
            ? "공고를 불러오는 중..."
            : `${items.length.toLocaleString()}개의 공고를 매일 자동으로 수집합니다.`}
        </p>
      </div>

      {/* ── 검색 ── */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="공고명 또는 기관명으로 검색"
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: "15px",
          fontFamily: "'Pretendard', sans-serif",
          color: "#0F172A",
          backgroundColor: "#F8F9FA",
          border: "none",
          outline: "none",
          borderRadius: "10px",
          boxSizing: "border-box",
        }}
      />

      {/* ── 필터 ── */}
      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <FilterTabs label="지역" options={REGIONS} value={filterRegion} onChange={setFilterRegion} />
        <FilterTabs label="단계" options={STAGES}  value={filterStage}  onChange={setFilterStage} />
      </div>

      {/* ── 리스트 ── */}
      {loading ? null : filtered.length === 0 ? (
        <div style={{ padding: "80px 0", textAlign: "center" }}>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "15px", color: "#CBD5E1" }}>
            검색 결과가 없습니다
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginTop: "32px", borderTop: "1px solid #F1F5F9" }}>
            {/* 결과 수 */}
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#CBD5E1", margin: "16px 0 0", textAlign: "right" }}>
              {filtered.length.toLocaleString()}개
            </p>
            {paged.map((item) => (
              <AnnouncementRow key={item.id} item={item} />
            ))}
          </div>

          {/* ── 페이지네이션 ── */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", marginTop: "48px" }}>
              <NavBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} label="←" />
              {buildPages(page, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={i} style={{ width: "36px", textAlign: "center", color: "#CBD5E1", fontSize: "13px" }}>…</span>
                ) : (
                  <NavBtn key={p} onClick={() => setPage(Number(p))} active={Number(p) === page} label={String(p)} />
                )
              )}
              <NavBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} label="→" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterTabs({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#CBD5E1", fontWeight: 600, letterSpacing: "0.06em", minWidth: "28px" }}>
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button key={opt} onClick={() => onChange(opt)} style={{
              padding: "4px 12px",
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "13px",
              fontWeight: active ? 600 : 400,
              borderRadius: "20px",
              border: "none",
              backgroundColor: active ? "#0F172A" : "transparent",
              color: active ? "#FFFFFF" : "#94A3B8",
              cursor: "pointer",
              transition: "all 0.1s",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, active, label }: {
  onClick: () => void; disabled?: boolean; active?: boolean; label: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "36px", height: "36px", borderRadius: "8px",
      fontFamily: "Inter, sans-serif", fontSize: "13px",
      fontWeight: active ? 700 : 400,
      border: "none",
      backgroundColor: active ? "#0F172A" : "transparent",
      color: active ? "#FFFFFF" : disabled ? "#E2E8F0" : "#94A3B8",
      cursor: disabled ? "default" : "pointer",
    }}>
      {label}
    </button>
  );
}

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}
