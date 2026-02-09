export type MethodKey =
  | "SEEDLING_STRING"
  | "ROPE"
  | "ROCK_FIXATION"
  | "TRANSPLANT_MODULE"
  | "DIRECT_FIXATION";

type MethodMeta = {
  name: string;
  description: string;
  unit: string;
  color: string;
};

export const METHOD_META: Record<MethodKey, MethodMeta> = {
  SEEDLING_STRING: {
    name: "종묘줄",
    description: "종묘줄(줄)",
    unit: "줄",
    color: "#38bdf8",
  },
  ROPE: {
    name: "로프",
    description: "로프(m): 종묘줄을 로프에 고정하여 이식",
    unit: "m",
    color: "#10b981",
  },
  ROCK_FIXATION: {
    name: "암반 고정",
    description: "종묘를 암반에 직접 부착하여 이식",
    unit: "지점",
    color: "#f59e0b",
  },
  TRANSPLANT_MODULE: {
    name: "이식 모듈",
    description: "이식 모듈(기): 제작된 모듈에 부착 후 수중에 고정",
    unit: "기",
    color: "#a78bfa",
  },
  DIRECT_FIXATION: {
    name: "직접 고정 지점",
    description: "직접 고정 지점(지점)",
    unit: "지점",
    color: "#f472b6",
  },
};

// 한글 이름 → 메타 역참조 맵
const NAME_TO_META = Object.fromEntries(
  Object.values(METHOD_META).map((m) => [m.name, m])
) as Record<string, MethodMeta>;

export const getMethodMeta = (key: string): MethodMeta =>
  (METHOD_META as Record<string, MethodMeta>)[key] ??
  NAME_TO_META[key] ?? {
    name: key,
    description: key,
    unit: "",
    color: "#94a3b8",
  };
