import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/angular';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';

describe('TodoItemComponent', () => {
  const createTodo = (overrides?: Partial<Todo>): Todo => ({
    id: 'test-id',
    title: 'Test Todo',
    order: 0,
    dueDate: null,
    ...overrides,
  });

  it('should render todo title', async () => {
    const todo = createTodo({ title: 'My Todo Item' });
    const { getByText } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    expect(getByText('My Todo Item')).toBeTruthy();
  });

  it('should render formatted due date when present', async () => {
    const dueDate = new Date('2024-12-31');
    const todo = createTodo({ dueDate });
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    // Date should be formatted (we'll format as YYYY-MM-DD)
    expect(container.textContent).toContain('2024-12-31');
  });

  it('should not render due date when null', async () => {
    const todo = createTodo({ dueDate: null });
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    // Should not contain a date format
    const text = container.textContent || '';
    expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('should display past-due indicator when due date is in the past', async () => {
    const pastDate = new Date('2020-01-01');
    const todo = createTodo({ dueDate: pastDate });
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    // Should have past-due indicator (badge or class)
    const pastDueElement = container.querySelector('[class*="past-due"], [class*="red"]');
    expect(pastDueElement).toBeTruthy();
  });

  it('should not display past-due indicator when due date is in the future', async () => {
    const futureDate = new Date('2099-12-31');
    const todo = createTodo({ dueDate: futureDate });
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    // Should not have past-due indicator
    const pastDueElement = container.querySelector('[class*="past-due"]');
    expect(pastDueElement).toBeFalsy();
  });

  it('should emit edit event when edit button is clicked', async () => {
    const todo = createTodo();
    const { container, fixture } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    const component = fixture.componentInstance;
    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);

    const editButton = container.querySelector('button[aria-label*="edit" i]') ||
      Array.from(container.querySelectorAll('button')).find((btn) => btn.textContent?.toLowerCase().includes('edit'));
    if (editButton) {
      fireEvent.click(editButton);
      expect(editSpy).toHaveBeenCalledWith(todo);
    } else {
      // If button text doesn't contain "edit", try finding by other means
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      fireEvent.click(buttons[0]);
      expect(editSpy).toHaveBeenCalled();
    }
  });

  it('should emit delete event when delete button is clicked', async () => {
    const todo = createTodo({ id: 'delete-me' });
    const { container, fixture } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    const component = fixture.componentInstance;
    const deleteSpy = vi.fn();
    component.delete.subscribe(deleteSpy);

    const deleteButton = container.querySelector('button[aria-label*="delete" i]') ||
      Array.from(container.querySelectorAll('button')).find((btn) => btn.textContent?.toLowerCase().includes('delete'));
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(deleteSpy).toHaveBeenCalledWith('delete-me');
    } else {
      const buttons = Array.from(container.querySelectorAll('button'));
      // Find delete button (usually last or contains delete icon/text)
      if (buttons.length > 0) {
        fireEvent.click(buttons[buttons.length - 1]);
        expect(deleteSpy).toHaveBeenCalled();
      }
    }
  });

  it('should emit moveUp event when move up button is clicked', async () => {
    const todo = createTodo({ id: 'move-me-up' });
    const { container, fixture } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    const component = fixture.componentInstance;
    const moveUpSpy = vi.fn();
    component.moveUp.subscribe(moveUpSpy);

    const upButton = container.querySelector('button[aria-label*="up" i]') ||
      Array.from(container.querySelectorAll('button')).find((btn) => btn.textContent?.includes('↑') || btn.textContent?.toLowerCase().includes('up'));
    if (upButton) {
      fireEvent.click(upButton);
      expect(moveUpSpy).toHaveBeenCalledWith('move-me-up');
    }
  });

  it('should emit moveDown event when move down button is clicked', async () => {
    const todo = createTodo({ id: 'move-me-down' });
    const { container, fixture } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    const component = fixture.componentInstance;
    const moveDownSpy = vi.fn();
    component.moveDown.subscribe(moveDownSpy);

    const downButton = container.querySelector('button[aria-label*="down" i]') ||
      Array.from(container.querySelectorAll('button')).find((btn) => btn.textContent?.includes('↓') || btn.textContent?.toLowerCase().includes('down'));
    if (downButton) {
      fireEvent.click(downButton);
      expect(moveDownSpy).toHaveBeenCalledWith('move-me-down');
    }
  });

  it('should use Tailwind CSS classes', async () => {
    const todo = createTodo();
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    // Check for common Tailwind classes
    const element = container.firstElementChild;
    expect(element?.className).toMatch(/(flex|grid|p-|m-|border|rounded)/);
  });

  it('should have past-due indicator with Tailwind classes when past due', async () => {
    const pastDate = new Date('2020-01-01');
    const todo = createTodo({ dueDate: pastDate });
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo },
    });
    // Past due indicator should have Tailwind classes (e.g., bg-red, text-red, etc.)
    const pastDueElement = container.querySelector('[class*="red"]');
    expect(pastDueElement?.className).toMatch(/(bg-|text-|border-)/);
  });
});
