import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { Todo } from '../../models/todo.model';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of todos', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Todo One',
        priority: 1,
        dueDate: new Date('2024-12-31'),
        completed: false,
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Todo Two',
        priority: 2,
        dueDate: new Date('2024-12-31'),
        completed: false,
        createdAt: new Date()
      }
    ];
    component.todos = todos;
    component.pastDueIds = new Set();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('app-todo-item');
    expect(items.length).toBe(2);
  });

  it('should render empty state when no todos', () => {
    component.todos = [];
    component.pastDueIds = new Set();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.text-gray-500');
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No todos');
  });

  it('should emit delete event', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Todo One',
        priority: 1,
        dueDate: new Date('2024-12-31'),
        completed: false,
        createdAt: new Date()
      }
    ];
    component.todos = todos;
    component.pastDueIds = new Set();
    fixture.detectChanges();

    let emittedId: string | undefined;
    component.delete.subscribe(id => {
      emittedId = id;
    });

    component.onDelete('1');
    expect(emittedId).toBe('1');
  });

  it('should emit toggle event', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Todo One',
        priority: 1,
        dueDate: new Date('2024-12-31'),
        completed: false,
        createdAt: new Date()
      }
    ];
    component.todos = todos;
    component.pastDueIds = new Set();
    fixture.detectChanges();

    let emittedId: string | undefined;
    component.toggle.subscribe(id => {
      emittedId = id;
    });

    component.onToggle('1');
    expect(emittedId).toBe('1');
  });

  it('should emit edit event', () => {
    const todo: Todo = {
      id: '1',
      title: 'Todo One',
      priority: 1,
      dueDate: new Date('2024-12-31'),
      completed: false,
      createdAt: new Date()
    };
    component.todos = [todo];
    component.pastDueIds = new Set();
    fixture.detectChanges();

    let emittedTodo: Todo | undefined;
    component.edit.subscribe(t => {
      emittedTodo = t;
    });

    component.onEdit(todo);
    expect(emittedTodo).toEqual(todo);
  });

  it('should use Tailwind classes for styling', () => {
    component.todos = [];
    component.pastDueIds = new Set();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.container');
    expect(container).toBeTruthy();
    expect(container?.className).toMatch(/mx-auto/);
  });

  it('should pass past due status to todo items', () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Past Due Todo',
        priority: 1,
        dueDate: new Date('2020-01-01'),
        completed: false,
        createdAt: new Date()
      }
    ];
    component.todos = todos;
    component.pastDueIds = new Set(['1']);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const todoItem = compiled.querySelector('app-todo-item');
    expect(todoItem).toBeTruthy();
  });
});
