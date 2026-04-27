"use client";

import { ExternalLink } from "lucide-react";

export interface AnnouncementItem {
  id: string;
  title: string;
  description: string | null;
  region: string;
  affiliation: string;
  stage: string;
  deadline: string | null;
  applyUrl: string | null;
  organization: string | null;
  source: string;
  createdAt: string;
}

function daysLeft(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DayBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) return <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#CBD5E1", minWidth: "44px" }}>—</span>;
  const d = daysLeft(deadline);
  const color = d <= 0 ? "#94A3B8" : d <= 3 ? "#DC2626" : d <= 7 ? "#EA580C" : d <= 14 ? "#D97706" : "#475569";
  const bg    = d <= 0 ? "#F1F5F9" : d <= 3 ? "#FEF2F2" : d <= 7 ? "#FFF7ED" : d <= 14 ? "#FFFBEB" : "#F8F9FA";
  const label = d <= 0 ? "마감" : `D-${d}`;
  return (
    <span style={{
      fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700,
      color, backgroundColor: bg, border: `1px solid ${color}20`,
      padding: "2px 7px", whiteSpace: "nowrap", minWidth: "44px", textAlign: "center",
    }}>
      {label}
    </span>
  );
}

const SOURCE_DOT: Record<string, string> = {
  "K-스타트업": "#0369A1",
  "기업마당":   "#047857",
  "수동":       "#374151",
};

export default function AnnouncementRow({ item, urgent }: { item: AnnouncementItem; urgent?: boolean }) {
  const dotColor = SOURCE_DOT[item.source] ?? "#94A3B8";
  const regionTags = item.region === "전국" ? ["전국"] : item.region.split(",").map((r) => r.trim()).filter(Boolean);
  const stageTags  = item.stage  !== "전체"  ? item.stage.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div
      className="ann-row"
      style={{
        borderBottom: "1px solid #E2E8F0",
        padding: "14px 0",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        backgroundColor: urgent ? "#FFFBFA" : "transparent",
        transition: "background-color 0.1s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = urgent ? "#FFF5F5" : "#F8F9FA"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = urgent ? "#FFFBFA" : "transparent"; }}
    >
      {/* D-day 배지 */}
      <div style={{ paddingTop: "2px", flexShrink: 0 }}>
        <DayBadge deadline={item.deadline} />
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 출처 점 + 제목 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0, marginTop: "6px" }} />
          <p style={{
            fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: "14px",
            color: "#0F172A", margin: 0, lineHeight: 1.5,
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {item.title}
          </p>
        </div>

        {/* 기관 + 태그 */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", marginTop: "6px", paddingLeft: "14px" }}>
          {item.organization && (
            <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "12px", color: "#64748B" }}>
              {item.organization}
            </span>
          )}
          {(regionTags.length > 0 || stageTags.length > 0) && item.organization && (
            <span style={{ color: "#CBD5E1", fontSize: "12px" }}>·</span>
          )}
          {regionTags.map((r) => (
            <Tag key={r} label={r} />
          ))}
          {stageTags.map((s) => (
            <Tag key={s} label={s} blue />
          ))}
        </div>
      </div>

      {/* 신청 버튼 */}
      {item.applyUrl && (
        <a
          href={item.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0,
            display: "flex", alignItems: "center", gap: "4px",
            padding: "6px 12px",
            fontFamily: "'Pretendard', sans-serif", fontSize: "12px", fontWeight: 600,
            backgroundColor: "#0F172A", color: "#FFFFFF",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1E293B")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0F172A")}
        >
          신청 <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

function Tag({ label, blue }: { label: string; blue?: boolean }) {
  return (
    <span style={{
      fontFamily: "'Pretendard', sans-serif", fontSize: "11px",
      padding: "1px 6px",
      backgroundColor: blue ? "#EFF6FF" : "#F1F5F9",
      color: blue ? "#1E40AF" : "#64748B",
      border: `1px solid ${blue ? "#BFDBFE" : "#E2E8F0"}`,
    }}>
      {label}
    </span>
  );
}
