import type {
  TimelineBounds,
  TimelineColumnLayout,
} from "@/entities/schedule/types/schedule";
import EventBlock from "./EventBlock";

type Props = {
  bounds: TimelineBounds;
  layout: TimelineColumnLayout;
};

export default function TimelineColumn({ layout }: Props) {
  return (
    <div className="absolute inset-0">
      {layout.events.map((ev) => (
        <EventBlock key={ev.id} event={ev} />
      ))}
    </div>
  );
}
