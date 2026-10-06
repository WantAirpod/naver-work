import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, Comment, TaskRelation, TaskPr } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { TaskCard } from "@/components/task-card";
import { TaskDetail } from "@/components/task-detail";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { WeatherClock } from "@/components/weather-clock";
import { FavoriteLinks } from "@/components/favorite-links";
import { ReplitUsage } from "@/components/replit-usage";
import { WeeklyReport } from "@/components/weekly-report";
import {
  Plus,
  Search,
  ListTodo,
  CheckCircle2,
  LayoutGrid,
  GripVertical,
  Inbox,
  PlayCircle,
  FileText,
  Eye,
  Terminal,
  Crown,
  TreePine,
  Rocket,
  Building2,
  GitPullRequest,
  Link2,
  MessageSquare,
  Columns3,
  List,
} from "lucide-react";
import { cn, extractTicketNumber, getPriorityConfig } from "@/lib/utils";
import { Link } from "wouter";

const DEMO_IN_PROGRESS_TASKS: Task[] = [
  { id: -1, title: "결제 내역 조회 응답 개선", ticketUrl: "https://example.com/issues/1842", referenceUrl: null, ticketNumber: "1842", description: "조회 결과에 결제 상태와 처리 시간을 함께 노출합니다. 예외 응답 문구와 프론트 표시 방식도 정리 중입니다.", status: "in_progress", priority: "high", sortOrder: 0, prUrl: null, isEpic: false, parentEpicId: null, deployDate: null, milestoneRegistered: false, qaCompleted: false, codeReviewCompleted: false, createdAt: new Date(), completedAt: null },
  { id: -2, title: "관리자 화면 검색 조건 추가", ticketUrl: "https://example.com/issues/1857", referenceUrl: null, ticketNumber: "1857", description: "기간과 상태를 조합해 조회할 수 있도록 검색 조건을 추가합니다. API 연동 후 빈 결과와 오류 상태를 확인할 예정입니다.", status: "in_progress", priority: "medium", sortOrder: 1, prUrl: null, isEpic: false, parentEpicId: null, deployDate: null, milestoneRegistered: false, qaCompleted: false, codeReviewCompleted: false, createdAt: new Date(), completedAt: null },
  { id: -3, title: "배치 작업 실패 알림 정비", ticketUrl: "https://example.com/issues/1861", referenceUrl: null, ticketNumber: "1861", description: "실패 원인과 재처리 여부를 알림에 포함합니다. 운영 알림 채널과 임계값도 함께 점검하고 있습니다.", status: "in_progress", priority: "medium", sortOrder: 2, prUrl: null, isEpic: false, parentEpicId: null, deployDate: null, milestoneRegistered: false, qaCompleted: false, codeReviewCompleted: false, createdAt: new Date(), completedAt: null },
  { id: -4, title: "월간 운영 리포트 자동화", ticketUrl: null, referenceUrl: null, ticketNumber: "TODO", description: "월말 지표를 집계해 공유용 문서를 자동으로 만들도록 구성합니다. 먼저 필요한 지표와 데이터 출처를 확정합니다.", status: "in_progress", priority: "low", sortOrder: 3, prUrl: null, isEpic: false, parentEpicId: null, deployDate: null, milestoneRegistered: false, qaCompleted: false, codeReviewCompleted: false, createdAt: new Date(), completedAt: null },
];

const DEMO_BOARD_TASKS: Task[] = DEMO_IN_PROGRESS_TASKS.map((task, index) => ({
  ...task,
  status: (["backlog", "in_progress", "review", "completed"] as const)[index],
  title: ["요구사항 및 일정 정리", "결제 내역 조회 응답 개선", "관리자 검색 조건 코드 리뷰", "지난 배포 내역 정리"][index],
}));

