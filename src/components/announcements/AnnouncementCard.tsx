"use client";

import { ExternalLink, Calendar, Building2 } from "lucide-react";

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

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const SOURCE_COLORS: Record<string, string> = {
  "K-스타트업": "#0369A1",
  "기업마당": "#047857",
  "보조금24": "#7C3AED",
  "수동": "#374151",
};

export default function AnnouncementCard({ item }: { item: AnnouncementItem }) {
  const days = item.deadline ? daysLeft(item.deadline) : null;
  const urgent = days !== null && days <= 7;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        padding: "20px 20px 16px",
        display: "flex", flexDirection: "column", gap: "12px",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* 소스 뱃지 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: "11px", fontFamily: "Inter, sans-serif",
          fontWeight: 600, letterSpacing: "0.06em",
          color: SOURCE_COLORS[item.source] ?? "#374151",
          textTransform: "uppercase",
        }}>
          {item.source}
        </span>
        {days !== null && (
          <span style={{
            fontSize: "11px", fontFamily: "Inter, sans-serif",
            fontWeight: 700, padding: "2px 8px",
            backgroundColor: urgent ? "#FEF2F2" : "var(--bg-surface, #F8FAFC)",
            color: urgent ? "#DC2626" : "var(--text-muted)",
            border: `1px solid ${urgent ? "#FECACA" : "var(--border)"}`,
          }}>
            {days <= 0 ? "마감" : urgent ? `D-${days}` : `${days}일 남음`}
          </span>
        )}
      </div>

      {/* 제목 */}
      <h3 style={{
        fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
        fontWeight: 600, lineHeight: 1.5,
        color: "var(--text-primary)",
        margin: 0, flex: 1,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {item.title}
      </h3>

      {/* 설명 */}
      {item.description && (
        <p style={{
          fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-muted)", margin: 0, lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {item.description}
        </p>
      )}

      {/* 태그 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {item.region !== "전국" && item.region.split(",").map((r) => (
          <Tag key={r} label={r.trim()} />
        ))}
        {item.region === "전국" && <Tag label="전국" color="#0369A1" />}
        {item.stage !== "전체" && item.stage.split(",").map((s) => (
          <Tag key={s} label={s.trim()} color="#7C3AED" />
        ))}
      </div>

      {/* 하단: 기관 + 마감일 + 신청 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: "1px solid var(--border)", paddingTop: "12px", gap: "8px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
          {item.organization && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Building2 size={11} color="var(--text-placeholder)" />
              <span style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.organization}
              </span>
            </div>
          )}
          {item.deadline && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={11} color="var(--text-placeholder)" />
              <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>
                {formatDate(item.deadline)}
              </span>
            </div>
          )}
        </div>

        {item.applyUrl && (
          <a
            href={item.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "8px 14px", fontSize: "13px", fontWeight: 600,
              fontFamily: "'Pretendard', sans-serif",
              backgroundColor: "#1E40AF", color: "white",
              textDecoration: "none", flexShrink: 0,
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1E3A8A")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1E40AF")}
          >
            신청하기 <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

function Tag({ label, color }: { label: string; color?: string }) {
  return (
    <span style={{
      fontSize: "11px", fontFamily: "'Pretendard', sans-serif",
      padding: "2px 8px",
      backgroundColor: "var(--bg-surface, #F8FAFC)",
      color: color ?? "var(--text-muted)",
      border: "1px solid var(--border)",
    }}>
      {label}
    </span>
  );
}
