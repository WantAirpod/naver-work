import { useState, useMemo } from "react";
import type { Task } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Copy,
  Check,
  Plus,
  X,
  Inbox,
  PlayCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { extractTicketNumber, cn } from "@/lib/utils";

interface ReportGroup {
  id: string;
  label: string;
  taskIds: number[];
}

type SectionKey = "backlog" | "progress" | "review" | "done";

interface WeeklyReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
}

const SECTION_CONFIG: Record<SectionKey, { title: string; emoji: string; icon: typeof Inbox }> = {
  done: { title: "Done (최근 1주 완료)", emoji: "✅", icon: CheckCircle2 },
  review: { title: "Review (검토 중)", emoji: "👀", icon: Eye },
  progress: { title: "In Progress (작업 중)", emoji: "🔧", icon: PlayCircle },
  backlog: { title: "Backlog (진행 전)", emoji: "📋", icon: Inbox },
};

export function WeeklyReport({ open, onOpenChange, tasks }: WeeklyReportProps) {
  const [weeklyFocus, setWeeklyFocus] = useState("");
  const [copied, setCopied] = useState(false);

  const oneWeekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const doneTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.status === "completed" &&
          t.completedAt &&
          new Date(t.completedAt) >= oneWeekAgo
      ),
    [tasks, oneWeekAgo]
  );

  const reviewTasks = useMemo(
    () => tasks.filter((t) => t.status === "review"),
    [tasks]
  );

  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.status === "in_progress"),
    [tasks]
  );

  const backlogTasks = useMemo(
    () => tasks.filter((t) => t.status === "backlog"),
    [tasks]
  );

  const sectionTasks: Record<SectionKey, Task[]> = {
    done: doneTasks,
    review: reviewTasks,
    progress: inProgressTasks,
    backlog: backlogTasks,
  };

  const [sectionGroups, setSectionGroups] = useState<Record<SectionKey, ReportGroup[]>>({
    done: [{ id: "done-1", label: "", taskIds: [] }],
    review: [{ id: "review-1", label: "", taskIds: [] }],
    progress: [{ id: "prog-1", label: "", taskIds: [] }],
    backlog: [{ id: "backlog-1", label: "", taskIds: [] }],
  });

  const resetState = () => {
    setWeeklyFocus("");
    setCopied(false);
    setSectionGroups({
      done: [{ id: "done-1", label: "", taskIds: doneTasks.map(t => t.id) }],
      review: [{ id: "review-1", label: "", taskIds: reviewTasks.map(t => t.id) }],
      progress: [{ id: "prog-1", label: "", taskIds: inProgressTasks.map(t => t.id) }],
      backlog: [{ id: "backlog-1", label: "", taskIds: backlogTasks.map(t => t.id) }],
    });
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const addGroup = (section: SectionKey) => {
    const id = `${section}-${Date.now()}`;
    setSectionGroups(prev => ({
      ...prev,
      [section]: [...prev[section], { id, label: "", taskIds: [] }],
    }));
  };

  const removeGroup = (section: SectionKey, groupId: string) => {
    setSectionGroups(prev => ({
      ...prev,
      [section]: prev[section].filter(g => g.id !== groupId),
    }));
  };

  const updateGroupLabel = (section: SectionKey, groupId: string, label: string) => {
    setSectionGroups(prev => ({
      ...prev,
      [section]: prev[section].map(g => g.id === groupId ? { ...g, label } : g),
    }));
  };

  const toggleTaskInGroup = (section: SectionKey, groupId: string, taskId: number) => {
    setSectionGroups(prev => ({
      ...prev,
      [section]: prev[section].map(g => {
        if (g.id === groupId) {
          const has = g.taskIds.includes(taskId);
          return { ...g, taskIds: has ? g.taskIds.filter(id => id !== taskId) : [...g.taskIds, taskId] };
        }
        return g;
      }),
    }));
  };

  const isTaskAssigned = (section: SectionKey, taskId: number, excludeGroupId?: string) => {
    return sectionGroups[section].some(g => g.id !== excludeGroupId && g.taskIds.includes(taskId));
  };

  const generateReport = () => {
    let report = "";
    report += "## \uD83C\uDFAF Weekly Focus\n";
    if (weeklyFocus.trim()) {
      report += weeklyFocus.trim() + "\n";
    }
    report += "\n";

    const sections: { key: SectionKey; emoji: string; title: string }[] = [
      { key: "done", emoji: "\u2705", title: "Done" },
      { key: "review", emoji: "\uD83D\uDC40", title: "Review" },
      { key: "progress", emoji: "\uD83D\uDD27", title: "In Progress" },
      { key: "backlog", emoji: "\uD83D\uDCCB", title: "Backlog" },
    ];

    for (const sec of sections) {
      const groups = sectionGroups[sec.key];
      const hasContent = groups.some(g => g.taskIds.length > 0);
      if (!hasContent) continue;

      report += `## ${sec.emoji} ${sec.title}\n`;
      groups.forEach(group => {
        if (group.taskIds.length === 0) return;
        const label = group.label.trim() || "기타";
        report += `- ${label}\n`;
        group.taskIds.forEach(taskId => {
          const task = sectionTasks[sec.key].find(t => t.id === taskId);
          if (task) {
            const desc = task.description?.trim() || task.title;
            report += `    - ${task.ticketUrl}\n`;
            report += `       ${desc}\n`;
          }
        });
      });
      report += "\n";
    }

    return report;
  };

  const handleCopy = async () => {
    const report = generateReport();
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderGroupSection = (
    section: SectionKey,
    groups: ReportGroup[],
    availableTasks: Task[]
  ) => (
    <div className="space-y-3">
      {groups.map((group, idx) => (
        <Card key={group.id} className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={group.label}
              onChange={(e) => updateGroupLabel(section, group.id, e.target.value)}
              placeholder="그룹명 입력 (예: 카드 결제 개발)"
              className="text-sm flex-1"
              data-testid={`input-group-label-${section}-${idx}`}
            />
            {groups.length > 1 && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeGroup(section, group.id)}
                data-testid={`button-remove-group-${section}-${idx}`}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {availableTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">해당 작업이 없습니다</p>
            ) : (
              availableTasks.map((task) => {
                const isInThisGroup = group.taskIds.includes(task.id);
                const isInOtherGroup = isTaskAssigned(section, task.id, group.id);
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                      isInThisGroup
                        ? "bg-primary/10 dark:bg-primary/20"
                        : isInOtherGroup
                        ? "opacity-40"
                        : "hover-elevate"
                    )}
                    onClick={() => {
                      if (!isInOtherGroup || isInThisGroup) {
                        toggleTaskInGroup(section, group.id, task.id);
                      }
                    }}
                    data-testid={`task-toggle-${section}-${task.id}`}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors",
                        isInThisGroup
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/40"
                      )}
                    >
                      {isInThisGroup && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className="text-xs font-mono text-primary font-semibold shrink-0">
                      #{extractTicketNumber(task.ticketUrl)}
                    </span>
                    <span className="text-xs truncate">{task.title}</span>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addGroup(section)}
        className="w-full"
        data-testid={`button-add-group-${section}`}
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        그룹 추가
      </Button>
    </div>
  );

  const preview = generateReport();

  const sectionOrder: SectionKey[] = ["done", "review", "progress", "backlog"];

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">주간 리포트 생성</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Weekly Focus</label>
            <Textarea
              value={weeklyFocus}
              onChange={(e) => setWeeklyFocus(e.target.value)}
              placeholder="이번 주 주요 목표를 입력하세요"
              className="resize-none min-h-[60px]"
              data-testid="input-weekly-focus"
            />
          </div>

          {sectionOrder.map((sectionKey) => {
            const config = SECTION_CONFIG[sectionKey];
            const tasks = sectionTasks[sectionKey];
            const groups = sectionGroups[sectionKey];
            const Icon = config.icon;
            return (
              <div key={sectionKey}>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    {config.title}
                  </label>
                  <Badge variant="secondary" className="text-xs">{tasks.length}건</Badge>
                </div>
                {renderGroupSection(sectionKey, groups, tasks)}
              </div>
            );
          })}

          <Separator />

          <div>
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <label className="text-sm font-semibold">미리보기</label>
              <Button
                size="sm"
                onClick={handleCopy}
                data-testid="button-copy-report"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    클립보드 복사
                  </>
                )}
              </Button>
            </div>
            <pre
              className="text-xs bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed"
              data-testid="text-report-preview"
            >
              {preview}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
