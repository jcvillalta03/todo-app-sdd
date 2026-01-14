import { describe, it, expect, beforeEach } from 'vitest';
import { TodoDataService } from './todo-data.service';
import { Todo } from '../models/todo.model';

describe('TodoDataService', () => {
  let service: TodoDataService;

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      try {
        if (localStorage.clear) {
          localStorage.clear();
        } else if (localStorage.removeItem) {
          localStorage.removeItem('todos');
        }
      } catch (e) {
        // localStorage might not be available in test environment
      }
    }
    service = new TodoDataService();
  });

  it('should return initial empty todo list', () => {
    expect(service.getTodos()()).toEqual([]);
  });

  it('should add a new todo', () => {
    const todo = service.addTodo('Test todo', 1, new Date('2024-12-31'));
    const todos = service.getTodos()();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Test todo');
    expect(todos[0].priority).toBe(1);
    expect(todos[0].completed).toBe(false);
    expect(todos[0].id).toBe(todo.id);
  });

  it('should remove a todo', () => {
    const todo = service.addTodo('Test todo', 1, new Date('2024-12-31'));
    service.removeTodo(todo.id);
    expect(service.getTodos()().length).toBe(0);
  });

  it('should update a todo', () => {
    const todo = service.addTodo('Test todo', 1, new Date('2024-12-31'));
    const newDate = new Date('2025-01-15');
    service.updateTodo(todo.id, {
      title: 'Updated todo',
      priority: 2,
      dueDate: newDate
    });
    const updated = service.getTodos()().find(t => t.id === todo.id);
    expect(updated?.title).toBe('Updated todo');
    expect(updated?.priority).toBe(2);
    expect(updated?.dueDate).toEqual(newDate);
  });

  it('should toggle todo completion', () => {
    const todo = service.addTodo('Test todo', 1, new Date('2024-12-31'));
    service.toggleTodo(todo.id);
    const updated = service.getTodos()().find(t => t.id === todo.id);
    expect(updated?.completed).toBe(true);
    service.toggleTodo(todo.id);
    const updatedAgain = service.getTodos()().find(t => t.id === todo.id);
    expect(updatedAgain?.completed).toBe(false);
  });

  it('should flag todos as past due when due date is in the past', () => {
    const pastDate = new Date('2020-01-01');
    // Use a date far in the future to ensure it's not past due
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    service.addTodo('Past due todo', 1, pastDate);
    service.addTodo('Future todo', 1, futureDate);
    service.addTodo('Today todo', 1, today);
    service.addTodo('Yesterday todo', 1, yesterday);
    service.addTodo('No due date', 1, null);

    const todos = service.getTodos()();
    const pastDueTodos = todos.filter(t => service.isPastDue(t));
    
    expect(pastDueTodos.length).toBeGreaterThan(0);
    expect(pastDueTodos.some(t => t.title === 'Past due todo')).toBe(true);
    expect(pastDueTodos.some(t => t.title === 'Yesterday todo')).toBe(true);
    expect(pastDueTodos.some(t => t.title === 'Future todo')).toBe(false);
    expect(pastDueTodos.some(t => t.title === 'No due date')).toBe(false);
  });

  it('should persist todos to localStorage', () => {
    if (typeof localStorage === 'undefined' || !localStorage.getItem) {
      // Skip test if localStorage is not available
      return;
    }
    service.addTodo('Test todo', 1, new Date('2024-12-31'));
    const stored = localStorage.getItem('todos');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(1);
  });

  it('should load todos from localStorage on initialization', () => {
    if (typeof localStorage === 'undefined' || !localStorage.setItem) {
      // Skip test if localStorage is not available
      return;
    }
    const mockTodos: Todo[] = [
      {
        id: '1',
        title: 'Loaded todo',
        priority: 1,
        dueDate: new Date('2024-12-31'),
        completed: false,
        createdAt: new Date()
      }
    ];
    localStorage.setItem('todos', JSON.stringify(mockTodos));
    const newService = new TodoDataService();
    const todos = newService.getTodos()();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Loaded todo');
  });

  it('should sort todos by priority (lower number = higher priority)', () => {
    service.addTodo('Low priority', 3, new Date('2024-12-31'));
    service.addTodo('High priority', 1, new Date('2024-12-31'));
    service.addTodo('Medium priority', 2, new Date('2024-12-31'));
    
    const todos = service.getTodos()();
    expect(todos[0].priority).toBe(1);
    expect(todos[1].priority).toBe(2);
    expect(todos[2].priority).toBe(3);
  });
});
