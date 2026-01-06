import { useLayoutEffect } from "react";
import type {
  TimelineBounds,
  TimelineColumnLayout,
} from "@/entities/schedule/types/schedule";
import { getScrollTargetMinute } from "./getScrollTargetMinute";

type Params = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bounds: TimelineBounds;
  plan: TimelineColumnLayout;
  execution: TimelineColumnLayout;
  selectedDate: string;

  headerHeightPx: number; // sticky 헤더 높이
  paddingMinutes?: number; // 기본 45
  defaultMinute?: number; // 기본 09:00
  extraOffsetPx?: number; // 약간 여유(기본 8px)
};

export function useAutoScrollOnDateChange({
  containerRef,
  bounds,
  plan,
  execution,
  selectedDate,
  headerHeightPx,
  paddingMinutes = 45,
  defaultMinute = 9 * 60,
  extraOffsetPx = 8,
}: Params) {
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targetMin = getScrollTargetMinute({
      bounds,
      plan,
      execution,
      paddingMinutes,
      defaultMinute,
    });

    const targetTopPx = (targetMin - bounds.dayStartMin) * bounds.pxPerMinute;

    // ✅ 헤더가 스크롤 컨테이너 안에서 sticky이므로,
    // scrollTop은 "헤더 높이 + 시간 위치"로 잡아야 원하는 시간대가 바로 보임
    const nextScrollTop = Math.max(
      0,
      headerHeightPx + targetTopPx - extraOffsetPx
    );

    // 레이아웃/페인트 타이밍 안정화
    requestAnimationFrame(() => {
      el.scrollTop = nextScrollTop;
    });
  }, [
    containerRef,
    bounds.dayStartMin,
    bounds.pxPerMinute,
    plan,
    execution,
    selectedDate,
    headerHeightPx,
    paddingMinutes,
    defaultMinute,
    extraOffsetPx,
  ]);
}
