import { TodoDataService } from './todo-data.service';

// Mock localStorage for tests
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() { return Object.keys(store).length; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('TodoDataService', () => {
  let service: TodoDataService;

  beforeEach(() => {
    // Clear localStorage for each test BEFORE creating service
    localStorage.clear();
    service = new TodoDataService();
  });

  describe('getTodos()', () => {
    it('should return initial empty todo list', () => {
      expect(service.getTodos()()).toEqual([]);
    });

    it('should return readonly signal', () => {
      const todos = service.getTodos();
      expect(typeof todos).toBe('function');
      expect(todos()).toEqual([]);
    });
  });

  describe('addTodo()', () => {
    it('should add a new todo with required description', () => {
      service.addTodo('Test todo');
      const todos = service.getTodos()();
      expect(todos.length).toBe(1);
      expect(todos[0].description).toBe('Test todo');
      expect(todos[0].priority).toBe(3); // default priority
      expect(todos[0].dueDate).toBeNull();
      expect(todos[0].id).toBeDefined();
      expect(todos[0].createdAt).toBeDefined();
    });

    it('should add a new todo with priority and due date', () => {
      service.addTodo('Test todo', 5, '2026-01-20');
      const todos = service.getTodos()();
      expect(todos.length).toBe(1);
      expect(todos[0].description).toBe('Test todo');
      expect(todos[0].priority).toBe(5);
      expect(todos[0].dueDate).toBe('2026-01-20');
    });

    it('should generate unique ids for multiple todos', () => {
      service.addTodo('First todo');
      service.addTodo('Second todo');
      const todos = service.getTodos()();
      expect(todos.length).toBe(2);
      expect(todos[0].id).not.toBe(todos[1].id);
    });

    it('should persist todos to localStorage', () => {
      service.addTodo('Test todo');
      const stored = JSON.parse(localStorage.getItem('todo-app-items') || '[]');
      expect(stored.length).toBe(1);
      expect(stored[0].description).toBe('Test todo');
    });

    it('should throw error for empty description', () => {
      expect(() => service.addTodo('')).toThrow();
      expect(() => service.addTodo('   ')).toThrow();
    });

    it('should throw error for invalid priority', () => {
      expect(() => service.addTodo('Test', 0)).toThrow();
      expect(() => service.addTodo('Test', 6)).toThrow();
      expect(() => service.addTodo('Test', -1)).toThrow();
    });

    it('should throw error for invalid due date format', () => {
      expect(() => service.addTodo('Test', 3, 'invalid-date')).toThrow();
      expect(() => service.addTodo('Test', 3, '2026/01/20')).toThrow();
    });
  });

  describe('updateTodo()', () => {
    let todoId: string;

    beforeEach(() => {
      service.addTodo('Original todo', 3, '2026-01-15');
      todoId = service.getTodos()()[0].id;
    });

    it('should update todo description', () => {
      service.updateTodo(todoId, { description: 'Updated todo' });
      const todos = service.getTodos()();
      expect(todos[0].description).toBe('Updated todo');
    });

    it('should update todo priority', () => {
      service.updateTodo(todoId, { priority: 5 });
      const todos = service.getTodos()();
      expect(todos[0].priority).toBe(5);
    });

    it('should update todo due date', () => {
      service.updateTodo(todoId, { dueDate: '2026-01-25' });
      const todos = service.getTodos()();
      expect(todos[0].dueDate).toBe('2026-01-25');
    });

    it('should update multiple fields at once', () => {
      service.updateTodo(todoId, {
        description: 'Updated todo',
        priority: 4,
        dueDate: '2026-01-25'
      });
      const todos = service.getTodos()();
      expect(todos[0].description).toBe('Updated todo');
      expect(todos[0].priority).toBe(4);
      expect(todos[0].dueDate).toBe('2026-01-25');
    });

    it('should persist updates to localStorage', () => {
      service.updateTodo(todoId, { description: 'Updated todo' });
      const stored = JSON.parse(localStorage.getItem('todo-app-items') || '[]');
      expect(stored[0].description).toBe('Updated todo');
    });

    it('should throw error for non-existent todo id', () => {
      expect(() => service.updateTodo('non-existent-id', { description: 'Test' })).toThrow();
    });

    it('should throw error for empty description update', () => {
      expect(() => service.updateTodo(todoId, { description: '' })).toThrow();
      expect(() => service.updateTodo(todoId, { description: '   ' })).toThrow();
    });

    it('should throw error for invalid priority update', () => {
      expect(() => service.updateTodo(todoId, { priority: 0 })).toThrow();
      expect(() => service.updateTodo(todoId, { priority: 6 })).toThrow();
    });

    it('should throw error for invalid due date format', () => {
      expect(() => service.updateTodo(todoId, { dueDate: 'invalid-date' })).toThrow();
    });
  });

  describe('removeTodo()', () => {
    let todoId: string;

    beforeEach(() => {
      service.addTodo('Test todo');
      todoId = service.getTodos()()[0].id;
    });

    it('should remove todo from list', () => {
      service.removeTodo(todoId);
      const todos = service.getTodos()();
      expect(todos.length).toBe(0);
    });

    it('should persist removal to localStorage', () => {
      service.removeTodo(todoId);
      const stored = JSON.parse(localStorage.getItem('todo-app-items') || '[]');
      expect(stored.length).toBe(0);
    });

    it('should throw error for non-existent todo id', () => {
      expect(() => service.removeTodo('non-existent-id')).toThrow();
    });
  });

  describe('getSortedTodos()', () => {
    it('should return computed signal', () => {
      const sortedTodos = service.getSortedTodos();
      expect(typeof sortedTodos).toBe('function');
    });

    it('should sort by priority descending, then creation time ascending', () => {
      // Add todos with different priorities and creation times
      service.addTodo('Low priority old', 1);
      service.addTodo('High priority new', 5);
      service.addTodo('Medium priority', 3);
      service.addTodo('High priority old', 5);

      const sorted = service.getSortedTodos()();

      // Should be sorted: priority 5, then priority 5, then priority 3, then priority 1
      expect(sorted[0].priority).toBe(5);
      expect(sorted[1].priority).toBe(5);
      expect(sorted[2].priority).toBe(3);
      expect(sorted[3].priority).toBe(1);

      // Within same priority, should be sorted by creation time (oldest first)
      // 'High priority new' was added second, 'High priority old' was added fourth
      expect(sorted[0].description).toBe('High priority new'); // created first among priority 5
      expect(sorted[1].description).toBe('High priority old'); // created second among priority 5
    });
  });

  describe('getPastDueTodos()', () => {
    it('should return computed signal', () => {
      const pastDueTodos = service.getPastDueTodos();
      expect(typeof pastDueTodos).toBe('function');
    });

    it('should return todos with due date today or earlier', () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      service.addTodo('Past due', 3, '2020-01-01'); // past due
      service.addTodo('Due today', 3, today); // due today
      service.addTodo('Future due', 3, '2030-01-01'); // future
      service.addTodo('No due date', 3); // no due date

      const pastDue = service.getPastDueTodos()();
      expect(pastDue.length).toBe(2);
      expect(pastDue.some(todo => todo.description === 'Past due')).toBe(true);
      expect(pastDue.some(todo => todo.description === 'Due today')).toBe(true);
    });

    it('should exclude todos without due dates', () => {
      service.addTodo('No due date', 3);
      const pastDue = service.getPastDueTodos()();
      expect(pastDue.length).toBe(0);
    });
  });

  describe('localStorage integration', () => {
    it('should load existing todos from localStorage on initialization', () => {
      const existingTodos = [
        {
          id: '1',
          description: 'Existing todo',
          priority: 4,
          dueDate: '2026-01-20',
          createdAt: '2026-01-14T10:00:00.000Z'
        }
      ];
      localStorage.setItem('todo-app-items', JSON.stringify(existingTodos));

      // Create new service instance to test loading
      const newService = new TodoDataService();
      const todos = newService.getTodos()();
      expect(todos.length).toBe(1);
      expect(todos[0].description).toBe('Existing todo');
    });

    it('should handle invalid localStorage data gracefully', () => {
      localStorage.setItem('todo-app-items', 'invalid json');
      const newService = new TodoDataService();
      const todos = newService.getTodos()();
      expect(todos).toEqual([]);
    });

    it('should handle localStorage disabled', () => {
      // Mock localStorage disabled
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => { throw new Error('localStorage disabled'); };

      // Should not crash, just log warning
      expect(() => service.addTodo('Test')).not.toThrow();

      // Restore localStorage
      localStorage.setItem = originalSetItem;
    });
  });
});