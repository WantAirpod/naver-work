import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  ticketUrl: text("ticket_url").notNull(),
  ticketNumber: text("ticket_number").notNull(),
  description: text("description"),
  status: text("status").notNull().default("in_progress"),
  priority: text("priority").notNull().default("medium"),
  sortOrder: integer("sort_order").notNull().default(0),
  prUrl: text("pr_url"),
  isEpic: boolean("is_epic").notNull().default(false),
  parentEpicId: integer("parent_epic_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  taskId: integer("task_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taskRelations = pgTable("task_relations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sourceTaskId: integer("source_task_id").notNull(),
  targetTaskId: integer("target_task_id").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const favoriteLinks = pgTable("favorite_links", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskRelationSchema = createInsertSchema(taskRelations).omit({
  id: true,
});

export const insertFavoriteLinkSchema = createInsertSchema(favoriteLinks).omit({
  id: true,
  createdAt: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertTaskRelation = z.infer<typeof insertTaskRelationSchema>;
export type TaskRelation = typeof taskRelations.$inferSelect;
export type InsertFavoriteLink = z.infer<typeof insertFavoriteLinkSchema>;
export type FavoriteLink = typeof favoriteLinks.$inferSelect;

export const todos = pgTable("todos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  completed: boolean("completed").notNull().default(false),
  color: text("color").notNull().default("yellow"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTodoSchema = createInsertSchema(todos).omit({
  id: true,
  createdAt: true,
});

export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Todo = typeof todos.$inferSelect;

export const quizQuestions = pgTable("quiz_questions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
