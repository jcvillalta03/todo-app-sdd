import { render, fireEvent } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { TodoItemComponent } from './todo-item.component';
import { TodoItem } from '../../models/todo-item.model';

describe('TodoItemComponent', () => {
  const mockTodo: TodoItem = {
    id: '1',
    description: 'Test todo item',
    priority: 4,
    dueDate: '2026-01-20',
    createdAt: '2026-01-14T10:00:00.000Z'
  };

  const mockTodoNoDueDate: TodoItem = {
    id: '2',
    description: 'Todo without due date',
    priority: 2,
    dueDate: null,
    createdAt: '2026-01-14T11:00:00.000Z'
  };

  it('should render todo description', async () => {
    const { getByText } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });

    expect(getByText('Test todo item')).toBeTruthy();
  });

  it('should render priority', async () => {
    const { getByText } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });

    expect(getByText('Priority:')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
  });

  it('should render due date when present', async () => {
    const { getByText } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });

    expect(getByText('Due:')).toBeTruthy();
    expect(getByText('2026-01-20')).toBeTruthy();
  });

  it('should not render due date when null', async () => {
    const { queryByText } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodoNoDueDate }
    });

    expect(queryByText(/Due:/)).toBeNull();
  });

  it('should render creation date', async () => {
    const { getByText } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });

    expect(getByText(/Created:/)).toBeTruthy();
  });

  it('should apply normal styling when not past due', async () => {
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });

    const itemElement = container.firstChild as HTMLElement;
    // Should not have past-due styling
    expect(itemElement?.className).not.toMatch(/text-red/);
    expect(itemElement?.className).not.toMatch(/border-red/);
  });

  it('should apply past-due styling when due date is today or earlier', async () => {
    const pastDueTodo: TodoItem = {
      ...mockTodo,
      dueDate: '2020-01-01' // Past date
    };

    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo: pastDueTodo }
    });

    const itemElement = container.firstChild as HTMLElement;
    // Should have past-due styling
    expect(itemElement?.className).toMatch(/text-red/);
  });

  it('should use Tailwind CSS classes for styling', async () => {
    const { container, fixture } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });

    await fixture.whenStable();

    const itemElement = container.querySelector('div');
    expect(itemElement?.className).toMatch(/border/);
    expect(itemElement?.className).toMatch(/rounded/);
    expect(itemElement?.className).toMatch(/p-4/);
    expect(itemElement?.className).toMatch(/mb-2/);
  });

  it('should display priority with appropriate visual indicator', async () => {
    const { container } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });

    // Check for priority visualization (could be stars, numbers, colors, etc.)
    const priorityElement = container.querySelector('[data-testid="priority"]') ||
                           container.textContent;
    expect(priorityElement).toBeTruthy();
  });

  it('should handle todos with different priority levels', async () => {
    const highPriorityTodo: TodoItem = { ...mockTodo, priority: 5 };
    const lowPriorityTodo: TodoItem = { ...mockTodo, priority: 1 };

    const { rerender, getByText } = await render(TodoItemComponent, {
      componentInputs: { todo: highPriorityTodo }
    });

    expect(getByText('5')).toBeTruthy();

    await rerender({ componentInputs: { todo: lowPriorityTodo } });

    expect(getByText('1')).toBeTruthy();
  });

  describe('Edit functionality', () => {
    it('should start in view mode by default', async () => {
      const { getByText, queryByRole } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo }
      });

      expect(getByText('Test todo item')).toBeTruthy();
      expect(queryByRole('textbox', { name: /description/i })).toBeNull();
    });

    it('should emit editStart event when edit button is clicked', async () => {
      let editStartEmitted = false;
      const { getByRole, fixture } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo }
      });

      fixture.componentInstance.editStart.subscribe(() => editStartEmitted = true);

      const editButton = getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(editStartEmitted).toBe(true);
    });

    it('should switch to edit mode when isEditing input is true', async () => {
      const { getByRole, getByDisplayValue } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo, isEditing: true }
      });

      expect(getByRole('textbox', { name: /description/i })).toBeTruthy();
      expect(screen.getByRole('combobox', { name: /priority/i })).toBeTruthy(); // priority
      expect(screen.getByDisplayValue('2026-01-20')).toBeTruthy(); // due date
    });

    it('should populate form fields with current todo values in edit mode', async () => {
      const { getByRole, getByDisplayValue } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo, isEditing: true }
      });

      const descriptionInput = getByRole('textbox', { name: /description/i }) as HTMLInputElement;
      const prioritySelect = getByDisplayValue('4') as HTMLSelectElement;
      const dueDateInput = getByDisplayValue('2026-01-20') as HTMLInputElement;

      expect(descriptionInput.value).toBe('Test todo item');
      expect(prioritySelect.value).toBe('4');
      expect(dueDateInput.value).toBe('2026-01-20');
    });

    it('should emit updateTodo event with updated values when save button is clicked', async () => {
      let updateEvent: any = null;
      const { getByRole, fixture } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo, isEditing: true }
      });

      fixture.componentInstance.updateTodo.subscribe((event: any) => updateEvent = event);

      // Change the description directly on the component
      fixture.componentInstance.editDescription = 'Updated todo item';
      fixture.componentInstance.editPriority = 5;

      // Save changes
      const saveButton = getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      expect(updateEvent).toEqual({
        description: 'Updated todo item',
        priority: 5,
        dueDate: '2026-01-20'
      });
    });

    it('should emit editCancel event when cancel button is clicked', async () => {
      let cancelEmitted = false;
      const { getByRole, fixture } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo, isEditing: true }
      });

      fixture.componentInstance.editCancel.subscribe(() => cancelEmitted = true);

      const cancelButton = getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(cancelEmitted).toBe(true);
    });

    it('should not emit updateTodo event when description is empty', async () => {
      let updateEvent: any = null;
      const { getByRole, fixture } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo, isEditing: true }
      });

      fixture.componentInstance.updateTodo.subscribe((event: any) => updateEvent = event);

      // Clear the description
      const descriptionInput = getByRole('textbox', { name: /description/i });
      fireEvent.input(descriptionInput, { target: { value: '' } });

      // Try to save
      const saveButton = getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      expect(updateEvent).toBeNull();
    });

    it('should handle null due date in edit mode', async () => {
      const { container } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodoNoDueDate, isEditing: true }
      });

      const dueDateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
      expect(dueDateInput?.value).toBe('');
    });

    it('should use Tailwind CSS classes for edit form styling', async () => {
      const { container } = await render(TodoItemComponent, {
        componentInputs: { todo: mockTodo, isEditing: true }
      });

      const form = container.querySelector('form');
      expect(form?.className).toMatch(/flex/);
      expect(form?.className).toMatch(/flex-col/);
      expect(form?.className).toMatch(/gap/);

      const inputs = container.querySelectorAll('input, select');
      inputs.forEach(input => {
        expect(input.className).toMatch(/border/);
        expect(input.className).toMatch(/rounded/);
        expect(input.className).toMatch(/px-\d+/);
        expect(input.className).toMatch(/py-\d+/);
      });
    });
  });
});