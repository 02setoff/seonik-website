"use client";

import { useState, useEffect, useCallback } from "react";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import AnnouncementCard, { AnnouncementItem } from "./AnnouncementCard";

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const STAGES = ["전체", "예비창업자", "초기창업자", "성장기창업자"];
const SOURCES = ["전체", "K-스타트업", "기업마당"];

export default function AnnouncementFeed() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filterRegion, setFilterRegion] = useState("전체");
  const [filterStage, setFilterStage] = useState("전체");
  const [filterSource, setFilterSource] = useState("전체");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const json: AnnouncementItem[] = await res.json();
      setItems(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const displayed = items.filter((a) => {
    if (filterRegion !== "전체" && !a.region.includes(filterRegion) && a.region !== "전국") return false;
    if (filterStage !== "전체" && !a.stage.includes(filterStage) && a.stage !== "전체") return false;
    if (filterSource !== "전체" && a.source !== filterSource) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !(a.organization ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}>

      {/* 타이틀 */}
      <div style={{
        padding: "48px 0 32px",
        borderBottom: "1px solid #E2E8F0",
        marginBottom: "32px",
      }}>
        <p style={{
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#94A3B8",
          marginBottom: "10px",
        }}>
          창업 지원 공고
        </p>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 700,
          color: "#0F172A",
          margin: 0,
          lineHeight: 1.2,
        }}>
          지금 신청 가능한 공고{" "}
          <span style={{ color: "#1E40AF" }}>{loading ? "—" : displayed.length}개</span>
        </h1>
        <p style={{
          fontSize: "14px",
          fontFamily: "'Pretendard', sans-serif",
          color: "#94A3B8",
          marginTop: "10px",
        }}>
          K-스타트업 · 기업마당 공고를 매일 자동 수집합니다
        </p>
      </div>

      {/* 검색 + 필터 바 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="공고명, 기관명 검색..."
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "10px 14px",
            fontSize: "14px",
            fontFamily: "'Pretendard', sans-serif",
            backgroundColor: "#FFFFFF",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            outline: "none",
          }}
        />
        <button
          onClick={() => setShowFilters((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 16px",
            fontSize: "13px",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 500,
            backgroundColor: showFilters ? "#EFF6FF" : "#FFFFFF",
            color: showFilters ? "#1E40AF" : "#475569",
            border: `1px solid ${showFilters ? "#BFDBFE" : "#E2E8F0"}`,
            cursor: "pointer",
          }}
        >
          <SlidersHorizontal size={14} /> 필터
        </button>
        <button
          onClick={load}
          title="새로고침"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            backgroundColor: "#FFFFFF",
            color: "#94A3B8",
            border: "1px solid #E2E8F0",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div style={{
          backgroundColor: "#F8F9FA",
          border: "1px solid #E2E8F0",
          padding: "20px 24px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}>
          <FilterGroup label="지역" value={filterRegion} options={REGIONS} onChange={setFilterRegion} />
          <FilterGroup label="창업 단계" value={filterStage} options={STAGES} onChange={setFilterStage} />
          <FilterGroup label="출처" value={filterSource} options={SOURCES} onChange={setFilterSource} />
        </div>
      )}

      {/* 결과 */}
      {loading ? (
        <div style={{
          textAlign: "center",
          padding: "100px 0",
          color: "#94A3B8",
          fontFamily: "'Pretendard', sans-serif",
          fontSize: "14px",
        }}>
          공고를 불러오는 중...
        </div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <p style={{ fontSize: "16px", color: "#475569", fontFamily: "'Pretendard', sans-serif", marginBottom: "8px" }}>
            조건에 맞는 공고가 없습니다
          </p>
          <p style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif" }}>
            필터를 바꾸거나 검색어를 지워보세요
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}>
          {displayed.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p style={{
        fontSize: "11px",
        fontFamily: "Inter, sans-serif",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#94A3B8",
        marginBottom: "10px",
        fontWeight: 600,
      }}>
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "5px 11px",
              fontSize: "13px",
              fontFamily: "'Pretendard', sans-serif",
              border: `1px solid ${value === opt ? "#1E40AF" : "#E2E8F0"}`,
              backgroundColor: value === opt ? "#EFF6FF" : "#FFFFFF",
              color: value === opt ? "#1E40AF" : "#475569",
              cursor: "pointer",
              fontWeight: value === opt ? 600 : 400,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
