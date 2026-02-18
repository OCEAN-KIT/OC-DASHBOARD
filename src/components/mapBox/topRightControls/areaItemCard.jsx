"use client";

export default function AreaItemCard({
  area,
  color,
  onClick,
  days,
  isActive = false,
}) {
  const start =
    Array.isArray(area.startDate) && area.startDate.length >= 3
      ? `${area.startDate[0]}년 ${area.startDate[1]}월 ${area.startDate[2]}일`
      : "-";

  return (
    <button
      onClick={onClick}
      className={[
        "relative w-full rounded-xl border px-3 py-2 text-left transition",
        "cursor-pointer",
        isActive
          ? "border-emerald-300/55 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.28),0_10px_18px_rgba(2,6,23,0.3)]"
          : "border-slate-800/80 bg-slate-900/65 hover:border-slate-600/80 hover:bg-slate-900",
      ].join(" ")}
    >
      <div className="absolute inset-y-2 left-1 w-1 rounded-full bg-slate-700/70" />
      <div className="ml-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color ?? "rgba(248,250,252,0.6)" }}
            />
            <span className="truncate text-[13px] font-semibold text-slate-100">
              {area.name}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">복원 시작일: {start}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
            Update
          </p>
          <p className="text-xs font-medium text-slate-200">
            {days == null ? "-" : `${days}일 전`}
          </p>
        </div>
      </div>
    </button>
  );
}
