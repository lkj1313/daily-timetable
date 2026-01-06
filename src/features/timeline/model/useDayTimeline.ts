import { useMemo } from "react";
import type {
  DayInput,
  TimelineBounds,
  TimelineColumnLayout,
  PositionedEvent,
  NormalizedEvent,
} from "@/entities/schedule/types/schedule";
import { normalizeDayInput } from "@/entities/schedule/model/normalizeDayInput";
import { computeLanes } from "@/shared/lib/lane";

type Options = {
  pxPerMinute?: number;
  axisWidthPx?: number;
};

export function useDayTimeline(input: DayInput, opts: Options = {}) {
  const pxPerMinute = opts.pxPerMinute ?? 2; // 1분=2px
  const axisWidthPx = opts.axisWidthPx ?? 64;

  return useMemo(() => {
    const normalized = normalizeDayInput(input);

    const plan = normalized.filter((e) => e.column === "plan");
    const execution = normalized.filter((e) => e.column === "execution");

    // ✅ 요구사항: 항상 하루 전체(00:00~24:00)
    const dayStartMin = 0; // 00:00
    const dayEndMin = 24 * 60; // 24:00 (=1440)

    const bounds: TimelineBounds = {
      dayStartMin,
      dayEndMin,
      pxPerMinute,
      axisWidthPx,
    };

    const makeColumn = (
      columnEvents: NormalizedEvent[],
      column: "plan" | "execution"
    ): TimelineColumnLayout => {
      const withLanes = computeLanes(columnEvents);

      const positioned: PositionedEvent[] = withLanes.map((e) => {
        const topPx = (e.startMin - dayStartMin) * pxPerMinute;
        const heightPx = (e.endMin - e.startMin) * pxPerMinute;

        // lane 기반 가로 분할
        const gutterPct = 2; // lane 사이 간격(%) 느낌
        const per = 100 / e.laneCount;

        const leftPct = per * e.laneIndex + gutterPct / 2;
        const widthPct = per - gutterPct;

        return {
          ...e,
          laneIndex: e.laneIndex,
          laneCount: e.laneCount,
          topPx,
          heightPx,
          leftPct,
          widthPct,
        };
      });

      const totalMinutes = columnEvents.reduce(
        (acc, e) => acc + (e.endMin - e.startMin),
        0
      );

      return {
        column,
        totalMinutes,
        events: positioned,
      };
    };

    return {
      input,
      bounds,
      plan: makeColumn(plan, "plan"),
      execution: makeColumn(execution, "execution"),
      // ✅ 항상 24h 높이
      heightPx: (dayEndMin - dayStartMin) * pxPerMinute, // 1440 * pxPerMinute
    };
  }, [input, axisWidthPx, pxPerMinute]);
}
