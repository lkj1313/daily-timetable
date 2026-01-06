type EventLike = { startMin: number; endMin: number };

export type LaneResult<T> = Array<T & { laneIndex: number; laneCount: number }>;

function overlaps(a: EventLike, b: EventLike) {
  // [start, end) half-open
  return a.startMin < b.endMin && b.startMin < a.endMin;
}

function buildOverlapGroups<T extends EventLike>(events: T[]): T[][] {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin);

  const groups: T[][] = [];
  let current: T[] = [];
  let currentEnd = -1;

  for (const ev of sorted) {
    if (current.length === 0) {
      current = [ev];
      currentEnd = ev.endMin;
      continue;
    }

    // 그룹의 현재 "끝"보다 시작이 뒤면 겹침 그룹 끊김
    if (ev.startMin >= currentEnd) {
      groups.push(current);
      current = [ev];
      currentEnd = ev.endMin;
    } else {
      current.push(ev);
      currentEnd = Math.max(currentEnd, ev.endMin);
    }
  }

  if (current.length) groups.push(current);
  return groups;
}

function assignLanesWithinGroup<T extends EventLike>(
  group: T[]
): LaneResult<T> {
  // greedy: 가능한 가장 낮은 lane에 넣기
  const lanes: T[][] = [];
  const laneIndexByEvent = new Map<T, number>();

  const sorted = [...group].sort((a, b) => a.startMin - b.startMin);

  for (const ev of sorted) {
    let placed = false;

    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      const last = lane[lane.length - 1];

      // 같은 lane에서 겹치지 않으면 배치 가능
      if (!overlaps(last, ev)) {
        lane.push(ev);
        laneIndexByEvent.set(ev, i);
        placed = true;
        break;
      }
    }

    if (!placed) {
      lanes.push([ev]);
      laneIndexByEvent.set(ev, lanes.length - 1);
    }
  }

  const laneCount = lanes.length;

  return sorted.map((ev) => {
    const laneIndex = laneIndexByEvent.get(ev)!;

    // Object.assign은 타입 추론이 잘 되는 편이라 any가 필요 없음
    return Object.assign({}, ev, {
      laneIndex,
      laneCount,
    });
  });
}

export function computeLanes<T extends EventLike>(events: T[]): LaneResult<T> {
  if (events.length === 0) return [];

  const groups = buildOverlapGroups(events);
  const result: LaneResult<T> = [];

  for (const g of groups) {
    result.push(...assignLanesWithinGroup(g));
  }

  // 원래 순서가 필요하면 호출 측에서 정렬/매핑하면 됨
  return result;
}
