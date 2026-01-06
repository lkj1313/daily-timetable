export type ColumnType = "plan" | "execution";

export type RawEvent = {
  id: string;
  title: string;
  subtitle?: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  color?: string; // tailwind class or hex (we'll use tailwind class)
};

export type DayInput = {
  date: string; // "YYYY-MM-DD"
  title?: string;
  plan: RawEvent[];
  execution: RawEvent[];
};

export type NormalizedEvent = {
  id: string;
  column: ColumnType;
  title: string;
  subtitle?: string;
  startMin: number; // minutes from 00:00
  endMin: number;
  colorClass: string;
};

export type PositionedEvent = NormalizedEvent & {
  laneIndex: number;
  laneCount: number;
  topPx: number;
  heightPx: number;
  leftPct: number; // 0~100
  widthPct: number; // 0~100
};

export type TimelineBounds = {
  dayStartMin: number;
  dayEndMin: number;
  pxPerMinute: number;
  axisWidthPx: number;
};

export type TimelineColumnLayout = {
  column: ColumnType;
  totalMinutes: number;
  events: PositionedEvent[];
};
