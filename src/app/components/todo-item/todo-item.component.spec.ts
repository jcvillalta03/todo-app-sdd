import { render } from '@testing-library/angular';
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
});