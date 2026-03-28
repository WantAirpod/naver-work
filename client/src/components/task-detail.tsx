import { useState } from "react";
import type { Task, Comment, TaskRelation } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExternalLink,
  MessageSquare,
  Link2,
  Send,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  X,
  GitPullRequest,
  Plus,
  Pencil,
  Save,
  Inbox,
  PlayCircle,
  Eye,
  Crown,
  ChevronRight,
  ChevronDown,
  TreePine,
  ListTodo,
} from "lucide-react";
import {
  extractTicketNumber,
  extractRepoPath,
  formatDate,
  getPriorityConfig,
  cn,
} from "@/lib/utils";

interface TaskDetailProps {
  task: Task;
  comments: Comment[];
  relatedTasks: Task[];
  allTasks: Task[];
  childTasks: Task[];
  epicTask: Task | null;
  onBack: () => void;
  onAddComment: (taskId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
  onComplete: (taskId: number) => void;
  onAddRelation: (sourceId: number, targetId: number) => void;
  onRemoveRelation: (sourceId: number, targetId: number) => void;
  onSelectRelated: (task: Task) => void;
  onUpdateTask: (taskId: number, data: Record<string, any>) => void;
  onChangeStatus: (taskId: number, status: string) => void;
  onCreateAndRelate: (sourceTaskId: number, data: { title: string; ticketUrl: string; ticketNumber: string; priority: string }) => void;
  isAddingComment?: boolean;
  isCreatingRelation?: boolean;
}

export function TaskDetail({
  task,
  comments,
  relatedTasks,
  allTasks,
  childTasks,
  epicTask,
  onBack,
  onAddComment,
  onDeleteComment,
  onComplete,
  onAddRelation,
  onRemoveRelation,
  onSelectRelated,
  onUpdateTask,
  onChangeStatus,
  onCreateAndRelate,
  isAddingComment,
  isCreatingRelation,
}: TaskDetailProps) {
  const [commentText, setCommentText] = useState("");
  const [showRelationPicker, setShowRelationPicker] = useState(false);
  const [showNewRelationForm, setShowNewRelationForm] = useState(false);
  const [showPrInput, setShowPrInput] = useState(false);
  const [prUrlInput, setPrUrlInput] = useState("");
  const [newRelTitle, setNewRelTitle] = useState("");
  const [newRelTicketUrl, setNewRelTicketUrl] = useState("");
  const [newRelPriority, setNewRelPriority] = useState("medium");
  const [epicTreeExpanded, setEpicTreeExpanded] = useState(true);
  const [showChildPicker, setShowChildPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTicketUrl, setEditTicketUrl] = useState(task.ticketUrl);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState(task.priority);

  const isTodo = !task.ticketUrl;
  const ticketNumber = isTodo ? "TODO" : extractTicketNumber(task.ticketUrl);
  const getTaskLabel = (t: Task) => t.ticketUrl ? `#${extractTicketNumber(t.ticketUrl)}` : "Todo";
  const repoPath = isTodo ? "" : extractRepoPath(task.ticketUrl);
  const priority = getPriorityConfig(task.priority);
  const isCompleted = task.status === "completed";

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditTicketUrl(task.ticketUrl);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    if (!isTodo && !editTicketUrl.trim()) return;
    const newTicketNumber = isTodo ? "TODO" : extractTicketNumber(editTicketUrl);
    onUpdateTask(task.id, {
      title: editTitle.trim(),
      ticketUrl: isTodo ? "" : editTicketUrl.trim(),
      ticketNumber: isTodo ? "TODO" : (newTicketNumber || editTicketUrl.trim()),
      description: editDescription.trim(),
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const availableForRelation = allTasks.filter(
    (t) => t.id !== task.id && !relatedTasks.some((rt) => rt.id === t.id)
  );

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText.trim());
    setCommentText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md",
            isTodo ? "bg-amber-100 dark:bg-amber-900/30" : "bg-primary/10 dark:bg-primary/20"
          )}>
            {isTodo && <ListTodo className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
            <span className={cn(
              "text-sm font-mono font-bold",
              isTodo ? "text-amber-600 dark:text-amber-400" : "text-primary"
            )} data-testid="text-detail-ticket">
              {isTodo ? "Todo" : `#${ticketNumber}`}
            </span>
          </div>
          <Badge variant="outline" className={cn("text-xs", priority.className)} data-testid="badge-detail-priority">
            {priority.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={task.status}
            onValueChange={(value) => onChangeStatus(task.id, value)}
          >
            <SelectTrigger className="text-xs w-[110px]" data-testid="select-detail-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog">
                <span className="flex items-center gap-1.5">
                  <Inbox className="w-3 h-3" />
                  진행 전
                </span>
              </SelectItem>
              <SelectItem value="in_progress">
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="w-3 h-3" />
                  작업 중
                </span>
              </SelectItem>
              <SelectItem value="review">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  검토 중
                </span>
              </SelectItem>
              <SelectItem value="completed">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  완료
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              data-testid="button-edit-task"
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              수정
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">제목</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="작업 제목을 입력하세요"
                  className="text-sm"
                  data-testid="input-edit-title"
                />
              </div>
              {!isTodo && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">티켓 URL</label>
                  <Input
                    value={editTicketUrl}
                    onChange={(e) => setEditTicketUrl(e.target.value)}
                    placeholder="https://oss.fin.navercorp.com/.../issues/1755"
                    className="text-sm"
                    data-testid="input-edit-ticket-url"
                  />
                  {extractTicketNumber(editTicketUrl) && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-muted-foreground">티켓 번호:</span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-xs font-mono font-semibold text-primary dark:bg-primary/20">
                        #{extractTicketNumber(editTicketUrl)}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">설명</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="작업에 대한 설명을 입력하세요"
                  className="text-sm resize-none min-h-[80px]"
                  data-testid="input-edit-description"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">우선순위</label>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger className="text-sm" data-testid="select-edit-priority">
                    <SelectValue placeholder="우선순위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  data-testid="button-cancel-edit"
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim() || (!isTodo && !editTicketUrl.trim())}
                  data-testid="button-save-edit"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-bold leading-tight" data-testid="text-detail-title">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed" data-testid="text-detail-desc">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {!isTodo && (
                  <a
                    href={task.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium transition-colors hover:underline"
                    data-testid="link-detail-ticket"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {repoPath}/issues/{ticketNumber}
                  </a>
                )}
                <span className="text-xs text-muted-foreground" data-testid="text-detail-date">
                  {formatDate(task.createdAt)}
                </span>
              </div>
            </>
          )}

          <Separator />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <GitPullRequest className="w-4 h-4 text-muted-foreground" />
                Pull Request
              </h3>
              {!task.prUrl && !showPrInput && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrInput(true)}
                  data-testid="button-add-pr"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  PR 추가
                </Button>
              )}
            </div>

