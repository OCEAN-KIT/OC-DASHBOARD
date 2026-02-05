"use client";
import LineBasic from "@/components/charts/LineBasic";

export default function WaterTab({ data }) {
  const categories = data.water.map((w) => w.month);
  const temp = data.water.map((w) => w.temp);
  const _do = data.water.map((w) => w.do);
  const nut = data.water.map((w) => w.nutrient);

  const cards = [
    { title: "수온(°C)", series: [{ name: "수온", data: temp }] },
    { title: "용존산소량(DO)", series: [{ name: "DO", data: _do }] },
    { title: "영양염류", series: [{ name: "Nutrient", data: nut }] },
  ];

  return (
    <section className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{c.title}</div>
          </div>
          <div className="mt-2">
            <LineBasic categories={categories} series={c.series} height={220} />
          </div>
          <div className="mt-2 text-[11px] text-white/60">
            {categories.join(" · ")}
          </div>
        </div>
      ))}
    </section>
  );
}
