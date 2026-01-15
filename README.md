# Todo App

A modern todo list application built with Angular 21 that allows users to manage weekly tasks with priority levels, due dates, and visual past-due indicators.

**NOTE**

This app was built with Spec-Driven development. See [Spec-Driven Development Guide](./docs/sdd/README.md) for all of those details.

## Features

- ✅ **Add Todo Items**: Create tasks with description, priority (1-5), and optional due date
- ✅ **View Todos**: Display all todos sorted by priority (highest first), then by creation time (oldest first)
- ✅ **Edit Todos**: Update description, priority, or due date inline
- ✅ **Delete Todos**: Remove completed or unnecessary tasks
- ✅ **Past-Due Indicators**: Visual highlighting (red styling) for items past their due date
- ✅ **Local Persistence**: Todos are saved to browser localStorage automatically
- ✅ **Responsive Design**: Beautiful, modern UI built with Tailwind CSS 4.1

## Tech Stack

- **Framework**: Angular 21.0.0 (standalone components, signals-based I/O, modern control flow)
- **Styling**: Tailwind CSS 4.1.12
- **Testing**: Vitest 4.0.8 with @testing-library/angular 19.0.0
- **TypeScript**: 5.9.2 (strict mode)
- **State Management**: Angular Signals with localStorage persistence

## Getting Started

### Prerequisites

- Node.js (compatible with Angular 21)
- npm 11.7.0 or compatible package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200/` and will automatically reload when you make changes.

### Running Tests

Run unit tests without coverage:

```bash
npm test
```

Run tests with coverage report:

```bash
npm run test:ci
```

**Coverage Requirements**: 
- Minimum 95% line coverage
- Minimum 90% branch coverage

All code must meet these thresholds before merging.

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory, optimized for performance.

## Architecture

### Component Structure

The application follows the **Container/Presentational Pattern**:

#### Container Component
- **`TodoContainerComponent`**: Manages application state, coordinates service interactions, and handles form state

#### Presentational Components
- **`TodoFormComponent`**: Handles user input for adding new todos
- **`TodoListComponent`**: Displays a list of todos
- **`TodoItemComponent`**: Displays a single todo item with edit/delete functionality

### Service Layer

- **`TodoDataService`**: Centralized state management using Angular Signals
  - Manages todo items in memory with reactive signals
  - Persists data to browser localStorage
  - Provides computed signals for sorted and filtered views
  - Handles validation and error cases

### Data Model

```typescript
interface TodoItem {
  id: string;                    // Unique identifier
  description: string;           // Task description (required)
  priority: number;              // Priority 1-5 (required, default: 3)
  dueDate: string | null;        // ISO date string YYYY-MM-DD (optional)
  createdAt: string;             // ISO timestamp (immutable)
}
```

### State Management

The application uses **Angular Signals** for reactive state management:

- `signal<TodoItem[]>`: Internal state for todo items
- `computed()`: Derived state for sorted and filtered views
- `asReadonly()`: Exposes readonly signals to components

## API Documentation

### TodoDataService

The service provides the following methods and signals:

#### Methods

**`addTodo(description: string, priority?: number, dueDate?: string | null): void`**
- Adds a new todo item
- Parameters:
  - `description` (required): Task description
  - `priority` (optional): Priority level 1-5 (default: 3)
  - `dueDate` (optional): ISO date string (YYYY-MM-DD) or null
- Throws: `Error` if validation fails

**`updateTodo(id: string, updates: Partial<TodoItem>): void`**
- Updates an existing todo item
- Parameters:
  - `id`: Todo item identifier
  - `updates`: Partial todo item with fields to update
- Throws: `Error` if todo not found or validation fails

**`removeTodo(id: string): void`**
- Removes a todo item
- Parameters:
  - `id`: Todo item identifier
- Throws: `Error` if todo not found

#### Signals (Readonly)

**`getTodos(): Signal<TodoItem[]>`**
- Returns all todos in their original order

**`getSortedTodos(): Signal<TodoItem[]>`**
- Returns todos sorted by:
  1. Priority (descending: 5 → 1)
  2. Creation time (ascending: oldest first)

**`getPastDueTodos(): Signal<TodoItem[]>`**
- Returns todos with due date today or earlier
- Excludes todos without due dates

### Component APIs

#### TodoFormComponent

**Outputs:**
- `addTodo: EventEmitter<AddTodoEvent>`
  ```typescript
  interface AddTodoEvent {
    description: string;
    priority: number;
    dueDate: string | null;
  }
  ```

#### TodoItemComponent

**Inputs:**
- `todo: TodoItem` (required): Todo item to display
- `isEditing: boolean`: Whether item is in edit mode

**Outputs:**
- `editStart: EventEmitter<void>`: Emitted when edit mode is activated
- `updateTodo: EventEmitter<UpdateTodoEvent>`: Emitted when todo is saved
- `editCancel: EventEmitter<void>`: Emitted when edit is cancelled
- `deleteTodo: EventEmitter<string>`: Emitted with todo ID when deleted

#### TodoListComponent

**Inputs:**
- `todos: TodoItem[]` (required): Array of todos to display

## Development Workflow

### Test-Driven Development (TDD)

All code follows TDD principles:

1. **Red**: Write a failing test
2. **Green**: Implement minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Code Style

- **Angular Best Practices**: Uses modern Angular 21 patterns
  - Signals-based `input()` and `output()` functions (not `@Input`/`@Output` decorators)
  - Modern control flow (`@if`, `@for` instead of `*ngIf`, `*ngFor`)
  - Standalone components (no explicit `standalone: true` in Angular 21)
- **Styling**: Tailwind CSS utility classes only
- **Testing**: All components and services must have comprehensive tests

### File Structure

```
src/app/
├── services/
│   ├── todo-data.service.ts          # State management service
│   └── todo-data.service.spec.ts     # Service tests
├── components/
│   ├── todo-container/               # Container component
│   │   ├── todo-container.component.ts
│   │   └── todo-container.component.spec.ts
│   ├── todo-list/                    # List presentational component
│   │   ├── todo-list.component.ts
│   │   └── todo-list.component.spec.ts
│   ├── todo-item/                    # Item presentational component
│   │   ├── todo-item.component.ts
│   │   └── todo-item.component.spec.ts
│   └── todo-form/                    # Form presentational component
│       ├── todo-form.component.ts
│       └── todo-form.component.spec.ts
└── models/
    └── todo-item.model.ts            # TodoItem interface
