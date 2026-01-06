import { useRef, useState } from "react";
import type { DayInput } from "@/entities/schedule/types/schedule";
import { useDayTimeline } from "@/features/timeline/model/useDayTimeline";
import TimelineCompareGrid from "@/features/timeline/ui/TimelineCompareGrid";

import DateHeader from "@/features/date-navigation/ui/DateHeader";
import WeekStrip from "@/features/date-navigation/ui/WeekStrip";
import {
  addDaysKST,
  getTodayYYYYMMDD_KST,
} from "@/features/date-navigation/model/kstDate";

import { useAutoScrollOnDateChange } from "@/features/timeline/model/useAutoScrollOnDateChange";

type Props = {
  dataByDate: Record<string, DayInput>;
  initialDate?: string; // 없으면 오늘(KST)
};

export default function DayCompareView({ dataByDate, initialDate }: Props) {
  const today = getTodayYYYYMMDD_KST();

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate ?? today
  );

  const input: DayInput = dataByDate[selectedDate] ?? {
    date: selectedDate,
    title: "공부 화이팅!!",
    plan: [],
    execution: [],
  };

  const timeline = useDayTimeline(input, {
    pxPerMinute: 2,
    axisWidthPx: 72,
  });

  // ✅ 스크롤 컨테이너 ref + sticky 헤더 높이
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [headerHeightPx, setHeaderHeightPx] = useState<number>(0);

  // ✅ 날짜가 바뀔 때마다 자동 스크롤
  useAutoScrollOnDateChange({
    containerRef: scrollRef,
    bounds: timeline.bounds,
    plan: timeline.plan,
    execution: timeline.execution,
    selectedDate,
    headerHeightPx,

    // 요구 정책
    paddingMinutes: 45, // minStart에서 45분 위로
    defaultMinute: 9 * 60, // 일정 없으면 09:00
    extraOffsetPx: 8,
  });

  return (
    <div className="w-full max-w-[980px] mx-auto px-4 py-4">
      {/* 날짜 네비게이션 */}
      <div className="rounded-xl border bg-white overflow-hidden mb-4">
        <DateHeader
          title={input.title ?? "공부 화이팅!!"}
          selectedDate={selectedDate}
          onPrevDay={() => setSelectedDate((d) => addDaysKST(d, -1))}
          onNextDay={() => setSelectedDate((d) => addDaysKST(d, +1))}
        />
        <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {/* 타임라인 */}
      <TimelineCompareGrid
        bounds={timeline.bounds}
        heightPx={timeline.heightPx}
        left={timeline.plan}
        right={timeline.execution}
        scrollContainerRef={scrollRef}
        onHeaderHeightChange={setHeaderHeightPx}
      />
    </div>
  );
}
