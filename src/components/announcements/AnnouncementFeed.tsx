"use client";

import { useState, useEffect, useCallback } from "react";
import { AnnouncementItem } from "./AnnouncementCard";
import AnnouncementRow from "./AnnouncementCard";

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const STAGES  = ["전체", "예비창업자", "초기창업자", "성장기창업자"];
const PAGE_SIZE = 30;

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AnnouncementFeed() {
  const [items, setItems]           = useState<AnnouncementItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filterRegion, setFilterRegion] = useState("전체");
  const [filterStage, setFilterStage]   = useState("전체");
  const [filterSource, setFilterSource] = useState("전체");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/announcements");
      const json = await res.json();
      setItems(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // 필터가 바뀌면 첫 페이지로
  useEffect(() => { setPage(1); }, [filterRegion, filterStage, filterSource, search]);

  const isFiltered = filterRegion !== "전체" || filterStage !== "전체" || filterSource !== "전체" || search !== "";

  const filtered = items.filter((a) => {
    if (filterRegion !== "전체" && !a.region.includes(filterRegion) && a.region !== "전국") return false;
    if (filterStage  !== "전체" && !a.stage.includes(filterStage) && a.stage !== "전체") return false;
    if (filterSource !== "전체" && a.source !== filterSource) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) &&
        !(a.organization ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // 마감 임박 (D-7 이하, 필터 없을 때만)
  const urgent = !isFiltered
    ? items.filter((a) => { const d = daysLeft(a.deadline); return d !== null && d >= 0 && d <= 7; })
    : [];

  // 페이지네이션
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px 80px" }}>

      {/* ── 타이틀 ── */}
      <div style={{ padding: "40px 0 28px", borderBottom: "1px solid #E2E8F0" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "10px" }}>
          STARTUP ANNOUNCEMENTS
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: "clamp(22px, 3.5vw, 30px)", color: "#0F172A", margin: 0 }}>
            창업 지원 공고
          </h1>
          {!loading && (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#94A3B8" }}>
              총 {items.length.toLocaleString()}개
              {urgent.length > 0 && (
                <span style={{ color: "#DC2626", fontWeight: 600, marginLeft: "10px" }}>
                  · 마감 임박 {urgent.length}개
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* ── 검색 ── */}
      <div style={{ padding: "20px 0 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="공고명, 기관명 검색..."
          style={{
            width: "100%", padding: "10px 14px",
            fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
            backgroundColor: "#F8F9FA", color: "#0F172A",
            border: "1px solid #E2E8F0", outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* ── 필터 칩 ── */}
      <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <FilterRow label="지역" options={REGIONS} value={filterRegion} onChange={setFilterRegion} />
        <FilterRow label="단계" options={STAGES}  value={filterStage}  onChange={setFilterStage} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "2px" }}>
          {["전체", "K-스타트업", "기업마당"].map((s) => (
            <button key={s} onClick={() => setFilterSource(s)} style={{
              padding: "4px 10px", fontSize: "12px",
              fontFamily: "Inter, sans-serif", fontWeight: filterSource === s ? 600 : 400,
              border: `1px solid ${filterSource === s ? "#0F172A" : "#E2E8F0"}`,
              backgroundColor: filterSource === s ? "#0F172A" : "transparent",
              color: filterSource === s ? "#FFFFFF" : "#475569",
              cursor: "pointer",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "80px 0", textAlign: "center", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif", fontSize: "14px" }}>
          공고를 불러오는 중...
        </div>
      ) : (
        <>
          {/* ── 마감 임박 섹션 ── */}
          {urgent.length > 0 && !isFiltered && (
            <div style={{ marginTop: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#DC2626" }}>
                  ⚡ 마감 임박
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#94A3B8" }}>D-7 이하</span>
              </div>
              <div style={{ borderTop: "2px solid #DC2626", marginTop: "10px" }}>
                {urgent.map((item) => (
                  <AnnouncementRow key={item.id} item={item} urgent />
                ))}
              </div>
            </div>
          )}

          {/* ── 전체 공고 리스트 ── */}
          <div style={{ marginTop: urgent.length > 0 && !isFiltered ? "40px" : "32px" }}>
            {filtered.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#0F172A" }}>
                  {isFiltered ? "검색 결과" : "전체 공고"}
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#94A3B8" }}>
                  {filtered.length.toLocaleString()}개
                </span>
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ padding: "80px 0", textAlign: "center" }}>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "15px", color: "#475569", marginBottom: "6px" }}>
                  조건에 맞는 공고가 없습니다
                </p>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "13px", color: "#94A3B8" }}>
                  필터를 바꾸거나 검색어를 지워보세요
                </p>
              </div>
            ) : (
              <div style={{ borderTop: "1px solid #0F172A", marginTop: "10px" }}>
                {paged.map((item) => (
                  <AnnouncementRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* ── 페이지네이션 ── */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginTop: "40px" }}>
              <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} label="←" />
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = totalPages <= 7 ? i + 1
                  : page <= 4 ? i + 1
                  : page >= totalPages - 3 ? totalPages - 6 + i
                  : page - 3 + i;
                return (
                  <PageBtn key={p} onClick={() => setPage(p)} active={p === page} label={String(p)} />
                );
              })}
              <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} label="→" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterRow({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#94A3B8", minWidth: "24px", letterSpacing: "0.04em" }}>
        {label}
      </span>
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: "3px 10px", fontSize: "12px",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: value === opt ? 600 : 400,
          border: `1px solid ${value === opt ? "#1E40AF" : "#E2E8F0"}`,
          backgroundColor: value === opt ? "#EFF6FF" : "transparent",
          color: value === opt ? "#1E40AF" : "#475569",
          cursor: "pointer",
        }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function PageBtn({ onClick, disabled, active, label }: {
  onClick: () => void; disabled?: boolean; active?: boolean; label: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "32px", height: "32px",
      fontFamily: "Inter, sans-serif", fontSize: "13px",
      fontWeight: active ? 700 : 400,
      backgroundColor: active ? "#0F172A" : "transparent",
      color: active ? "#FFFFFF" : disabled ? "#CBD5E1" : "#475569",
      border: `1px solid ${active ? "#0F172A" : "#E2E8F0"}`,
      cursor: disabled ? "default" : "pointer",
    }}>
      {label}
    </button>
  );
}
