import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render todo title', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      priority: 1,
      dueDate: new Date('2024-12-31'),
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Todo');
  });

  it('should display priority', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      priority: 2,
      dueDate: new Date('2024-12-31'),
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('2');
  });

  it('should display due date', () => {
    // Create date using local time to avoid timezone conversion issues
    const dueDate = new Date(2024, 11, 31); // Month is 0-indexed, so 11 = December
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      priority: 1,
      dueDate: dueDate,
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    // Check that the formatted date contains December and 2024
    const text = compiled.textContent || '';
    expect(text).toMatch(/Dec.*2024/);
  });

  it('should show past due indicator when todo is past due', () => {
    const pastDate = new Date('2020-01-01');
    const todo: Todo = {
      id: '1',
      title: 'Past Due Todo',
      priority: 1,
      dueDate: pastDate,
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    component.isPastDue = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const pastDueIndicator = compiled.querySelector('.text-red-600');
    expect(pastDueIndicator).toBeTruthy();
  });

  it('should emit delete event when delete button is clicked', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      priority: 1,
      dueDate: new Date('2024-12-31'),
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    fixture.detectChanges();

    let emittedId: string | undefined;
    component.delete.subscribe(id => {
      emittedId = id;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('button[aria-label="Delete"]');
    (deleteButton as HTMLElement)?.click();
    fixture.detectChanges();

    expect(emittedId).toBe('1');
  });

  it('should emit toggle event when checkbox is clicked', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      priority: 1,
      dueDate: new Date('2024-12-31'),
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    fixture.detectChanges();

    let emittedId: string | undefined;
    component.toggle.subscribe(id => {
      emittedId = id;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('input[type="checkbox"]');
    (checkbox as HTMLElement)?.click();
    fixture.detectChanges();

    expect(emittedId).toBe('1');
  });

  it('should emit edit event when edit button is clicked', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      priority: 1,
      dueDate: new Date('2024-12-31'),
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    fixture.detectChanges();

    let emittedTodo: Todo | undefined;
    component.edit.subscribe(t => {
      emittedTodo = t;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const editButton = compiled.querySelector('button[aria-label="Edit"]');
    (editButton as HTMLElement)?.click();
    fixture.detectChanges();

    expect(emittedTodo).toEqual(todo);
  });

  it('should use Tailwind classes for styling', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      priority: 1,
      dueDate: new Date('2024-12-31'),
      completed: false,
      createdAt: new Date()
    };
    component.todo = todo;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.border');
    expect(container).toBeTruthy();
    expect(container?.className).toMatch(/rounded/);
  });
});
