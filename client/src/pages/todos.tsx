import { Link } from "wouter";
import { ArrowLeft, ListTodo, Rocket } from "lucide-react";
import { TodoBoard } from "@/components/todo-board";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TodosPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 border-b bg-card">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="홈으로">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold leading-tight">할 일</h1>
              <p className="text-xs text-muted-foreground">날짜별 Todo 리스트</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/deploy">
              <Button variant="outline" size="sm">
                <Rocket className="w-4 h-4 mr-1" />
                배포
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:py-8">
        <TodoBoard />
      </main>
    </div>
  );
}
