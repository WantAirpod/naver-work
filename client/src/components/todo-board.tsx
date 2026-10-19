import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Todo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Link2, Pencil, Plus, Trash2, X } from "lucide-react";

function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function toYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function moveDate(ymd: string, amount: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);
  return toYmd(date);
}

function formatDateLabel(ymd: string, today: string): string {
  if (ymd === today) return "오늘";
  const [year, month, day] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(new Date(year, month - 1, day));
}

export function TodoBoard() {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<{ id: number; todoDate: string; content: string; description: string; url: string } | null>(null);
  const today = toYmd(new Date());
  const previousDate = moveDate(today, -1);
  const [selectedDate, setSelectedDate] = useState(today);
  const todosQueryKey = ["/api/todos", selectedDate];

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: todosQueryKey,
    queryFn: async () => {
      const res = await fetch(`/api/todos?date=${selectedDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Todo 목록을 불러오지 못했습니다");
      return res.json();
    },
  });

  const { data: previousTodos = [] } = useQuery<Todo[]>({
    queryKey: ["/api/todos", previousDate],
    queryFn: async () => {
      const res = await fetch(`/api/todos?date=${previousDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("이전 Todo 목록을 불러오지 못했습니다");
      return res.json();
    },
    enabled: selectedDate === today,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { content: string; description: string | null; url: string | null; todoDate: string }) => {
      const res = await apiRequest("POST", "/api/todos", data);
      return res.json();
    },
    onSuccess: (todo) => {
      queryClient.setQueryData<Todo[]>(todosQueryKey, (current = []) => [...current, todo]);
      setContent("");
      setDescription("");
      setUrl("");
      setIsAdding(false);
    },
    onError: () => toast({ title: "할 일을 저장하지 못했습니다", variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, { completed });
      return res.json();
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: todosQueryKey });
      const previous = queryClient.getQueryData<Todo[]>(todosQueryKey);
      queryClient.setQueryData<Todo[]>(todosQueryKey, (current = []) => current.map((todo) => todo.id === id ? { ...todo, completed } : todo));
      return { previous };
    },
    onSuccess: (todo) => queryClient.setQueryData<Todo[]>(todosQueryKey, (current = []) => current.map((item) => item.id === todo.id ? todo : item)),
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(todosQueryKey, context?.previous);
      toast({ title: "완료 상태를 저장하지 못했습니다", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, content, description, url }: { id: number; todoDate: string; content: string; description: string | null; url: string | null }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, { content, description, url });
      return res.json() as Promise<Todo>;
    },
    onSuccess: (updated, { todoDate }) => {
      queryClient.setQueryData<Todo[]>(["/api/todos", todoDate], (current = []) => current.map((todo) => todo.id === updated.id ? updated : todo));
      setEditing((current) => current?.id === updated.id ? null : current);
    },
    onError: () => toast({ title: "할 일 수정을 저장하지 못했습니다", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/todos/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todosQueryKey });
      const previous = queryClient.getQueryData<Todo[]>(todosQueryKey);
      queryClient.setQueryData<Todo[]>(todosQueryKey, (current = []) => current.filter((todo) => todo.id !== id));
      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(todosQueryKey, context?.previous);
      toast({ title: "할 일을 삭제하지 못했습니다", variant: "destructive" });
    },
  });

  const carryOverMutation = useMutation({
    mutationFn: async ({ fromDate, toDate }: { fromDate: string; toDate: string }) => {
      const res = await apiRequest("POST", "/api/todos/carry-over", { fromDate, toDate });
      return res.json() as Promise<Todo[]>;
    },
    onMutate: async ({ fromDate, toDate }) => {
      const fromKey = ["/api/todos", fromDate];
      const toKey = ["/api/todos", toDate];
      await Promise.all([queryClient.cancelQueries({ queryKey: fromKey }), queryClient.cancelQueries({ queryKey: toKey })]);
      const previousFrom = queryClient.getQueryData<Todo[]>(fromKey);
      const previousTo = queryClient.getQueryData<Todo[]>(toKey);
      const moving = (previousFrom ?? []).filter((todo) => !todo.completed);
      queryClient.setQueryData<Todo[]>(fromKey, (current = []) => current.filter((todo) => todo.completed));
      queryClient.setQueryData<Todo[]>(toKey, (current = []) => [...current, ...moving.map((todo) => ({ ...todo, todoDate: toDate }))]);
      return { previousFrom, previousTo, fromKey, toKey };
    },
    onSuccess: (moved, { fromDate, toDate }) => {
      const fromKey = ["/api/todos", fromDate];
      const toKey = ["/api/todos", toDate];
      queryClient.setQueryData<Todo[]>(fromKey, (current = []) => current.filter((todo) => todo.completed));
      queryClient.setQueryData<Todo[]>(toKey, (current = []) => {
        const movedIds = new Set(moved.map((todo) => todo.id));
        return [...current.filter((todo) => !movedIds.has(todo.id)), ...moved];
      });
      toast({ title: moved.length ? `${moved.length}건을 선택한 날짜로 전달했습니다` : "전달할 미완료 항목이 없습니다" });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(context?.fromKey ?? todosQueryKey, context?.previousFrom);
      queryClient.setQueryData(context?.toKey ?? todosQueryKey, context?.previousTo);
      toast({ title: "할 일을 내일로 전달하지 못했습니다", variant: "destructive" });
    },
  });

  const handleAdd = () => {
    if (!content.trim()) return;
    createMutation.mutate({ content: content.trim(), description: description.trim() || null, url: normalizeUrl(url), todoDate: selectedDate });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setContent("");
    setDescription("");
    setUrl("");
  };

  const startEdit = (todo: Todo) => {
    setEditing({ id: todo.id, todoDate: todo.todoDate, content: todo.content, description: todo.description ?? "", url: todo.url ?? "" });
  };

  const saveEdit = () => {
    if (!editing?.content.trim() || updateMutation.isPending) return;
    updateMutation.mutate({
      id: editing.id,
      todoDate: editing.todoDate,
      content: editing.content.trim(),
      description: editing.description.trim() || null,
      url: normalizeUrl(editing.url),
    });
  };

  const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));
  const completedCount = todos.filter((todo) => todo.completed).length;
  const previousIncompleteCount = previousTodos.filter((todo) => !todo.completed).length;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            {selectedDate === today ? "오늘 할 일" : `${formatDateLabel(selectedDate, today)} 할 일`}
          </h3>
          {todos.length > 0 && <p className="mt-0.5 text-xs text-muted-foreground">{completedCount}/{todos.length} 완료</p>}
        </div>
        {!isAdding && (
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)} data-testid="button-add-todo">
            <Plus className="w-3.5 h-3.5 mr-1" />추가
          </Button>
        )}
      </div>

      {selectedDate === today && (
        <div className="grid gap-2 sm:grid-cols-2">
          {previousIncompleteCount > 0 && (
            <Button variant="outline" size="sm" className="w-full" onClick={() => carryOverMutation.mutate({ fromDate: previousDate, toDate: today })} disabled={carryOverMutation.isPending} data-testid="button-bring-previous-todos">
              <ChevronRight className="mr-1 h-3.5 w-3.5" />
              어제 미완료 {previousIncompleteCount}건 오늘로 가져오기
            </Button>
          )}
          {todos.some((todo) => !todo.completed) && (
            <Button variant="outline" size="sm" className="w-full" onClick={() => carryOverMutation.mutate({ fromDate: today, toDate: moveDate(today, 1) })} disabled={carryOverMutation.isPending} data-testid="button-carry-over-todos">
              <ChevronRight className="mr-1 h-3.5 w-3.5" />
              미완료 항목 {todos.filter((todo) => !todo.completed).length}건을 내일로 전달
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between rounded-md bg-muted/40 px-1 py-1">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(moveDate(selectedDate, -1))} aria-label="이전 날짜" data-testid="button-todo-prev-date">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
          <label className="relative cursor-pointer text-sm font-medium">
            {formatDateLabel(selectedDate, today)}
            <input type="date" value={selectedDate} onChange={(event) => event.target.value && setSelectedDate(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Todo 날짜 선택" data-testid="input-todo-date" />
          </label>
          {selectedDate !== today && (
            <Button variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedDate(today)}>오늘</Button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(moveDate(selectedDate, 1))} aria-label="다음 날짜" data-testid="button-todo-next-date">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <Input value={content} onChange={(event) => setContent(event.target.value)} placeholder="제목" aria-label="할 일 제목" autoFocus data-testid="input-new-todo" />
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="내용 (선택)" aria-label="할 일 내용" className="min-h-[80px] resize-y" data-testid="input-todo-description" />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleAdd();
                  if (event.key === "Escape") cancelAdd();
                }}
                placeholder="관련 URL (선택)"
                className="pl-8"
                data-testid="input-todo-url"
              />
            </div>
            <Button size="icon" onClick={handleAdd} disabled={!content.trim() || createMutation.isPending} data-testid="button-save-todo"><Plus className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" onClick={cancelAdd} data-testid="button-cancel-todo"><X className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {todos.length === 0 && !isAdding ? (
        <button type="button" onClick={() => setIsAdding(true)} className="w-full rounded-md border border-dashed py-5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
          오늘 처리할 일을 추가해 보세요
        </button>
      ) : (
        <div className="divide-y rounded-md border">
          {sortedTodos.map((todo) => (
            <div key={todo.id} className="group px-3 py-2.5" data-testid={`todo-${todo.id}`}>
              {editing?.id === todo.id && editing.todoDate === selectedDate ? (
                <form className="space-y-2" onSubmit={(event) => { event.preventDefault(); saveEdit(); }} onKeyDown={(event) => { if (event.key === "Escape" && !updateMutation.isPending) setEditing(null); }}>
                  <Input value={editing.content} onChange={(event) => setEditing({ ...editing, content: event.target.value })} placeholder="제목" aria-label="할 일 제목 수정" autoFocus data-testid={`input-edit-todo-title-${todo.id}`} />
                  <Textarea value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} placeholder="내용 (선택)" aria-label="할 일 내용 수정" className="min-h-[80px] resize-y" data-testid={`input-edit-todo-description-${todo.id}`} />
                  <Input value={editing.url} onChange={(event) => setEditing({ ...editing, url: event.target.value })} placeholder="관련 URL (선택)" aria-label="할 일 URL 수정" data-testid={`input-edit-todo-url-${todo.id}`} />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditing(null)} disabled={updateMutation.isPending} data-testid={`button-cancel-edit-todo-${todo.id}`}>취소</Button>
                    <Button type="submit" size="sm" disabled={!editing.content.trim() || updateMutation.isPending} data-testid={`button-save-edit-todo-${todo.id}`}>저장</Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Checkbox checked={todo.completed} onCheckedChange={(checked) => toggleMutation.mutate({ id: todo.id, completed: checked === true })} aria-label={`${todo.content} 완료`} data-testid={`checkbox-todo-${todo.id}`} />
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-sm break-words", todo.completed && "line-through text-muted-foreground")}>{todo.content}</div>
                    {todo.description && <p className="mt-1 whitespace-pre-wrap break-words text-xs text-muted-foreground" data-testid={`todo-description-${todo.id}`}>{todo.description}</p>}
                  </div>
                  {todo.url && (
                    <a href={todo.url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-primary" aria-label={`${todo.content} 링크 열기`} data-testid={`link-todo-${todo.id}`}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button type="button" onClick={() => startEdit(todo)} className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary" aria-label={`${todo.content} 수정`} data-testid={`button-edit-todo-${todo.id}`}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => deleteMutation.mutate(todo.id)} className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100" aria-label={`${todo.content} 삭제`} data-testid={`button-delete-todo-${todo.id}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
