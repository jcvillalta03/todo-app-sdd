# API Documentation

Complete API reference for the Todo App service and components.

## Table of Contents

- [TodoDataService](#tododataservice)
- [Component APIs](#component-apis)
- [Data Models](#data-models)
- [Events](#events)

---

## TodoDataService

The `TodoDataService` is an Angular service that manages todo items state using Angular Signals and persists data to browser localStorage.

### Location

`src/app/services/todo-data.service.ts`

### Public API

#### Methods

##### `addTodo(description: string, priority?: number, dueDate?: string | null): void`

Adds a new todo item to the collection.

**Parameters:**
- `description` (required): Task description string. Must be non-empty after trimming.
- `priority` (optional): Priority level between 1-5. Defaults to 3 if not provided.
  - 1 = Lowest priority
  - 5 = Highest priority
- `dueDate` (optional): ISO date string in YYYY-MM-DD format, or `null`. Defaults to `null` if not provided.

**Returns:** `void`

**Throws:**
- `Error` if description is empty or only whitespace
- `Error` if priority is outside the range 1-5
- `Error` if dueDate is provided but not in valid YYYY-MM-DD format

**Example:**
```typescript
// Add a todo with all fields
service.addTodo('Complete project report', 5, '2026-01-20');

// Add a todo with default priority
service.addTodo('Review documentation');

// Add a todo without due date
service.addTodo('Update README', 4, null);
```

**Side Effects:**
- Updates internal signal state
- Persists to localStorage
- Triggers reactive updates to all subscribed computed signals

---

##### `updateTodo(id: string, updates: Partial<Pick<TodoItem, 'description' | 'priority' | 'dueDate'>>): void`

Updates an existing todo item with new values.

**Parameters:**
- `id` (required): The unique identifier of the todo item to update
- `updates` (required): Partial object containing fields to update:
  - `description?`: New description (must be non-empty if provided)
  - `priority?`: New priority (must be 1-5 if provided)
  - `dueDate?`: New due date (must be YYYY-MM-DD format or null if provided)

**Returns:** `void`

**Throws:**
- `Error` if todo item with given `id` is not found
- `Error` if any provided field fails validation

**Example:**
```typescript
// Update only description
service.updateTodo(todoId, { description: 'Updated task name' });

// Update multiple fields
service.updateTodo(todoId, {
  description: 'New description',
  priority: 4,
  dueDate: '2026-02-01'
});

// Remove due date
service.updateTodo(todoId, { dueDate: null });
```

**Side Effects:**
- Updates internal signal state
- Persists to localStorage
- Triggers reactive updates to all subscribed computed signals

---

##### `removeTodo(id: string): void`

Removes a todo item from the collection.

**Parameters:**
- `id` (required): The unique identifier of the todo item to remove

**Returns:** `void`

**Throws:**
- `Error` if todo item with given `id` is not found

**Example:**
```typescript
service.removeTodo(todoId);
```

**Side Effects:**
- Updates internal signal state
- Persists to localStorage
- Triggers reactive updates to all subscribed computed signals

---

#### Signals (Readonly)

##### `getTodos(): Signal<TodoItem[]>`

Returns a readonly signal containing all todo items in their original order (as stored).

**Returns:** `Signal<TodoItem[]>` - Readonly signal that emits the current array of all todos

**Example:**
```typescript
const todos = service.getTodos(); // Signal<TodoItem[]>

// Subscribe to changes
effect(() => {
  console.log('Current todos:', todos());
});

// Access current value
const currentTodos = todos(); // TodoItem[]
```

**Note:** The signal is readonly - you cannot modify todos directly through this signal.

---

##### `getSortedTodos(): Signal<TodoItem[]>`

Returns a computed signal containing all todos sorted by priority (descending) and creation time (ascending).

**Sorting Logic:**
1. **Primary sort**: Priority (descending: 5 → 1)
2. **Secondary sort**: Creation time (ascending: oldest first)

**Returns:** `Signal<TodoItem[]>` - Computed signal that automatically recalculates when todos change

**Example:**
```typescript
const sortedTodos = service.getSortedTodos(); // Signal<TodoItem[]>

// Use in component template
todos = this.todoService.getSortedTodos();
```

**Note:** This is a computed signal that automatically updates when the underlying todos change.

---

##### `getPastDueTodos(): Signal<TodoItem[]>`

Returns a computed signal containing todos that are past their due date.

**Filtering Logic:**
- Includes todos with `dueDate` that is today or earlier (YYYY-MM-DD comparison)
- Excludes todos without a `dueDate` (null)
- Excludes todos with future due dates

**Returns:** `Signal<TodoItem[]>` - Computed signal that automatically recalculates when todos change

**Example:**
```typescript
const pastDueTodos = service.getPastDueTodos(); // Signal<TodoItem[]>

// Use in component
effect(() => {
  const overdue = pastDueTodos();
  if (overdue.length > 0) {
    console.warn(`You have ${overdue.length} overdue tasks`);
  }
});
```

---

### Error Handling

The service includes comprehensive error handling for localStorage operations:

1. **QuotaExceededError**: When localStorage quota is exceeded
   - Logs error message
   - Data remains in memory (available for current session)
   - Does not throw exception (graceful degradation)

2. **SecurityError**: When localStorage is disabled (e.g., private browsing)
   - Logs warning message
   - Data remains in memory (available for current session)
   - Does not throw exception (graceful degradation)

3. **Invalid Data**: When localStorage contains invalid JSON or non-array data
   - Logs warning message
   - Returns empty array
   - Does not crash the application

---

## Component APIs

### TodoFormComponent

**Location:** `src/app/components/todo-form/todo-form.component.ts`

**Purpose:** Presentational component for adding new todo items.

#### Inputs

None. This is a form-only component with internal state.

#### Outputs

**`addTodo: EventEmitter<AddTodoEvent>`**

Emitted when the user submits the form with valid data.

**Event Type:**
```typescript
interface AddTodoEvent {
  description: string;  // Required, non-empty
  priority: number;     // 1-5
  dueDate: string | null; // YYYY-MM-DD format or null
}
```

**Example:**
```typescript
<todo-form (addTodo)="onAddTodo($event)"></todo-form>
```

---

### TodoItemComponent

**Location:** `src/app/components/todo-item/todo-item.component.ts`

**Purpose:** Presentational component that displays a single todo item with edit/delete capabilities.

#### Inputs

**`todo: TodoItem` (required)**

The todo item to display and edit.

**`isEditing: boolean` (optional, default: `false`)**

Controls whether the item is in edit mode or view mode.

#### Outputs

**`editStart: EventEmitter<void>`**

Emitted when the user clicks the "Edit" button to enter edit mode.

**`updateTodo: EventEmitter<UpdateTodoEvent>`**

Emitted when the user saves changes in edit mode.

**Event Type:**
```typescript
interface UpdateTodoEvent {
  description: string;
  priority: number;
  dueDate: string | null;
}
```

**`editCancel: EventEmitter<void>`**

Emitted when the user cancels editing (clicks "Cancel" button).

**`deleteTodo: EventEmitter<string>`**

Emitted when the user clicks the "Delete" button. Emits the todo item's ID.

**Example:**
```typescript
<todo-item
  [todo]="todo"
  [isEditing]="isEditing(todo.id)"
  (editStart)="onEditStart(todo.id)"
  (updateTodo)="onUpdateTodo(todo.id, $event)"
  (editCancel)="onCancelEdit()"
  (deleteTodo)="onDeleteTodo($event)"
></todo-item>
```

---

### TodoListComponent

**Location:** `src/app/components/todo-list/todo-list.component.ts`

**Purpose:** Presentational component that displays a list of todo items.

#### Inputs

**`todos: TodoItem[]` (required)**

Array of todo items to display in the list.

#### Outputs

None. This is a pure display component.

**Example:**
```typescript
<todo-list [todos]="todos()"></todo-list>
```

**Empty State:**
When `todos` array is empty, displays a message: "No todos yet"

---

### TodoContainerComponent

**Location:** `src/app/components/todo-container/todo-container.component.ts`

**Purpose:** Container component that orchestrates service interactions and manages form state.

#### Public Methods

**`onAddTodo(event: AddTodoEvent): void`**

Handles the `addTodo` event from `TodoFormComponent` and delegates to `TodoDataService`.

**`onEditStart(todoId: string): void`**

Sets the specified todo item to edit mode.

**`onUpdateTodo(todoId: string, updates: UpdateTodoEvent): void`**

Handles todo updates and exits edit mode on success.

**`onCancelEdit(): void`**

Cancels edit mode for any currently editing item.

**`onDeleteTodo(todoId: string): void`**

Handles todo deletion.

**`isEditing(todoId: string): boolean`**

Checks if the specified todo item is currently in edit mode.

**`trackById(index: number, todo: TodoItem): string`**

TrackBy function for `@for` loop performance optimization.

---

## Data Models

### TodoItem

**Location:** `src/app/models/todo-item.model.ts`

**Interface:**
```typescript
interface TodoItem {
  id: string;                    // Unique identifier (generated automatically)
  description: string;           // Task description (required, non-empty)
  priority: number;              // Priority level 1-5 (required, default: 3)
  dueDate: string | null;        // ISO date string YYYY-MM-DD or null (optional)
  createdAt: string;             // ISO timestamp of creation (immutable)
}
```

**Properties:**

- **`id`**: Automatically generated unique identifier (timestamp-based with random suffix). Never user-provided.
- **`description`**: User-provided task description. Required and must be non-empty after trimming.
- **`priority`**: Numeric priority from 1 (lowest) to 5 (highest). Defaults to 3 if not specified.
- **`dueDate`**: Optional ISO date string in YYYY-MM-DD format. Can be `null` if no due date is set.
- **`createdAt`**: ISO timestamp string generated when the todo is created. Immutable after creation.

**Example:**
```typescript
const todo: TodoItem = {
  id: '1705276800000_abc123',
  description: 'Complete project report',
  priority: 5,
  dueDate: '2026-01-20',
  createdAt: '2026-01-14T10:00:00.000Z'
};
```

---

## Events

### AddTodoEvent

Emitted by `TodoFormComponent` when a new todo is submitted.

```typescript
interface AddTodoEvent {
  description: string;
  priority: number;
  dueDate: string | null;
}
```

**Validation:**
- `description`: Required, non-empty after trimming
- `priority`: Must be between 1 and 5
- `dueDate`: Must be valid YYYY-MM-DD format or null

---

### UpdateTodoEvent

Emitted by `TodoItemComponent` when changes are saved in edit mode.

```typescript
interface UpdateTodoEvent {
  description: string;
  priority: number;
  dueDate: string | null;
}
```

**Validation:**
- `description`: Required, non-empty after trimming
- `priority`: Must be between 1 and 5
- `dueDate`: Must be valid YYYY-MM-DD format or null

---

## Type Definitions

All types and interfaces are exported from their respective files:

- `TodoItem`: `src/app/models/todo-item.model.ts`
- `AddTodoEvent`: `src/app/components/todo-form/todo-form.component.ts`
- `UpdateTodoEvent`: `src/app/components/todo-item/todo-item.component.ts`

---

## Usage Patterns

### Getting Sorted Todos in a Component

```typescript
import { Component, inject } from '@angular/core';
import { TodoDataService } from '../services/todo-data.service';

@Component({ /* ... */ })
export class MyComponent {
  private todoService = inject(TodoDataService);
  
  // Get sorted todos (recommended for display)
  todos = this.todoService.getSortedTodos();
}
```

### Adding Todos Programmatically

```typescript
import { TodoDataService } from '../services/todo-data.service';

constructor(private todoService: TodoDataService) {}

addTask() {
  try {
    this.todoService.addTodo('New task', 3, '2026-01-20');
  } catch (error) {
    console.error('Failed to add todo:', error);
  }
}
```

### Handling Past-Due Items

```typescript
import { Component, inject, effect } from '@angular/core';
import { TodoDataService } from '../services/todo-data.service';

@Component({ /* ... */ })
export class MyComponent {
  private todoService = inject(TodoDataService);
  
  pastDueTodos = this.todoService.getPastDueTodos();
  
  constructor() {
    // Monitor past-due items
    effect(() => {
      const overdue = this.pastDueTodos();
      if (overdue.length > 0) {
        // Show notification, update UI, etc.
      }
    });
  }
}
```