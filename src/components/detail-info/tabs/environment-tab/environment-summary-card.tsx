type Summary = {
  visibility: string;
  current: string;
  surge: string;
  wave: string;
};

type Props = {
  summary: Summary;
};

const ITEMS: { key: keyof Summary; label: string }[] = [
  { key: "visibility", label: "시야" },
  { key: "current", label: "조류" },
  { key: "surge", label: "서지" },
  { key: "wave", label: "파도" },
];

const GRADE_META: Record<string, { bg: string; text: string; index: number }> =
  {
    좋음: { bg: "bg-emerald-500/20", text: "text-emerald-400", index: 0 },
    양호: { bg: "bg-emerald-500/20", text: "text-emerald-400", index: 0 },
    보통: { bg: "bg-amber-500/20", text: "text-amber-400", index: 1 },
    나쁨: { bg: "bg-red-500/20", text: "text-red-400", index: 2 },
    미흡: { bg: "bg-red-500/20", text: "text-red-400", index: 2 },
  };

const GRADES = ["좋음", "보통", "나쁨"] as const;

const fallback = { bg: "bg-white/10", text: "text-white/60", index: -1 };

export default function EnvironmentSummaryCard({ summary }: Props) {
  const hasData = Object.values(summary).some((v) => v);

  return (
    <>
      {ITEMS.map(({ key, label }) => {
        const value = summary[key];
        const meta = GRADE_META[value] ?? fallback;

        return (
          <div
            key={key}
            className="rounded-xl bg-white/5 p-4 h-full flex flex-col"
          >
            <h3 className="text-[11px] text-white/50">{label}</h3>
            <p className="text-[10px] text-white/30 mb-3">최근 3개월 기준</p>

            {hasData && value ? (
              <div className="flex-1 flex flex-col justify-center gap-3">
                <div className="flex items-center justify-center">
                  <span
                    className={`text-[13px] font-semibold px-3 py-1 rounded-full ${meta.bg} ${meta.text}`}
                  >
                    {value}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {GRADES.map((grade, i) => {
                    const isActive = meta.index === i;
                    return (
                      <div key={grade} className="flex-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            isActive ? "bg-white/80" : "bg-white/10"
                          }`}
                          style={{
                            background: isActive
                              ? "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))"
                              : undefined,
                          }}
                        />
                        <div
                          className={`mt-1 text-center text-[9px] ${
                            isActive ? "text-white/80" : "text-white/30"
                          }`}
                        >
                          {grade}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[11px] text-white/40">
                데이터 부족
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
