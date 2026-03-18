export const STAGE_ORDER = ["관측", "정착", "성장", "관리"] as const;

export type StageName = (typeof STAGE_ORDER)[number];

export const STAGE_META: Record<
  StageName,
  { color: string; slug: string; description: string }
> = {
  관측: {
    color: "#f59e0b",
    slug: "observation",
    description: "초기 상태 기록",
  },
  정착: {
    color: "#a78bfa",
    slug: "settlement",
    description: "이식 단위 활착 확인",
  },
  성장: {
    color: "#38bdf8",
    slug: "growth",
    description: "해조류 군집 확대 관찰",
  },
  관리: {
    color: "#10b981",
    slug: "management",
    description: "지속 관찰 및 유지",
  },
};

const DEFAULT_STAGE_COLOR = "rgba(255,255,255,.6)";

const isStageName = (value: string): value is StageName => value in STAGE_META;

export const getStageColor = (stage: string) => {
  if (!isStageName(stage)) return DEFAULT_STAGE_COLOR;
  return STAGE_META[stage].color;
};
