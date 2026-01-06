import { useMemo } from "react";
import { addDaysKST, startOfWeekSunKST } from "./kstDate";

export function useWeekStrip(selectedDate: string) {
  return useMemo(() => {
    const start = startOfWeekSunKST(selectedDate);
    const weekDates = Array.from({ length: 7 }, (_, i) => addDaysKST(start, i));
    const selectedIndex = weekDates.indexOf(selectedDate);
    return { weekDates, selectedIndex };
  }, [selectedDate]);
}
