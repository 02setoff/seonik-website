"use client";

import { ArrowRight } from "lucide-react";

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
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

function DeadlineText({ deadline }: { deadline: string | null }) {
  if (!deadline) return null;
  const d = daysLeft(deadline);
  if (d < 0) return <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#CBD5E1" }}>마감</span>;
  const color = d <= 3 ? "#EF4444" : d <= 7 ? "#F97316" : "#94A3B8";
  return (
    <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", fontWeight: 600, color }}>
      {d === 0 ? "오늘 마감" : `D-${d}`}
    </span>
  );
}

export default function AnnouncementRow({ item }: { item: AnnouncementItem }) {
  const meta = [
    item.organization,
    item.region === "전국" ? "전국" : item.region.split(",")[0]?.trim(),
    item.stage !== "전체" ? item.stage.split(",")[0]?.trim() : null,
  ].filter(Boolean).join("  ·  ");

  return (
    <div style={{
      padding: "20px 0",
      borderBottom: "1px solid #F1F5F9",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      cursor: item.applyUrl ? "pointer" : "default",
    }}
    onClick={() => item.applyUrl && window.open(item.applyUrl, "_blank", "noopener,noreferrer")}
    >
      {/* 텍스트 영역 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          color: "#0F172A",
          margin: "0 0 6px",
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {item.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "13px", color: "#94A3B8" }}>
            {meta}
          </span>
          <DeadlineText deadline={item.deadline} />
        </div>
      </div>

      {/* 화살표 */}
      {item.applyUrl && (
        <div style={{ flexShrink: 0, color: "#CBD5E1", transition: "color 0.15s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0F172A")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#CBD5E1")}
        >
          <ArrowRight size={18} />
        </div>
      )}
    </div>
  );
}
