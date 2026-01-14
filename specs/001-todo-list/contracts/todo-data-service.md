# Service Interface Contract: TodoDataService

**Date**: 2026-01-14  
**Feature**: Todo List (001-todo-list)

## Service Interface

Since this is a local storage application, this document defines the service interface contract rather than HTTP API endpoints. The service interface is designed to be API-ready for future migration.

## TodoDataService

**Location**: `src/app/services/todo-data.service.ts`

### Public Interface

```typescript
@Injectable({ providedIn: 'root' })
export class TodoDataService {
  // Returns readonly signal of all todo items
  getTodos(): ReadonlySignal<TodoItem[]>
  
  // Returns computed signal of todos sorted by priority (desc) then creation time (asc)
  getSortedTodos(): Signal<TodoItem[]>
  
  // Returns computed signal of todos filtered by past-due status
  getPastDueTodos(): Signal<TodoItem[]>
  
  // Adds a new todo item
  addTodo(description: string, priority?: number, dueDate?: string | null): void
  
  // Updates an existing todo item
  updateTodo(id: string, updates: Partial<Pick<TodoItem, 'description' | 'priority' | 'dueDate'>>): void
  
  // Removes a todo item by id
  removeTodo(id: string): void
}
```

### Method Specifications

#### `getTodos(): ReadonlySignal<TodoItem[]>`

Returns a readonly signal containing all todo items.

**Returns**: `ReadonlySignal<TodoItem[]>` - Readonly signal of all todo items

**Behavior**:
- Returns signal that updates reactively when items are added/updated/removed
- Signal is readonly to prevent external mutation
- Initial value: Empty array `[]` if no items in storage

**Error Handling**: None (always returns valid signal)

---

#### `getSortedTodos(): Signal<TodoItem[]>`

Returns a computed signal of todos sorted by priority (descending) then creation time (ascending).

**Returns**: `Signal<TodoItem[]>` - Computed signal of sorted todo items

**Sorting Rules**:
- Primary: Priority (5 → 1, descending)
- Secondary: Creation time (oldest first, ascending)

**Behavior**:
- Automatically recomputes when todos signal changes
- Returns new array reference (immutable)

---

#### `getPastDueTodos(): Signal<TodoItem[]>`

Returns a computed signal of todos that are past their due date.

**Returns**: `Signal<TodoItem[]>` - Computed signal of past-due items

**Filtering Logic**:
- Item is past due if `dueDate` exists and is today or earlier (date-only comparison)
- Items without due dates are excluded

**Behavior**:
- Automatically recomputes when todos signal or current date changes
- Returns new array reference (immutable)

---

#### `addTodo(description: string, priority?: number, dueDate?: string | null): void`

Adds a new todo item to the list.

**Parameters**:
- `description: string` (required) - Task description (non-empty, trimmed)
- `priority?: number` (optional) - Priority 1-5 (defaults to 3 if not provided)
- `dueDate?: string | null` (optional) - ISO date string (YYYY-MM-DD) or null

**Behavior**:
- Creates new TodoItem with generated `id` and `createdAt` timestamp
- Updates todos signal
- Persists to localStorage
- Throws error if description is empty or invalid

**Validation**:
- `description`: Must be non-empty string after trimming
- `priority`: Must be integer 1-5 if provided
- `dueDate`: Must be valid ISO date string (YYYY-MM-DD) or null

**Error Handling**:
- Throws `Error` if description is empty
- Throws `Error` if priority is out of range (1-5)
- Throws `Error` if dueDate format is invalid
- Logs warning if localStorage save fails (quota exceeded, disabled)

---

#### `updateTodo(id: string, updates: Partial<Pick<TodoItem, 'description' | 'priority' | 'dueDate'>>): void`

Updates an existing todo item.

**Parameters**:
- `id: string` (required) - Todo item identifier
- `updates: Partial<Pick<TodoItem, 'description' | 'priority' | 'dueDate'>>` (required) - Fields to update

**Behavior**:
- Finds todo item by id
- Applies updates to found item
- Updates todos signal
- Persists to localStorage
- Throws error if item not found or validation fails

**Validation**:
- `id`: Must exist in todos array
- `description`: If provided, must be non-empty string after trimming
- `priority`: If provided, must be integer 1-5
- `dueDate`: If provided, must be valid ISO date string (YYYY-MM-DD) or null

**Error Handling**:
- Throws `Error` if item with id not found
- Throws `Error` if any update value is invalid
- Logs warning if localStorage save fails

---

#### `removeTodo(id: string): void`

Removes a todo item from the list.

**Parameters**:
- `id: string` (required) - Todo item identifier

**Behavior**:
- Finds todo item by id
- Removes from todos array
- Updates todos signal
- Persists to localStorage
- Throws error if item not found

**Validation**:
- `id`: Must exist in todos array

**Error Handling**:
- Throws `Error` if item with id not found
- Logs warning if localStorage save fails

---

## TodoItem Model

```typescript
export interface TodoItem {
  id: string                    // Unique identifier (UUID or timestamp-based)
  description: string          // Task description (required, non-empty)
  priority: number             // Priority 1-5 (required, default: 3)
  dueDate: string | null       // ISO date string YYYY-MM-DD or null (optional)
  createdAt: string            // ISO timestamp of creation (required, immutable)
}
```

## Future API Endpoints (for reference)

When migrating to API, these endpoints would replace localStorage operations:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

Service interface remains unchanged - only internal implementation changes.
