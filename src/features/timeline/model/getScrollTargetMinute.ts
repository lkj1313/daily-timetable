import type {
  TimelineBounds,
  TimelineColumnLayout,
} from "@/entities/schedule/types/schedule";
import { clamp } from "@/shared/lib/clamp";

type Params = {
  bounds: TimelineBounds;
  plan: TimelineColumnLayout;
  execution: TimelineColumnLayout;
  paddingMinutes?: number; // minStart에서 위로 당길 분
  defaultMinute?: number; // 일정 없을 때 기본 (09:00)
};

export function getScrollTargetMinute({
  bounds,
  plan,
  execution,
  paddingMinutes = 45,
  defaultMinute = 9 * 60,
}: Params): number {
  const all = [...plan.events, ...execution.events];

  if (all.length === 0) {
    return clamp(defaultMinute, bounds.dayStartMin, bounds.dayEndMin);
  }

  const minStart = Math.min(...all.map((e) => e.startMin));
  const target = minStart - paddingMinutes;

  return clamp(target, bounds.dayStartMin, bounds.dayEndMin);
}
