import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoDataService {
  private todos = signal<Todo[]>(this.loadFromStorage());

  getTodos() {
    return computed(() => {
      // Sort by priority (lower number = higher priority)
      return [...this.todos()].sort((a, b) => a.priority - b.priority);
    });
  }

  addTodo(title: string, priority: number, dueDate: Date | null): Todo {
    const newTodo: Todo = {
      id: this.generateId(),
      title,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date()
    };
    this.todos.update(todos => [...todos, newTodo]);
    this.saveToStorage();
    return newTodo;
  }

  removeTodo(id: string): void {
    this.todos.update(todos => todos.filter(t => t.id !== id));
    this.saveToStorage();
  }

  updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate'>>): void {
    this.todos.update(todos =>
      todos.map(t =>
        t.id === id
          ? {
              ...t,
              ...updates
            }
          : t
      )
    );
    this.saveToStorage();
  }

  toggleTodo(id: string): void {
    this.todos.update(todos =>
      todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    this.saveToStorage();
  }

  isPastDue(todo: Todo): boolean {
    if (!todo.dueDate) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !todo.completed;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage(): Todo[] {
    try {
      if (typeof localStorage === 'undefined') {
        return [];
      }
      const stored = localStorage.getItem('todos');
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((todo: any) => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        createdAt: new Date(todo.createdAt)
      }));
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }
}
