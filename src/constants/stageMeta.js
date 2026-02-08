export const STAGE_ORDER = ["관측", "정착", "성장", "관리"];

export const STAGE_META = {
  관측: { color: "#10b981", slug: "observation" },
  정착: { color: "#38bdf8", slug: "settlement" },
  성장: { color: "#f59e0b", slug: "growth" },
  관리: { color: "#a78bfa", slug: "management" },
};

export const getStageColor = (stage) =>
  STAGE_META[stage]?.color ?? "rgba(255,255,255,.6)";
