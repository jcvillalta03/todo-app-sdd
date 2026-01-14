import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo.model';

const STORAGE_KEY = 'todos';

@Injectable({ providedIn: 'root' })
export class TodoDataService {
  private todos = signal<Todo[]>(this.loadFromStorage());

  getTodos() {
    return this.todos.asReadonly();
  }

  addTodo(title: string, dueDate: Date | null = null): void {
    const currentTodos = this.todos();
    const newOrder = currentTodos.length > 0 ? Math.max(...currentTodos.map((t) => t.order)) + 1 : 0;
    const newTodo: Todo = {
      id: this.generateId(),
      title,
      order: newOrder,
      dueDate: dueDate ? new Date(dueDate) : null,
    };
    this.todos.update((todos) => {
      const updated = [...todos, newTodo];
      this.saveToStorage(updated);
      return updated;
    });
  }

  removeTodo(id: string): void {
    this.todos.update((todos) => {
      const updated = todos.filter((todo) => todo.id !== id);
      // Reassign order values to be sequential
      const reordered = updated.map((todo, index) => ({
        ...todo,
        order: index,
      }));
      this.saveToStorage(reordered);
      return reordered;
    });
  }

  updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'dueDate'>>): void {
    this.todos.update((todos) => {
      const updated = todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...updates,
              dueDate: updates.dueDate ? new Date(updates.dueDate) : todo.dueDate,
            }
          : todo
      );
      this.saveToStorage(updated);
      return updated;
    });
  }

  reorderTodo(id: string, direction: 'up' | 'down'): void {
    this.todos.update((todos) => {
      const sortedTodos = [...todos].sort((a, b) => a.order - b.order);
      const index = sortedTodos.findIndex((todo) => todo.id === id);
      if (index === -1) return todos;

      let targetIndex: number;
      if (direction === 'up') {
        targetIndex = index - 1;
        if (targetIndex < 0) return todos;
      } else {
        targetIndex = index + 1;
        if (targetIndex >= sortedTodos.length) return todos;
      }

      // Swap order values by creating new objects
      const currentOrder = sortedTodos[index].order;
      const targetOrder = sortedTodos[targetIndex].order;
      const updated = sortedTodos.map((todo, i) => {
        if (i === index) {
          return { ...todo, order: targetOrder };
        }
        if (i === targetIndex) {
          return { ...todo, order: currentOrder };
        }
        return todo;
      });

      this.saveToStorage(updated);
      return updated;
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadFromStorage(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map((todo: any) => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      }));
    } catch {
      return [];
    }
  }

  private saveToStorage(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }
}
