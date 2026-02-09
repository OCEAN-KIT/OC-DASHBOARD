import { useId, type ReactNode } from "react";

type Props = {
  width: number;
  height: number;
  durationMs?: number;
  easing?: string;
  children: ReactNode;
};

export default function SvgReveal({
  width,
  height,
  durationMs = 1200,
  easing = "ease-out",
  children,
}: Props) {
  const clipId = useId();

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect className="svg-reveal-rect" x="0" y="0" width={width} height={height} />
        </clipPath>
      </defs>
      <style>{`
        .svg-reveal-rect {
          transform-origin: left center;
          transform-box: fill-box;
          animation: svg-reveal ${durationMs}ms ${easing} both;
        }
        @keyframes svg-reveal {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .svg-reveal-rect { animation: none; }
        }
      `}</style>
      <g clipPath={`url(#${clipId})`}>{children}</g>
    </>
  );
}
