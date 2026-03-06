"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { Image } from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";

const FONTS = [
  { label: "Pretendard (기본)", value: "Pretendard, sans-serif" },
  { label: "Noto Sans KR", value: "'Noto Sans KR', sans-serif" },
  { label: "Noto Serif KR", value: "'Noto Serif KR', serif" },
  { label: "Inter", value: "Inter, sans-serif" },
];

const SIZES = ["13px", "14px", "15px", "16px", "18px", "20px", "24px", "28px", "32px"];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: [
          "min-height:400px",
          "padding:20px",
          "outline:none",
          "font-family:'Pretendard',sans-serif",
          "font-size:15px",
          "line-height:1.85",
          "color:#0F172A",
        ].join(";"),
      },
    },
  });

  // Sync external value on initial load (edit page)
  useEffect(() => {
    if (editor && value && editor.isEmpty) {
      editor.commands.setContent(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || "이미지 업로드에 실패했습니다.");
      }
    } catch {
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const btn = (active: boolean): React.CSSProperties => ({
    padding: "4px 8px",
    background: active ? "#0F172A" : "transparent",
    color: active ? "white" : "#374151",
    border: "1px solid " + (active ? "#0F172A" : "#E2E8F0"),
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    borderRadius: 0,
    lineHeight: 1,
    minWidth: "28px",
  });

  const selectStyle: React.CSSProperties = {
    padding: "4px 8px",
    border: "1px solid #E2E8F0",
    background: "white",
    color: "#374151",
    fontSize: "12px",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    borderRadius: 0,
    outline: "none",
  };

  const currentFont = editor.getAttributes("textStyle").fontFamily ?? "";
  const currentSize = editor.getAttributes("textStyle").fontSize ?? "";

  return (
    <div style={{ border: "1px solid #E2E8F0", backgroundColor: "white" }}>
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
        }}
      />

      {/* 툴바 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center",
          padding: "10px 12px",
          borderBottom: "1px solid #E2E8F0",
          backgroundColor: "#F8F9FA",
        }}
      >
        {/* 글꼴 선택 */}
        <select
          value={currentFont}
          onChange={(e) =>
            e.target.value
              ? editor.chain().focus().setFontFamily(e.target.value).run()
              : editor.chain().focus().unsetFontFamily().run()
          }
          style={{ ...selectStyle, minWidth: "140px" }}
          title="글꼴"
        >
          <option value="">글꼴</option>
          {FONTS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>

        {/* 글자 크기 */}
        <select
          value={currentSize}
          onChange={(e) =>
            e.target.value
              ? editor.chain().focus().setFontSize(e.target.value).run()
              : editor.chain().focus().unsetFontSize().run()
          }
          style={{ ...selectStyle, minWidth: "72px" }}
          title="크기"
        >
          <option value="">크기</option>
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div style={{ width: "1px", height: "20px", backgroundColor: "#E2E8F0" }} />

        {/* 볼드 */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          style={btn(editor.isActive("bold"))} title="굵게">B</button>

        {/* 이탤릭 */}
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          style={{ ...btn(editor.isActive("italic")), fontStyle: "italic" }} title="기울임">I</button>

        {/* 밑줄 */}
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
          style={{ ...btn(editor.isActive("underline")), textDecoration: "underline" }} title="밑줄">U</button>

        {/* 취소선 */}
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}
          style={{ ...btn(editor.isActive("strike")), textDecoration: "line-through" }} title="취소선">S</button>

        <div style={{ width: "1px", height: "20px", backgroundColor: "#E2E8F0" }} />

        {/* 정렬 */}
        {(["left", "center", "right"] as const).map((align) => {
          const icons: Record<string, string> = { left: "≡←", center: "≡", right: "≡→" };
          const labels: Record<string, string> = { left: "왼쪽 정렬", center: "가운데 정렬", right: "오른쪽 정렬" };
          return (
            <button key={align} type="button"
              onClick={() => editor.chain().focus().setTextAlign(align).run()}
              style={btn(editor.isActive({ textAlign: align }))} title={labels[align]}>
              {icons[align]}
            </button>
          );
        })}

        <div style={{ width: "1px", height: "20px", backgroundColor: "#E2E8F0" }} />

        {/* 제목 */}
        {([2, 3] as const).map((level) => (
          <button key={level} type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            style={btn(editor.isActive("heading", { level }))} title={`제목 H${level}`}>
            H{level}
          </button>
        ))}

        {/* 목록 */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={btn(editor.isActive("bulletList"))} title="글머리 목록">•—</button>

        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={btn(editor.isActive("orderedList"))} title="번호 목록">1—</button>

        <div style={{ width: "1px", height: "20px", backgroundColor: "#E2E8F0" }} />

        {/* 이미지 업로드 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            ...btn(false),
            opacity: uploading ? 0.6 : 1,
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 10px",
          }}
          title="이미지 삽입"
        >
          {uploading ? "업로드 중..." : "🖼 이미지"}
        </button>
      </div>

      {/* 에디터 본문 */}
      <EditorContent editor={editor} />

      {/* Tiptap 기본 스타일 */}
      <style>{`
        .ProseMirror h2 { font-size: 22px; font-weight: 700; margin: 16px 0 8px; }
        .ProseMirror h3 { font-size: 18px; font-weight: 600; margin: 14px 0 6px; }
        .ProseMirror p { margin: 0 0 8px; }
        .ProseMirror ul { padding-left: 20px; list-style: disc; margin: 8px 0; }
        .ProseMirror ol { padding-left: 20px; list-style: decimal; margin: 8px 0; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror u { text-decoration: underline; }
        .ProseMirror s { text-decoration: line-through; }
        .ProseMirror img { max-width: 100%; height: auto; display: block; margin: 12px 0; border-radius: 2px; }
        .ProseMirror img.ProseMirror-selectednode { outline: 2px solid #0F172A; }
      `}</style>
    </div>
  );
}
