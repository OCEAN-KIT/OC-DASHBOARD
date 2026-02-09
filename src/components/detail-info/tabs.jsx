export const TABS = [
  { key: "overview", label: "개요" },
  { key: "status", label: "현황" },
  { key: "ecology", label: "생태 반응" },
  { key: "enviroment", label: "환경" },
  { key: "photos", label: "사진" },
];

export default function TabsBar({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3">
      {TABS.map((t) => {
        const on = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "h-8 px-3 rounded-full text-sm border transition",
              on
                ? "border-white/20 bg-white/20"
                : "border-white/10 bg-white/10 hover:bg-white/15",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
