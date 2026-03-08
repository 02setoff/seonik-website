"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TYPE_OPTIONS = ["서비스", "약관", "업데이트", "긴급"];
type PublishMode = "instant" | "scheduled" | "draft";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
  outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
  color: "#0F172A", backgroundColor: "white", borderRadius: 0, boxSizing: "border-box",
};

export default function NewNoticePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: "서비스", title: "", content: "", important: false,
  });
  const [publishMode, setPublishMode] = useState<PublishMode>("instant");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }
    if (publishMode === "scheduled" && !scheduledAt) {
      setError("예약 발행 날짜와 시간을 설정해주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const published = publishMode !== "draft";
      const scheduledAtValue = publishMode === "scheduled"
        ? new Date(scheduledAt).toISOString()
        : null;

      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published, scheduledAt: scheduledAtValue }),
      });
      if (res.ok) {
        router.push("/admin/notices");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "저장에 실패했습니다.");
      }
    } catch {
      setError("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const minDateTime = new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16);

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/notices" style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textDecoration: "none" }}>
          ← 공지사항 목록
        </Link>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          새 공지 작성
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* 유형 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>유형</label>
          <select
            value={form.type}
            onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* 제목 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>제목</label>
          <input
            type="text"
            placeholder="공지 제목을 입력하세요"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            style={inputStyle}
          />
        </div>

        {/* 내용 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>내용</label>
          <textarea
            rows={12}
            placeholder="공지 내용을 입력하세요"
            value={form.content}
            onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* 중요 공지 */}
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>
          <input
            type="checkbox"
            checked={form.important}
            onChange={(e) => setForm(f => ({ ...f, important: e.target.checked }))}
            style={{ width: "16px", height: "16px", accentColor: "#EF4444" }}
          />
          중요 공지
        </label>

        {/* 공개 설정 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>공개 설정</label>
          <div style={{ display: "flex", gap: "0" }}>
            {([
              { key: "instant", label: "즉시 공개" },
              { key: "scheduled", label: "예약 발행" },
              { key: "draft", label: "비공개(초안)" },
            ] as { key: PublishMode; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPublishMode(key)}
                style={{
                  padding: "9px 16px",
                  border: "1px solid #E2E8F0",
                  marginLeft: key !== "instant" ? "-1px" : 0,
                  backgroundColor: publishMode === key ? "#0F172A" : "white",
                  color: publishMode === key ? "white" : "#64748B",
                  fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
                  cursor: "pointer",
                  position: "relative", zIndex: publishMode === key ? 1 : 0,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {publishMode === "scheduled" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "16px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "Inter, sans-serif" }}>발표 일시 설정</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                min={minDateTime}
                onChange={(e) => setScheduledAt(e.target.value)}
                style={{ ...inputStyle, backgroundColor: "white" }}
              />
              {scheduledAt && (
                <p style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", margin: 0 }}>
                  ⏰ {new Date(scheduledAt).toLocaleString("ko-KR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} 에 자동 공개됩니다.
                </p>
              )}
            </div>
          )}

          {publishMode === "draft" && (
            <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif", margin: 0 }}>
              비공개 상태로 저장됩니다. 목록에서 언제든지 공개로 변경할 수 있습니다.
            </p>
          )}
        </div>

        {error && <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 28px", backgroundColor: "#0F172A", color: "white",
              border: "none", cursor: saving ? "not-allowed" : "pointer",
              fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "저장 중..." : "공지 등록"}
          </button>
          <Link href="/admin/notices"
            style={{
              padding: "12px 20px", backgroundColor: "white", color: "#64748B",
              border: "1px solid #E2E8F0", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
              textDecoration: "none",
            }}>
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
