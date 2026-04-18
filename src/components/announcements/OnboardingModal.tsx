"use client";

import { useState } from "react";
import { ChevronRight, MapPin, Users, Rocket } from "lucide-react";

const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종",
  "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

const AFFILIATIONS = [
  { value: "대학(원)생", label: "대학(원)생", desc: "재학 중인 대학생·대학원생" },
  { value: "직장인", label: "직장인", desc: "현재 고용 상태인 직장인" },
  { value: "무직·프리랜서", label: "무직·프리랜서", desc: "개인 활동 중인 분" },
  { value: "법인·팀", label: "법인·팀", desc: "이미 법인 또는 팀을 구성" },
];

const STAGES = [
  { value: "예비창업자", label: "예비창업자", desc: "아직 창업 전, 준비 중" },
  { value: "초기창업자", label: "초기창업자 (1~3년)", desc: "창업 후 3년 이내" },
  { value: "성장기창업자", label: "성장기창업자 (3년+)", desc: "창업 후 3년 이상" },
];

interface Props {
  isOpen: boolean;
  onComplete: (data: { region: string; affiliation: string; startupStage: string }) => void;
  onSkip?: () => void;
}

export default function OnboardingModal({ isOpen, onComplete, onSkip }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [region, setRegion] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [startupStage, setStartupStage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleComplete() {
    if (!region || !affiliation || !startupStage) return;
    setLoading(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, affiliation, startupStage }),
      });
      onComplete({ region, affiliation, startupStage });
    } finally {
      setLoading(false);
    }
  }

  const canNext =
    (step === 1 && region !== "") ||
    (step === 2 && affiliation !== "") ||
    (step === 3 && startupStage !== "");

  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px",
  };

  const modal: React.CSSProperties = {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    width: "100%", maxWidth: "480px",
    padding: "40px 36px",
    position: "relative",
  };

  const stepIcons = [
    <MapPin key="map" size={18} />,
    <Users key="users" size={18} />,
    <Rocket key="rocket" size={18} />,
  ];

  const stepLabels = ["지역", "소속", "창업단계"];

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* 진행 표시 */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1, height: "3px",
                backgroundColor: s <= step ? "#1E40AF" : "var(--border)",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ color: "#1E40AF" }}>{stepIcons[step - 1]}</span>
          <span style={{
            fontSize: "11px", fontFamily: "Inter, sans-serif",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--text-placeholder)",
          }}>
            {step} / 3 — {stepLabels[step - 1]}
          </span>
        </div>

        {step === 1 && (
          <>
            <h2 style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, marginBottom: "6px", color: "var(--text-primary)" }}>
              어느 지역에 계신가요?
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px", fontFamily: "'Pretendard', sans-serif" }}>
              지역 맞춤 공고를 우선 보여드립니다
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "8px" }}>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  style={{
                    padding: "10px 8px", fontSize: "14px",
                    fontFamily: "'Pretendard', sans-serif",
                    border: `1.5px solid ${region === r ? "#1E40AF" : "var(--border)"}`,
                    backgroundColor: region === r ? "#EFF6FF" : "transparent",
                    color: region === r ? "#1E40AF" : "var(--text-primary)",
                    cursor: "pointer", transition: "all 0.15s",
                    fontWeight: region === r ? 600 : 400,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, marginBottom: "6px", color: "var(--text-primary)" }}>
              현재 소속이 어떻게 되시나요?
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px", fontFamily: "'Pretendard', sans-serif" }}>
              소속에 따라 신청 가능한 공고가 달라집니다
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {AFFILIATIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAffiliation(a.value)}
                  style={{
                    padding: "14px 16px", textAlign: "left",
                    border: `1.5px solid ${affiliation === a.value ? "#1E40AF" : "var(--border)"}`,
                    backgroundColor: affiliation === a.value ? "#EFF6FF" : "transparent",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "15px", fontWeight: 600, fontFamily: "'Pretendard', sans-serif", color: affiliation === a.value ? "#1E40AF" : "var(--text-primary)" }}>
                    {a.label}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px", fontFamily: "'Pretendard', sans-serif" }}>
                    {a.desc}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, marginBottom: "6px", color: "var(--text-primary)" }}>
              창업 단계가 어디쯤인가요?
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px", fontFamily: "'Pretendard', sans-serif" }}>
              단계별 최적 지원사업을 맞춰드립니다
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {STAGES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStartupStage(s.value)}
                  style={{
                    padding: "14px 16px", textAlign: "left",
                    border: `1.5px solid ${startupStage === s.value ? "#1E40AF" : "var(--border)"}`,
                    backgroundColor: startupStage === s.value ? "#EFF6FF" : "transparent",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "15px", fontWeight: 600, fontFamily: "'Pretendard', sans-serif", color: startupStage === s.value ? "#1E40AF" : "var(--text-primary)" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px", fontFamily: "'Pretendard', sans-serif" }}>
                    {s.desc}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "32px" }}>
          {onSkip && (
            <button
              onClick={onSkip}
              style={{
                fontSize: "13px", color: "var(--text-placeholder)",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Pretendard', sans-serif",
              }}
            >
              나중에 하기
            </button>
          )}
          <div style={{ marginLeft: "auto" }}>
            {step < 3 ? (
              <button
                onClick={() => canNext && setStep((s) => (s + 1) as 1 | 2 | 3)}
                disabled={!canNext}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "12px 24px", fontSize: "15px", fontWeight: 600,
                  fontFamily: "'Pretendard', sans-serif",
                  backgroundColor: canNext ? "#1E40AF" : "var(--border)",
                  color: canNext ? "white" : "var(--text-placeholder)",
                  border: "none", cursor: canNext ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                }}
              >
                다음 <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canNext || loading}
                style={{
                  padding: "12px 28px", fontSize: "15px", fontWeight: 600,
                  fontFamily: "'Pretendard', sans-serif",
                  backgroundColor: canNext && !loading ? "#1E40AF" : "var(--border)",
                  color: canNext && !loading ? "white" : "var(--text-placeholder)",
                  border: "none", cursor: canNext && !loading ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                }}
              >
                {loading ? "저장 중..." : "맞춤 공고 보기"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
