import { render, fireEvent } from '@testing-library/angular';
import { TodoFormComponent } from './todo-form.component';

describe('TodoFormComponent', () => {
  it('should render form with description, priority, and due date inputs', async () => {
    const { getByPlaceholderText, getByDisplayValue, getByRole } = await render(TodoFormComponent);

    expect(getByPlaceholderText('Enter todo description')).toBeTruthy();
    expect(getByDisplayValue('3')).toBeTruthy(); // Default priority
    expect(getByPlaceholderText('Due date (optional)')).toBeTruthy();
    expect(getByRole('button', { name: 'Add Todo' })).toBeTruthy();
  });

  it('should emit addTodo event with description, priority, and due date when form is submitted', async () => {
    let emittedEvent: any = null;
    const { getByPlaceholderText, getByDisplayValue, getByRole, fixture } = await render(TodoFormComponent);

    // Set up event listener
    fixture.componentInstance.addTodo.subscribe((event: any) => emittedEvent = event);

    // Fill form
    const descriptionInput = getByPlaceholderText('Enter todo description');
    const priorityInput = getByDisplayValue('3');
    const dueDateInput = getByPlaceholderText('Due date (optional)');

    fireEvent.input(descriptionInput, { target: { value: 'Test todo' } });
    fireEvent.input(priorityInput, { target: { value: '5' } });
    fireEvent.input(dueDateInput, { target: { value: '2026-01-20' } });

    // Submit form
    const submitButton = getByRole('button', { name: 'Add Todo' });
    fireEvent.click(submitButton);

    expect(emittedEvent).toEqual({
      description: 'Test todo',
      priority: 5,
      dueDate: '2026-01-20'
    });
  });

  it('should emit addTodo event with default priority when priority not specified', async () => {
    let emittedEvent: any = null;
    const { getByPlaceholderText, getByRole, fixture } = await render(TodoFormComponent);

    fixture.componentInstance.addTodo.subscribe((event: any) => emittedEvent = event);

    const descriptionInput = getByPlaceholderText('Enter todo description');
    fireEvent.input(descriptionInput, { target: { value: 'Test todo' } });

    const submitButton = getByRole('button', { name: 'Add Todo' });
    fireEvent.click(submitButton);

    expect(emittedEvent).toEqual({
      description: 'Test todo',
      priority: 3,
      dueDate: null
    });
  });

  it('should emit addTodo event with null due date when due date not specified', async () => {
    let emittedEvent: any = null;
    const { getByPlaceholderText, getByRole, fixture } = await render(TodoFormComponent);

    fixture.componentInstance.addTodo.subscribe((event: any) => emittedEvent = event);

    const descriptionInput = getByPlaceholderText('Enter todo description');
    fireEvent.input(descriptionInput, { target: { value: 'Test todo' } });

    const submitButton = getByRole('button', { name: 'Add Todo' });
    fireEvent.click(submitButton);

    expect(emittedEvent).toEqual({
      description: 'Test todo',
      priority: 3,
      dueDate: null
    });
  });

  it('should clear form after successful submission', async () => {
    const { getByPlaceholderText, getByDisplayValue, getByRole, fixture } = await render(TodoFormComponent);

    // Fill form
    const descriptionInput = getByPlaceholderText('Enter todo description') as HTMLInputElement;
    const priorityInput = getByDisplayValue('3') as HTMLInputElement;
    const dueDateInput = getByPlaceholderText('Due date (optional)') as HTMLInputElement;

    fireEvent.input(descriptionInput, { target: { value: 'Test todo' } });
    fireEvent.input(priorityInput, { target: { value: '5' } });
    fireEvent.input(dueDateInput, { target: { value: '2026-01-20' } });

    // Submit form
    const submitButton = getByRole('button', { name: 'Add Todo' });
    fireEvent.click(submitButton);

    // Wait for Angular to update the view
    await fixture.whenStable();

    // Check form is cleared
    expect(descriptionInput.value).toBe('');
    expect(priorityInput.value).toBe('3'); // Back to default
    expect(dueDateInput.value).toBe('');
  });

  it('should not submit form when description is empty', async () => {
    let emittedEvent: any = null;
    const { getByRole, fixture } = await render(TodoFormComponent);

    fixture.componentInstance.addTodo.subscribe((event: any) => emittedEvent = event);

    const submitButton = getByRole('button', { name: 'Add Todo' });
    fireEvent.click(submitButton);

    expect(emittedEvent).toBeNull();
  });

  it('should trim whitespace from description', async () => {
    let emittedEvent: any = null;
    const { getByPlaceholderText, getByRole, fixture } = await render(TodoFormComponent);

    fixture.componentInstance.addTodo.subscribe((event: any) => emittedEvent = event);

    const descriptionInput = getByPlaceholderText('Enter todo description');
    fireEvent.input(descriptionInput, { target: { value: '  Test todo  ' } });

    const submitButton = getByRole('button', { name: 'Add Todo' });
    fireEvent.click(submitButton);

    expect(emittedEvent).toEqual({
      description: 'Test todo',
      priority: 3,
      dueDate: null
    });
  });

  it('should use Tailwind CSS classes for styling', async () => {
    const { container } = await render(TodoFormComponent);

    // Check for key Tailwind classes
    const form = container.querySelector('form');
    expect(form?.className).toMatch(/flex/);
    expect(form?.className).toMatch(/flex-col/);
    expect(form?.className).toMatch(/gap/);

    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      expect(input.className).toMatch(/border/);
      expect(input.className).toMatch(/rounded/);
      expect(input.className).toMatch(/px-\d+/);
      expect(input.className).toMatch(/py-\d+/);
    });

    const button = container.querySelector('button');
    expect(button?.className).toMatch(/bg-/);
    expect(button?.className).toMatch(/text-white/);
    expect(button?.className).toMatch(/px-\d+/);
    expect(button?.className).toMatch(/py-\d+/);
    expect(button?.className).toMatch(/rounded/);
  });
});