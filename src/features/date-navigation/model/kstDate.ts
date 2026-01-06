const KST_OFFSET = "+09:00";

/** "YYYY-MM-DD" -> Date (KST 기준 00:00) */
export function parseKSTDate(date: string): Date {
  // KST 기준 자정으로 고정 생성(브라우저 타임존 흔들림 방지)
  return new Date(`${date}T00:00:00${KST_OFFSET}`);
}

/** Date -> "YYYY-MM-DD" (KST 기준) */
export function formatKSTDate(d: Date): string {
  // sv-SE는 YYYY-MM-DD 포맷
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(d);
}

export function addDaysKST(date: string, delta: number): string {
  const d = parseKSTDate(date);
  d.setDate(d.getDate() + delta);
  return formatKSTDate(d);
}

/** 일요일 시작(이미지처럼 일~토) */
export function startOfWeekSunKST(date: string): string {
  const d = parseKSTDate(date);
  // getDay(): 0=일 ... 6=토 (KST 기반 Date로 만들었으니 일관됨)
  const diff = d.getDay(); // 일요일이면 0
  d.setDate(d.getDate() - diff);
  return formatKSTDate(d);
}

export function getTodayYYYYMMDD_KST(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date()
  );
}

/** "2025-09-10" -> "2025. 09. 10" */
export function formatDotDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${y}. ${m}. ${d}`;
}
