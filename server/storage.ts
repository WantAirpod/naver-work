import {
  tasks,
  comments,
  taskRelations,
  favoriteLinks,
  todos,
  quizQuestions,
  type Task,
  type InsertTask,
  type Comment,
  type InsertComment,
  type TaskRelation,
  type InsertTaskRelation,
  type FavoriteLink,
  type InsertFavoriteLink,
  type Todo,
  type InsertTodo,
  type QuizQuestion,
  type InsertQuizQuestion,
} from "@shared/schema";
import { db } from "./db";
import { eq, or, and, asc, sql } from "drizzle-orm";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined>;
  reorderTasks(orderedIds: number[]): Promise<void>;
  deleteTask(id: number): Promise<void>;

  getComments(): Promise<Comment[]>;
  getCommentsByTask(taskId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<void>;

  getRelations(): Promise<TaskRelation[]>;
  createRelation(relation: InsertTaskRelation): Promise<TaskRelation>;
  deleteRelation(sourceTaskId: number, targetTaskId: number): Promise<void>;

  getFavoriteLinks(): Promise<FavoriteLink[]>;
  createFavoriteLink(link: InsertFavoriteLink): Promise<FavoriteLink>;
  updateFavoriteLink(id: number, data: Partial<InsertFavoriteLink>): Promise<FavoriteLink | undefined>;
  deleteFavoriteLink(id: number): Promise<void>;

  getTodos(): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, data: Partial<InsertTodo>): Promise<Todo | undefined>;
  deleteTodo(id: number): Promise<void>;

  getQuizQuestions(): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  updateQuizQuestion(id: number, data: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined>;
  deleteQuizQuestion(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    const priorityOrder = sql`CASE ${tasks.priority} WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 1 END`;
    return db.select().from(tasks).orderBy(priorityOrder, asc(tasks.sortOrder), asc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db.update(tasks).set(data).where(eq(tasks.id, id)).returning();
    return updated;
  }

  async reorderTasks(orderedIds: number[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.update(tasks).set({ sortOrder: i }).where(eq(tasks.id, orderedIds[i]));
      }
    });
  }

  async deleteTask(id: number): Promise<void> {
    await db.update(tasks).set({ parentEpicId: null }).where(eq(tasks.parentEpicId, id));
    await db.delete(comments).where(eq(comments.taskId, id));
    await db.delete(taskRelations).where(
      or(eq(taskRelations.sourceTaskId, id), eq(taskRelations.targetTaskId, id))
    );
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async getComments(): Promise<Comment[]> {
    return db.select().from(comments).orderBy(comments.createdAt);
  }

  async getCommentsByTask(taskId: number): Promise<Comment[]> {
    return db.select().from(comments).where(eq(comments.taskId, taskId));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [created] = await db.insert(comments).values(comment).returning();
    return created;
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  async getRelations(): Promise<TaskRelation[]> {
    return db.select().from(taskRelations);
  }

  async createRelation(relation: InsertTaskRelation): Promise<TaskRelation> {
    const [created] = await db.insert(taskRelations).values(relation).returning();
    return created;
  }

  async deleteRelation(sourceTaskId: number, targetTaskId: number): Promise<void> {
    await db.delete(taskRelations).where(
      or(
        and(eq(taskRelations.sourceTaskId, sourceTaskId), eq(taskRelations.targetTaskId, targetTaskId)),
        and(eq(taskRelations.sourceTaskId, targetTaskId), eq(taskRelations.targetTaskId, sourceTaskId))
      )
    );
  }

  async getFavoriteLinks(): Promise<FavoriteLink[]> {
    return db.select().from(favoriteLinks).orderBy(favoriteLinks.createdAt);
  }

  async createFavoriteLink(link: InsertFavoriteLink): Promise<FavoriteLink> {
    const [created] = await db.insert(favoriteLinks).values(link).returning();
    return created;
  }

  async updateFavoriteLink(id: number, data: Partial<InsertFavoriteLink>): Promise<FavoriteLink | undefined> {
    const [updated] = await db.update(favoriteLinks).set(data).where(eq(favoriteLinks.id, id)).returning();
    return updated;
  }

  async deleteFavoriteLink(id: number): Promise<void> {
    await db.delete(favoriteLinks).where(eq(favoriteLinks.id, id));
  }

  async getTodos(): Promise<Todo[]> {
    return db.select().from(todos).orderBy(todos.createdAt);
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [created] = await db.insert(todos).values(todo).returning();
    return created;
  }

  async updateTodo(id: number, data: Partial<InsertTodo>): Promise<Todo | undefined> {
    const [updated] = await db.update(todos).set(data).where(eq(todos.id, id)).returning();
    return updated;
  }

  async deleteTodo(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }

  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return db.select().from(quizQuestions).orderBy(quizQuestions.createdAt);
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const [created] = await db.insert(quizQuestions).values(question).returning();
    return created;
  }

  async updateQuizQuestion(id: number, data: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined> {
    const [updated] = await db.update(quizQuestions).set(data).where(eq(quizQuestions.id, id)).returning();
    return updated;
  }

  async deleteQuizQuestion(id: number): Promise<void> {
    await db.delete(quizQuestions).where(eq(quizQuestions.id, id));
  }
}

export const storage = new DatabaseStorage();
