import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Task, TaskPr } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Rocket,
  ExternalLink,
  GitPullRequest,
  Crown,
  Plus,
  ListTodo,
  X,
} from "lucide-react";
import { extractTicketNumber, extractRepoPath, cn } from "@/lib/utils";
import {
  getUpcomingDeployDate,
  getDeployRounds,
  formatDeployDateLabel,
  getDDayLabel,
  isValidYmd,
  type Ymd,
} from "@/lib/deploy-schedule";

function prLabel(url: string): string {
  const repo = extractRepoPath(url).split("/").pop() || "PR";
  const num = extractTicketNumber(url);
  return /^\d+$/.test(num) ? `${repo} #${num}` : repo;
}

export default function DeployPage() {
  const { toast } = useToast();
  const [roundYmd, setRoundYmd] = useState<Ymd>(() => getUpcomingDeployDate());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  const { data: taskPrs = [] } = useQuery<TaskPr[]>({
    queryKey: ["/api/task-prs"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, data }: { taskId: number; data: Record<string, any> }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${taskId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({ title: "저장에 실패했습니다", variant: "destructive" });
    },
  });

  const updatePrMutation = useMutation({
    mutationFn: async ({ prId, reviewed }: { prId: number; reviewed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/task-prs/${prId}`, { reviewed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-prs"] });
    },
    onError: () => {
      toast({ title: "저장에 실패했습니다", variant: "destructive" });
    },
  });

  const rounds = useMemo(
    () =>
      getDeployRounds({
        extraDates: tasks.map((t) => t.deployDate).filter((d): d is string => !!d),
        include: roundYmd,
      }),
    [tasks, roundYmd]
  );

  const roundIdx = rounds.findIndex((r) => r.date === roundYmd);
  const currentRound = rounds[roundIdx];
  const upcoming = getUpcomingDeployDate();

  const prsByTask = useMemo(() => {
    const map = new Map<number, TaskPr[]>();
    for (const pr of taskPrs) {
      const list = map.get(pr.taskId);
      if (list) list.push(pr);
      else map.set(pr.taskId, [pr]);
    }
    return map;
  }, [taskPrs]);

  const roundTasks = useMemo(
    () => tasks.filter((t) => t.deployDate === roundYmd),
    [tasks, roundYmd]
  );

  const isReady = (task: Task) => {
    const prs = prsByTask.get(task.id) ?? [];
    return (
      task.milestoneRegistered &&
      task.qaCompleted &&
      task.codeReviewCompleted &&
      prs.length > 0 &&
      prs.every((p) => p.reviewed)
    );
  };

  const readyCount = roundTasks.filter(isReady).length;

  const candidates = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    return tasks
      .filter((t) => t.status !== "completed" && !t.deployDate)
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.ticketNumber.toLowerCase().includes(q)
      );
  }, [tasks, pickerQuery]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="shrink-0 border-b bg-card" style={{ zIndex: 100 }}>
        <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-6xl mx-auto flex-wrap">
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold tracking-tight" data-testid="text-deploy-title">
              배포 회차
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/todos">
              <Button variant="outline" size="sm" data-testid="button-todos-link">
                <ListTodo className="w-4 h-4 mr-1" />
                할 일
              </Button>
            </Link>
            <Button size="sm" onClick={() => setShowPicker((v) => !v)} data-testid="button-toggle-picker">
              <Plus className="w-4 h-4 mr-1" />
              티켓 추가
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {currentRound?.isRegular ? (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  정기배포
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                >
                  수시배포
                </Badge>
              )}
              <h2 className="text-lg font-bold" data-testid="text-round-label">
                {formatDeployDateLabel(roundYmd)}
              </h2>
              <Badge variant="outline" className="font-mono text-xs" data-testid="text-dday">
                {getDDayLabel(roundYmd)}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={roundIdx <= 0}
                onClick={() => setRoundYmd(rounds[roundIdx - 1].date)}
                data-testid="button-prev-round"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                이전 회차
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={roundIdx < 0 || roundIdx >= rounds.length - 1}
                onClick={() => setRoundYmd(rounds[roundIdx + 1].date)}
                data-testid="button-next-round"
              >
                다음 회차
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              {roundYmd !== upcoming && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRoundYmd(upcoming)}
                  data-testid="button-reset-round"
                >
                  다음 정기배포
                </Button>
              )}
            </div>
          </div>

          {showPicker && (
            <Card className="p-3">
              <p className="text-xs text-muted-foreground mb-2">
                {formatDeployDateLabel(roundYmd)} 회차에 넣을 티켓을 선택하세요
              </p>
              <Input
                value={pickerQuery}
                onChange={(e) => setPickerQuery(e.target.value)}
                placeholder="제목 또는 티켓 번호 검색"
                className="text-sm mb-2"
                data-testid="input-picker-search"
              />
              {candidates.length === 0 ? (
                <p className="text-xs text-muted-foreground">추가 가능한 티켓이 없습니다</p>
              ) : (
                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {candidates.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 p-2 rounded-md hover-elevate active-elevate-2 cursor-pointer"
                      onClick={() =>
                        updateTaskMutation.mutate({
                          taskId: t.id,
                          data: { deployDate: roundYmd },
                        })
                      }
                      data-testid={`button-assign-${t.id}`}
                    >
                      <span
                        className={cn(
                          "text-xs font-mono font-semibold shrink-0",
                          t.ticketUrl ? "text-primary" : "text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {t.ticketUrl ? `#${extractTicketNumber(t.ticketUrl)}` : "Todo"}
                      </span>
                      <span className="text-xs truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : roundTasks.length === 0 ? (
            <Card className="p-8 text-center">
              <Rocket className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                이 회차에 등록된 티켓이 없습니다
              </p>
              <Button size="sm" variant="outline" onClick={() => setShowPicker(true)}>
                <Plus className="w-4 h-4 mr-1" />
                티켓 추가
              </Button>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">티켓</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead className="w-14 text-center">OSS</TableHead>
                    <TableHead className="w-44">git</TableHead>
                    <TableHead className="w-20 text-center">마일스톤</TableHead>
                    <TableHead className="w-20 text-center">QA 완료</TableHead>
                    <TableHead className="w-24 text-center">Code Review</TableHead>
                    <TableHead className="w-20 text-center">PR리뷰</TableHead>
                    <TableHead className="w-40">배포일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roundTasks.map((task) => {
                    const prs = prsByTask.get(task.id) ?? [];
                    const isTodo = !task.ticketUrl;
                    return (
                      <TableRow
                        key={task.id}
                        className={cn(isReady(task) && "bg-primary/5")}
                        data-testid={`row-deploy-${task.id}`}
                      >
                        <TableCell className="align-top">
                          <div className="flex items-center gap-1">
                            {task.isEpic && (
                              <Crown className="w-3 h-3 text-violet-500 shrink-0" />
                            )}
                            <span
                              className={cn(
                                "text-xs font-mono font-semibold",
                                isTodo ? "text-amber-600 dark:text-amber-400" : "text-primary"
                              )}
                            >
                              {isTodo ? "Todo" : `#${extractTicketNumber(task.ticketUrl)}`}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="align-top text-sm font-medium">
                          {task.title}
                        </TableCell>

                        <TableCell className="align-top text-center">
                          {task.ticketUrl ? (
                            <a
                              href={task.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex text-primary hover:underline"
                              data-testid={`link-oss-${task.id}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>

                        <TableCell className="align-top">
                          {prs.length === 0 ? (
                            <span className="text-xs text-muted-foreground">-</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {prs.map((pr) => (
                                <a
                                  key={pr.id}
                                  href={pr.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                                  data-testid={`link-pr-${pr.id}`}
                                >
                                  <GitPullRequest className="w-3 h-3 shrink-0" />
                                  <span className="truncate font-mono">{prLabel(pr.url)}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="align-top text-center">
                          <Checkbox
                            checked={task.milestoneRegistered}
                            onCheckedChange={(checked) =>
                              updateTaskMutation.mutate({
                                taskId: task.id,
                                data: { milestoneRegistered: checked === true },
                              })
                            }
                            data-testid={`checkbox-milestone-${task.id}`}
                          />
                        </TableCell>

                        <TableCell className="align-top text-center">
                          <Checkbox
                            checked={task.qaCompleted}
                            onCheckedChange={(checked) =>
                              updateTaskMutation.mutate({ taskId: task.id, data: { qaCompleted: checked === true } })
                            }
                            aria-label={`${task.title} QA 완료`}
                            data-testid={`checkbox-qa-${task.id}`}
                          />
                        </TableCell>

                        <TableCell className="align-top text-center">
                          <Checkbox
                            checked={task.codeReviewCompleted}
                            onCheckedChange={(checked) =>
                              updateTaskMutation.mutate({ taskId: task.id, data: { codeReviewCompleted: checked === true } })
                            }
                            aria-label={`${task.title} Code Review 완료`}
                            data-testid={`checkbox-code-review-${task.id}`}
                          />
                        </TableCell>

                        <TableCell className="align-top">
                          {prs.length === 0 ? (
                            <div className="text-center text-xs text-muted-foreground">-</div>
                          ) : (
                            <div className="flex flex-col gap-1 items-center">
                              {prs.map((pr) => (
                                <div key={pr.id} className="flex items-center h-4">
                                  <Checkbox
                                    checked={pr.reviewed}
                                    onCheckedChange={(checked) =>
                                      updatePrMutation.mutate({
                                        prId: pr.id,
                                        reviewed: checked === true,
                                      })
                                    }
                                    data-testid={`checkbox-review-${pr.id}`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="align-top">
                          <div className="flex items-center gap-1">
                            <Input
                              type="date"
                              value={task.deployDate ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (!v || isValidYmd(v)) {
                                  updateTaskMutation.mutate({
                                    taskId: task.id,
                                    data: { deployDate: v || null },
                                  });
                                }
                              }}
                              className="h-8 text-xs"
                              data-testid={`input-deploy-date-${task.id}`}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0"
                              onClick={() =>
                                updateTaskMutation.mutate({
                                  taskId: task.id,
                                  data: { deployDate: null },
                                })
                              }
                              data-testid={`button-unassign-${task.id}`}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="border-t px-4 py-2.5 text-sm text-muted-foreground">
                <span data-testid="text-ready-summary">
                  {roundTasks.length}건 중 준비 완료{" "}
                  <span className="font-semibold text-foreground">{readyCount}</span>건
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
