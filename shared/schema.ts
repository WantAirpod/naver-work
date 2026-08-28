import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  ticketUrl: text("ticket_url"),
  ticketNumber: text("ticket_number").notNull(),
  description: text("description"),
  status: text("status").notNull().default("in_progress"),
  priority: text("priority").notNull().default("medium"),
  sortOrder: integer("sort_order").notNull().default(0),
  // task_prs로 이관됨. backups/*.sql과 import-data.cjs가 이 컬럼을 명시 참조하므로 삭제하지 않는다.
  prUrl: text("pr_url"),
  isEpic: boolean("is_epic").notNull().default(false),
  parentEpicId: integer("parent_epic_id"),
  // 문자열 모드(YYYY-MM-DD). mode:"date"는 toISOString()으로 KST 자정이 전날로 밀린다.
  deployDate: date("deploy_date"),
  milestoneRegistered: boolean("milestone_registered").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const taskPrs = pgTable("task_prs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  taskId: integer("task_id").notNull(),
  url: text("url").notNull(),
  reviewed: boolean("reviewed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const insertTaskPrSchema = createInsertSchema(taskPrs).omit({
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
export type InsertTaskPr = z.infer<typeof insertTaskPrSchema>;
export type TaskPr = typeof taskPrs.$inferSelect;
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
