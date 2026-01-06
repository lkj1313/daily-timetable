import type { DayInput, NormalizedEvent, RawEvent } from "../types/schedule";
import { hhmmToMinutes } from "@/shared/lib/time";

const DEFAULT_COLOR_BY_COLUMN: Record<"plan" | "execution", string> = {
  plan: "bg-indigo-200",
  execution: "bg-slate-200",
};

function normalizeOne(
  e: RawEvent,
  column: "plan" | "execution"
): NormalizedEvent {
  const startMin = hhmmToMinutes(e.start);
  const endMin = hhmmToMinutes(e.end);

  if (Number.isNaN(startMin) || Number.isNaN(endMin)) {
    throw new Error(
      `Invalid time format in event "${e.title}" (${e.start}~${e.end})`
    );
  }
  if (endMin <= startMin) {
    throw new Error(
      `Event "${e.title}" has invalid range: ${e.start}~${e.end}`
    );
  }

  return {
    id: e.id,
    column,
    title: e.title,
    subtitle: e.subtitle,
    startMin,
    endMin,
    colorClass: e.color ?? DEFAULT_COLOR_BY_COLUMN[column],
  };
}

export function normalizeDayInput(input: DayInput): NormalizedEvent[] {
  const plan = input.plan.map((e) => normalizeOne(e, "plan"));
  const execution = input.execution.map((e) => normalizeOne(e, "execution"));
  return [...plan, ...execution].sort((a, b) => a.startMin - b.startMin);
}
