import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Todo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Link2, Plus, Trash2, X } from "lucide-react";

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
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const today = toYmd(new Date());
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

  const createMutation = useMutation({
    mutationFn: async (data: { content: string; url: string | null; todoDate: string }) => {
      const res = await apiRequest("POST", "/api/todos", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos", selectedDate] });
      setContent("");
      setUrl("");
      setIsAdding(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/todos", selectedDate] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/todos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/todos", selectedDate] }),
  });

  const handleAdd = () => {
    if (!content.trim()) return;
    createMutation.mutate({ content: content.trim(), url: normalizeUrl(url), todoDate: selectedDate });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setContent("");
    setUrl("");
  };

  const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            오늘 할 일
          </h3>
          {todos.length > 0 && <p className="mt-0.5 text-xs text-muted-foreground">{completedCount}/{todos.length} 완료</p>}
        </div>
        {!isAdding && (
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)} data-testid="button-add-todo">
            <Plus className="w-3.5 h-3.5 mr-1" />추가
          </Button>
        )}
      </div>

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
          <Input value={content} onChange={(event) => setContent(event.target.value)} placeholder="오늘 할 일을 입력하세요" autoFocus data-testid="input-new-todo" />
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
            <div key={todo.id} className="group flex items-center gap-2.5 px-3 py-2.5" data-testid={`todo-${todo.id}`}>
              <Checkbox checked={todo.completed} onCheckedChange={(checked) => toggleMutation.mutate({ id: todo.id, completed: checked === true })} aria-label={`${todo.content} 완료`} data-testid={`checkbox-todo-${todo.id}`} />
              <span className={cn("min-w-0 flex-1 text-sm break-words", todo.completed && "line-through text-muted-foreground")}>{todo.content}</span>
              {todo.url && (
                <a href={todo.url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-primary" aria-label={`${todo.content} 링크 열기`} data-testid={`link-todo-${todo.id}`}>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button type="button" onClick={() => deleteMutation.mutate(todo.id)} className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100" aria-label={`${todo.content} 삭제`} data-testid={`button-delete-todo-${todo.id}`}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
