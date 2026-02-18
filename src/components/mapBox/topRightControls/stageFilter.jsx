"use client";

export default function StageFilter({
  activeStage,
  setActiveStage,
  stageMeta,
}) {
  return (
    <div className="mt-2 flex gap-2">
      {Object.keys(stageMeta).map((stage) => {
        const on = activeStage === stage;
        const color = stageMeta[stage]?.color;
        return (
          <button
            key={stage}
            aria-pressed={on}
            onClick={() => setActiveStage((s) => (s === stage ? null : stage))}
            className={`relative h-7 flex-1 rounded-full border text-xs font-medium transition
              ${
                on
                  ? "border-indigo-200/70 bg-indigo-500/30 text-indigo-50"
                  : "border-white/20 bg-white/10 text-slate-100 hover:border-indigo-300/65 hover:bg-indigo-500/18"
              }`}
          >
            <span
              className="absolute left-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="block ml-2 text-center">{stage}</span>
          </button>
        );
      })}
    </div>
  );
}
