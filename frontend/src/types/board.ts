export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface Card {
  id: string;
  listId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: Priority | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  id: string;
  title: string;
  order: number;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}
