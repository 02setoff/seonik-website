"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TYPE_OPTIONS = ["서비스", "약관", "업데이트", "긴급"];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
  outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
  color: "#0F172A", backgroundColor: "white", borderRadius: 0, boxSizing: "border-box",
};

interface NoticeData {
  id: string;
  type: string;
  title: string;
  content: string;
  important: boolean;
  published: boolean;
}

export default function EditNoticeForm({ notice }: { notice: NoticeData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    type: notice.type,
    title: notice.title,
    content: notice.content,
    important: notice.important,
    published: notice.published,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/notices/${notice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/admin/notices" style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textDecoration: "none" }}>
          ← 공지사항 목록
        </Link>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          공지 수정
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>제목</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", fontWeight: 600 }}>내용</label>
          <textarea
            rows={12}
            value={form.content}
            onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>
            <input
              type="checkbox"
              checked={form.important}
              onChange={(e) => setForm(f => ({ ...f, important: e.target.checked }))}
              style={{ width: "16px", height: "16px", accentColor: "#EF4444" }}
            />
            중요 공지
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))}
              style={{ width: "16px", height: "16px", accentColor: "#0F172A" }}
            />
            공개
          </label>
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
            {saving ? "저장 중..." : "수정 완료"}
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
