---
name: Todo List Implementation
overview: Implement a complete todo list application following TDD principles, with a service-based architecture, container/presentational component pattern, and support for add/remove/update/reorder operations with priority ordering and due dates.
todos:
  - id: create-todo-model
    content: Create Todo interface/model in src/app/models/todo.model.ts with id, title, order, dueDate properties
    status: completed
  - id: todo-service-tests
    content: Write TodoDataService tests (empty state, add, remove, update, reorder, localStorage, past-due detection)
    status: completed
  - id: todo-service-impl
    content: Implement TodoDataService with signal-based state, localStorage persistence, and all CRUD operations
    status: completed
    dependencies:
      - todo-service-tests
  - id: todo-item-tests
    content: Write TodoItemComponent tests (rendering, events, Tailwind classes, past-due indicator)
    status: completed
  - id: todo-item-impl
    content: Implement TodoItemComponent with inputs/outputs, edit/delete/reorder buttons, past-due indicator
    status: completed
    dependencies:
      - todo-item-tests
  - id: todo-list-tests
    content: Write TodoListComponent tests (list rendering, sorting, event forwarding, Tailwind classes)
    status: completed
  - id: todo-list-impl
    content: Implement TodoListComponent with todo sorting and TodoItemComponent integration
    status: completed
    dependencies:
      - todo-list-tests
  - id: todo-container-tests
    content: Write TodoContainerComponent tests (add, remove, update, reorder, service integration)
    status: completed
  - id: todo-container-impl
    content: Implement TodoContainerComponent with forms and service integration
    status: completed
    dependencies:
      - todo-container-tests
  - id: update-app-component
    content: Update App component to use TodoContainerComponent and update tests
    status: completed
    dependencies:
      - todo-container-impl
---

# Todo List Implementation Plan

## Overview

Implement a todo list application where users can add, remove, update, and reorder items. Each todo item includes a title, priority (order), and due date with past-due flagging. The implementation follows TDD principles with a service-based architecture and container/presentational component pattern.

## Architecture

The implementation uses:

- **TodoDataService**: Manages todo state using Angular signals, with localStorage persistence (structured for future API integration)
- **Presentational Components**: `TodoItemComponent` and `TodoListComponent` (display only, receive inputs, emit events)
- **Container Component**: `TodoContainerComponent` (manages state, handles service interactions)
- **App Component**: Updated to use the container component

## Data Model

Create a Todo interface in `src/app/models/todo.model.ts`:

- `id: string` - Unique identifier
- `title: string` - Todo description
- `order: number` - Priority/order for sorting
- `dueDate: Date | null` - Due date (date only, no time)
- `isPastDue` - Computed property based on due date comparison

## Implementation Steps

### 1. Create Todo Model

Create `src/app/models/todo.model.ts` with the Todo interface.

### 2. TodoDataService (TDD First)

**File**: `src/app/services/todo-data.service.spec.ts`
Write tests for:

- Initial empty state
- Adding todos (with title, order, dueDate)
- Removing todos by id
- Updating todos
- Reordering todos (swapping order values)
- LocalStorage persistence (load/save)
- Past due detection/computation
- getTodos() returns readonly signal

**File**: `src/app/services/todo-data.service.ts`
Implement service:

- Use `signal<Todo[]>` for state
- Methods: `getTodos()`, `addTodo()`, `removeTodo()`, `updateTodo()`, `reorderTodo()`
- localStorage persistence (structure methods to be easily replaceable with API calls)
- Automatically assign order values on add
- Computed past-due status

### 3. Presentational Components (TDD First)

**TodoItemComponent**

- **File**: `src/app/components/todo-item/todo-item.component.spec.ts`
- Test rendering: title, due date, past-due visual indicator
- Test event emissions: edit, delete, reorder (up/down)
- Test Tailwind classes for styling and past-due indicator

- **File**: `src/app/components/todo-item/todo-item.component.ts`
- `@Input() todo: Todo`
- `@Output() edit = new EventEmitter<Todo>()`
- `@Output() delete = new EventEmitter<string>()`
- `@Output() moveUp = new EventEmitter<string>()`
- `@Output() moveDown = new EventEmitter<string>()`
- Display: title, formatted due date, past-due badge/indicator
- Buttons for edit, delete, reorder
- Use Tailwind CSS

**TodoListComponent**

- **File**: `src/app/components/todo-list/todo-list.component.spec.ts`
- Test rendering list of todos (sorted by order)
- Test empty state
- Test event forwarding from TodoItemComponent
- Test Tailwind classes

- **File**: `src/app/components/todo-list/todo-list.component.ts`
- `@Input() todos: Todo[]`
- `@Output() edit = new EventEmitter<Todo>()`
- `@Output() delete = new EventEmitter<string>()`
- `@Output() moveUp = new EventEmitter<string>()`
- `@Output() moveDown = new EventEmitter<string>()`
- Sort todos by order property
- Render TodoItemComponent for each todo
- Use Tailwind CSS

### 4. Container Component (TDD First)

**TodoContainerComponent**

- **File**: `src/app/components/todo-container/todo-container.component.spec.ts`
- Test adding todo (form submission)
- Test removing todo (service interaction)
- Test updating todo (service interaction)
- Test reordering todos (service interaction)
- Test service integration

- **File**: `src/app/components/todo-container/todo-container.component.ts`
- Inject TodoDataService
- Form for adding todos: title input, due date input, submit button
- Edit form/modal for updating todos
- Handle events from TodoListComponent, call service methods
- Use Tailwind CSS for form styling

### 5. Update App Component

**File**: `src/app/app.ts`

- Import TodoContainerComponent
- Replace placeholder content with TodoContainerComponent

**File**: `src/app/app.html`

- Remove placeholder content
- Add TodoContainerComponent

**File**: `src/app/app.spec.ts`

- Update tests to verify TodoContainerComponent is rendered

## Technical Details

- **Date Handling**: Use HTML date input (`<input type="date">`), store as Date objects, compare dates (not times) for past-due detection
- **Reordering**: Implement moveUp/moveDown by swapping order values between adjacent items
- **Styling**: Tailwind CSS classes (verify in tests)
- **State Management**: Angular signals via service
- **Testing**: Vitest with @testing-library/angular
- **Persistence**: localStorage (service structure allows API replacement)

## Files to Create

1. `src/app/models/todo.model.ts`
2. `src/app/services/todo-data.service.ts`
3. `src/app/services/todo-data.service.spec.ts`
4. `src/app/components/todo-item/todo-item.component.ts`
5. `src/app/components/todo-item/todo-item.component.spec.ts`
6. `src/app/components/todo-list/todo-list.component.ts`
7. `src/app/components/todo-list/todo-list.component.spec.ts`
8. `src/app/components/todo-container/todo-container.component.ts`
9. `src/app/components/todo-container/todo-container.component.spec.ts`

## Files to Modify

1. `src/app/app.ts`
2. `src/app/app.html`
3. `src/app/app.spec.ts`