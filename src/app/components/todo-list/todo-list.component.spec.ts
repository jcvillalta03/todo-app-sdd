import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/angular';
import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

describe('TodoListComponent', () => {
  const createTodo = (overrides?: Partial<Todo>): Todo => ({
    id: `id-${Math.random()}`,
    title: 'Test Todo',
    order: 0,
    dueDate: null,
    ...overrides,
  });

  it('should render list of todos sorted by order', async () => {
    const todos: Todo[] = [
      createTodo({ id: '1', title: 'First', order: 1 }),
      createTodo({ id: '2', title: 'Second', order: 0 }),
      createTodo({ id: '3', title: 'Third', order: 2 }),
    ];
    const { getAllByText } = await render(TodoListComponent, {
      componentInputs: { todos },
      imports: [TodoItemComponent],
    });
    const todoElements = getAllByText(/First|Second|Third/);
    expect(todoElements.length).toBe(3);
    // Should be sorted by order: Second (0), First (1), Third (2)
    expect(todoElements[0].textContent).toContain('Second');
    expect(todoElements[1].textContent).toContain('First');
    expect(todoElements[2].textContent).toContain('Third');
  });

  it('should render empty state when todos array is empty', async () => {
    const todos: Todo[] = [];
    const { container } = await render(TodoListComponent, {
      componentInputs: { todos },
      imports: [TodoItemComponent],
    });
    // Should not have any todo items
    const todoItems = container.querySelectorAll('app-todo-item');
    expect(todoItems.length).toBe(0);
  });

  it('should forward edit event from TodoItemComponent', async () => {
    const todos: Todo[] = [createTodo({ id: 'edit-me', title: 'Edit Me' })];
    const { fixture } = await render(TodoListComponent, {
      componentInputs: { todos },
      imports: [TodoItemComponent],
    });
    const component = fixture.componentInstance;
    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);

    // Trigger edit from the first todo item
    const todoItemComponent = fixture.debugElement.query((el) => el.name === 'app-todo-item');
    if (todoItemComponent) {
      const itemComponent = todoItemComponent.componentInstance as TodoItemComponent;
      itemComponent.edit.emit(todos[0]);
      expect(editSpy).toHaveBeenCalledWith(todos[0]);
    }
  });

  it('should forward delete event from TodoItemComponent', async () => {
    const todos: Todo[] = [createTodo({ id: 'delete-me', title: 'Delete Me' })];
    const { fixture } = await render(TodoListComponent, {
      componentInputs: { todos },
      imports: [TodoItemComponent],
    });
    const component = fixture.componentInstance;
    const deleteSpy = vi.fn();
    component.delete.subscribe(deleteSpy);

    const todoItemComponent = fixture.debugElement.query((el) => el.name === 'app-todo-item');
    if (todoItemComponent) {
      const itemComponent = todoItemComponent.componentInstance as TodoItemComponent;
      itemComponent.delete.emit('delete-me');
      expect(deleteSpy).toHaveBeenCalledWith('delete-me');
    }
  });

  it('should forward moveUp event from TodoItemComponent', async () => {
    const todos: Todo[] = [createTodo({ id: 'move-up', title: 'Move Up' })];
    const { fixture } = await render(TodoListComponent, {
      componentInputs: { todos },
      imports: [TodoItemComponent],
    });
    const component = fixture.componentInstance;
    const moveUpSpy = vi.fn();
    component.moveUp.subscribe(moveUpSpy);

    const todoItemComponent = fixture.debugElement.query((el) => el.name === 'app-todo-item');
    if (todoItemComponent) {
      const itemComponent = todoItemComponent.componentInstance as TodoItemComponent;
      itemComponent.moveUp.emit('move-up');
      expect(moveUpSpy).toHaveBeenCalledWith('move-up');
    }
  });

  it('should forward moveDown event from TodoItemComponent', async () => {
    const todos: Todo[] = [createTodo({ id: 'move-down', title: 'Move Down' })];
    const { fixture } = await render(TodoListComponent, {
      componentInputs: { todos },
      imports: [TodoItemComponent],
    });
    const component = fixture.componentInstance;
    const moveDownSpy = vi.fn();
    component.moveDown.subscribe(moveDownSpy);

    const todoItemComponent = fixture.debugElement.query((el) => el.name === 'app-todo-item');
    if (todoItemComponent) {
      const itemComponent = todoItemComponent.componentInstance as TodoItemComponent;
      itemComponent.moveDown.emit('move-down');
      expect(moveDownSpy).toHaveBeenCalledWith('move-down');
    }
  });

  it('should use Tailwind CSS classes', async () => {
    const todos: Todo[] = [createTodo()];
    const { container } = await render(TodoListComponent, {
      componentInputs: { todos },
      imports: [TodoItemComponent],
    });
    const element = container.firstElementChild;
    expect(element?.className).toMatch(/(flex|grid|p-|m-|border|rounded)/);
  });
});
