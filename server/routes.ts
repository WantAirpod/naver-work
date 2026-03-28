import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertCommentSchema, insertTaskRelationSchema, insertFavoriteLinkSchema, insertTodoSchema, insertQuizQuestionSchema } from "@shared/schema";
import { z } from "zod";

const updateTaskSchema = z.object({
  title: z.string().optional(),
  ticketUrl: z.string().optional(),
  ticketNumber: z.string().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["backlog", "in_progress", "review", "completed"]).optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  sortOrder: z.number().int().optional(),
  prUrl: z.string().nullable().optional(),
  isEpic: z.boolean().optional(),
  parentEpicId: z.number().int().nullable().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.get("/api/tasks/:id", async (req, res) => {
    const task = await storage.getTask(Number(req.params.id));
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  });

  app.post("/api/tasks", async (req, res) => {
    const parsed = insertTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const task = await storage.createTask(parsed.data);
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const updateData: Record<string, any> = { ...parsed.data };
    if (updateData.status === "completed") {
      updateData.completedAt = new Date();
    } else if (updateData.status === "backlog" || updateData.status === "in_progress" || updateData.status === "review") {
      updateData.completedAt = null;
    }
    const taskId = Number(req.params.id);
    if (updateData.parentEpicId !== undefined && updateData.parentEpicId !== null) {
      if (updateData.parentEpicId === taskId) {
        return res.status(400).json({ message: "Task cannot be its own Epic" });
      }
      const parent = await storage.getTask(updateData.parentEpicId);
      if (!parent) {
        return res.status(400).json({ message: "Parent Epic not found" });
      }
      if (!parent.isEpic) {
        return res.status(400).json({ message: "Parent task is not an Epic" });
      }
    }
    if (updateData.isEpic === false) {
      const currentTask = await storage.getTask(taskId);
      if (currentTask?.isEpic) {
        const allTasks = await storage.getTasks();
        const children = allTasks.filter(t => t.parentEpicId === taskId);
        for (const child of children) {
          await storage.updateTask(child.id, { parentEpicId: null });
        }
      }
    }
    const task = await storage.updateTask(taskId, updateData);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  });

  app.put("/api/tasks/reorder", async (req, res) => {
    const schema = z.object({ orderedIds: z.array(z.number().int()) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    await storage.reorderTasks(parsed.data.orderedIds);
    res.json({ success: true });
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    await storage.deleteTask(Number(req.params.id));
    res.status(204).send();
  });

  app.get("/api/comments", async (_req, res) => {
    const allComments = await storage.getComments();
    res.json(allComments);
  });

  app.post("/api/comments", async (req, res) => {
    const parsed = insertCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const comment = await storage.createComment(parsed.data);
    res.status(201).json(comment);
  });

  app.delete("/api/comments/:id", async (req, res) => {
    await storage.deleteComment(Number(req.params.id));
    res.status(204).send();
  });

  app.get("/api/relations", async (_req, res) => {
    const relations = await storage.getRelations();
    res.json(relations);
  });

  app.post("/api/relations", async (req, res) => {
    const parsed = insertTaskRelationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const relation = await storage.createRelation(parsed.data);
    res.status(201).json(relation);
  });

  app.delete("/api/relations/:sourceId/:targetId", async (req, res) => {
    await storage.deleteRelation(Number(req.params.sourceId), Number(req.params.targetId));
    res.status(204).send();
  });

  app.get("/api/favorite-links", async (_req, res) => {
    const links = await storage.getFavoriteLinks();
    res.json(links);
  });

  app.post("/api/favorite-links", async (req, res) => {
    const parsed = insertFavoriteLinkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const link = await storage.createFavoriteLink(parsed.data);
    res.status(201).json(link);
  });

  app.patch("/api/favorite-links/:id", async (req, res) => {
    const updateSchema = z.object({
      title: z.string().optional(),
      url: z.string().url().optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const link = await storage.updateFavoriteLink(Number(req.params.id), parsed.data);
    if (!link) return res.status(404).json({ message: "Link not found" });
    res.json(link);
  });

  app.delete("/api/favorite-links/:id", async (req, res) => {
    await storage.deleteFavoriteLink(Number(req.params.id));
    res.status(204).send();
  });

  app.get("/api/todos", async (_req, res) => {
    const allTodos = await storage.getTodos();
    res.json(allTodos);
  });

  app.post("/api/todos", async (req, res) => {
    const parsed = insertTodoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const todo = await storage.createTodo(parsed.data);
    res.status(201).json(todo);
  });

  app.patch("/api/todos/:id", async (req, res) => {
    const updateSchema = z.object({
      content: z.string().optional(),
      completed: z.boolean().optional(),
      color: z.string().optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const todo = await storage.updateTodo(Number(req.params.id), parsed.data);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    await storage.deleteTodo(Number(req.params.id));
    res.status(204).send();
  });

  app.get("/api/quiz-questions", async (_req, res) => {
    const questions = await storage.getQuizQuestions();
    res.json(questions);
  });

  app.post("/api/quiz-questions", async (req, res) => {
    const parsed = insertQuizQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const question = await storage.createQuizQuestion(parsed.data);
    res.status(201).json(question);
  });

  app.patch("/api/quiz-questions/:id", async (req, res) => {
    const updateSchema = z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
      category: z.string().nullable().optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const question = await storage.updateQuizQuestion(Number(req.params.id), parsed.data);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  });

  app.delete("/api/quiz-questions/:id", async (req, res) => {
    await storage.deleteQuizQuestion(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}
