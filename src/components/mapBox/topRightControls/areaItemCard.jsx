"use client";

export default function AreaItemCard({
  area,
  color,
  onClick,
  days,
  isActive = false,
}) {
  return (
    <>
      <button
        onClick={onClick}
        className={[
          "relative overflow-hidden",
          "w-full text-left rounded-xl hover:bg-white/12 transition border-white/10 px-3 py-1",
          isActive ? "ai-active" : "",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: color ?? "rgba(255,255,255,.6)" }}
            />
            <span className="text-[13px]">{area.name}</span>
          </div>
          <div className="text-xs text-white/60">
            복원 시작일: {area.startDate[0]}년 {area.startDate[1]}월{" "}
            {area.startDate[2]}일
          </div>
        </div>
      </button>

      <style jsx global>{`
        /* 선택 카드 배경: 왼→오 스윕 */
        .ai-active::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          pointer-events: none;
          z-index: 0;

          /* 흐르는 하이라이트 밴드 */
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(34, 211, 238, 0.1) 18%,
            rgba(167, 139, 250, 0.16) 30%,
            rgba(16, 185, 129, 0.22) 50%,
            rgba(167, 139, 250, 0.16) 70%,
            rgba(34, 211, 238, 0.1) 82%,
            rgba(0, 0, 0, 0) 100%
          );
          filter: blur(0px); /* 살짝 번짐 */
          background-size: 200% 100%; /* 넓게 깔고 */
          animation: aiSweep 10s linear infinite; /* 좌→우 이동 */
        }

        /* 내용은 항상 위로 */
        .ai-active > * {
          position: relative;
          z-index: 1;
        }

        @keyframes aiSweep {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  );
}
