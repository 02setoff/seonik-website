// 애니메이션 타이밍 (밀리초)
export const TIMING = {
  logoFadeDelay: 150,
  logoFadeDuration: 500,
  logoHold: 400,
  phase2Start: 1100,
  logoMoveDuration: 400,
  dividerDelay: 0,
  dividerDuration: 300,
  sloganDelay: 100,
  sloganDuration: 400,
  phase3Start: 2200,
  ctaDuration: 350,
};

export type SectionId = "RADAR" | "CORE" | "FLASH";

export const SECTIONS: Array<{
  id: SectionId;
  title: string;
  subtitle: string;
}> = [
  { id: "RADAR", title: "RADAR", subtitle: "최신 트렌드 브리핑" },
  { id: "CORE", title: "CORE", subtitle: "비즈니스 모델 해부" },
  { id: "FLASH", title: "FLASH", subtitle: "긴급 인사이트" },
];
