import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TodoContainerComponent } from './todo-container.component';
import { TodoDataService } from '../../services/todo-data.service';
import { Todo } from '../../models/todo.model';

describe('TodoContainerComponent', () => {
  let component: TodoContainerComponent;
  let fixture: ComponentFixture<TodoContainerComponent>;
  let service: TodoDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoContainerComponent, FormsModule],
      providers: [TodoDataService]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoContainerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TodoDataService);
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a todo to the list', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleInput = compiled.querySelector('input[placeholder*="title"]') as HTMLInputElement;
    const priorityInput = compiled.querySelector('input[type="number"]') as HTMLInputElement;
    const dueDateInput = compiled.querySelector('input[type="date"]') as HTMLInputElement;
    const addButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    titleInput.value = 'My New Todo';
    titleInput.dispatchEvent(new Event('input'));
    priorityInput.value = '1';
    priorityInput.dispatchEvent(new Event('input'));
    dueDateInput.value = '2024-12-31';
    dueDateInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    addButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const todos = service.getTodos()();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('My New Todo');
    expect(todos[0].priority).toBe(1);
  });

  it('should remove a todo from the list', async () => {
    const todo = service.addTodo('Test Todo', 1, new Date('2024-12-31'));
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('button[aria-label="Delete"]') as HTMLButtonElement;
    deleteButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const todos = service.getTodos()();
    expect(todos.length).toBe(0);
  });

  it('should toggle todo completion', async () => {
    const todo = service.addTodo('Test Todo', 1, new Date('2024-12-31'));
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const todos = service.getTodos()();
    expect(todos[0].completed).toBe(true);
  });

  it('should update a todo', async () => {
    const todo = service.addTodo('Original Todo', 1, new Date('2024-12-31'));
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const editButton = compiled.querySelector('button[aria-label="Edit"]') as HTMLButtonElement;
    editButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const titleInput = compiled.querySelector('input[placeholder*="title"]') as HTMLInputElement;
    titleInput.value = 'Updated Todo';
    titleInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const saveButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    saveButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const todos = service.getTodos()();
    expect(todos[0].title).toBe('Updated Todo');
  });

  it('should display past due todos with indicator', async () => {
    const pastDate = new Date('2020-01-01');
    service.addTodo('Past Due Todo', 1, pastDate);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const pastDueIndicator = compiled.querySelector('.text-red-600');
    expect(pastDueIndicator).toBeTruthy();
  });

  it('should use Tailwind classes for styling', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.max-w-4xl');
    expect(container).toBeTruthy();
  });
});
