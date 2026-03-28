import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Todo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Plus,
  X,
  Check,
  StickyNote,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NOTE_COLORS = [
  { name: "yellow", bg: "bg-yellow-100 dark:bg-yellow-900/40", border: "border-yellow-300 dark:border-yellow-700", text: "text-yellow-900 dark:text-yellow-100", accent: "bg-yellow-200 dark:bg-yellow-800/60" },
  { name: "green", bg: "bg-emerald-100 dark:bg-emerald-900/40", border: "border-emerald-300 dark:border-emerald-700", text: "text-emerald-900 dark:text-emerald-100", accent: "bg-emerald-200 dark:bg-emerald-800/60" },
  { name: "blue", bg: "bg-blue-100 dark:bg-blue-900/40", border: "border-blue-300 dark:border-blue-700", text: "text-blue-900 dark:text-blue-100", accent: "bg-blue-200 dark:bg-blue-800/60" },
  { name: "pink", bg: "bg-pink-100 dark:bg-pink-900/40", border: "border-pink-300 dark:border-pink-700", text: "text-pink-900 dark:text-pink-100", accent: "bg-pink-200 dark:bg-pink-800/60" },
  { name: "purple", bg: "bg-purple-100 dark:bg-purple-900/40", border: "border-purple-300 dark:border-purple-700", text: "text-purple-900 dark:text-purple-100", accent: "bg-purple-200 dark:bg-purple-800/60" },
  { name: "orange", bg: "bg-orange-100 dark:bg-orange-900/40", border: "border-orange-300 dark:border-orange-700", text: "text-orange-900 dark:text-orange-100", accent: "bg-orange-200 dark:bg-orange-800/60" },
];

function getColorConfig(colorName: string) {
  return NOTE_COLORS.find(c => c.name === colorName) || NOTE_COLORS[0];
}

const ROTATIONS = [
  "-rotate-1",
  "rotate-1",
  "-rotate-2",
  "rotate-2",
  "rotate-0",
  "-rotate-1",
];

export function TodoBoard() {
  const [newTodo, setNewTodo] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [isAdding, setIsAdding] = useState(false);

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { content: string; color: string }) => {
      const res = await apiRequest("POST", "/api/todos", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodo("");
      setIsAdding(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    createMutation.mutate({ content: newTodo.trim(), color: selectedColor });
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <StickyNote className="w-4 h-4 text-yellow-500" />
          Quick Todo
          {activeTodos.length > 0 && (
            <span className="text-xs text-muted-foreground font-normal ml-1">
              {activeTodos.length}개
            </span>
          )}
        </h3>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            data-testid="button-add-todo"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            추가
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {NOTE_COLORS.map((color) => (
              <button
                key={color.name}
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-all",
                  color.bg,
                  color.border,
                  selectedColor === color.name
                    ? "ring-2 ring-offset-1 ring-primary scale-110"
                    : "opacity-60 hover:opacity-100"
                )}
                onClick={() => setSelectedColor(color.name)}
                data-testid={`button-color-${color.name}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="할 일을 입력하세요..."
              className="text-sm flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setIsAdding(false);
              }}
              autoFocus
              data-testid="input-new-todo"
            />
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!newTodo.trim() || createMutation.isPending}
              data-testid="button-save-todo"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setIsAdding(false); setNewTodo(""); }}
              data-testid="button-cancel-todo"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {todos.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center py-4 text-center">
          <Sparkles className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">
            간단한 할 일을 메모하세요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {activeTodos.map((todo, index) => {
            const color = getColorConfig(todo.color);
            const rotation = ROTATIONS[index % ROTATIONS.length];
            return (
              <div
                key={todo.id}
                className={cn(
                  "group relative p-3 rounded-md border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer",
                  color.bg,
                  color.border,
                  color.text,
                  rotation
                )}
                data-testid={`card-todo-${todo.id}`}
              >
                <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-md", color.accent)} />
                <button
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                  onClick={() => deleteMutation.mutate(todo.id)}
                  data-testid={`button-delete-todo-${todo.id}`}
                >
                  <X className="w-3 h-3" />
                </button>
                <div
                  className="flex items-start gap-2 mt-1"
                  onClick={() => toggleMutation.mutate({ id: todo.id, completed: true })}
                >
                  <div className="w-4 h-4 mt-0.5 rounded border-2 border-current/30 shrink-0 flex items-center justify-center hover:border-current/60 transition-colors" data-testid={`button-toggle-todo-${todo.id}`}>
                  </div>
                  <p className="text-xs leading-relaxed break-words flex-1 font-medium">{todo.content}</p>
                </div>
              </div>
            );
          })}
          {completedTodos.map((todo) => {
            const color = getColorConfig(todo.color);
            return (
              <div
                key={todo.id}
                className={cn(
                  "group relative p-3 rounded-md border shadow-sm opacity-50 transition-all duration-200 hover:opacity-70",
                  color.bg,
                  color.border,
                  color.text
                )}
                data-testid={`card-todo-done-${todo.id}`}
              >
                <button
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                  onClick={() => deleteMutation.mutate(todo.id)}
                  data-testid={`button-delete-done-todo-${todo.id}`}
                >
                  <X className="w-3 h-3" />
                </button>
                <div
                  className="flex items-start gap-2 cursor-pointer"
                  onClick={() => toggleMutation.mutate({ id: todo.id, completed: false })}
                >
                  <div className="w-4 h-4 mt-0.5 rounded border-2 border-current/30 shrink-0 flex items-center justify-center bg-current/20" data-testid={`button-untoggle-todo-${todo.id}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <p className="text-xs leading-relaxed break-words flex-1 font-medium line-through">{todo.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
