import { prisma } from "@/lib/prisma";

export const metadata = { title: "통계 — 선익 SEONIK" };

function StatCard({ label, value, sub, highlight }: { label: string; value: string | number; sub?: string; highlight?: boolean }) {
  return (
    <div style={{
      backgroundColor: highlight ? "#0F172A" : "white",
      border: `1px solid ${highlight ? "#0F172A" : "#E2E8F0"}`,
      padding: "24px 28px",
    }}>
      <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "28px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: highlight ? "white" : "#0F172A" }}>{value}</p>
      {sub && <p style={{ fontSize: "11px", fontFamily: "'Pretendard', sans-serif", color: highlight ? "#64748B" : "#94A3B8", marginTop: "4px" }}>{sub}</p>}
    </div>
  );
}

function Bar({ label, value, max, pct }: { label: string; value: number; max: number; pct?: number }) {
  const barPct = max > 0 ? Math.round((value / max) * 100) : 0;
  const displayPct = pct !== undefined ? pct : barPct;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#475569" }}>{label}</span>
        <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#64748B" }}>
          {value} <span style={{ color: "#CBD5E1" }}>({displayPct}%)</span>
        </span>
      </div>
      <div style={{ height: "7px", backgroundColor: "#F1F5F9", borderRadius: "2px" }}>
        <div style={{ height: "100%", width: `${barPct}%`, backgroundColor: "#0F172A", borderRadius: "2px" }} />
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color = "#0F172A" }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", width: "36px", textAlign: "right", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: "18px", backgroundColor: "#F8F9FA", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, backgroundColor: color, opacity: 0.85 }} />
        <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", fontFamily: "Inter, sans-serif", color: pct > 30 ? "white" : "#64748B", fontWeight: 700, zIndex: 1 }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
      {children}
    </p>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px", ...style }}>
      {children}
    </div>
  );
}

