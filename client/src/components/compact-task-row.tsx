import type { Task } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getPriorityConfig, getTicketLabel } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Crown,
  Inbox,
  ListTodo,
  MessageSquare,
  PlayCircle,
  RotateCcw,
  Trash2,
  GitPullRequest,
} from "lucide-react";

interface CompactTaskRowProps {
  task: Task;
  childCount: number;
  commentCount: number;
  prCount: number;
  isExpanded: boolean;
  inGroup?: boolean;
  showStatus?: boolean;
  onToggleExpand?: () => void;
  onSelect: (task: Task) => void;
  onComplete?: (id: number) => void;
  onStartProgress?: (id: number) => void;
  onMoveToBacklog?: (id: number) => void;
  onRestore?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const statusLabels: Record<string, string> = {
  backlog: "진행 전",
  in_progress: "진행 중",
  completed: "완료",
};

export function CompactTaskRow({
  task,
  childCount,
  commentCount,
  prCount,
  isExpanded,
  inGroup = false,
  showStatus = false,
  onToggleExpand,
  onSelect,
  onComplete,
  onStartProgress,
  onMoveToBacklog,
  onRestore,
  onDelete,
}: CompactTaskRowProps) {
  const priority = getPriorityConfig(task.priority);
  const isTodo = !task.ticketUrl;
  const label = getTicketLabel(task.ticketUrl);

  return (
    <div className={cn(
      "group flex items-center gap-1.5 bg-card px-2 py-2 transition-colors hover:bg-muted/30 sm:gap-2 sm:px-3",
      inGroup ? "border-0 bg-transparent px-3 py-2.5 shadow-none sm:px-4" : "rounded-lg border shadow-sm hover:border-primary/40",
      task.isEpic && !inGroup && "border-violet-200 dark:border-violet-800",
      task.status === "completed" && "opacity-70",
    )} data-testid={`compact-task-${task.id}`}>
      {task.isEpic && childCount > 0 && onToggleExpand ? (
        <button type="button" className="flex h-7 w-6 shrink-0 items-center justify-center rounded text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30" onClick={onToggleExpand} aria-label={`${task.title} 하위 작업 ${isExpanded ? "접기" : "펼치기"}`}>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      ) : null}

      <button type="button" onClick={() => onSelect(task)} className="min-w-0 flex-1 py-1 text-left" data-testid={`button-select-task-${task.id}`}>
        <div className="flex min-w-0 items-start gap-2">
          <span className={cn("mt-0.5 shrink-0 font-mono text-xs font-semibold", isTodo ? "text-amber-700 dark:text-amber-400" : "text-primary")}>
            {isTodo && <ListTodo className="mr-0.5 inline h-3 w-3" />}{label}
          </span>
          <span className={cn("min-w-0 flex-1 text-sm font-medium leading-5 line-clamp-2 sm:truncate", task.status === "completed" && "line-through text-muted-foreground")} data-testid={`text-title-${task.id}`}>{task.title}</span>
          {task.isEpic && <Crown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" aria-label="Epic" />}
        </div>
        <div className="mt-1 flex min-w-0 items-center gap-2 pl-0.5 text-xs text-muted-foreground">
          {showStatus && <span className="shrink-0">{statusLabels[task.status] ?? task.status}</span>}
          <Badge variant="outline" className={cn("shrink-0 px-1 text-[10px] sm:hidden", priority.className)}>{priority.label}</Badge>
          {task.description && <span className="min-w-0 flex-1 truncate">{task.description}</span>}
          {prCount > 0 && <span className="ml-auto inline-flex shrink-0 items-center gap-0.5"><GitPullRequest className="h-3 w-3" />{prCount}</span>}
          {commentCount > 0 && <span className="inline-flex shrink-0 items-center gap-0.5"><MessageSquare className="h-3 w-3" />{commentCount}</span>}
          {childCount > 0 && <span className="shrink-0">하위 {childCount}</span>}
        </div>
      </button>

      <Badge variant="outline" className={cn("hidden shrink-0 px-1.5 text-[10px] sm:inline-flex", priority.className)}>{priority.label}</Badge>
      <div className="flex shrink-0 items-center gap-0.5">
        {onStartProgress && <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => onStartProgress(task.id)} aria-label={`${task.title} 작업 시작`} title="작업 시작"><PlayCircle className="h-4 w-4" /></Button>}
        {onMoveToBacklog && <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMoveToBacklog(task.id)} aria-label={`${task.title} 진행 전으로 이동`} title="진행 전으로 이동"><Inbox className="h-4 w-4" /></Button>}
        {onComplete && <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => onComplete(task.id)} aria-label={`${task.title} 완료`} title="완료"><CheckCircle2 className="h-4 w-4" /></Button>}
        {onRestore && <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => onRestore(task.id)} aria-label={`${task.title} 복원`} title="복원"><RotateCcw className="h-4 w-4" /></Button>}
        {onDelete && <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete(task.id)} aria-label={`${task.title} 삭제`} title="삭제"><Trash2 className="h-4 w-4" /></Button>}
      </div>
    </div>
  );
}