            {showPrInput && (
              <div className="flex gap-2 mb-3">
                <Input
                  value={prUrlInput}
                  onChange={(e) => setPrUrlInput(e.target.value)}
                  placeholder="https://github.com/org/repo/pull/123"
                  className="text-sm flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && prUrlInput.trim()) {
                      onUpdateTask(task.id, { prUrl: prUrlInput.trim() });
                      setPrUrlInput("");
                      setShowPrInput(false);
                    }
                  }}
                  data-testid="input-pr-url"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (prUrlInput.trim()) {
                      onUpdateTask(task.id, { prUrl: prUrlInput.trim() });
                      setPrUrlInput("");
                      setShowPrInput(false);
                    }
                  }}
                  disabled={!prUrlInput.trim()}
                  data-testid="button-save-pr"
                >
                  저장
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPrUrlInput("");
                    setShowPrInput(false);
                  }}
                  data-testid="button-cancel-pr"
                >
                  취소
                </Button>
              </div>
            )}

            {task.prUrl ? (
              <div className="flex items-center gap-2 p-2.5 rounded-md border" data-testid="card-pr-url">
                <GitPullRequest className="w-4 h-4 text-primary shrink-0" />
                <a
                  href={task.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-medium truncate flex-1 hover:underline"
                  data-testid="link-pr-url"
                >
                  {task.prUrl.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onUpdateTask(task.id, { prUrl: null })}
                  data-testid="button-remove-pr"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : !showPrInput ? (
              <p className="text-xs text-muted-foreground py-2">등록된 PR이 없습니다</p>
            ) : null}
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <Crown className="w-4 h-4 text-violet-500" />
                Epic 관리
              </h3>
              <Button
                variant={task.isEpic ? "default" : "outline"}
                size="sm"
                className={cn(task.isEpic && "bg-violet-600 hover:bg-violet-700")}
                onClick={() => onUpdateTask(task.id, { isEpic: !task.isEpic })}
                data-testid="button-toggle-epic"
              >
                <Crown className="w-3.5 h-3.5 mr-1" />
                {task.isEpic ? "Epic 해제" : "Epic 지정"}
              </Button>
            </div>

            {epicTask && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1.5">소속 Epic:</p>
                <div
                  className="flex items-center gap-2 p-2.5 rounded-md border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/20 hover-elevate cursor-pointer"
                  onClick={() => onSelectRelated(epicTask)}
                  data-testid="card-parent-epic"
                >
                  <Crown className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  <span className={cn("text-xs font-mono font-semibold shrink-0", epicTask.ticketUrl ? "text-primary" : "text-amber-600 dark:text-amber-400")}>
                    {getTaskLabel(epicTask)}
                  </span>
                  <span className="text-xs truncate flex-1">{epicTask.title}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTask(task.id, { parentEpicId: null });
                    }}
                    data-testid="button-remove-parent-epic"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {!epicTask && !task.isEpic && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1.5">Epic에 연결:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {allTasks.filter(t => t.isEpic && t.id !== task.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">Epic 티켓이 없습니다. 먼저 Epic을 지정하세요.</p>
                  ) : (
                    allTasks.filter(t => t.isEpic && t.id !== task.id).map(epic => (
                      <div
                        key={epic.id}
                        className="flex items-center gap-2 p-2 rounded-md hover-elevate cursor-pointer"
                        onClick={() => onUpdateTask(task.id, { parentEpicId: epic.id })}
                        data-testid={`button-set-epic-${epic.id}`}
                      >
                        <Crown className="w-3 h-3 text-violet-500 shrink-0" />
                        <span className={cn("text-xs font-mono font-semibold shrink-0", epic.ticketUrl ? "text-primary" : "text-amber-600 dark:text-amber-400")}>
                          {getTaskLabel(epic)}
                        </span>
                        <span className="text-xs truncate">{epic.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {task.isEpic && (
              <div>
                <div
                  className="flex items-center gap-1.5 cursor-pointer mb-2"
                  onClick={() => setEpicTreeExpanded(!epicTreeExpanded)}
                  data-testid="button-toggle-tree"
                >
                  {epicTreeExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span className="text-xs font-medium text-muted-foreground">
                    하위 작업 ({childTasks.length})
                  </span>
                </div>

                {epicTreeExpanded && (
                  <div className="ml-2 border-l-2 border-violet-200 dark:border-violet-800 pl-3 space-y-1.5">
                    {childTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">하위 작업이 없습니다</p>
                    ) : (
                      childTasks.map(child => {
                        const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
                          backlog: { icon: Inbox, color: "text-muted-foreground" },
                          in_progress: { icon: PlayCircle, color: "text-blue-500" },
                          review: { icon: Eye, color: "text-orange-500" },
                          completed: { icon: CheckCircle2, color: "text-primary" },
                        };
                        const sc = statusConfig[child.status] || statusConfig.backlog;
                        const StatusIcon = sc.icon;
                        return (
                          <div
                            key={child.id}
                            className="flex items-center gap-2 p-2 rounded-md border hover-elevate cursor-pointer group"
                            onClick={() => onSelectRelated(child)}
                            data-testid={`card-child-task-${child.id}`}
                          >
                            <TreePine className="w-3 h-3 text-violet-400 shrink-0" />
                            <StatusIcon className={cn("w-3.5 h-3.5 shrink-0", sc.color)} />
                            <span className={cn("text-xs font-mono font-semibold shrink-0", child.ticketUrl ? "text-primary" : "text-amber-600 dark:text-amber-400")}>
                              {getTaskLabel(child)}
                            </span>
                            <span className={cn("text-xs truncate flex-1", child.status === "completed" && "line-through text-muted-foreground")}>{child.title}</span>
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] shrink-0", getPriorityConfig(child.priority).className)}
                            >
                              {getPriorityConfig(child.priority).label}
                            </Badge>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 w-6 h-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateTask(child.id, { parentEpicId: null });
                              }}
                              data-testid={`button-remove-child-${child.id}`}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        );
                      })
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setShowChildPicker(!showChildPicker)}
                      data-testid="button-add-child"
                    >
                      {showChildPicker ? "닫기" : (
                        <>
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          하위 작업 추가
                        </>
                      )}
                    </Button>

                    {showChildPicker && (
                      <div className="space-y-1 max-h-40 overflow-y-auto mt-2">
                        {allTasks
                          .filter(t => t.id !== task.id && !t.isEpic && !t.parentEpicId)
                          .map(t => (
                            <div
                              key={t.id}
                              className="flex items-center gap-2 p-2 rounded-md hover-elevate cursor-pointer"
                              onClick={() => {
                                onUpdateTask(t.id, { parentEpicId: task.id });
                                setShowChildPicker(false);
                              }}
                              data-testid={`button-assign-child-${t.id}`}
                            >
                              <span className={cn("text-xs font-mono font-semibold shrink-0", t.ticketUrl ? "text-primary" : "text-amber-600 dark:text-amber-400")}>
                                {getTaskLabel(t)}
                              </span>
                              <span className="text-xs truncate">{t.title}</span>
                            </div>
                          ))}
                        {allTasks.filter(t => t.id !== task.id && !t.isEpic && !t.parentEpicId).length === 0 && (
                          <p className="text-xs text-muted-foreground py-2">추가할 수 있는 작업이 없습니다</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                연관 작업
                {relatedTasks.length > 0 && (
                  <span className="text-xs text-muted-foreground font-normal">
                    ({relatedTasks.length})
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowRelationPicker(!showRelationPicker);
                    setShowNewRelationForm(false);
                  }}
                  data-testid="button-add-relation"
                >
                  {showRelationPicker ? "닫기" : "기존 작업"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewRelationForm(!showNewRelationForm);
                    setShowRelationPicker(false);
                  }}
                  data-testid="button-new-relation"
                >
                  {showNewRelationForm ? "닫기" : "새로 등록"}
                </Button>
              </div>
            </div>

            {showRelationPicker && (
              <Card className="mb-3 p-3">
                <p className="text-xs text-muted-foreground mb-2">기존 작업에서 선택하세요</p>
                {availableForRelation.length === 0 ? (
                  <p className="text-xs text-muted-foreground">추가 가능한 작업이 없습니다</p>
                ) : (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {availableForRelation.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-md hover-elevate active-elevate-2 cursor-pointer"
                        onClick={() => {
                          onAddRelation(task.id, t.id);
                          setShowRelationPicker(false);
                        }}
                        data-testid={`button-relate-${t.id}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn("text-xs font-mono font-semibold shrink-0", t.ticketUrl ? "text-primary" : "text-amber-600 dark:text-amber-400")}>
                            {getTaskLabel(t)}
                          </span>
                          <span className="text-xs truncate">{t.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {showNewRelationForm && (
              <Card className="mb-3 p-3 space-y-3">
                <p className="text-xs text-muted-foreground">새 연관 작업을 직접 등록하세요</p>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">제목</label>
                  <Input
                    value={newRelTitle}
                    onChange={(e) => setNewRelTitle(e.target.value)}
                    placeholder="연관 작업 제목"
                    className="text-sm"
                    data-testid="input-new-rel-title"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">티켓 URL</label>
                  <Input
                    value={newRelTicketUrl}
                    onChange={(e) => setNewRelTicketUrl(e.target.value)}
                    placeholder="https://oss.fin.navercorp.com/.../issues/1234"
                    className="text-sm"
                    data-testid="input-new-rel-ticket-url"
                  />
                  {extractTicketNumber(newRelTicketUrl) && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-muted-foreground">티켓 번호:</span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-xs font-mono font-semibold text-primary dark:bg-primary/20">
                        #{extractTicketNumber(newRelTicketUrl)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">우선순위</label>
                  <Select value={newRelPriority} onValueChange={setNewRelPriority}>
                    <SelectTrigger className="text-sm" data-testid="select-new-rel-priority">
                      <SelectValue placeholder="우선순위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewRelationForm(false);
                      setNewRelTitle("");
                      setNewRelTicketUrl("");
                      setNewRelPriority("medium");
                    }}
                    data-testid="button-cancel-new-rel"
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    disabled={!newRelTitle.trim() || !newRelTicketUrl.trim() || isCreatingRelation}
                    onClick={() => {
                      const ticketNum = extractTicketNumber(newRelTicketUrl);
                      onCreateAndRelate(task.id, {
                        title: newRelTitle.trim(),
                        ticketUrl: newRelTicketUrl.trim(),
                        ticketNumber: ticketNum || newRelTicketUrl.trim(),
                        priority: newRelPriority,
                      });
                      setNewRelTitle("");
                      setNewRelTicketUrl("");
                      setNewRelPriority("medium");
                      setShowNewRelationForm(false);
                    }}
                    data-testid="button-save-new-rel"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    등록
                  </Button>
                </div>
              </Card>
            )}

            {relatedTasks.length === 0 && !showRelationPicker ? (
              <p className="text-xs text-muted-foreground py-2">연관된 작업이 없습니다</p>
            ) : (
              <div className="space-y-2">
                {relatedTasks.map((rt) => (
                  <div
                    key={rt.id}
                    className="flex items-center gap-2 p-2.5 rounded-md border hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`card-related-${rt.id}`}
                  >
                    <div
                      className="flex items-center gap-2 flex-1 min-w-0"
                      onClick={() => onSelectRelated(rt)}
                    >
                      <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded shrink-0", rt.ticketUrl ? "bg-primary/10 dark:bg-primary/20" : "bg-amber-100 dark:bg-amber-900/30")}>
                        <span className={cn("text-xs font-mono font-semibold", rt.ticketUrl ? "text-primary" : "text-amber-600 dark:text-amber-400")}>
                          {getTaskLabel(rt)}
                        </span>
                      </div>
                      <span className="text-xs truncate">{rt.title}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] shrink-0", getPriorityConfig(rt.priority).className)}
                      >
                        {getPriorityConfig(rt.priority).label}
                      </Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRelation(task.id, rt.id);
                      }}
                      data-testid={`button-unlink-${rt.id}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              메모
              {comments.length > 0 && (
                <span className="text-xs text-muted-foreground font-normal">
                  ({comments.length})
                </span>
              )}
            </h3>

            <div className="space-y-3 mb-4">
              {comments.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">아직 메모가 없습니다</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="group/comment p-3 rounded-md border"
                    data-testid={`card-comment-${comment.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
                        {comment.content}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0 invisible group-hover/comment:visible"
                        onClick={() => onDeleteComment(comment.id)}
                        data-testid={`button-delete-comment-${comment.id}`}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1.5 block">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="메모를 작성하세요..."
                className="text-sm resize-none min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSubmitComment();
                  }
                }}
                data-testid="input-comment"
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isAddingComment}
                size="sm"
                data-testid="button-submit-comment"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
