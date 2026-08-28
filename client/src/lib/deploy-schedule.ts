/**
 * 격주 수요일 정기배포 회차 계산.
 *
 * 모든 산술은 UTC 자정 기준이다. "YYYY-MM-DD"를 로컬 자정 Date로 만들면 KST에서
 * toISOString()이 전날로 밀리고, UTC 자정 Date를 toLocaleDateString()으로 찍으면
 * 음수 오프셋 지역에서 하루 밀린다. 로컬 시간은 "사용자에게 오늘이 며칠인가"를
 * 답하는 todayYmd() 한 곳에서만 쓴다.
 */

export const DEPLOY_ANCHOR = "2026-09-02";
export const DEPLOY_INTERVAL_DAYS = 14;

const MS_PER_DAY = 86400000;
const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

export type Ymd = string;

function ymdToUtcMs(ymd: Ymd): number {
  const [y, m, d] = ymd.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function utcMsToYmd(ms: number): Ymd {
  const d = new Date(ms);
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${month}-${day}`;
}

export function addDays(ymd: Ymd, n: number): Ymd {
  return utcMsToYmd(ymdToUtcMs(ymd) + n * MS_PER_DAY);
}

export function diffDays(a: Ymd, b: Ymd): number {
  return Math.round((ymdToUtcMs(a) - ymdToUtcMs(b)) / MS_PER_DAY);
}

export function isValidYmd(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  // 왕복 비교로 2026-02-30 같은 실존하지 않는 날짜를 거른다
  return utcMsToYmd(ymdToUtcMs(s)) === s;
}

export function todayYmd(now = new Date()): Ymd {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isRegularDeployDate(ymd: Ymd): boolean {
  const delta = diffDays(ymd, DEPLOY_ANCHOR);
  return ((delta % DEPLOY_INTERVAL_DAYS) + DEPLOY_INTERVAL_DAYS) % DEPLOY_INTERVAL_DAYS === 0;
}

/** 오늘 이후(오늘 포함) 가장 가까운 정기배포일. 기준일 이전 날짜도 처리된다. */
export function getUpcomingDeployDate(today: Ymd = todayYmd()): Ymd {
  const k = Math.ceil(diffDays(today, DEPLOY_ANCHOR) / DEPLOY_INTERVAL_DAYS);
  return addDays(DEPLOY_ANCHOR, k * DEPLOY_INTERVAL_DAYS);
}

export interface DeployRound {
  date: Ymd;
  isRegular: boolean;
}

/**
 * 정기 회차 윈도우와 실제 데이터에 등록된 배포일을 합친 회차 목록(오름차순).
 * 이전/다음 이동은 이 목록의 인덱스로 하므로 수시 배포 회차도 탐색으로 도달한다.
 */
export function getDeployRounds(opts: {
  today?: Ymd;
  extraDates?: Ymd[];
  back?: number;
  forward?: number;
  include?: Ymd;
} = {}): DeployRound[] {
  const { today = todayYmd(), extraDates = [], back = 3, forward = 4, include } = opts;
  const upcoming = getUpcomingDeployDate(today);

  const dates = new Set<Ymd>();
  for (let i = -back; i <= forward; i++) {
    dates.add(addDays(upcoming, i * DEPLOY_INTERVAL_DAYS));
  }
  for (const d of extraDates) {
    if (isValidYmd(d)) dates.add(d);
  }
  if (include && isValidYmd(include)) dates.add(include);

  return Array.from(dates)
    .sort()
    .map((date) => ({ date, isRegular: isRegularDeployDate(date) }));
}

export function formatDeployDateLabel(ymd: Ymd): string {
  const d = new Date(ymdToUtcMs(ymd));
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${WEEKDAY_KO[d.getUTCDay()]})`;
}

export function getDDayLabel(ymd: Ymd, today: Ymd = todayYmd()): string {
  const delta = diffDays(ymd, today);
  if (delta === 0) return "D-DAY";
  return delta > 0 ? `D-${delta}` : `D+${-delta}`;
}
