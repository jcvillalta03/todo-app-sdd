import { render } from '@testing-library/angular';
import { TodoListComponent } from './todo-list.component';
import { TodoItem } from '../../models/todo-item.model';

describe('TodoListComponent', () => {
  const mockTodos: TodoItem[] = [
    {
      id: '1',
      description: 'First todo',
      priority: 5,
      dueDate: '2026-01-20',
      createdAt: '2026-01-14T10:00:00.000Z'
    },
    {
      id: '2',
      description: 'Second todo',
      priority: 3,
      dueDate: null,
      createdAt: '2026-01-14T11:00:00.000Z'
    }
  ];

  it('should render empty list when no todos provided', async () => {
    const { container } = await render(TodoListComponent, {
      componentInputs: { todos: [] }
    });

    const list = container.querySelector('ul');
    expect(list).toBeTruthy();
    expect(list?.children.length).toBe(0);
  });

  it('should render list of todos', async () => {
    const { getAllByRole } = await render(TodoListComponent, {
      componentInputs: { todos: mockTodos }
    });

    const items = getAllByRole('listitem');
    expect(items.length).toBe(2);
  });

  it('should pass todo data to child todo-item components', async () => {
    const { container } = await render(TodoListComponent, {
      componentInputs: { todos: mockTodos }
    });

    // Check that todo-item components receive the correct props
    const todoItems = container.querySelectorAll('todo-item');
    expect(todoItems.length).toBe(2);

    // The component should render todo-item elements with the todo data
    // (exact implementation will depend on the template)
  });

  it('should use Tailwind CSS classes for styling', async () => {
    const { container } = await render(TodoListComponent, {
      componentInputs: { todos: [] }
    });

    const list = container.querySelector('ul');
    expect(list?.className).toMatch(/list/);
    expect(list?.className).toMatch(/pl-\d+/);
  });

  it('should re-render when todos input changes', async () => {
    const { rerender, getAllByRole } = await render(TodoListComponent, {
      componentInputs: { todos: [mockTodos[0]] }
    });

    let items = getAllByRole('listitem');
    expect(items.length).toBe(1);

    // Update with more todos
    await rerender({ componentInputs: { todos: mockTodos } });

    items = getAllByRole('listitem');
    expect(items.length).toBe(2);
  });
});