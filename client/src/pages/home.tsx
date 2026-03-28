import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, Comment, TaskRelation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowUpDown,
  Inbox,
  PlayCircle,
  FileText,
  Eye,
  Terminal,
  Crown,
  TreePine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { extractTicketNumber, getPriorityConfig } from "@/lib/utils";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("in_progress");
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

  const getChildTasks = (taskId: number) =>
    tasks.filter((t) => t.parentEpicId === taskId);

  const getEpicTask = (parentEpicId: number | null) =>
    parentEpicId ? tasks.find((t) => t.id === parentEpicId) || null : null;

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

              <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-md" />
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
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
                <div className="space-y-2">
                  {filteredTasks.map((task) => renderTaskItem(task))}
                </div>
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
