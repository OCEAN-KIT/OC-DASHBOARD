type Props = {
  status: string;
};

type StatusMeta = {
  color: string;
  label: string;
  index: number;
};

const STATUS_MAP: Record<string, StatusMeta> = {
  안정: {
    color: "text-emerald-400",
    label: "안정",
    index: 0,
  },
  "일부 감소": {
    color: "text-amber-400",
    label: "일부 감소",
    index: 1,
  },
  불안정: {
    color: "text-red-400",
    label: "불안정",
    index: 2,
  },
};

const fallback: StatusMeta = {
  color: "text-white/50",
  label: "-",
  index: 1,
};

export default function SurvivalStatusCard({ status }: Props) {
  const meta = STATUS_MAP[status] ?? fallback;

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <h3 className="text-[11px] text-white/50 mb-1">생존 상태</h3>
      <p className="text-[10px] text-white/30 mb-3">기준: 작업 구역</p>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* status label */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">현재 상태</span>
          <span
            className={`text-[12px] font-semibold px-3 py-1 rounded-full bg-white/5 ${meta.color}`}
          >
            {status || "-"}
          </span>
        </div>

        {/* status meter */}
        <div className="flex items-center gap-2">
          {["안정", "일부 감소", "불안정"].map((label, i) => {
            const isActive = meta.index === i;
            return (
              <div key={label} className="flex-1">
                <div
                  className={`h-2 rounded-full ${
                    isActive ? "bg-white/80" : "bg-white/10"
                  }`}
                  style={{
                    background: isActive
                      ? "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))"
                      : undefined,
                  }}
                />
                <div
                  className={`mt-1 text-[10px] ${
                    isActive ? "text-white/80" : "text-white/30"
                  }`}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
