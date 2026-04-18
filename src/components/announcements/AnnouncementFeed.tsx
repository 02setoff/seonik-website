"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import AnnouncementCard, { AnnouncementItem } from "./AnnouncementCard";
import OnboardingModal from "./OnboardingModal";

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const STAGES = ["전체", "예비창업자", "초기창업자", "성장기창업자"];
const SOURCES = ["전체", "K-스타트업", "기업마당", "수동"];

interface Profile {
  name: string | null;
  region: string | null;
  affiliation: string | null;
  startupStage: string | null;
  onboarded: boolean;
}

interface FeedData {
  announcements: AnnouncementItem[];
  personalized: boolean;
  profile: Profile | null;
}

export default function AnnouncementFeed() {
  const { data: session } = useSession();
  const [data, setData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filterRegion, setFilterRegion] = useState("전체");
  const [filterStage, setFilterStage] = useState("전체");
  const [filterSource, setFilterSource] = useState("전체");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements/personalized");
      const json: FeedData = await res.json();
      setData(json);
      if (session && json.profile && !json.profile.onboarded) {
        setShowOnboarding(true);
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { load(); }, [load]);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    load();
  }

  const displayed = (data?.announcements ?? []).filter((a) => {
    if (filterRegion !== "전체" && !a.region.includes(filterRegion) && a.region !== "전국") return false;
    if (filterStage !== "전체" && !a.stage.includes(filterStage) && a.stage !== "전체") return false;
    if (filterSource !== "전체" && a.source !== filterSource) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !(a.organization ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={() => setShowOnboarding(false)}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px 60px" }}>
        {/* 헤더 배너 */}
        <div style={{
          padding: "40px 0 32px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "32px",
        }}>
          {data?.personalized && data.profile ? (
            <>
              <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-placeholder)", marginBottom: "8px" }}>
                맞춤 공고
              </p>
              <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                {data.profile.name ?? ""}님이 지금 신청할 수 있는 공고{" "}
                <span style={{ color: "#1E40AF" }}>{displayed.length}개</span>
              </h1>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", marginTop: "8px" }}>
                {data.profile.region} · {data.profile.affiliation} · {data.profile.startupStage} 기준
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-placeholder)", marginBottom: "8px" }}>
                창업 공고 피드
              </p>
              <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                전체 공고 <span style={{ color: "#1E40AF" }}>{displayed.length}개</span>
              </h1>
              {!session && (
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", marginTop: "8px" }}>
                  로그인하면 내 상황에 맞는 공고만 추려드립니다
                </p>
              )}
            </>
          )}
        </div>

        {/* 검색 + 필터 바 */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="공고명, 기관명 검색..."
            style={{
              flex: 1, minWidth: "200px", padding: "10px 14px",
              fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
              backgroundColor: "var(--bg-card)", color: "var(--text-primary)",
              border: "1px solid var(--border)", outline: "none",
            }}
          />
          <button
            onClick={() => setShowFilters((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 16px", fontSize: "13px",
              fontFamily: "'Pretendard', sans-serif", fontWeight: 500,
              backgroundColor: showFilters ? "#EFF6FF" : "var(--bg-card)",
              color: showFilters ? "#1E40AF" : "var(--text-primary)",
              border: `1px solid ${showFilters ? "#BFDBFE" : "var(--border)"}`,
              cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={14} /> 필터
          </button>
          <button
            onClick={load}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 14px", fontSize: "13px",
              fontFamily: "'Pretendard', sans-serif",
              backgroundColor: "var(--bg-card)", color: "var(--text-muted)",
              border: "1px solid var(--border)", cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <div style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
            padding: "20px", marginBottom: "20px",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px",
          }}>
            <FilterGroup label="지역" value={filterRegion} options={REGIONS} onChange={setFilterRegion} />
            <FilterGroup label="창업단계" value={filterStage} options={STAGES} onChange={setFilterStage} />
            <FilterGroup label="출처" value={filterSource} options={SOURCES} onChange={setFilterSource} />
          </div>
        )}

        {/* 결과 */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-placeholder)", fontFamily: "'Pretendard', sans-serif" }}>
            공고를 불러오는 중...
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "16px", color: "var(--text-muted)", fontFamily: "'Pretendard', sans-serif", marginBottom: "8px" }}>
              조건에 맞는 공고가 없습니다
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-placeholder)", fontFamily: "'Pretendard', sans-serif" }}>
              필터를 변경하거나 전체 보기를 시도해보세요
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
    </>
  );
}

function FilterGroup({
  label, value, options, onChange,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-placeholder)", marginBottom: "8px" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "5px 10px", fontSize: "13px",
              fontFamily: "'Pretendard', sans-serif",
              border: `1px solid ${value === opt ? "#1E40AF" : "var(--border)"}`,
              backgroundColor: value === opt ? "#EFF6FF" : "transparent",
              color: value === opt ? "#1E40AF" : "var(--text-muted)",
              cursor: "pointer", fontWeight: value === opt ? 600 : 400,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
