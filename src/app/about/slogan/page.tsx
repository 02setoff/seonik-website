import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "슬로건 | 선익 SEONIK",
  description: "Know First, Win First. — 선익의 슬로건이 담고 있는 철학.",
};

const NAV = [
  { label: "미션", href: "/about/mission" },
  { label: "비전", href: "/about/vision" },
  { label: "회사명", href: "/about/company" },
  { label: "슬로건", href: "/about/slogan" },
  { label: "연혁", href: "/about/history" },
];

export default function SloganPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px 96px" }}>
      {/* About 서브 네비 */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "48px", borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              color: item.href === "/about/slogan" ? "#0F172A" : "#94A3B8",
              fontWeight: item.href === "/about/slogan" ? 700 : 400,
              textDecoration: "none",
              borderBottom: item.href === "/about/slogan" ? "2px solid #0F172A" : "2px solid transparent",
              paddingBottom: "16px", marginBottom: "-17px",
            }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.15em", marginBottom: "12px" }}>
          OUR SLOGAN
        </p>
        <h1 style={{ fontSize: "32px", fontFamily: "'Pretendard', sans-serif", fontWeight: 800, color: "#0F172A", marginBottom: "0" }}>
          슬로건
        </h1>
      </div>

      {/* 슬로건 전시 */}
      <div style={{ padding: "48px 40px", backgroundColor: "#0F172A", marginBottom: "48px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#64748B", letterSpacing: "0.15em", marginBottom: "24px" }}>
          SLOGAN
        </p>
        <p style={{ fontSize: "36px", fontFamily: "Inter, sans-serif", fontWeight: 800, color: "white", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "16px" }}>
          Know First,<br />Win First.
        </p>
        <p style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", margin: 0 }}>
          먼저 알아야 먼저 이긴다
        </p>
      </div>

      {/* 슬로건의 의미 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          슬로건의 의미
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ border: "1px solid #E2E8F0", padding: "28px" }}>
            <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "12px" }}>KNOW FIRST</p>
            <p style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>먼저 아는 것의 힘</p>
            <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.8", margin: 0 }}>
              비즈니스에서 정보는 곧 자산입니다. 시장의 변화를 경쟁자보다 하루 먼저 알면,
              전략적 우위를 선점할 수 있습니다. 선익은 당신이 항상 가장 먼저 알 수 있도록
              24시간 인텔리전스를 제공합니다.
            </p>
          </div>

          <div style={{ border: "1px solid #E2E8F0", padding: "28px" }}>
            <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.1em", marginBottom: "12px" }}>WIN FIRST</p>
            <p style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>먼저 이기는 실행</p>
            <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.8", margin: 0 }}>
              지식은 실행으로 이어질 때 의미를 갖습니다. 선익의 인텔리전스는 단순한 정보 제공이 아닌,
              즉시 실행 가능한 인사이트를 제공합니다. 아는 것을 실행으로 옮기면, 먼저 이깁니다.
            </p>
          </div>
        </div>
      </div>

      {/* 슬로건과 회사명의 연결 */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F172A", borderBottom: "2px solid #0F172A", paddingBottom: "8px", marginBottom: "24px" }}>
          슬로건과 先益의 연결
        </h2>
        <div style={{ padding: "24px 28px", borderLeft: "3px solid #0F172A", backgroundColor: "#F8F9FA" }}>
          <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "#475569", lineHeight: "1.9", margin: 0 }}>
            &ldquo;Know First, Win First.&rdquo;는 한자 <strong style={{ color: "#0F172A" }}>先益(선익)</strong>의 정수를 영어로 담아낸 것입니다.
            <br /><br />
            <strong style={{ color: "#0F172A" }}>先(먼저)</strong>은 Know First — 정보를 선점하는 것.<br />
            <strong style={{ color: "#0F172A" }}>益(이롭다)</strong>은 Win First — 그 정보로 이익을 얻는 것.<br />
            <br />
            슬로건은 회사명의 철학을 그대로 반영합니다.
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/about/company" style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
          ← 회사명
        </Link>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
          先益 — Know First, Win First.
        </p>
        <Link href="/about/history" style={{ fontSize: "13px", color: "#0F172A", fontFamily: "'Pretendard', sans-serif", textDecoration: "none", fontWeight: 600 }}>
          연혁 →
        </Link>
      </div>
    </div>
  );
}
