import type { TimelineBounds } from "@/entities/schedule/types/schedule";

type Props = {
  bounds: TimelineBounds;
  nowMinutes: number;
};

export default function NowIndicator({ bounds, nowMinutes }: Props) {
  const { dayStartMin, dayEndMin, pxPerMinute } = bounds;
  if (nowMinutes < dayStartMin || nowMinutes > dayEndMin) return null;

  const top = (nowMinutes - dayStartMin) * pxPerMinute;

  return (
    <div
      className="pointer-events-none absolute left-0 right-0"
      style={{ top }}
    >
      <div className="relative">
        <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500" />
        <div className="border-t border-red-500" />
      </div>
    </div>
  );
}