```

## Usage Examples

### Adding a Todo

```typescript
// In TodoContainerComponent
this.todoService.addTodo('Complete project report', 5, '2026-01-20');
```

### Getting Todos

```typescript
// Get all todos
todos = this.todoService.getTodos(); // Signal<TodoItem[]>

// Get sorted todos (priority + creation time)
sortedTodos = this.todoService.getSortedTodos(); // Signal<TodoItem[]>

// Get past-due todos
pastDueTodos = this.todoService.getPastDueTodos(); // Signal<TodoItem[]>
```

### Updating a Todo

```typescript
this.todoService.updateTodo(todoId, {
  description: 'Updated description',
  priority: 4,
  dueDate: '2026-01-25'
});
```

### Removing a Todo

```typescript
this.todoService.removeTodo(todoId);
```

## Data Persistence

- **Storage**: Browser localStorage
- **Key**: `'todo-app-items'`
- **Format**: JSON array of `TodoItem` objects
- **Error Handling**: 
  - Gracefully handles quota exceeded errors
  - Falls back to in-memory storage if localStorage is disabled
  - Data remains available during the session even if persistence fails

## Priority System

- **Scale**: 1 (lowest) to 5 (highest)
- **Default**: 3 if not specified
- **Sorting**: 
  - Primary: Priority (descending: 5 → 1)
  - Secondary: Creation time (ascending: oldest first)

## Due Dates

- **Format**: ISO date string (YYYY-MM-DD)
- **Optional**: Can be omitted or set to null
- **Past-Due Detection**: Items with due date today or earlier are visually flagged
- **Timezone**: Uses local date comparison (date-only, no time component)

## Troubleshooting

### Items Not Persisting

- Check that localStorage is enabled in your browser
- Verify browser storage quota hasn't been exceeded
- Check browser console for error messages

### Past-Due Items Not Highlighting

- Ensure due date format is YYYY-MM-DD
- Verify date comparison logic (compares date-only, not time)
- Check that computed signal is recalculating

### Tests Failing

- Ensure localStorage is cleared in test setup (`beforeEach`)
- Verify component inputs/outputs match test expectations
- Check that Tailwind classes are correctly asserted

## Documentation

### Project Documentation

- **[API Documentation](./docs/API.md)**: Complete API reference for services and components
- **[Architecture Documentation](./docs/ARCHITECTURE.md)**: Comprehensive architecture overview and design patterns
- **[Quickstart Guide](./specs/001-todo-list/quickstart.md)**: Feature-specific developer guide
- **[Specification](./specs/001-todo-list/spec.md)**: Complete requirements and user stories

### External Resources

- **Angular CLI**: Visit [Angular CLI Overview](https://angular.dev/tools/cli) for Angular CLI documentation
- **Angular Signals**: Learn about [Angular Signals](https://angular.dev/guide/signals)
- **Tailwind CSS**: Visit [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- **Vitest**: Visit [Vitest Documentation](https://vitest.dev) for testing framework details

## License

This project is private and not licensed for public use.
