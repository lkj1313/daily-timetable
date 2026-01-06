import type { DayInput, RawEvent } from "@/entities/schedule/types/schedule";

/**
 * KST 기준 "오늘 YYYY-MM-DD"를 sv-SE 포맷으로 얻음
 */
function getTodayYYYYMMDD_KST(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date()
  );
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function minutesToHHMM(min: number): string {
  // 0~1440
  const safe = Math.max(0, Math.min(24 * 60, min));
  const hh = Math.floor(safe / 60);
  const mm = safe % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}

/**
 * KST 기준 현재 시각을 분(minute)으로 얻음
 */
function getNowMinutesKST(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const mm = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hh * 60 + mm;
}

/**
 * 10분 단위로 내림 (ex 18:37 -> 18:30)
 */
function floorTo10(min: number) {
  return Math.floor(min / 10) * 10;
}

/**
 * 겹침 lane 확인용으로 일부러 겹치게도 섞어둠.
 * "현재시각 ~ 그 전 시각 위주"로 plan/execution 생성.
 */
export function buildTodaySample(): DayInput {
  const today = getTodayYYYYMMDD_KST();
  const nowMin = getNowMinutesKST();
  const base = floorTo10(nowMin);

  // 너무 이른 시간대면(새벽) 보기 좋게 "아침~점심" 근처로 당겨줌
  const anchor = base < 8 * 60 ? 12 * 60 + 10 : base;

  // 최근 2~3시간 범위 위주로 배치
  const plan: RawEvent[] = [
    {
      id: "p1",
      title: "국어",
      subtitle: "문학 6~8강",
      start: minutesToHHMM(anchor - 170),
      end: minutesToHHMM(anchor - 120),
      color: "bg-orange-200",
    },
    {
      id: "p2",
      title: "영어",
      subtitle: "경선식 영단어 Day 31~32",
      start: minutesToHHMM(anchor - 120),
      end: minutesToHHMM(anchor - 70),
      color: "bg-yellow-200",
    },
    // ✅ 겹침(Plan 내부)
    {
      id: "p3",
      title: "사회문화",
      subtitle: "수행평가 준비",
      start: minutesToHHMM(anchor - 95),
      end: minutesToHHMM(anchor - 55),
      color: "bg-green-200",
    },
    {
      id: "p4",
      title: "공통수학1",
      subtitle: "쎈 4-1 ~ 4-3",
      start: minutesToHHMM(anchor - 60),
      end: minutesToHHMM(anchor - 10),
      color: "bg-sky-200",
    },
  ];

  const execution: RawEvent[] = [
    {
      id: "e1",
      title: "국어",
      subtitle: "문학 6강만 완료",
      start: minutesToHHMM(anchor - 165),
      end: minutesToHHMM(anchor - 130),
      color: "bg-orange-200",
    },
    {
      id: "e2",
      title: "슈퍼에서 우유 사기",
      start: minutesToHHMM(anchor - 130),
      end: minutesToHHMM(anchor - 115),
      color: "bg-slate-200",
    },
    {
      id: "e3",
      title: "영어",
      subtitle: "Day31",
      start: minutesToHHMM(anchor - 110),
      end: minutesToHHMM(anchor - 70),
      color: "bg-yellow-200",
    },
    // ✅ 겹침(Execution 내부)
    {
      id: "e4",
      title: "공통수학1",
      subtitle: "쎈 4-1",
      start: minutesToHHMM(anchor - 65),
      end: minutesToHHMM(anchor - 25),
      color: "bg-sky-200",
    },
    {
      id: "e5",
      title: "잡일",
      subtitle: "메신저 답장/정리",
      start: minutesToHHMM(anchor - 45),
      end: minutesToHHMM(anchor - 20),
      color: "bg-slate-200",
    },
  ];

  return {
    date: today,
    title: "공부 화이팅!!",
    plan,
    execution,
  };
}

/**
 * 페이지에서 쓰기 좋게: Record<string, DayInput>
 * (현재는 오늘만 넣어둠. 필요하면 addDays로 어제/내일도 생성 가능)
 */
export function buildDataByDate(): Record<string, DayInput> {
  const todayInput = buildTodaySample();
  return {
    [todayInput.date]: todayInput,
  };
}
