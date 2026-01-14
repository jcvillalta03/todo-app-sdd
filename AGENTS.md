# Project Instructions

## Component Structure, State Management, and Testing Guidelines

- **Decouple Data with Services:**  
  Always use Angular services to manage and store data for your components. This ensures components are simple, easily testable, and prepared for future API integrations.  
  **Write tests before implementation**—define the desired behavior and interface of your services and components with unit tests from the start.

- **Test-Driven Development (TDD):**  
  - Start by writing unit tests (using [Vitest](https://vitest.dev/), as included in your dev dependencies) for each service and component.
  - Tests should specify all component/service inputs, outputs, and expected behavior.
  - There should be tests for presentational components (inputs, output events, rendering), container components (integration, side effects), and services (data updates, selectors).

- **Use the Container/Presentational Pattern:**  
  1. Write tests for presentational components verifying rendering and event emission.
  2. Write tests for containers verifying state management, side effects, and interaction with services.

- **Use Tailwind CSS:**  
  - Add tests (e.g., shallow snapshot or class checks) to verify that critical Tailwind utility classes appear in rendered markup.

- **Future-proof Service Design:**  
  - Begin tests (and implementation) with local storage of data, but structure services such that integrating API calls in the future will not break your tests or component interfaces.

---

### Example: Service & Component Skeletons With Tests

#### Service Example (TDD First)

```typescript
// todo-data.service.spec.ts
import { TodoDataService } from './todo-data.service';

describe('TodoDataService', () => {
  let service: TodoDataService;

  beforeEach(() => {
    service = new TodoDataService();
  });

  it('should return initial empty todo list', () => {
    expect(service.getTodos().()).toEqual([]);
  });

  it('should add a new todo', () => {
    service.addTodo('Test todo');
    expect(service.getTodos().()).toEqual(['Test todo']);
  });
});
```
```typescript
// todo-data.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TodoDataService {
  private todos = signal<string[]>([]);

  getTodos() {
    return this.todos.asReadonly();
  }

  addTodo(todo: string) {
    this.todos.update(todos => [...todos, todo]);
  }
}
```

#### Presentational Component Example (TDD First)

```typescript
// todo-list.component.spec.ts
import { render } from '@testing-library/angular';
import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent', () => {
  it('should render a list of todos', async () => {
    const todos = ['One', 'Two'];
    const { getAllByRole } = await render(TodoListComponent, {
      componentInputs: { todos }
    });
    const items = getAllByRole('listitem');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('One');
    expect(items[1].textContent).toContain('Two');
  });

  it('should use Tailwind classes', async () => {
    const { container } = await render(TodoListComponent, { componentInputs: { todos: [] } });
    expect(container.querySelector('ul')?.className).toMatch(/list-disc/); // example check
  });
});
```
```typescript
// todo-list.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'todo-list',
  template: `
    <ul class="list-disc pl-4">
      <li *ngFor="let todo of todos">{{ todo }}</li>
    </ul>
  `,
  standalone: true
})
export class TodoListComponent {
  @Input() todos: string[] = [];
}
```

#### Container Component Example (TDD First)

```typescript
// todo-container.component.spec.ts
import { render, fireEvent } from '@testing-library/angular';
import { TodoContainerComponent } from './todo-container.component';
import { TodoDataService } from './todo-data.service';

describe('TodoContainerComponent', () => {
  it('should add a todo to the list', async () => {
    const { getByPlaceholderText, getByText, findAllByRole } = await render(TodoContainerComponent, {
      providers: [TodoDataService]
    });

    const input = getByPlaceholderText('Add a todo') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'My New Todo' } });
    fireEvent.click(getByText('Add'));

    const items = await findAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('My New Todo');
  });
});
```
```typescript
// todo-container.component.ts
import { Component, inject } from '@angular/core';
import { TodoListComponent } from './todo-list.component';
import { FormsModule } from '@angular/forms';
import { TodoDataService } from './todo-data.service';

@Component({
  selector: 'todo-container',
  template: `
    <section class="p-4 max-w-lg mx-auto">
      <input
        class="border rounded px-2 py-1 mr-2"
        [(ngModel)]="newTodo"
        placeholder="Add a todo"
      />
      <button class="bg-blue-600 text-white px-3 py-1 rounded" (click)="add()">
        Add
      </button>
      <todo-list [todos]="todos()"></todo-list>
    </section>
  `,
  imports: [TodoListComponent, FormsModule],
  standalone: true
})
export class TodoContainerComponent {
  private todoService = inject(TodoDataService);
  newTodo = '';
  todos = this.todoService.getTodos();

  add() {
    if (this.newTodo.trim()) {
      this.todoService.addTodo(this.newTodo.trim());
      this.newTodo = '';
    }
  }
}
```

---

## Summary of Best Practices

- Follow **TDD**: Write tests before logic for every service and component. 
  - After writing code, run the tests, and identify tests that are failing
  - Then work through each failing test to identify the root cause and then fix test/logic.
- **Decouple state**: Put all data management in services (for future API expansion).
- **Container/Presentational**: Clearly split data logic from UI rendering; test both roles.
- **Tailwind**: Use Tailwind for styling; verify critical classes in tests.
- **Services** can store data locally now, but should make API replacement a drop-in transition, as proven by your tests.




