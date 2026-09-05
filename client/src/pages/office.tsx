import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { addMonths, format, getDay, getDaysInMonth, startOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeft, Building2, CalendarDays, Check, ChevronLeft, ChevronRight, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MonthPlan = { target: number; planned: string[]; vacations: string[] };
type Plans = Record<string, MonthPlan>;

const STORAGE_KEY = "naver-work-office-plans-v1";
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function loadPlans(): Plans {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Plans;
  } catch {
    return {};
  }
}

export default function OfficePage() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [plans, setPlans] = useState<Plans>(loadPlans);
  const [mode, setMode] = useState<"planned" | "vacation">("planned");
  const monthKey = format(month, "yyyy-MM");
  const savedPlan = plans[monthKey] as (Partial<MonthPlan> & { fixed?: string[] }) | undefined;
  const plan: MonthPlan = savedPlan
    ? { target: savedPlan.target ?? 8, planned: Array.from(new Set([...(savedPlan.planned ?? []), ...(savedPlan.fixed ?? [])])), vacations: savedPlan.vacations ?? [] }
    : { target: 8, planned: [], vacations: [] };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const update = (next: Partial<MonthPlan>) => {
    setPlans((prev) => ({ ...prev, [monthKey]: { ...plan, ...next } }));
  };

  const toggleDate = (ymd: string) => {
    if (mode === "vacation") {
      update({
        vacations: plan.vacations.includes(ymd) ? plan.vacations.filter((d) => d !== ymd) : [...plan.vacations, ymd],
        planned: plan.planned.filter((d) => d !== ymd),
      });
      return;
    }
    update({
      planned: plan.planned.includes(ymd) ? plan.planned.filter((d) => d !== ymd) : [...plan.planned, ymd],
      vacations: plan.vacations.filter((d) => d !== ymd),
    });
  };

  const days = useMemo(() => {
    const blanks = Array.from({ length: getDay(month) }, () => null);
    const dates = Array.from({ length: getDaysInMonth(month) }, (_, i) => {
      const day = i + 1;
      return `${monthKey}-${String(day).padStart(2, "0")}`;
    });
    return [...blanks, ...dates];
  }, [month, monthKey]);

  const counted = plan.planned.length + plan.vacations.length;
  const remaining = Math.max(0, plan.target - counted);
  const over = Math.max(0, counted - plan.target);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link href="/"><Button variant="ghost" size="icon" aria-label="홈으로"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><Building2 className="w-4 h-4 text-primary-foreground" /></div>
            <div><h1 className="font-bold leading-tight">오피스 출근 플래너</h1><p className="text-xs text-muted-foreground">월별 출근일을 가볍게 맞춰보세요</p></div>
          </div>
          <Badge variant="outline" className="hidden sm:flex gap-1.5 bg-primary/5 text-primary border-primary/20"><Check className="w-3 h-3" />자동 저장됨</Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:py-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft className="w-4 h-4" /></Button>
            <h2 className="text-xl font-bold min-w-36 text-center">{format(month, "yyyy년 M월", { locale: ko })}</h2>
            <Button variant="outline" size="icon" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight className="w-4 h-4" /></Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>이번 달</Button>
        </div>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-4 col-span-2 lg:col-span-1">
            <p className="text-xs text-muted-foreground mb-2">회사 지정 출근 횟수</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => update({ target: Math.max(0, plan.target - 1) })}><Minus className="w-3.5 h-3.5" /></Button>
              <Input className="h-9 w-16 text-center text-lg font-bold" type="number" min={0} value={plan.target} onChange={(e) => update({ target: Math.max(0, Number(e.target.value)) })} />
              <span className="text-sm">일</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => update({ target: plan.target + 1 })}><Plus className="w-3.5 h-3.5" /></Button>
            </div>
          </Card>
          <Card className="p-4"><p className="text-xs text-muted-foreground">내가 정한 출근일</p><p className="text-2xl font-bold mt-1 text-primary">{plan.planned.length}<span className="text-sm font-normal ml-1">일</span></p></Card>
          <Card className="p-4"><p className="text-xs text-muted-foreground">휴가일</p><p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{plan.vacations.length}<span className="text-sm font-normal ml-1">일</span></p></Card>
          <Card className={cn("p-4", remaining === 0 && "bg-primary/5 border-primary/20")}><p className="text-xs text-muted-foreground">앞으로 정할 날</p><div className="flex items-end gap-2"><p className="text-2xl font-bold mt-1">{remaining}<span className="text-sm font-normal ml-1">일</span></p>{remaining === 0 && over === 0 && <span className="text-xs text-primary mb-1">계획 완료!</span>}{over > 0 && <span className="text-xs text-amber-600 mb-1">{over}일 초과</span>}</div></Card>
        </section>

        <section className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">
          <Card className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div><h3 className="font-semibold flex items-center gap-2"><CalendarDays className="w-4 h-4" />날짜 선택</h3><p className="text-xs text-muted-foreground mt-1">출근 또는 휴가를 고른 뒤 날짜를 눌러주세요.</p></div>
              <div className="grid grid-cols-2 bg-muted rounded-lg p-1 text-sm">
                <button onClick={() => setMode("planned")} className={cn("px-4 py-2 rounded-md transition", mode === "planned" && "bg-card shadow-sm font-semibold text-primary")}>출근일</button>
                <button onClick={() => setMode("vacation")} className={cn("px-4 py-2 rounded-md transition", mode === "vacation" && "bg-card shadow-sm font-semibold text-amber-600")}>휴가일</button>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-1">{weekdays.map((d, i) => <div key={d} className={cn("text-center text-xs py-2 text-muted-foreground", i === 0 && "text-red-500", i === 6 && "text-blue-500")}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {days.map((ymd, i) => {
                if (!ymd) return <div key={`blank-${i}`} />;
                const day = Number(ymd.slice(-2));
                const dow = (getDay(month) + day - 1) % 7;
                const planned = plan.planned.includes(ymd);
                const vacation = plan.vacations.includes(ymd);
                return <button key={ymd} onClick={() => toggleDate(ymd)} className={cn("relative min-h-14 sm:min-h-20 rounded-lg border text-sm text-left p-2 transition hover:border-primary/50 hover:bg-muted/50", planned && "border-primary bg-primary/5", vacation && "border-amber-400 bg-amber-50 dark:bg-amber-950/20", dow === 0 && "text-red-500", dow === 6 && "text-blue-500")}>
                  <span className="font-medium">{day}</span>
                  {planned && <span className="absolute left-1.5 right-1.5 bottom-1.5 rounded bg-primary text-primary-foreground text-[10px] sm:text-xs py-0.5 text-center">출근</span>}
                  {vacation && <span className="absolute left-1.5 right-1.5 bottom-1.5 rounded bg-amber-500 text-white text-[10px] sm:text-xs py-0.5 text-center">휴가</span>}
                </button>;
              })}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-1">이번 달 출근 계획</h3>
              <p className="text-xs text-muted-foreground mb-4">출근일과 휴가일 모두 필수 횟수에서 자동으로 빠져요.</p>
              {counted === 0 ? <div className="text-sm text-muted-foreground bg-muted/60 rounded-lg p-4 text-center">아직 선택한 날짜가 없어요</div> : <div className="space-y-2">{[...plan.planned.map((date) => ({ date, type: "출근" })), ...plan.vacations.map((date) => ({ date, type: "휴가" }))].sort((a, b) => a.date.localeCompare(b.date)).map(({ date, type }) => <div key={date} className="flex items-center justify-between rounded-lg border px-3 py-2"><span className="text-sm font-medium">{format(new Date(`${date}T12:00:00`), "M월 d일 (EEE)", { locale: ko })}</span><Badge variant="outline" className={cn("text-[10px]", type === "휴가" ? "text-amber-600 border-amber-200" : "text-primary border-primary/20")}>{type}</Badge></div>)}</div>}
            </Card>
            <Button variant="outline" className="w-full text-muted-foreground" onClick={() => update({ planned: [], vacations: [] })}><RotateCcw className="w-3.5 h-3.5 mr-2" />{format(month, "M월")} 날짜 선택 초기화</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