export default async function StatsPage() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const d7 = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const d14 = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
  const d30 = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const d60 = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
  const d90 = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersWeek,
    newUsersLastWeek,
    newUsersMonth,
    newUsersLastMonth,
    newUsersQuarter,
    totalPosts,
    totalLikes,
    newsletterUsers,
    recentSignups,
    recentViews,
    recentLikes,
    topPostsByViews,
    topPostsByLikes,
    occupationStats,
    howFoundStats,
    joinReasonStats,
    recentUsers,
    categoryStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: d7 } } }),
    prisma.user.count({ where: { createdAt: { gte: d14, lt: d7 } } }),
    prisma.user.count({ where: { createdAt: { gte: d30 } } }),
    prisma.user.count({ where: { createdAt: { gte: d60, lt: d30 } } }),
    prisma.user.count({ where: { createdAt: { gte: d90 } } }),
    prisma.post.count({ where: { published: true } }),
    prisma.like.count(),
    prisma.user.count({ where: { newsletterConsent: true } }),
    prisma.user.findMany({
      where: { createdAt: { gte: d7 } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.postView.findMany({
      where: { viewedAt: { gte: d7 } },
      select: { viewedAt: true },
      orderBy: { viewedAt: "asc" },
    }),
    prisma.like.findMany({
      where: { createdAt: { gte: d7 } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { viewCount: "desc" },
      take: 8,
      select: { id: true, title: true, category: true, viewCount: true, _count: { select: { likes: true } } },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { likes: { _count: "desc" } },
      take: 8,
      select: { id: true, title: true, category: true, viewCount: true, _count: { select: { likes: true } } },
    }),
    prisma.user.groupBy({ by: ["occupation"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.user.groupBy({ by: ["howFound"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.user.groupBy({ by: ["joinReason"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { name: true, email: true, occupation: true, joinReason: true, newsletterConsent: true, createdAt: true },
    }),
    prisma.post.groupBy({
      by: ["category"],
      where: { published: true },
      _count: { id: true },
      _sum: { viewCount: true },
    }),
  ]);

  // 날짜별 집계 (최근 7일)
  const days7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  });

  const groupByDay = (items: { createdAt?: Date; viewedAt?: Date }[]) => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      const raw = item.createdAt ?? item.viewedAt;
      if (!raw) return;
      const key = new Date(raw).toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  };

  const signupsByDay = groupByDay(recentSignups);
  const viewsByDay = groupByDay(recentViews.map((v) => ({ createdAt: v.viewedAt })));
  const likesByDay = groupByDay(recentLikes);

  const maxSignup = Math.max(...days7.map((d) => signupsByDay[d] || 0), 1);
  const maxViews7 = Math.max(...days7.map((d) => viewsByDay[d] || 0), 1);
  const maxLikes7 = Math.max(...days7.map((d) => likesByDay[d] || 0), 1);

  const totalViews = topPostsByViews.reduce((sum, p) => sum + p.viewCount, 0);
  const maxViewsTop = topPostsByViews[0]?.viewCount || 1;
  const maxLikesTop = Math.max(...topPostsByLikes.map((p) => p._count.likes), 1);

  const newsletterPct = totalUsers > 0 ? Math.round((newsletterUsers / totalUsers) * 100) : 0;
  const weekDiff = newUsersWeek - newUsersLastWeek;
  const monthDiff = newUsersMonth - newUsersLastMonth;

  const dayLabel = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
        사이트 통계
      </h1>
      <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8", marginBottom: "40px" }}>
        기준일: {now.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
      </p>

      {/* 핵심 지표 */}
      <SectionTitle>핵심 지표</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "12px", marginBottom: "40px" }}>
        <StatCard label="전체 회원" value={totalUsers.toLocaleString()} highlight />
        <StatCard label="이번 주 신규"
          value={newUsersWeek}
          sub={weekDiff >= 0 ? `▲ 전주 대비 +${weekDiff}` : `▼ 전주 대비 ${weekDiff}`} />
        <StatCard label="이번 달 신규"
          value={newUsersMonth}
          sub={monthDiff >= 0 ? `▲ 전월 대비 +${monthDiff}` : `▼ 전월 대비 ${monthDiff}`} />
        <StatCard label="최근 90일 신규" value={newUsersQuarter} />
        <StatCard label="게시된 글" value={totalPosts} />
        <StatCard label="전체 조회수" value={totalViews.toLocaleString()} />
        <StatCard label="전체 저장수" value={totalLikes.toLocaleString()} />
        <StatCard label="뉴스레터 동의" value={`${newsletterUsers} (${newsletterPct}%)`} />
      </div>

      {/* 최근 7일 추세 */}
      <SectionTitle>최근 7일 추세</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "40px" }}>
        <Card>
          <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>
            신규 가입 <span style={{ color: "#94A3B8", fontWeight: 400 }}>({newUsersWeek}명)</span>
          </p>
          {days7.map((d) => (
            <MiniBar key={d} label={dayLabel(d)} value={signupsByDay[d] || 0} max={maxSignup} color="#0F172A" />
          ))}
        </Card>
        <Card>
          <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>
            회원 조회 <span style={{ color: "#94A3B8", fontWeight: 400 }}>(7일)</span>
          </p>
          {days7.map((d) => (
            <MiniBar key={d} label={dayLabel(d)} value={viewsByDay[d] || 0} max={maxViews7} color="#334155" />
          ))}
        </Card>
        <Card>
          <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>
            저장(체크) <span style={{ color: "#94A3B8", fontWeight: 400 }}>(7일)</span>
          </p>
          {days7.map((d) => (
            <MiniBar key={d} label={dayLabel(d)} value={likesByDay[d] || 0} max={maxLikes7} color="#64748B" />
          ))}
        </Card>
      </div>

      {/* 기간별 가입 비교 */}
      <SectionTitle>기간별 가입 비교</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {([
          { label: "이번 주", value: newUsersWeek, diff: weekDiff, prevLabel: "전주" },
          { label: "이번 달", value: newUsersMonth, diff: monthDiff, prevLabel: "전월" },
          { label: "최근 90일", value: newUsersQuarter, diff: null, prevLabel: "" },
        ] as const).map(({ label, value, diff, prevLabel }) => (
          <Card key={label}>
            <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "8px" }}>{label} 신규 가입</p>
            <p style={{ fontSize: "32px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A" }}>{value}</p>
            {diff !== null && (
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: diff >= 0 ? "#16A34A" : "#DC2626", marginTop: "6px" }}>
                {diff >= 0 ? `▲ ${prevLabel} 대비 +${diff}` : `▼ ${prevLabel} 대비 ${diff}`}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* 카테고리별 현황 */}
      <SectionTitle>카테고리별 현황</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {categoryStats.map((cat) => (
          <Card key={cat.category}>
            <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.12em", marginBottom: "14px" }}>
              {cat.category}
            </p>
            <div style={{ display: "flex", gap: "24px" }}>
              <div>
                <p style={{ fontSize: "24px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A" }}>{cat._count.id}</p>
                <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif" }}>발행 글</p>
              </div>
              <div>
                <p style={{ fontSize: "24px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#334155" }}>
                  {(cat._sum.viewCount || 0).toLocaleString()}
                </p>
                <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif" }}>조회수</p>
              </div>
            </div>
          </Card>
        ))}
        {categoryStats.length === 0 && (
          <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>발행된 글이 없습니다.</p>
        )}
      </div>

      {/* 인기 브리핑 */}
      <SectionTitle>인기 브리핑</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
        <Card>
          <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "20px" }}>
            조회수 TOP
          </p>
          {topPostsByViews.map((p) => (
            <Bar key={p.id}
              label={p.title.length > 22 ? p.title.slice(0, 22) + "…" : p.title}
              value={p.viewCount} max={maxViewsTop}
              pct={totalViews > 0 ? Math.round((p.viewCount / totalViews) * 100) : 0}
            />
          ))}
          {topPostsByViews.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>데이터 없음</p>}
        </Card>
        <Card>
          <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "20px" }}>
            저장수 TOP
          </p>
          {topPostsByLikes.map((p) => (
            <Bar key={p.id}
              label={p.title.length > 22 ? p.title.slice(0, 22) + "…" : p.title}
              value={p._count.likes} max={maxLikesTop}
              pct={totalLikes > 0 ? Math.round((p._count.likes / totalLikes) * 100) : 0}
            />
          ))}
          {topPostsByLikes.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>데이터 없음</p>}
        </Card>
      </div>

      {/* 회원 분석 */}
      <SectionTitle>회원 분석</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "40px" }}>
        {[
          { title: "직업 분포", data: occupationStats.map((x) => ({ label: x.occupation || "미입력", value: x._count.id })) },
          { title: "유입 경로", data: howFoundStats.map((x) => ({ label: x.howFound || "미입력", value: x._count.id })) },
          { title: "가입 이유", data: joinReasonStats.map((x) => ({ label: x.joinReason || "미입력", value: x._count.id })) },
        ].map(({ title, data }) => {
          const total = data.reduce((s, d) => s + d.value, 0);
          return (
            <Card key={title}>
              <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "20px" }}>
                {title} <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: "11px" }}>({total}명)</span>
              </p>
              {data.map(({ label, value }) => (
                <Bar key={label} label={label} value={value} max={data[0]?.value || 1}
                  pct={total > 0 ? Math.round((value / total) * 100) : 0}
                />
              ))}
              {data.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>데이터 없음</p>}
            </Card>
          );
        })}
      </div>

      {/* 뉴스레터 */}
      <SectionTitle>뉴스레터 동의 현황</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
        <Card>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "8px" }}>동의 회원</p>
          <p style={{ fontSize: "32px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A" }}>{newsletterUsers}</p>
          <div style={{ marginTop: "14px", height: "8px", backgroundColor: "#F1F5F9", borderRadius: "4px" }}>
            <div style={{ height: "100%", width: `${newsletterPct}%`, backgroundColor: "#0F172A", borderRadius: "4px" }} />
          </div>
          <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#64748B", marginTop: "6px" }}>
            전체 회원의 {newsletterPct}%
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "8px" }}>미동의 회원</p>
          <p style={{ fontSize: "32px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#475569" }}>{totalUsers - newsletterUsers}</p>
          <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8", marginTop: "8px" }}>
            전체 회원의 {100 - newsletterPct}%
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "8px" }}>이메일 발송 가능</p>
          <p style={{ fontSize: "32px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A" }}>{newsletterPct}%</p>
          <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8", marginTop: "8px" }}>동의율</p>
        </Card>
      </div>

      {/* 최근 가입 회원 */}
      <SectionTitle>최근 가입 회원</SectionTitle>
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "680px" }}>
            <thead>
              <tr>
                {["이름", "이메일", "직업", "가입 이유", "뉴스레터", "가입일"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "8px 12px",
                    fontSize: "11px", fontFamily: "Inter, sans-serif",
                    color: "#94A3B8", letterSpacing: "0.05em",
                    borderBottom: "1px solid #F1F5F9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={i} style={{ borderBottom: i < recentUsers.length - 1 ? "1px solid #F8F9FA" : "none" }}>
                  <td style={{ padding: "10px 12px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>{u.name || "—"}</td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#64748B" }}>{u.email}</td>
                  <td style={{ padding: "10px 12px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>{u.occupation || "—"}</td>
                  <td style={{ padding: "10px 12px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>
                    {u.joinReason ? (u.joinReason.length > 12 ? u.joinReason.slice(0, 12) + "…" : u.joinReason) : "—"}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", fontFamily: "Inter, sans-serif", color: u.newsletterConsent ? "#16A34A" : "#CBD5E1" }}>
                    {u.newsletterConsent ? "동의" : "미동의"}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8", whiteSpace: "nowrap" }}>
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentUsers.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>가입 회원이 없습니다.</p>}
      </Card>
    </div>
  );
}
