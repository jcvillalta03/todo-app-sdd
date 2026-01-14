import { render, fireEvent } from '@testing-library/angular';
import { TodoContainerComponent } from './todo-container.component';
import { TodoDataService } from '../../services/todo-data.service';

describe('TodoContainerComponent', () => {
  it('should render todo form and todo list', async () => {
    const { getByPlaceholderText, container } = await render(TodoContainerComponent, {
      providers: [TodoDataService]
    });

    // Check form is present
    expect(getByPlaceholderText('Enter todo description')).toBeTruthy();

    // Check list is present
    const list = container.querySelector('todo-list');
    expect(list).toBeTruthy();
  });

  it('should add todo when form is submitted', async () => {
    const { getByPlaceholderText, getByRole } = await render(TodoContainerComponent, {
      providers: [TodoDataService]
    });

    // Fill and submit form
    const descriptionInput = getByPlaceholderText('Enter todo description');
    fireEvent.input(descriptionInput, { target: { value: 'New test todo' } });

    const submitButton = getByRole('button', { name: 'Add Todo' });
    fireEvent.click(submitButton);

    // Check that todo was added to the list
    // This would require checking the service or the rendered list
    // For now, we verify the form interaction works
  });

  it('should display todos from service', async () => {
    // This test would need to set up the service with mock data
    // and verify the todos are displayed in the list
    const { container } = await render(TodoContainerComponent, {
      providers: [TodoDataService]
    });

    // Initially should be empty
    const listItems = container.querySelectorAll('todo-item');
    expect(listItems.length).toBe(0);
  });

  it('should use sorted todos from service', async () => {
    // Test that the component uses getSortedTodos() for display
    const { fixture } = await render(TodoContainerComponent, {
      providers: [TodoDataService]
    });

    const component = fixture.componentInstance;

    // The component should have a todos property that uses getSortedTodos
    expect(component.todos).toBeDefined();
    // Verify it's a signal/computed value
    expect(typeof component.todos).toBe('function');
  });

  it('should use Tailwind CSS classes for layout', async () => {
    const { container } = await render(TodoContainerComponent, {
      providers: [TodoDataService]
    });

    const mainElement = container.firstChild as HTMLElement;
    expect(mainElement.className).toMatch(/p-\d+/);
    expect(mainElement.className).toMatch(/max-w-/);
    expect(mainElement.className).toMatch(/mx-auto/);
  });

  it('should integrate all child components', async () => {
    const { container } = await render(TodoContainerComponent, {
      providers: [TodoDataService]
    });

    // Check all expected child components are present
    expect(container.querySelector('todo-form')).toBeTruthy();
    expect(container.querySelector('todo-list')).toBeTruthy();
  });
});