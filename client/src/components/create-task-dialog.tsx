import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ListTodo, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요"),
  ticketUrl: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["backlog", "in_progress", "review"]),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; ticketUrl: string; ticketNumber: string; description?: string; priority: string; status: string }) => void;
  isPending?: boolean;
}

function extractTicketNum(url: string): string {
  const match = url.match(/\/(\d+)$/);
  return match ? match[1] : "";
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreateTaskDialogProps) {
  const [mode, setMode] = useState<"ticket" | "todo">("ticket");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      ticketUrl: "",
      description: "",
      priority: "medium",
      status: "in_progress",
    },
  });

  const ticketUrl = form.watch("ticketUrl") || "";
  const previewTicket = extractTicketNum(ticketUrl);

  const handleSubmit = (data: FormData) => {
    if (mode === "ticket" && !data.ticketUrl?.trim()) {
      form.setError("ticketUrl", { message: "유효한 URL을 입력하세요" });
      return;
    }
    if (mode === "todo") {
      onSubmit({
        title: data.title,
        ticketUrl: "",
        ticketNumber: "TODO",
        description: data.description,
        priority: data.priority,
        status: data.status,
      });
    } else {
      const ticketNumber = extractTicketNum(data.ticketUrl || "");
      onSubmit({
        title: data.title,
        ticketUrl: data.ticketUrl || "",
        ticketNumber: ticketNumber || data.ticketUrl || "",
        description: data.description,
        priority: data.priority,
        status: data.status,
      });
    }
    form.reset();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setMode("ticket");
    }
    onOpenChange(isOpen);
  };

  useEffect(() => {
    form.clearErrors("ticketUrl");
  }, [mode, form]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">새 작업 추가</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant={mode === "ticket" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setMode("ticket")}
            data-testid="button-mode-ticket"
          >
            <Ticket className="w-3.5 h-3.5 mr-1.5" />
            티켓
          </Button>
          <Button
            type="button"
            variant={mode === "todo" ? "default" : "outline"}
            size="sm"
            className={cn("flex-1", mode === "todo" && "bg-amber-500 hover:bg-amber-600 text-white")}
            onClick={() => setMode("todo")}
            data-testid="button-mode-todo"
          >
            <ListTodo className="w-3.5 h-3.5 mr-1.5" />
            Todo
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {mode === "ticket" && (
              <FormField
                control={form.control}
                name="ticketUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>티켓 URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://oss.fin.navercorp.com/.../issues/1755"
                        {...field}
                        data-testid="input-ticket-url"
                      />
                    </FormControl>
                    {previewTicket && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-muted-foreground">티켓 번호:</span>
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-xs font-mono font-semibold text-primary dark:bg-primary/20">
                          #{previewTicket}
                        </span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === "todo" && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <ListTodo className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  이슈 URL 없이 간단한 Todo 작업을 등록합니다
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={mode === "todo" ? "할 일을 입력하세요" : "작업 제목을 입력하세요"}
                      {...field}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="작업에 대한 설명을 입력하세요"
                      className="resize-none min-h-[80px]"
                      {...field}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>우선순위</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-priority">
                          <SelectValue placeholder="우선순위 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">높음</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="low">낮음</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상태</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in_progress">작업 중</SelectItem>
                        <SelectItem value="review">검토 중</SelectItem>
                        <SelectItem value="backlog">진행 전</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                data-testid="button-cancel-create"
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-submit-create">
                <Plus className="w-4 h-4 mr-1" />
                추가
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
