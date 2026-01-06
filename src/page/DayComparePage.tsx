import DayCompareView from "@/widgets/day-compare/ui/DayCompareView";
import { buildDataByDate } from "@/entities/schedule/mock/daySamples";

export default function DayComparePage() {
  const dataByDate = buildDataByDate();
  return <DayCompareView dataByDate={dataByDate} />;
}
