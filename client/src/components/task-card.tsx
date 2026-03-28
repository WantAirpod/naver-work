import type { Task, Comment } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  MessageSquare,
  Link2,
  CheckCircle2,
  RotateCcw,
  Trash2,
  GitPullRequest,
  PlayCircle,
  Inbox,
  Eye,
  Crown,
  ListTodo,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { extractTicketNumber, extractRepoPath, formatDate, getPriorityConfig, cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  comments: Comment[];
  relatedCount: number;
  childCount?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onSelect: (task: Task) => void;
  onComplete?: (taskId: number) => void;
  onStartProgress?: (taskId: number) => void;
  onMoveToBacklog?: (taskId: number) => void;
  onRestore?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskCard({
  task,
  comments,
  relatedCount,
  childCount,
  isExpanded,
  onToggleExpand,
  onSelect,
  onComplete,
  onStartProgress,
  onMoveToBacklog,
  onRestore,
  onDelete,
}: TaskCardProps) {
  const isTodo = !task.ticketUrl;
  const ticketNumber = isTodo ? "TODO" : extractTicketNumber(task.ticketUrl);
  const repoPath = isTodo ? "" : extractRepoPath(task.ticketUrl);
  const priority = getPriorityConfig(task.priority);
  const isCompleted = task.status === "completed";
  const isBacklog = task.status === "backlog";

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover-elevate active-elevate-2 overflow-visible",
        isCompleted && "opacity-70",
        task.isEpic && "border-violet-200 dark:border-violet-800"
      )}
      onClick={() => onSelect(task)}
      data-testid={`card-task-${task.id}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {task.isEpic && onToggleExpand && (
              <button
                className="p-0.5 rounded hover:bg-muted transition-colors shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                data-testid={`button-expand-epic-${task.id}`}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-violet-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-violet-500" />
                )}
              </button>
            )}
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md",
              isTodo
                ? "bg-amber-100 dark:bg-amber-900/30"
                : "bg-primary/10 dark:bg-primary/20"
            )}>
              {isTodo ? (
                <ListTodo className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              ) : null}
              <span className={cn(
                "text-xs font-mono font-semibold",
                isTodo ? "text-amber-600 dark:text-amber-400" : "text-primary"
              )} data-testid={`text-ticket-${task.id}`}>
                {isTodo ? "Todo" : `#${ticketNumber}`}
              </span>
            </div>
            <Badge variant="outline" className={cn("text-xs", priority.className)} data-testid={`badge-priority-${task.id}`}>
              {priority.label}
            </Badge>
            {isBacklog && (
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                <Inbox className="w-3 h-3 mr-1" />
                진행 전
              </Badge>
            )}
            {task.status === "review" && (
              <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20">
                <Eye className="w-3 h-3 mr-1" />
                검토 중
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary dark:bg-primary/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                완료
              </Badge>
            )}
            {task.isEpic && (
              <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-500/20">
                <Crown className="w-3 h-3 mr-1" />
                Epic
                {childCount !== undefined && childCount > 0 && (
                  <span className="ml-1">{childCount}</span>
                )}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isCompleted ? (
              <>
                {onRestore && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(task.id);
                    }}
                    data-testid={`button-restore-${task.id}`}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    data-testid={`button-delete-${task.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </>
            ) : (
              <>
                {onStartProgress && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartProgress(task.id);
                    }}
                    data-testid={`button-start-${task.id}`}
                  >
                    <PlayCircle className="w-4 h-4 text-primary" />
                  </Button>
                )}
                {onMoveToBacklog && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveToBacklog(task.id);
                    }}
                    data-testid={`button-backlog-${task.id}`}
                  >
                    <Inbox className="w-4 h-4" />
                  </Button>
                )}
                {onComplete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete(task.id);
                    }}
                    data-testid={`button-complete-${task.id}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <h3
          className={cn(
            "mt-3 text-sm font-semibold leading-snug",
            isCompleted && "line-through text-muted-foreground"
          )}
          data-testid={`text-title-${task.id}`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2" data-testid={`text-desc-${task.id}`}>
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t flex-wrap">
          <div className="flex items-center gap-3">
            {!isTodo && (
              <a
                href={task.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                data-testid={`link-ticket-${task.id}`}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="truncate max-w-[140px]">{repoPath}</span>
              </a>
            )}
            {task.prUrl && (
              <span className="flex items-center gap-1 text-xs text-primary" data-testid={`text-pr-${task.id}`}>
                <GitPullRequest className="w-3 h-3" />
                PR
              </span>
            )}
            {comments.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`text-comments-count-${task.id}`}>
                <MessageSquare className="w-3 h-3" />
                {comments.length}
              </span>
            )}
            {relatedCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`text-related-count-${task.id}`}>
                <Link2 className="w-3 h-3" />
                {relatedCount}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground" data-testid={`text-date-${task.id}`}>
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
    </Card>
  );
}
