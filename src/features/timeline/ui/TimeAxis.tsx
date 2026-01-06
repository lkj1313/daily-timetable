import type { TimelineBounds } from "@/entities/schedule/types/schedule";
import { minutesToHHMM } from "@/shared/lib/time";

type Props = {
  bounds: TimelineBounds;
  heightPx: number;
};

export default function TimeAxis({ bounds }: Props) {
  const { dayStartMin, dayEndMin, pxPerMinute } = bounds;

  // ✅ 60분 단위로 라벨 표시 (00:00 ~ 24:00)
  const labels: Array<{ top: number; text: string }> = [];

  const startHour = Math.ceil(dayStartMin / 60); // 0
  const endHour = Math.floor(dayEndMin / 60); // 24

  for (let h = startHour; h <= endHour; h++) {
    const min = h * 60;
    const top = (min - dayStartMin) * pxPerMinute;
    labels.push({ top, text: minutesToHHMM(min) });
  }

  return (
    <div className="absolute inset-0">
      {labels.map((l) => (
        <div
          key={l.text}
          className="absolute right-2 -translate-y-1/2 text-xs text-slate-500 tabular-nums"
          style={{ top: l.top }}
        >
          {l.text}
        </div>
      ))}
    </div>
  );
}
