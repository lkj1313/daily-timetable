import { useWeekStrip } from "../model/useWeekStrip";

const DOW = ["일", "월", "화", "수", "목", "금", "토"] as const;

type Props = {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
};

export default function WeekStrip({ selectedDate, onSelectDate }: Props) {
  const { weekDates } = useWeekStrip(selectedDate);

  return (
    <div className="w-full px-3 pb-2">
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, idx) => {
          const dayNum = date.split("-")[2]; // "10"
          const isSelected = date === selectedDate;

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              className="flex flex-col items-center gap-1 rounded-lg py-2 hover:bg-slate-50 active:bg-slate-100"
            >
              <div className="text-xs text-slate-500">{DOW[idx]}</div>

              <div
                className={[
                  "h-8 w-8 grid place-items-center rounded-full text-sm font-semibold tabular-nums",
                  isSelected ? "bg-blue-600 text-white" : "text-slate-700",
                ].join(" ")}
              >
                {Number(dayNum)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
