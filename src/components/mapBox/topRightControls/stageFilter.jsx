"use client";

export default function StageFilter({
  activeStage,
  setActiveStage,
  stageMeta,
}) {
  return (
    <div className="flex gap-3 mt-2">
      {Object.keys(stageMeta).map((stage) => {
        const on = activeStage === stage;
        const color = stageMeta[stage]?.color;
        return (
          <button
            key={stage}
            onClick={() => setActiveStage((s) => (s === stage ? null : stage))}
            className={`flex-1 h-6  rounded-full text-xs border transition relative
              ${
                on
                  ? "border-white/20 bg-white/20"
                  : "border-white/10 bg-white/10 hover:bg-white/15"
              }`}
          >
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="block ml-2 text-center">{stage}</span>
          </button>
        );
      })}
    </div>
  );
}
