import type { PositionedEvent } from "@/entities/schedule/types/schedule";

type Props = {
  event: PositionedEvent;
};

export default function EventBlock({ event }: Props) {
  // height가 너무 작으면 텍스트를 줄이거나 숨기는 UX 가능
  const compact = event.heightPx < 40;

  return (
    <div
      className="absolute px-1"
      style={{
        top: event.topPx,
        height: event.heightPx,
        left: `${event.leftPct}%`,
        width: `${event.widthPct}%`,
      }}
    >
      <div
        className={[
          "h-full w-full rounded-lg border border-black/10 shadow-sm",
          event.colorClass,
          "overflow-hidden",
        ].join(" ")}
      >
        <div className="h-full w-full p-2">
          <div
            className={`font-semibold text-slate-900 ${
              compact ? "text-xs" : "text-sm"
            } leading-tight`}
          >
            <span className={compact ? "line-clamp-1" : "line-clamp-2"}>
              {event.title}
            </span>
          </div>

          {!compact && event.subtitle && (
            <div className="mt-1 text-xs text-slate-700/90 leading-snug">
              <span className="line-clamp-2">{event.subtitle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
