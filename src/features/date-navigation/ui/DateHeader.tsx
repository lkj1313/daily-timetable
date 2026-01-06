import { formatDotDate } from "../model/kstDate";

type Props = {
  title?: string;
  selectedDate: string; // YYYY-MM-DD
  onPrevDay: () => void;
  onNextDay: () => void;
};

export default function DateHeader({
  title,
  selectedDate,
  onPrevDay,
  onNextDay,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      {title && (
        <div className="text-xl font-extrabold text-slate-900">{title}</div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrevDay}
          className="h-9 w-9 rounded-full hover:bg-slate-100 active:bg-slate-200"
          aria-label="이전 날짜"
        >
          ◀
        </button>

        <div className="text-lg font-semibold text-slate-800 tabular-nums">
          {formatDotDate(selectedDate)}
        </div>

        <button
          type="button"
          onClick={onNextDay}
          className="h-9 w-9 rounded-full hover:bg-slate-100 active:bg-slate-200"
          aria-label="다음 날짜"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
