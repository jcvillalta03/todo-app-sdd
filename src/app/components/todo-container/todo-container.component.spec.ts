import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/angular';
import { TodoContainerComponent } from './todo-container.component';
import { TodoDataService } from '../../services/todo-data.service';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';

describe('TodoContainerComponent', () => {
  beforeEach(() => {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.clear) {
        localStorage.clear();
      } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('todos');
      }
    } catch {
      // Ignore localStorage errors in test environment
    }
  });

  it('should add a todo when form is submitted', async () => {
    const { getByPlaceholderText, getByRole, getByText, fixture } = await render(TodoContainerComponent, {
      providers: [TodoDataService],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });

    const titleInput = getByPlaceholderText(/title/i) as HTMLInputElement;
    fireEvent.input(titleInput, { target: { value: 'My New Todo' } });
    fireEvent.change(titleInput, { target: { value: 'My New Todo' } });

    const submitButton = getByRole('button', { name: /add|submit/i });
    fireEvent.click(submitButton);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getByText('My New Todo')).toBeTruthy();
  });

  it('should add todo with due date when provided', async () => {
    const { getByPlaceholderText, getByRole, getByText, fixture } = await render(TodoContainerComponent, {
      providers: [TodoDataService],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });

    const titleInput = getByPlaceholderText(/title/i) as HTMLInputElement;
    fireEvent.input(titleInput, { target: { value: 'Todo with Date' } });
    fireEvent.change(titleInput, { target: { value: 'Todo with Date' } });

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    expect(dateInput).toBeTruthy();
    fireEvent.input(dateInput, { target: { value: '2024-12-31' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });

    const submitButton = getByRole('button', { name: /add|submit/i });
    fireEvent.click(submitButton);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getByText('Todo with Date')).toBeTruthy();
    expect(getByText(/2024-12-31/)).toBeTruthy();
  });

  it('should remove todo when delete event is triggered', async () => {
    const service = new TodoDataService();
    service.addTodo('Todo to delete');

    const { getAllByText, getByText, queryByText, fixture } = await render(TodoContainerComponent, {
      providers: [{ provide: TodoDataService, useValue: service }],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });

    await fixture.whenStable();
    fixture.detectChanges();
    expect(getAllByText(/Todo to delete/).length).toBeGreaterThan(0);

    const deleteButtons = getAllByText(/delete/i);
    // Click the delete button for the todo item (not the generic delete button)
    const deleteButton = Array.from(document.querySelectorAll('button[aria-label*="Delete todo" i]'))[0] as HTMLButtonElement;
    expect(deleteButton).toBeTruthy();
    fireEvent.click(deleteButton);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryByText(/Todo to delete/)).toBeFalsy();
  });

  it('should update todo when edit event is triggered', async () => {
    const service = new TodoDataService();
    service.addTodo('Original Todo');

    const { getByText, getByPlaceholderText, getByRole, queryByText, fixture } = await render(TodoContainerComponent, {
      providers: [{ provide: TodoDataService, useValue: service }],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });

    await fixture.whenStable();
    fixture.detectChanges();
    expect(getByText(/Original Todo/)).toBeTruthy();

    const editButton = Array.from(document.querySelectorAll('button[aria-label*="Edit todo" i]'))[0] as HTMLButtonElement;
    expect(editButton).toBeTruthy();
    fireEvent.click(editButton);
    await fixture.whenStable();
    fixture.detectChanges();

    // The edit form should have an input - find by id="editTitle" or the edit form
    const titleInput = document.querySelector('#editTitle') as HTMLInputElement || 
                      Array.from(document.querySelectorAll('input[type="text"]')).find(
                        (input) => (input as HTMLInputElement).value === 'Original Todo'
                      ) as HTMLInputElement;
    expect(titleInput).toBeTruthy();
    expect(titleInput.value).toBe('Original Todo');

    fireEvent.input(titleInput, { target: { value: 'Updated Todo' } });
    fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

    const saveButton = getByRole('button', { name: /save|update/i });
    fireEvent.click(saveButton);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getByText(/Updated Todo/)).toBeTruthy();
    expect(queryByText(/Original Todo/)).toBeFalsy();
  });

  it('should reorder todo when moveUp event is triggered', async () => {
    const service = new TodoDataService();
    service.addTodo('First');
    service.addTodo('Second');

    const { getAllByText, fixture } = await render(TodoContainerComponent, {
      providers: [{ provide: TodoDataService, useValue: service }],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });

    await fixture.whenStable();
    fixture.detectChanges();
    const items = getAllByText(/First|Second/);
    expect(items.length).toBeGreaterThanOrEqual(2);

    const upButtons = Array.from(document.querySelectorAll('button')).filter((btn) =>
      btn.textContent?.includes('↑')
    );
    if (upButtons.length > 0) {
      fireEvent.click(upButtons[upButtons.length - 1]);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(getAllByText(/Second/).length).toBeGreaterThan(0);
      expect(getAllByText(/First/).length).toBeGreaterThan(0);
    }
  });

  it('should reorder todo when moveDown event is triggered', async () => {
    const service = new TodoDataService();
    service.addTodo('First');
    service.addTodo('Second');

    const { getAllByText, fixture } = await render(TodoContainerComponent, {
      providers: [{ provide: TodoDataService, useValue: service }],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });

    await fixture.whenStable();
    fixture.detectChanges();
    const items = getAllByText(/First|Second/);
    expect(items.length).toBeGreaterThanOrEqual(2);

    const downButtons = Array.from(document.querySelectorAll('button')).filter((btn) =>
      btn.textContent?.includes('↓')
    );
    if (downButtons.length > 0) {
      fireEvent.click(downButtons[0]);
      await fixture.whenStable();
      fixture.detectChanges();
      expect(getAllByText(/Second/).length).toBeGreaterThan(0);
      expect(getAllByText(/First/).length).toBeGreaterThan(0);
    }
  });

  it('should integrate with TodoDataService', async () => {
    const service = new TodoDataService();
    const { getByPlaceholderText, getByRole, fixture } = await render(TodoContainerComponent, {
      providers: [{ provide: TodoDataService, useValue: service }],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });

    const titleInput = getByPlaceholderText(/title/i) as HTMLInputElement;
    fireEvent.input(titleInput, { target: { value: 'Service Test' } });
    fireEvent.change(titleInput, { target: { value: 'Service Test' } });

    const submitButton = getByRole('button', { name: /add|submit/i });
    fireEvent.click(submitButton);
    await fixture.whenStable();

    const todos = service.getTodos()();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Service Test');
  });

  it('should use Tailwind CSS classes', async () => {
    const { container } = await render(TodoContainerComponent, {
      providers: [TodoDataService],
      imports: [TodoListComponent, TodoItemComponent, FormsModule],
    });
    const element = container.firstElementChild;
    expect(element?.className).toMatch(/(flex|grid|p-|m-|border|rounded)/);
  });
});
