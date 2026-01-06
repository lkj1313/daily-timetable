import type { TimelineBounds } from "@/entities/schedule/types/schedule";

type Props = {
  bounds: TimelineBounds;
  heightPx: number;
};

export default function GridLines({ bounds, heightPx }: Props) {
  const { dayStartMin, dayEndMin, pxPerMinute } = bounds;

  const lines: Array<{ top: number; bold: boolean; key: string }> = [];
  const start = Math.floor(dayStartMin / 10) * 10;
  for (let m = start; m <= dayEndMin; m += 10) {
    const top = (m - dayStartMin) * pxPerMinute;
    if (top < 0 || top > heightPx) continue;
    const bold = m % 60 === 0;
    lines.push({ top, bold, key: String(m) });
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      {lines.map((l) => (
        <div
          key={l.key}
          className={`absolute left-0 right-0 ${
            l.bold ? "border-t border-slate-300" : "border-t border-slate-200"
          }`}
          style={{ top: l.top }}
        />
      ))}
    </div>
  );
}
