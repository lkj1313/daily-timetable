export type ColumnKey = "plan" | "execution";

export type RawEvent = {
  id: string;
  title: string;
  subtitle?: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  color?: string; // e.g. "bg-yellow-100 border-yellow-300"
};

export type DayInput = {
  date: string; // "YYYY-MM-DD"
  plan: RawEvent[];
  execution: RawEvent[];
};

export type NormalizedEvent = RawEvent & {
  startMin: number;
  endMin: number;
};

export type LaneEvent = NormalizedEvent & {
  laneIndex: number;
  laneCount: number;
};

export type GridLine = {
  y: number;
  isHour: boolean;
  label?: string;
};

export type TimelineConfig = {
  dayStart: string; // "HH:MM"
  dayEnd: string; // "HH:MM"
  pxPerMinute: number;
  axisWidthPx: number;
  gridStepMin: number; // 10
  hourStepMin: number; // 60
  laneGapPx: number; // 6
  minEventHeightPx: number; // 18
  nowTimeHHMM: string; // 기본 "17:00" (기존과 동일 동작)
};
