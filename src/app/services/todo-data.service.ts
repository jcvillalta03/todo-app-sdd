import { Injectable, signal, computed, Signal } from '@angular/core';
import { TodoItem } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {
  private readonly STORAGE_KEY = 'todo-app-items';
  private todos = signal<TodoItem[]>(this.loadTodosFromStorage());

  getTodos(): Signal<TodoItem[]> {
    return this.todos.asReadonly();
  }

  getSortedTodos(): Signal<TodoItem[]> {
    return computed(() => {
      return [...this.todos()].sort((a, b) => {
        // Primary: Priority (descending: 5 → 1)
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        // Secondary: Creation time (ascending: oldest first)
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    });
  }

  getPastDueTodos(): Signal<TodoItem[]> {
    return computed(() => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      return this.todos().filter(todo =>
        todo.dueDate && todo.dueDate <= today
      );
    });
  }

  addTodo(description: string, priority: number = 3, dueDate?: string | null): void {
    this.validateAddTodoParams(description, priority, dueDate);

    const newTodo: TodoItem = {
      id: this.generateId(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };

    this.todos.update(todos => [...todos, newTodo]);
    this.saveTodosToStorage();
  }

  updateTodo(id: string, updates: Partial<Pick<TodoItem, 'description' | 'priority' | 'dueDate'>>): void {
    const currentTodos = this.todos();
    const todoIndex = currentTodos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      throw new Error(`Todo item with id '${id}' not found`);
    }

    const currentTodo = currentTodos[todoIndex];
    const updatedTodo = { ...currentTodo, ...updates };

    this.validateTodoFields(updatedTodo);

    this.todos.update(todos => {
      const newTodos = [...todos];
      newTodos[todoIndex] = updatedTodo;
      return newTodos;
    });

    this.saveTodosToStorage();
  }

  removeTodo(id: string): void {
    const currentTodos = this.todos();
    const todoExists = currentTodos.some(todo => todo.id === id);

    if (!todoExists) {
      throw new Error(`Todo item with id '${id}' not found`);
    }

    this.todos.update(todos => todos.filter(todo => todo.id !== id));
    this.saveTodosToStorage();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private validateAddTodoParams(description: string, priority: number, dueDate?: string | null): void {
    if (!description || description.trim().length === 0) {
      throw new Error('Description is required and cannot be empty');
    }

    if (priority < 1 || priority > 5) {
      throw new Error('Priority must be between 1 and 5');
    }

    if (dueDate && !this.isValidDateString(dueDate)) {
      throw new Error('Due date must be a valid ISO date string (YYYY-MM-DD)');
    }
  }

  private validateTodoFields(todo: Partial<TodoItem>): void {
    if (todo.description !== undefined && (!todo.description || todo.description.trim().length === 0)) {
      throw new Error('Description cannot be empty');
    }

    if (todo.priority !== undefined && (todo.priority < 1 || todo.priority > 5)) {
      throw new Error('Priority must be between 1 and 5');
    }

    if (todo.dueDate !== undefined && todo.dueDate !== null && !this.isValidDateString(todo.dueDate)) {
      throw new Error('Due date must be a valid ISO date string (YYYY-MM-DD)');
    }
  }

  private isValidDateString(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date.toISOString().split('T')[0] === dateString;
  }

  private loadTodosFromStorage(): TodoItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        console.warn('Invalid localStorage data: expected array');
        return [];
      }

      // Validate and filter out invalid items
      return parsed.filter((item): item is TodoItem => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.description === 'string' &&
          typeof item.priority === 'number' &&
          typeof item.createdAt === 'string' &&
          (item.dueDate === null || typeof item.dueDate === 'string')
        );
      });
    } catch (error) {
      console.warn('Failed to load todos from localStorage:', error);
      return [];
    }
  }

  private saveTodosToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos()));
    } catch (error: any) {
      // Check if error is due to quota exceeded
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded: Unable to save todos. Please free up browser storage space.');
        // Data remains in memory, but won't persist
        // Could implement cleanup of old items here if needed
      } else if (error?.name === 'SecurityError' || error?.code === 18) {
        // localStorage disabled (e.g., in private browsing mode)
        console.warn('localStorage is disabled. Todos will only be stored in memory for this session.');
      } else {
        // Other localStorage errors
        console.warn('Failed to save todos to localStorage:', error);
      }
      // Continue execution - localStorage failure shouldn't break the app
      // Data remains in memory signals, just won't persist
    }
  }
}