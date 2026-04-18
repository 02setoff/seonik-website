"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function SyncAnnouncementsButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<{ kstartup: number; bizinfo: number; total: number } | null>(null);
  const [error, setError] = useState("");

  async function handleSync() {
    setStatus("loading");
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/admin/sync-announcements", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "오류 발생");
      setResult(json);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
      setStatus("error");
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <button
        onClick={handleSync}
        disabled={status === "loading"}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "10px 20px",
          backgroundColor: status === "loading" ? "#94A3B8" : "#1E40AF",
          color: "white", border: "none", cursor: status === "loading" ? "not-allowed" : "pointer",
          fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
          transition: "background-color 0.15s",
        }}
      >
        <RefreshCw size={14} style={{ animation: status === "loading" ? "spin 1s linear infinite" : "none" }} />
        {status === "loading" ? "동기화 중..." : "공고 동기화"}
      </button>

      {status === "done" && result && (
        <span style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#166534" }}>
          ✓ K-스타트업 {result.kstartup}건 · 기업마당 {result.bizinfo}건 저장 (DB 총 {result.total}건)
        </span>
      )}
      {status === "error" && (
        <span style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#DC2626" }}>
          ✗ {error}
        </span>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
