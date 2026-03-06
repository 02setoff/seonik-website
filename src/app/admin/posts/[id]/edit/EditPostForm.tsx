"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Post {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  published: boolean;
}

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post.title,
    summary: post.summary ?? "",
    content: post.content ?? "",
    category: post.category,
    published: post.published,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (publish: boolean) => {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published: publish }),
    });
    setSaving(false);
    if (res.ok) { router.push("/admin"); router.refresh(); }
    else { const d = await res.json(); setError(d.error || "저장 실패"); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0",
    outline: "none", fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
    color: "#0F172A", backgroundColor: "white", borderRadius: 0, boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <Link href="/admin" style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textDecoration: "none" }}>
          ← 대시보드
        </Link>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          글 수정
        </h1>
        <span style={{
          fontSize: "11px", padding: "2px 8px",
          backgroundColor: form.published ? "#DCFCE7" : "#F1F5F9",
          color: form.published ? "#166534" : "#64748B",
          fontFamily: "'Pretendard', sans-serif",
        }}>
          {form.published ? "게시됨" : "초안"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px" }}>
          <input name="title" value={form.title} onChange={handleInput}
            style={{ ...inputStyle, fontSize: "18px", fontWeight: 600 }} />
          <select name="category" value={form.category} onChange={handleInput}
            style={{ ...inputStyle, width: "120px" }}>
            <option value="RADAR">RADAR</option>
            <option value="CORE">CORE</option>
            <option value="FLASH">FLASH</option>
          </select>
        </div>

        <input name="summary" placeholder="요약 (선택)" value={form.summary} onChange={handleInput} style={inputStyle} />

        <RichTextEditor
          value={form.content}
          onChange={(html) => setForm(f => ({ ...f, content: html }))}
        />

        {error && <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif" }}>{error}</p>}

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={() => save(false)} disabled={saving}
            style={{
              padding: "10px 24px", backgroundColor: "white", color: "#0F172A",
              border: "1px solid #E2E8F0", cursor: saving ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
            }}>
            {form.published ? "초안으로 전환" : "초안 저장"}
          </button>
          <button onClick={() => save(true)} disabled={saving}
            style={{
              padding: "10px 24px", backgroundColor: "#0F172A", color: "white",
              border: "none", cursor: saving ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
            }}>
            {saving ? "저장 중..." : "게시하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