export default function Home() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("in_progress");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [completedFilter, setCompletedFilter] = useState<"7d" | "30d" | "all">("30d");
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null);
  const [expandedEpics, setExpandedEpics] = useState<Set<number>>(new Set());
  const dragCounter = useRef(0);

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/comments"],
  });

  const { data: relations = [] } = useQuery<TaskRelation[]>({
    queryKey: ["/api/relations"],
  });

  const { data: taskPrs = [] } = useQuery<TaskPr[]>({
    queryKey: ["/api/task-prs"],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/tasks", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setCreateDialogOpen(false);
      toast({ title: "작업이 추가되었습니다" });
    },
    onError: () => {
      toast({ title: "작업 추가에 실패했습니다", variant: "destructive" });
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await apiRequest("PATCH", `/api/tasks/${taskId}`, { status: "completed" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "작업이 완료되었습니다" });
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${taskId}`, { status });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      const labels: Record<string, string> = {
        backlog: "진행 전으로 이동했습니다",
        in_progress: "작업 중으로 이동했습니다",
        review: "검토 중으로 이동했습니다",
        completed: "작업이 완료되었습니다",
      };
      toast({ title: labels[variables.status] || "상태가 변경되었습니다" });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/relations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/task-prs"] });
      setSelectedTask(null);
      toast({ title: "작업이 삭제되었습니다" });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ taskId, content }: { taskId: number; content: string }) => {
      const res = await apiRequest("POST", "/api/comments", { taskId, content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("DELETE", `/api/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, data }: { taskId: number; data: Record<string, any> }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${taskId}`, data);
      return res.json();
    },
    onSuccess: (updatedTask: Task) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      if (selectedTask && updatedTask.id === selectedTask.id) {
        setSelectedTask(updatedTask);
      }
      toast({ title: "작업이 업데이트되었습니다" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderedIds: number[]) => {
      await apiRequest("PUT", "/api/tasks/reorder", { orderedIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const addPrMutation = useMutation({
    mutationFn: async ({ taskId, url }: { taskId: number; url: string }) => {
      const res = await apiRequest("POST", "/api/task-prs", { taskId, url });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-prs"] });
      toast({ title: "PR이 추가되었습니다" });
    },
    onError: () => {
      toast({ title: "PR 추가에 실패했습니다", variant: "destructive" });
    },
  });

  const removePrMutation = useMutation({
    mutationFn: async (prId: number) => {
      await apiRequest("DELETE", `/api/task-prs/${prId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-prs"] });
      toast({ title: "PR이 제거되었습니다" });
    },
  });

  const togglePrReviewedMutation = useMutation({
    mutationFn: async ({ prId, reviewed }: { prId: number; reviewed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/task-prs/${prId}`, { reviewed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/task-prs"] });
    },
  });

  const addRelationMutation = useMutation({
    mutationFn: async ({ sourceTaskId, targetTaskId }: { sourceTaskId: number; targetTaskId: number }) => {
      const res = await apiRequest("POST", "/api/relations", { sourceTaskId, targetTaskId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relations"] });
      toast({ title: "연관 작업이 추가되었습니다" });
    },
  });

  const createAndRelateMutation = useMutation({
    mutationFn: async ({ sourceTaskId, data }: { sourceTaskId: number; data: { title: string; ticketUrl: string; ticketNumber: string; priority: string } }) => {
      const taskRes = await apiRequest("POST", "/api/tasks", data);
      const newTask = await taskRes.json();
      await apiRequest("POST", "/api/relations", { sourceTaskId, targetTaskId: newTask.id });
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/relations"] });
      toast({ title: "연관 작업이 등록되었습니다" });
    },
    onError: () => {
      toast({ title: "연관 작업 등록에 실패했습니다", variant: "destructive" });
    },
  });

  const removeRelationMutation = useMutation({
    mutationFn: async ({ sourceTaskId, targetTaskId }: { sourceTaskId: number; targetTaskId: number }) => {
      await apiRequest("DELETE", `/api/relations/${sourceTaskId}/${targetTaskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relations"] });
      toast({ title: "연관 작업이 제거되었습니다" });
    },
  });

  const toggleEpicExpanded = useCallback((epicId: number) => {
    setExpandedEpics(prev => {
      const next = new Set(prev);
      if (next.has(epicId)) {
        next.delete(epicId);
      } else {
        next.add(epicId);
      }
      return next;
    });
  }, []);

  const filteredTasks = useMemo(() => {
    const statusFilter = activeTab;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return tasks
        .filter((t) => t.status === statusFilter)
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.ticketNumber.includes(q) ||
            t.description?.toLowerCase().includes(q)
        );
    }

    const tasksInTab = tasks.filter((t) => t.status === statusFilter);
    const topLevel = tasksInTab.filter((t) => !t.parentEpicId);

    const childrenInTab = tasksInTab.filter((t) => t.parentEpicId);
    const epicParentIds = new Set(childrenInTab.map((t) => t.parentEpicId!));
    const missingEpicParents = tasks.filter(
      (t) => epicParentIds.has(t.id) && t.isEpic && t.status !== statusFilter && !topLevel.some((tl) => tl.id === t.id)
    );

    return [...topLevel, ...missingEpicParents];
  }, [tasks, activeTab, searchQuery]);

  const getChildTasksInTab = useCallback((epicId: number) => {
    return tasks.filter(t => t.parentEpicId === epicId && (
      (activeTab === "backlog" && t.status === "backlog") ||
      (activeTab === "in_progress" && t.status === "in_progress") ||
      (activeTab === "review" && t.status === "review") ||
      (activeTab === "completed" && t.status === "completed")
    ));
  }, [tasks, activeTab]);

  const getAllChildTasks = useCallback((epicId: number) => {
    return tasks.filter(t => t.parentEpicId === epicId);
  }, [tasks]);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: number) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(taskId));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback((taskId: number) => {
    dragCounter.current++;
    setDragOverTaskId(taskId);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverTaskId(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetTaskId: number) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverTaskId(null);
    setDraggedTaskId(null);

    if (draggedTaskId === null || draggedTaskId === targetTaskId) return;

    const currentOrder = filteredTasks.map(t => t.id);
    const fromIndex = currentOrder.indexOf(draggedTaskId);
    const toIndex = currentOrder.indexOf(targetTaskId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newOrder = [...currentOrder];
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedTaskId);

    reorderMutation.mutate(newOrder);
  }, [draggedTaskId, filteredTasks, reorderMutation]);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
    dragCounter.current = 0;
  }, []);

  const backlogTasks = tasks.filter((t) => t.status === "backlog");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const reviewTasks = tasks.filter((t) => t.status === "review");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const visibleCompletedTasks = useMemo(() => {
    if (completedFilter === "all") return completedTasks;
    const limit = new Date();
    limit.setDate(limit.getDate() - (completedFilter === "7d" ? 7 : 30));
    return completedTasks.filter((task) => task.completedAt && new Date(task.completedAt) >= limit);
  }, [completedTasks, completedFilter]);

  const getCommentsForTask = (taskId: number) =>
    comments.filter((c) => c.taskId === taskId);

  const getRelatedTasks = (taskId: number) => {
    const relatedIds = relations
      .filter((r) => r.sourceTaskId === taskId || r.targetTaskId === taskId)
      .map((r) => (r.sourceTaskId === taskId ? r.targetTaskId : r.sourceTaskId));
    return tasks.filter((t) => relatedIds.includes(t.id));
  };

  const getRelatedCount = (taskId: number) =>
    relations.filter((r) => r.sourceTaskId === taskId || r.targetTaskId === taskId).length;

  const getPrsForTask = (taskId: number) =>
    taskPrs.filter((p) => p.taskId === taskId);

  const getChildTasks = (taskId: number) =>
    tasks.filter((t) => t.parentEpicId === taskId);

  const getEpicTask = (parentEpicId: number | null) =>
    parentEpicId ? tasks.find((t) => t.id === parentEpicId) || null : null;

  const showingOverviewPreview = activeTab === "in_progress" && !searchQuery.trim() && filteredTasks.length === 0;
  const overviewTasks = showingOverviewPreview ? DEMO_IN_PROGRESS_TASKS : filteredTasks;

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  const showDetail = selectedTask !== null;

  const renderTaskItem = (task: Task, isChild = false) => {
    const childTasksInTab = task.isEpic ? getChildTasksInTab(task.id) : [];
    const allChildren = task.isEpic ? getAllChildTasks(task.id) : [];
    const isExpanded = expandedEpics.has(task.id);

    return (
      <div key={task.id}>
        <div
          draggable={!isChild && activeTab !== "completed" && !searchQuery.trim()}
          onDragStart={!isChild ? (e) => handleDragStart(e, task.id) : undefined}
          onDragOver={!isChild ? handleDragOver : undefined}
          onDragEnter={!isChild ? () => handleDragEnter(task.id) : undefined}
          onDragLeave={!isChild ? handleDragLeave : undefined}
          onDrop={!isChild ? (e) => handleDrop(e, task.id) : undefined}
          onDragEnd={!isChild ? handleDragEnd : undefined}
          className={cn(
            "flex items-stretch gap-0 rounded-md transition-all duration-150",
            !isChild && draggedTaskId === task.id && "opacity-40",
            !isChild && dragOverTaskId === task.id && draggedTaskId !== task.id && "ring-2 ring-primary ring-offset-1 ring-offset-background",
            isChild && "ml-6"
          )}
          data-testid={`draggable-task-${task.id}`}
        >
          {activeTab !== "completed" && !searchQuery.trim() && !isChild && (
            <div
              className="flex items-center px-1 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground shrink-0"
              data-testid={`drag-handle-${task.id}`}
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          {isChild && (
            <div className="flex items-center px-1 shrink-0">
              <TreePine className="w-3.5 h-3.5 text-violet-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <TaskCard
              task={task}
              comments={getCommentsForTask(task.id)}
              relatedCount={getRelatedCount(task.id)}
              prCount={getPrsForTask(task.id).length}
              childCount={allChildren.length}
              isExpanded={isExpanded}
              onToggleExpand={task.isEpic && allChildren.length > 0 ? () => toggleEpicExpanded(task.id) : undefined}
              onSelect={handleSelectTask}
              onComplete={
                activeTab !== "completed"
                  ? (id) => completeTaskMutation.mutate(id)
                  : undefined
              }
              onStartProgress={
                activeTab === "backlog"
                  ? (id) => changeStatusMutation.mutate({ taskId: id, status: "in_progress" })
                  : undefined
              }
              onMoveToBacklog={
                activeTab === "in_progress"
                  ? (id) => changeStatusMutation.mutate({ taskId: id, status: "backlog" })
                  : undefined
              }
              onRestore={
                activeTab === "completed"
                  ? (id) => changeStatusMutation.mutate({ taskId: id, status: "in_progress" })
                  : undefined
              }
              onDelete={
                activeTab === "completed"
                  ? (id) => deleteTaskMutation.mutate(id)
                  : undefined
              }
            />
          </div>
        </div>
        {task.isEpic && isExpanded && childTasksInTab.length > 0 && (
          <div className="space-y-1.5 mt-1.5 mb-2 pl-2 border-l-2 border-violet-200 dark:border-violet-800 ml-4">
            {childTasksInTab.map(child => renderTaskItem(child, true))}
          </div>
        )}
        {task.isEpic && isExpanded && childTasksInTab.length === 0 && allChildren.length > 0 && (
          <div className="ml-10 py-2 text-xs text-muted-foreground">
            이 탭에 해당하는 하위 작업이 없습니다 (전체 {allChildren.length}개)
          </div>
        )}
      </div>
    );
  };

  const renderInProgressOverview = () => (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
        <div>
          <h2 className="text-sm font-semibold">작업 중 한눈에 보기</h2>
          <p className="text-xs text-muted-foreground mt-0.5">행을 누르면 상세 내용을 볼 수 있어요.</p>
        </div>
        <div className="flex items-center gap-2">
          {showingOverviewPreview && <Badge variant="outline" className="text-[10px] text-muted-foreground">예시 데이터</Badge>}
          <Badge variant="secondary">{overviewTasks.length}개</Badge>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-muted/40 text-[11px] text-muted-foreground">
            <tr>
              <th className="w-[78px] px-4 py-2.5 font-medium">우선순위</th>
              <th className="w-[76px] px-2 py-2.5 font-medium">티켓</th>
              <th className="w-[28%] px-3 py-2.5 font-medium">작업명</th>
              <th className="px-3 py-2.5 font-medium">작업 내용</th>
              <th className="w-[105px] px-3 py-2.5 font-medium">활동</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {overviewTasks.map((task, index) => {
          const priority = getPriorityConfig(task.priority);
          const commentCount = showingOverviewPreview ? [3, 1, 4, 0][index] : getCommentsForTask(task.id).length;
          const relatedCount = getRelatedCount(task.id);
          const prCount = showingOverviewPreview ? [1, 0, 2, 0][index] : getPrsForTask(task.id).length;
          const ticketNumber = task.ticketUrl ? extractTicketNumber(task.ticketUrl) : "Todo";

            return (
            <tr
              key={task.id}
              onClick={() => !showingOverviewPreview && handleSelectTask(task)}
              className={cn("transition-colors", showingOverviewPreview ? "" : "cursor-pointer hover:bg-muted/60")}
              data-testid={`overview-task-${task.id}`}
            >
              <td className="px-4 py-3 align-top"><Badge variant="outline" className={cn("px-1.5 text-[10px]", priority.className)}>{priority.label}</Badge></td>
              <td className="px-2 py-3 align-top text-xs font-mono font-semibold text-primary">{task.ticketUrl ? `#${ticketNumber}` : ticketNumber}</td>
              <td className="px-3 py-3 align-top text-sm font-semibold leading-5">{task.title}</td>
              <td className="px-3 py-3 align-top text-xs leading-5 text-muted-foreground">{task.description || "내용 미입력"}</td>
              <td className="px-3 py-3 align-top">
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  {prCount > 0 && <span className="flex items-center gap-1 text-primary"><GitPullRequest className="w-3 h-3" />{prCount}</span>}
                  {commentCount > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{commentCount}</span>}
                  {relatedCount > 0 && <span className="flex items-center gap-1"><Link2 className="w-3 h-3" />{relatedCount}</span>}
                  {prCount === 0 && commentCount === 0 && relatedCount === 0 && <span className="text-muted-foreground/60">-</span>}
                </div>
              </td>
            </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderBoardCard = (task: Task, index: number, isPreview: boolean) => {
    const priority = getPriorityConfig(task.priority);
    const ticketNumber = task.ticketUrl ? extractTicketNumber(task.ticketUrl) : "Todo";
    const commentCount = isPreview ? [1, 3, 2, 0][index % 4] : getCommentsForTask(task.id).length;
    const prCount = isPreview ? [0, 1, 2, 0][index % 4] : getPrsForTask(task.id).length;
    const childTasks = task.isEpic ? tasks.filter((child) => child.parentEpicId === task.id) : [];
    const isExpanded = expandedEpics.has(task.id);

    return (
      <div key={task.id} className="space-y-1.5">
        <button
          type="button"
          onClick={() => !isPreview && handleSelectTask(task)}
          className={cn("w-full rounded-lg border bg-card p-3 text-left shadow-sm transition-colors", isPreview ? "cursor-default" : "hover:border-primary/50 hover:bg-muted/30")}
        >
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className={cn("px-1.5 text-[10px]", priority.className)}>{priority.label}</Badge>
            <span className="text-[10px] font-mono text-primary">{task.ticketUrl ? `#${ticketNumber}` : ticketNumber}</span>
          </div>
          <div className="mt-2 flex items-start gap-1.5">
            {task.isEpic && childTasks.length > 0 && <span className="mt-0.5 text-violet-500">{isExpanded ? "▾" : "▸"}</span>}
            <h3 className="text-sm font-semibold leading-5 line-clamp-2">{task.title}</h3>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground line-clamp-1">{task.description || "내용 미입력"}</p>
          <div className="flex items-center justify-between gap-2 mt-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              {prCount > 0 && <span className="flex items-center gap-1 text-primary"><GitPullRequest className="w-3 h-3" />{prCount}</span>}
              {commentCount > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{commentCount}</span>}
            </div>
            {task.isEpic && childTasks.length > 0 && <span className="text-violet-600">하위 {childTasks.length}</span>}
          </div>
        </button>
        {task.isEpic && childTasks.length > 0 && (
          <button type="button" onClick={() => toggleEpicExpanded(task.id)} className="w-full rounded border border-dashed border-violet-200 px-2 py-1.5 text-xs text-violet-600 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-950/20">
            {isExpanded ? "하위 작업 접기" : `하위 작업 ${childTasks.length}개 펼치기`}
          </button>
        )}
        {task.isEpic && isExpanded && childTasks.length > 0 && (
          <div className="space-y-1.5 border-l-2 border-violet-200 pl-2 dark:border-violet-800">
            {childTasks.map((child) => <button key={child.id} type="button" onClick={() => handleSelectTask(child)} className="w-full rounded border bg-background p-2 text-left hover:border-primary/40"><div className="flex items-center justify-between gap-2"><span className="text-xs font-medium line-clamp-1">{child.title}</span><Badge variant="outline" className="shrink-0 px-1 text-[9px]">{child.status === "backlog" ? "진행 전" : child.status === "in_progress" ? "작업 중" : child.status === "review" ? "검토 중" : "완료"}</Badge></div><p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{child.description || "내용 미입력"}</p></button>)}
          </div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const isPreview = tasks.length === 0;
    const source = isPreview ? DEMO_BOARD_TASKS : tasks;
    const columns = [
      { status: "backlog", label: "진행 전", className: "border-slate-300", tasks: source.filter((task) => task.status === "backlog" && !task.parentEpicId) },
      { status: "in_progress", label: "작업 중", className: "border-primary/40", tasks: source.filter((task) => task.status === "in_progress" && !task.parentEpicId) },
      { status: "review", label: "검토 중", className: "border-orange-300", tasks: source.filter((task) => task.status === "review" && !task.parentEpicId) },
      { status: "completed", label: "완료", className: "border-emerald-300", tasks: (isPreview ? source.filter((task) => task.status === "completed") : visibleCompletedTasks).filter((task) => !task.parentEpicId) },
    ];

    return (
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1000px] grid-cols-4 gap-4">
          {columns.map((column) => (
            <Card key={column.status} className={cn("flex h-[calc(100vh-240px)] min-h-[380px] flex-col border-t-2 bg-muted/20", column.className)}>
              <div className="flex items-center justify-between gap-2 border-b px-3 py-3 bg-card/70">
                <div className="flex items-center gap-2"><h2 className="text-sm font-semibold">{column.label}</h2><Badge variant="secondary" className="text-[10px]">{column.tasks.length}</Badge></div>
                {column.status === "completed" && !isPreview && (
                  <select value={completedFilter} onChange={(event) => setCompletedFilter(event.target.value as "7d" | "30d" | "all")} onClick={(event) => event.stopPropagation()} className="h-7 rounded border bg-background px-1 text-[10px] text-muted-foreground">
                    <option value="7d">최근 7일</option><option value="30d">최근 30일</option><option value="all">전체</option>
                  </select>
                )}
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-2.5">
                {column.tasks.length > 0 ? column.tasks.map((task, index) => renderBoardCard(task, index, isPreview)) : <p className="py-8 text-center text-xs text-muted-foreground">작업이 없습니다</p>}
              </div>
            </Card>
          ))}
        </div>
        {isPreview && <p className="mt-2 text-xs text-muted-foreground">예시 데이터입니다. 실제 작업이 있으면 해당 작업으로 자동 대체됩니다.</p>}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="shrink-0 border-b bg-card" style={{ zIndex: 100 }}>
        <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-6xl mx-auto flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold tracking-tight" data-testid="text-app-title">
              NAVER Work
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/todos">
              <Button variant="outline" size="sm" data-testid="button-todos-link">
                <ListTodo className="w-4 h-4 mr-1" />
                할 일
              </Button>
            </Link>
            <Link href="/quiz">
              <Button
                variant="outline"
                size="sm"
                data-testid="button-quiz-link"
              >
                <Terminal className="w-4 h-4 mr-1" />
                퀴즈
              </Button>
            </Link>
            <Link href="/deploy">
              <Button
                variant="outline"
                size="sm"
                data-testid="button-deploy-link"
              >
                <Rocket className="w-4 h-4 mr-1" />
                배포
              </Button>
            </Link>
            <Link href="/office">
              <Button variant="outline" size="sm" data-testid="button-office-link">
                <Building2 className="w-4 h-4 mr-1" />
                출근
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReportOpen(true)}
              data-testid="button-report"
            >
              <FileText className="w-4 h-4 mr-1" />
              리포트
            </Button>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              data-testid="button-create-task"
            >
              <Plus className="w-4 h-4 mr-1" />
              새 작업
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex">
          <div
            className={cn(
              "flex-1 flex flex-col h-full border-r",
              isMobile && showDetail && "hidden"
            )}
          >
            <div className="p-4 space-y-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="작업 검색... (제목, 티켓번호)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{viewMode === "board" ? "상태별 작업 흐름을 한 화면에서 확인하세요." : "상태별 작업을 목록으로 확인하세요."}</p>
                <div className="flex shrink-0 rounded-md bg-muted p-0.5 text-xs">
                  <button onClick={() => setViewMode("board")} className={cn("flex items-center gap-1 rounded px-2 py-1.5", viewMode === "board" && "bg-background shadow-sm font-semibold")}><Columns3 className="w-3.5 h-3.5" />보드</button>
                  <button onClick={() => setViewMode("list")} className={cn("flex items-center gap-1 rounded px-2 py-1.5", viewMode === "list" && "bg-background shadow-sm font-semibold")}><List className="w-3.5 h-3.5" />목록</button>
                </div>
              </div>

              {viewMode === "list" && <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger
                    value="backlog"
                    className="flex-1 gap-1.5"
                    data-testid="tab-backlog"
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    진행 전
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {backlogTasks.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="in_progress"
                    className="flex-1 gap-1.5"
                    data-testid="tab-in-progress"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    작업 중
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {inProgressTasks.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="review"
                    className="flex-1 gap-1.5"
                    data-testid="tab-review"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    검토 중
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {reviewTasks.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="flex-1 gap-1.5"
                    data-testid="tab-completed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    완료
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {completedTasks.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-md" />
                  ))}
                </div>
              ) : viewMode === "board" ? renderBoard() : filteredTasks.length === 0 && !showingOverviewPreview ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    {activeTab === "backlog" ? (
                      <Inbox className="w-6 h-6 text-muted-foreground" />
                    ) : activeTab === "in_progress" ? (
                      <PlayCircle className="w-6 h-6 text-muted-foreground" />
                    ) : activeTab === "review" ? (
                      <Eye className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {searchQuery
                      ? "검색 결과가 없습니다"
                      : activeTab === "backlog"
                      ? "진행 전 작업이 없습니다"
                      : activeTab === "in_progress"
                      ? "작업 중인 항목이 없습니다"
                      : activeTab === "review"
                      ? "검토 중인 작업이 없습니다"
                      : "완료된 작업이 없습니다"}
                  </p>
                  {!searchQuery && activeTab !== "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setCreateDialogOpen(true)}
                      data-testid="button-empty-create"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      작업 추가하기
                    </Button>
                  )}
                </div>
              ) : (
                activeTab === "in_progress" ? renderInProgressOverview() : (
                  <div className="space-y-2">
                    {filteredTasks.map((task) => renderTaskItem(task))}
                  </div>
                )
              )}
            </div>
          </div>

          <div
            className={cn(
              "w-full md:w-[420px] lg:w-[480px] shrink-0 bg-card",
              isMobile ? (showDetail ? "block" : "hidden") : (showDetail ? "block" : "hidden md:block")
            )}
          >
            {selectedTask ? (
              <TaskDetail
                task={selectedTask}
                comments={getCommentsForTask(selectedTask.id)}
                taskPrs={getPrsForTask(selectedTask.id)}
                relatedTasks={getRelatedTasks(selectedTask.id)}
                allTasks={tasks}
                childTasks={getChildTasks(selectedTask.id)}
                epicTask={getEpicTask(selectedTask.parentEpicId)}
                onBack={() => setSelectedTask(null)}
                onAddComment={(taskId, content) =>
                  addCommentMutation.mutate({ taskId, content })
                }
                onDeleteComment={(commentId) =>
                  deleteCommentMutation.mutate(commentId)
                }
                onComplete={(id) => {
                  completeTaskMutation.mutate(id);
                  setSelectedTask(null);
                }}
                onAddRelation={(sourceId, targetId) =>
                  addRelationMutation.mutate({ sourceTaskId: sourceId, targetTaskId: targetId })
                }
                onRemoveRelation={(sourceId, targetId) =>
                  removeRelationMutation.mutate({ sourceTaskId: sourceId, targetTaskId: targetId })
                }
                onSelectRelated={(task) => setSelectedTask(task)}
                onChangeStatus={(taskId, status) =>
                  changeStatusMutation.mutate({ taskId, status })
                }
                onUpdateTask={(taskId, data) =>
                  updateTaskMutation.mutate({ taskId, data })
                }
                onCreateAndRelate={(sourceTaskId, data) =>
                  createAndRelateMutation.mutate({ sourceTaskId, data })
                }
                onAddPr={(taskId, url) => addPrMutation.mutate({ taskId, url })}
                onRemovePr={(prId) => removePrMutation.mutate(prId)}
                onTogglePrReviewed={(prId, reviewed) =>
                  togglePrReviewedMutation.mutate({ prId, reviewed })
                }
                isAddingComment={addCommentMutation.isPending}
                isCreatingRelation={createAndRelateMutation.isPending}
              />
            ) : (
              !isMobile && (
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <WeatherClock />
                  <FavoriteLinks />
                  <ReplitUsage />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={(data) => createTaskMutation.mutate(data)}
        isPending={createTaskMutation.isPending}
      />

      <WeeklyReport
        open={reportOpen}
        onOpenChange={setReportOpen}
        tasks={tasks}
      />
    </div>
  );
}
