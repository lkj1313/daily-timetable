import React, { useLayoutEffect, useRef } from "react";
import type {
  TimelineBounds,
  TimelineColumnLayout,
} from "@/entities/schedule/types/schedule";
import TimeAxis from "./TimeAxis";
import GridLines from "./GridLines";
import TimelineColumn from "./TimelineColumn";

type Props = {
  bounds: TimelineBounds;
  heightPx: number;
  left: TimelineColumnLayout; // plan
  right: TimelineColumnLayout; // execution

  // ✅ 자동 스크롤을 위해 부모가 스크롤 컨테이너에 접근할 수 있게
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;

  // ✅ sticky 헤더 높이(px) 측정해서 부모에 전달
  onHeaderHeightChange?: (heightPx: number) => void;
};

export default function TimelineCompareGrid({
  bounds,
  heightPx,
  left,
  right,
  scrollContainerRef,
  onHeaderHeightChange,
}: Props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `${bounds.axisWidthPx}px 1fr 1fr`,
  };

  // 헤더 높이 측정용 (한 셀만 재면 동일)
  const headerCellRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!onHeaderHeightChange) return;
    if (!headerCellRef.current) return;

    const el = headerCellRef.current;

    const emit = () => {
      onHeaderHeightChange(el.offsetHeight);
    };

    emit();

    // 리사이즈 시 헤더 높이가 바뀔 수 있으니 옵저버
    const ro = new ResizeObserver(() => emit());
    ro.observe(el);

    return () => ro.disconnect();
  }, [onHeaderHeightChange]);

  return (
    <div className="w-full rounded-xl border bg-white overflow-hidden">
      <div
        ref={scrollContainerRef as React.RefObject<HTMLDivElement>}
        className="relative max-h-[70vh] overflow-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="grid" style={gridStyle}>
          {/* ===== Sticky Header ===== */}
          <div className="sticky top-0 z-20 border-b border-r bg-slate-50" />
          <div
            ref={headerCellRef}
            className="sticky top-0 z-20 p-3 border-b border-r bg-white"
          >
            <div className="flex items-baseline justify-between">
              <div className="font-semibold text-slate-800">계획</div>
              <div className="text-sm text-slate-500">
                총 {formatHours(left.totalMinutes)}
              </div>
            </div>
          </div>
          <div className="sticky top-0 z-20 p-3 border-b bg-white">
            <div className="flex items-baseline justify-between">
              <div className="font-semibold text-slate-800">실행</div>
              <div className="text-sm text-slate-500">
                총 {formatHours(right.totalMinutes)}
              </div>
            </div>
          </div>

          {/* ===== Timeline Body ===== */}
          <div
            className="relative border-r bg-slate-50"
            style={{ height: heightPx }}
          >
            <TimeAxis bounds={bounds} heightPx={heightPx} />
          </div>

          <div className="relative border-r" style={{ height: heightPx }}>
            <GridLines bounds={bounds} heightPx={heightPx} />
            <TimelineColumn bounds={bounds} layout={left} />
          </div>

          <div className="relative" style={{ height: heightPx }}>
            <GridLines bounds={bounds} heightPx={heightPx} />
            <TimelineColumn bounds={bounds} layout={right} />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatHours(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
