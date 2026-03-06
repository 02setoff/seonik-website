interface ContentCardProps {
  title: string;
  category: string;
  date: string;
}

export default function ContentCard({ title, category, date }: ContentCardProps) {
  return (
    <div className="group bg-white border border-[#E2E8F0] rounded-lg overflow-hidden cursor-default hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 ease-out">
      {/* 썸네일 영역 (16:9 비율) */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 bg-white flex items-center justify-center p-6">
          <p
            className="text-[#0F172A] font-semibold text-center leading-snug line-clamp-2"
            style={{
              fontSize: "18px",
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            {title}
          </p>
        </div>
      </div>

      {/* 하단 정보 */}
      <div
        className="flex items-center justify-between border-t border-[#E2E8F0]"
        style={{ padding: "16px" }}
      >
        <span
          className="text-[#94A3B8] font-medium uppercase tracking-wide"
          style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}
        >
          {category}
        </span>
        <span
          className="text-[#94A3B8]"
          style={{
            fontSize: "12px",
            fontFamily: "'Pretendard', sans-serif",
          }}
        >
          {date}
        </span>
      </div>
    </div>
  );
}
