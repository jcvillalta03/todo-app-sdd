export interface Todo {
  id: string;
  title: string;
  priority: number; // Lower number = higher priority
  dueDate: Date | null;
  completed: boolean;
  createdAt: Date;
}
