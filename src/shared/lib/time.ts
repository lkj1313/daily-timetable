export function hhmmToMinutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return NaN;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh < 0 || hh > 24) return NaN;
  if (mm < 0 || mm > 59) return NaN;

  // ✅ "24:00"만 허용 (24:xx는 불가)
  if (hh === 24 && mm !== 0) return NaN;

  return hh * 60 + mm;
}

export function minutesToHHMM(min: number): string {
  // ✅ 1440 => "24:00" 허용
  if (min === 24 * 60) return "24:00";

  // 나머지는 0~1439 범위 권장
  const safe = Math.max(0, Math.min(24 * 60 - 1, min));
  const hh = Math.floor(safe / 60);
  const mm = safe % 60;

  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function isSameDateYYYYMMDD(a: string, b: string) {
  return a === b;
}

export function getTodayYYYYMMDD_KST(): string {
  const dt = new Date();
  const fmt = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" });
  return fmt.format(dt);
}

export function getNowMinutes_KST(): number {
  const dt = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(dt);

  const hh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const mm = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return hh * 60 + mm;
}
