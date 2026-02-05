"use client";
import LineBasic from "@/components/charts/LineBasic";

export default function GrowthTab({ data }) {
  const months = data.growth.months;

  return (
    <section className="grid grid-cols-3 gap-4">
      {[
        {
          title: "착생률(%)",
          series: [{ name: "착생률", data: data.growth.attachment }],
        },
        {
          title: "생존률(%)",
          series: [{ name: "생존률", data: data.growth.survival }],
        },
        {
          title: "성장률(mm/일)",
          series: [{ name: "성장률", data: data.growth.growthMM }],
        },
      ].map((g) => (
        <div
          key={g.title}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{g.title}</div>
          </div>
          <div className="mt-2">
            <LineBasic categories={months} series={g.series} height={220} />
          </div>
          <div className="mt-2 text-[11px] text-white/60">
            {months.join(" · ")}
          </div>
        </div>
      ))}
    </section>
  );
}
