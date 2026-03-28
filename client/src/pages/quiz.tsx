import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { QuizQuestion } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Terminal,
  ArrowLeft,
  Trash2,
  Pencil,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface TerminalLine {
  type: "prompt" | "input" | "result" | "info";
  content: string;
}

export default function QuizPage() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"manage" | "quiz">("manage");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const { data: questions = [], isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/quiz-questions"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { question: string; answer: string; category?: string }) => {
      const res = await apiRequest("POST", "/api/quiz-questions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz-questions"] });
      toast({ title: "문제가 추가되었습니다" });
      setAddDialogOpen(false);
      setNewQuestion("");
      setNewAnswer("");
      setNewCategory("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { question?: string; answer?: string; category?: string | null } }) => {
      const res = await apiRequest("PATCH", `/api/quiz-questions/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz-questions"] });
      toast({ title: "문제가 수정되었습니다" });
      setEditingQuestion(null);
      setNewQuestion("");
      setNewAnswer("");
      setNewCategory("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/quiz-questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz-questions"] });
      toast({ title: "문제가 삭제되었습니다" });
    },
  });

  const handleSave = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    if (editingQuestion) {
      updateMutation.mutate({
        id: editingQuestion.id,
        data: {
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
          category: newCategory.trim() || null,
        },
      });
    } else {
      createMutation.mutate({
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        category: newCategory.trim() || undefined,
      });
    }
  };

  const handleEdit = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setNewQuestion(q.question);
    setNewAnswer(q.answer);
    setNewCategory(q.category || "");
    setAddDialogOpen(true);
  };

  const categories = Array.from(new Set(questions.map((q) => q.category || "general")));

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="shrink-0 border-b bg-card" style={{ zIndex: 100 }}>
        <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-4xl mx-auto flex-wrap">
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Button size="icon" variant="ghost" data-testid="button-quiz-back">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold tracking-tight" data-testid="text-quiz-title">
              Linux Command Quiz
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={mode === "manage" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("manage")}
              data-testid="button-mode-manage"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              문제 관리
            </Button>
            <Button
              variant={mode === "quiz" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("quiz")}
              disabled={questions.length === 0}
              data-testid="button-mode-quiz"
            >
              <Terminal className="w-3.5 h-3.5 mr-1" />
              퀴즈 풀기
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {mode === "manage" ? (
          <ManageView
            questions={questions}
            isLoading={isLoading}
            onAdd={() => {
              setEditingQuestion(null);
              setNewQuestion("");
              setNewAnswer("");
              setNewCategory("");
              setAddDialogOpen(true);
            }}
            onEdit={handleEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            categories={categories}
          />
        ) : (
          <QuizView questions={questions} />
        )}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "문제 수정" : "새 문제 추가"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">카테고리</label>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="예: 네트워크, 파일시스템, 프로세스"
                data-testid="input-quiz-category"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">문제</label>
              <Textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="예: 8080 포트가 열렸는지 확인하는 방법은?"
                className="resize-none min-h-[80px]"
                data-testid="input-quiz-question"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">정답</label>
              <Input
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="예: lsof -i :8080"
                className="font-mono"
                data-testid="input-quiz-answer"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(false)} data-testid="button-quiz-cancel">
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!newQuestion.trim() || !newAnswer.trim() || createMutation.isPending || updateMutation.isPending}
                data-testid="button-quiz-save"
              >
                {editingQuestion ? "수정" : "추가"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ManageView({
  questions,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  categories,
}: {
  questions: QuizQuestion[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (q: QuizQuestion) => void;
  onDelete: (id: number) => void;
  categories: string[];
}) {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">
          등록된 문제: <span className="font-semibold text-foreground">{questions.length}개</span>
        </p>
        <Button size="sm" onClick={onAdd} data-testid="button-add-question">
          <Plus className="w-3.5 h-3.5 mr-1" />
          문제 추가
        </Button>
      </div>

      {questions.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Terminal className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">등록된 문제가 없습니다</p>
          <p className="text-xs text-muted-foreground mb-3">Linux 명령어 문제를 추가해보세요</p>
          <Button variant="outline" size="sm" onClick={onAdd} data-testid="button-empty-add">
            <Plus className="w-4 h-4 mr-1" />
            첫 문제 추가하기
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => {
            const catQuestions = questions.filter((q) => (q.category || "general") === cat);
            if (catQuestions.length === 0) return null;
            return (
              <div key={cat} className="space-y-2">
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">{cat}</Badge>
                  <span className="text-xs text-muted-foreground">{catQuestions.length}개</span>
                </div>
                {catQuestions.map((q) => (
                  <Card key={q.id} className="p-3" data-testid={`card-quiz-${q.id}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-sm font-medium leading-snug" data-testid={`text-quiz-question-${q.id}`}>{q.question}</p>
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-muted-foreground shrink-0" />
                          <code className="text-xs font-mono text-primary bg-primary/10 dark:bg-primary/20 px-1.5 py-0.5 rounded" data-testid={`text-quiz-answer-${q.id}`}>
                            {q.answer}
                          </code>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => onEdit(q)} data-testid={`button-edit-quiz-${q.id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDelete(q.id)} data-testid={`button-delete-quiz-${q.id}`}>
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuizView({ questions }: { questions: QuizQuestion[] }) {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [terminalLines, scrollToBottom]);

  const pickRandomQuestion = useCallback(() => {
    const available = questions.filter((q) => !usedIds.has(q.id));
    if (available.length === 0) {
      setTerminalLines((prev) => [
        ...prev,
        { type: "info", content: "" },
        { type: "info", content: `=== 퀴즈 완료! 모든 문제를 풀었습니다 ===` },
        { type: "info", content: `결과: ${score.correct}개 정답 / ${score.wrong}개 오답 (총 ${questions.length}문제)` },
        { type: "info", content: `'다시 시작' 버튼을 눌러주세요.` },
      ]);
      setCurrentQuestion(null);
      return;
    }
    const idx = Math.floor(Math.random() * available.length);
    const q = available[idx];
    setCurrentQuestion(q);
    setShowAnswer(false);
    setTerminalLines((prev) => [
      ...prev,
      { type: "info", content: "" },
      { type: "prompt", content: `[문제 ${usedIds.size + 1}/${questions.length}] ${q.question}` },
    ]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [questions, usedIds, score]);

  const startQuiz = useCallback(() => {
    setTerminalLines([
      { type: "info", content: "=== Linux Command Quiz ===" },
      { type: "info", content: `총 ${questions.length}개의 문제가 준비되었습니다.` },
      { type: "info", content: "명령어를 입력하고 Enter를 누르세요." },
    ]);
    setScore({ correct: 0, wrong: 0 });
    setUsedIds(new Set());
    setCurrentQuestion(null);
    setShowAnswer(false);
    setTimeout(() => {
      const available = [...questions];
      const idx = Math.floor(Math.random() * available.length);
      const q = available[idx];
      setCurrentQuestion(q);
      setTerminalLines((prev) => [
        ...prev,
        { type: "info", content: "" },
        { type: "prompt", content: `[문제 1/${questions.length}] ${q.question}` },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 0);
  }, [questions]);

  useEffect(() => {
    if (questions.length > 0 && terminalLines.length === 0) {
      startQuiz();
    }
  }, [questions, startQuiz, terminalLines.length]);

  const normalizeAnswer = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (!currentQuestion || !userInput.trim()) return;

    const userAnswer = userInput.trim();
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(currentQuestion.answer);

    setTerminalLines((prev) => [
      ...prev,
      { type: "input", content: `$ ${userAnswer}` },
      {
        type: "result",
        content: isCorrect
          ? `  ✓ 정답입니다!`
          : `  ✗ 오답입니다. 정답: ${currentQuestion.answer}`,
      },
    ]);

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
    }));

    setUsedIds((prev) => new Set([...prev, currentQuestion.id]));
    setUserInput("");
    setShowAnswer(false);

    setTimeout(() => {
      const newUsed = new Set([...usedIds, currentQuestion.id]);
      const available = questions.filter((q) => !newUsed.has(q.id));
      if (available.length === 0) {
        const finalCorrect = score.correct + (isCorrect ? 1 : 0);
        const finalWrong = score.wrong + (isCorrect ? 0 : 1);
        setTerminalLines((prev) => [
          ...prev,
          { type: "info", content: "" },
          { type: "info", content: `=== 퀴즈 완료! ===` },
          { type: "info", content: `결과: ${finalCorrect}개 정답 / ${finalWrong}개 오답 (총 ${questions.length}문제)` },
        ]);
        setCurrentQuestion(null);
      } else {
        const idx = Math.floor(Math.random() * available.length);
        const q = available[idx];
        setCurrentQuestion(q);
        setShowAnswer(false);
        setTerminalLines((prev) => [
          ...prev,
          { type: "info", content: "" },
          { type: "prompt", content: `[문제 ${newUsed.size + 1}/${questions.length}] ${q.question}` },
        ]);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 800);
  };

  const handleShowAnswer = () => {
    if (!currentQuestion) return;
    setShowAnswer(true);
    setTerminalLines((prev) => [
      ...prev,
      { type: "info", content: `  힌트: ${currentQuestion.answer}` },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-full flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs gap-1">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            정답: {score.correct}
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <XCircle className="w-3 h-3 text-destructive" />
            오답: {score.wrong}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {!showAnswer && currentQuestion && (
            <Button variant="outline" size="sm" onClick={handleShowAnswer} data-testid="button-show-answer">
              정답 보기
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={startQuiz} data-testid="button-restart-quiz">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            다시 시작
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e] dark:bg-[#0d0d0d] border-[#333]">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] dark:bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs text-[#999] font-mono ml-2">linux-quiz — bash</span>
        </div>

        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed"
          onClick={() => inputRef.current?.focus()}
          data-testid="terminal-output"
        >
          {terminalLines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap",
                line.type === "prompt" && "text-[#4ec9b0] font-semibold",
                line.type === "input" && "text-[#d4d4d4]",
                line.type === "result" && line.content.includes("✓") && "text-[#27c93f]",
                line.type === "result" && line.content.includes("✗") && "text-[#ff5f56]",
                line.type === "info" && "text-[#808080]",
                line.type === "info" && line.content.includes("힌트") && "text-[#ffbd2e]"
              )}
            >
              {line.content}
            </div>
          ))}

          {currentQuestion && (
            <div className="flex items-center mt-1">
              <span className="text-[#27c93f] mr-2 shrink-0">$</span>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className="flex-1 bg-transparent text-[#d4d4d4] outline-none font-mono text-sm caret-[#27c93f]"
                placeholder="명령어를 입력하세요..."
                autoFocus
                data-testid="input-quiz-terminal"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
