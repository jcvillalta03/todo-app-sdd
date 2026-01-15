# Architecture Documentation

Comprehensive architecture overview of the Todo App application.

## Table of Contents

- [Overview](#overview)
- [Architecture Patterns](#architecture-patterns)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Persistence Layer](#persistence-layer)
- [Styling Architecture](#styling-architecture)
- [Testing Strategy](#testing-strategy)

---

## Overview

The Todo App is built using **Angular 21** with modern best practices:

- **Standalone Components**: All components are standalone (no NgModules)
- **Signals**: Reactive state management using Angular Signals
- **Modern Control Flow**: `@if` and `@for` instead of structural directives
- **Signal-based I/O**: `input()` and `output()` functions instead of decorators
- **Container/Presentational Pattern**: Clear separation of concerns
- **TDD**: Test-Driven Development with comprehensive test coverage

---

## Architecture Patterns

### Container/Presentational Pattern

The application follows the **Container/Presentational Pattern** to separate data logic from UI rendering:

#### Container Components

**`TodoContainerComponent`**
- **Responsibility**: Orchestrates application logic, manages service interactions
- **State**: Manages edit state (which todo is being edited)
- **Data**: Connects to `TodoDataService` and passes data to presentational components
- **Events**: Handles events from presentational components and delegates to service

#### Presentational Components

**`TodoFormComponent`**
- **Responsibility**: Displays form UI for adding todos
- **State**: Internal form state only (description, priority, dueDate)
- **Data**: No direct service access
- **Events**: Emits `addTodo` event to parent

**`TodoListComponent`**
- **Responsibility**: Displays list of todos
- **State**: None (pure display)
- **Data**: Receives todos via `@Input()`
- **Events**: None (pure presentation)

**`TodoItemComponent`**
- **Responsibility**: Displays single todo item with edit/delete actions
- **State**: Internal edit form state when in edit mode
- **Data**: Receives todo via `@Input()`
- **Events**: Emits edit/update/delete events to parent

**Benefits:**
- Components are highly reusable
- Easy to test (presentational components don't need service mocks)
- Clear separation of concerns
- Easy to modify UI without touching business logic

---

## Component Architecture

### Component Hierarchy

```
AppComponent
└── TodoContainerComponent (Container)
    ├── TodoFormComponent (Presentational)
    └── TodoItemComponent[] (Presentational, via @for)
```

### Component Communication Flow

```
User Action → Presentational Component → Event Emission → Container Component → Service → Signal Update → Reactive Update → UI
```

**Example: Adding a Todo**

1. User fills form in `TodoFormComponent`
2. User clicks "Add Todo" button
3. `TodoFormComponent` validates and emits `addTodo` event
4. `TodoContainerComponent` receives event via `(addTodo)="onAddTodo($event)"`
5. Container calls `todoService.addTodo(...)`
6. Service updates internal signal
7. Service saves to localStorage
8. `getSortedTodos()` computed signal recalculates
9. Container's `todos` signal updates
10. `@for` loop in template re-renders
11. New todo appears in UI

---

## State Management

### Angular Signals

The application uses **Angular Signals** for reactive state management:

#### Internal State (Service)

```typescript
private todos = signal<TodoItem[]>([]);
```

- **Private signal**: Only the service can modify it
- **Reactive**: Automatically notifies subscribers when changed
- **Initialized**: Loads from localStorage on service creation

#### Readonly Signals (Exposed to Components)

```typescript
getTodos(): Signal<TodoItem[]> {
  return this.todos.asReadonly();
}
```

- **Readonly**: Components cannot modify directly
- **Reactive**: Components automatically update when signal changes
- **Type-safe**: Full TypeScript support

#### Computed Signals (Derived State)

```typescript
getSortedTodos(): Signal<TodoItem[]> {
  return computed(() => {
    return [...this.todos()].sort(/* sorting logic */);
  });
}
```

- **Computed**: Automatically recalculates when dependencies change
- **Memoized**: Only recalculates when needed
- **Reactive**: Components using this signal update automatically

### State Updates

All state updates follow this pattern:

1. **Update Signal**: Modify internal signal using `update()` or `set()`
2. **Persist**: Save to localStorage
3. **React**: Computed signals automatically recalculate
4. **Re-render**: Components automatically re-render

**Example:**
```typescript
addTodo(description: string, priority: number, dueDate?: string | null) {
  // 1. Create new todo
  const newTodo: TodoItem = { /* ... */ };
  
  // 2. Update signal (triggers reactive updates)
  this.todos.update(todos => [...todos, newTodo]);
  
  // 3. Persist to localStorage
  this.saveTodosToStorage();
  
  // 4. Computed signals (getSortedTodos, getPastDueTodos) 
  //    automatically recalculate
  // 5. Components using these signals automatically re-render
}
```

---

## Data Flow

### Unidirectional Data Flow

The application follows **unidirectional data flow**:

```
Service (Single Source of Truth)
    ↓ (Readonly Signals)
Container Component
    ↓ (@Input)
Presentational Components
    ↓ (Events)
Container Component
    ↓ (Service Methods)
Service (State Update)
```

**Key Principles:**

1. **Single Source of Truth**: `TodoDataService` holds all todo state
2. **Data Flows Down**: Service → Container → Presentational via signals/props
3. **Events Flow Up**: Presentational → Container → Service via events/methods
4. **No Two-Way Binding**: Components don't directly modify service state

### Data Flow Examples

#### Reading Data

```
Service.getSortedTodos() 
  → Container.todos 
  → Template @for loop 
  → TodoItemComponent[todo] input
```

#### Writing Data

```
User clicks "Delete" 
  → TodoItemComponent.deleteTodo.emit(id)
  → Container.onDeleteTodo(id)
  → Service.removeTodo(id)
  → Service updates signal
  → Container.todos signal updates
  → Template re-renders
```

---

## Persistence Layer

### localStorage Strategy

**Storage Key:** `'todo-app-items'`

**Format:** JSON array of `TodoItem` objects

**Operations:**

1. **Load on Init**: Service loads todos from localStorage in constructor
2. **Save on Update**: Every state-changing operation saves to localStorage
3. **Error Handling**: Graceful degradation if localStorage fails

### localStorage Lifecycle

```
Application Start
  ↓
Service Constructor
  ↓
loadTodosFromStorage()
  ↓
Parse JSON from localStorage
  ↓
Validate data structure
  ↓
Initialize signal with loaded todos
  ↓
User Actions...
  ↓
State Changes
  ↓
saveTodosToStorage()
  ↓
JSON.stringify()
  ↓
localStorage.setItem()
```

### Error Handling

The persistence layer handles three error scenarios:

1. **QuotaExceededError**: localStorage quota exceeded
   - Logs error
   - Continues with in-memory state
   - Data available for session only

2. **SecurityError**: localStorage disabled (private browsing)
   - Logs warning
   - Continues with in-memory state
   - Data available for session only

3. **Invalid Data**: Corrupted or invalid JSON in localStorage
   - Logs warning
   - Returns empty array
   - Starts fresh

**Future-Proofing:**
- Service interface designed for easy migration to HTTP API
- Components don't know about persistence mechanism
- Only service needs changes for API migration

---

## Styling Architecture

### Tailwind CSS

All styling uses **Tailwind CSS 4.1.12** utility classes:

- **Utility-First**: No custom CSS files for component styles
- **Atomic Classes**: Small, reusable utility classes
- **Responsive**: Built-in responsive design utilities
- **Dark Mode**: Ready for dark mode support (not implemented)

### Styling Patterns

#### Component-Level Classes

Each component applies Tailwind classes directly in templates:

```html
<div class="border rounded-lg p-4 mb-2 shadow-sm">
  <!-- Component content -->
</div>
```

#### State-Based Classes

Dynamic classes based on component state:

```typescript
itemClasses = computed(() => {
  const baseClasses = 'border rounded-lg p-4 mb-2 shadow-sm';
  const pastDueClasses = this.isPastDue(todo) 
    ? 'text-red-700 border-red-300 bg-red-50' 
    : 'text-gray-900 border-gray-200 bg-white';
  return `${baseClasses} ${pastDueClasses}`;
});
```

#### Conditional Classes

Template-based conditional styling:

```html
<input
  [class.border-gray-300]="!input.invalid || !input.touched"
  [class.border-red-500]="input.invalid && input.touched"
/>
```

### Design System

**Colors:**
- Primary actions: Blue (`bg-blue-600`, `text-blue-600`)
- Destructive actions: Red (`bg-red-600`, `text-red-600`)
- Neutral actions: Gray (`bg-gray-600`, `text-gray-600`)
- Past-due indicators: Red (`text-red-700`, `border-red-300`, `bg-red-50`)
- Priority indicators: Color-coded badges (gray, blue, yellow, orange, red)

**Spacing:**
- Consistent padding: `p-4`, `p-6`
- Consistent gaps: `gap-2`, `gap-4`
- Consistent margins: `mb-2`, `mb-8`

**Typography:**
- Headings: `text-3xl`, `text-lg`
- Body: `text-sm`, `text-base`
- Font weights: `font-medium`, `font-bold`

---

## Testing Strategy

### Test Pyramid

```
          E2E Tests (Not Implemented)
              /      \
         /                \
    /                          \
Integration Tests          Unit Tests (Comprehensive)
(TodoContainerComponent)   (Services, Presentational Components)
```

### Test Types

#### Unit Tests (95%+ Coverage)

**Service Tests** (`todo-data.service.spec.ts`):
- Signal updates
- localStorage persistence
- Validation logic
- Error handling
- Computed signals

**Presentational Component Tests**:
- Rendering
- Inputs/outputs
- User interactions
- Tailwind class verification
- Conditional rendering

**Container Component Tests** (`todo-container.component.spec.ts`):
- Service integration
- Event handling
- State management
- Child component integration

### Testing Tools

- **Vitest 4.0.8**: Test runner
- **@testing-library/angular 19.0.0**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@vitest/coverage-v8**: Code coverage

### Test Patterns

#### Service Test Pattern

```typescript
describe('TodoDataService', () => {
  let service: TodoDataService;

  beforeEach(() => {
    localStorage.clear(); // Clean state
    service = new TodoDataService();
  });

  it('should add a todo', () => {
    service.addTodo('Test', 3);
    expect(service.getTodos()().length).toBe(1);
  });
});
```

#### Component Test Pattern

```typescript
describe('TodoItemComponent', () => {
  it('should render todo description', async () => {
    const { getByText } = await render(TodoItemComponent, {
      componentInputs: { todo: mockTodo }
    });
    expect(getByText('Test todo')).toBeTruthy();
  });
});
```

### Coverage Requirements

- **Line Coverage**: Minimum 95%
- **Branch Coverage**: Minimum 90%
- **Function Coverage**: Tracked (no strict requirement)
- **Enforcement**: Tests fail if coverage drops below thresholds

---

## File Organization

### Directory Structure

```
src/app/
├── services/              # Business logic layer
│   ├── todo-data.service.ts
│   └── todo-data.service.spec.ts
├── components/            # UI components
│   ├── todo-container/   # Container component
│   ├── todo-list/        # Presentational components
│   ├── todo-item/
│   └── todo-form/
├── models/                # Data models
│   └── todo-item.model.ts
├── app.ts                 # Root component
└── app.config.ts          # Application configuration
```

### Naming Conventions

- **Components**: PascalCase with `.component.ts` suffix
- **Services**: PascalCase with `.service.ts` suffix
- **Models**: PascalCase with `.model.ts` suffix
- **Tests**: Same name as source file with `.spec.ts` suffix
- **Directories**: kebab-case matching component/service name

---

## Future Considerations

### Scalability

- **API Integration**: Service interface ready for HTTP migration
- **Feature Modules**: Can be organized into feature modules if needed
- **State Management**: Can migrate to NgRx or similar if complexity grows

### Performance

- **OnPush Change Detection**: Can be added if performance issues arise
- **Virtual Scrolling**: For large lists (1000+ items)
- **Lazy Loading**: For feature modules if app grows

### Enhancements

- **Filtering**: Filter by priority, due date, completion status
- **Search**: Full-text search across descriptions
- **Bulk Operations**: Select multiple, delete/edit in batch
- **Export/Import**: JSON export/import functionality
- **Categories/Tags**: Organize todos into categories

---

## Design Decisions

### Why Signals Instead of RxJS?

- **Simpler API**: Less boilerplate than Observables
- **Better Performance**: Fine-grained reactivity
- **Angular-First**: Built-in Angular feature, no external dependency
- **Type Safety**: Excellent TypeScript support

### Why Container/Presentational Pattern?

- **Testability**: Presentational components easy to test in isolation
- **Reusability**: Components can be reused in different contexts
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add features without breaking existing code

### Why localStorage Instead of Backend?

- **Simplicity**: No backend infrastructure needed
- **Performance**: Instant saves, no network latency
- **Offline**: Works without internet connection
- **Future-Proof**: Service interface ready for API migration

---

## Summary

The Todo App architecture prioritizes:

1. **Simplicity**: Easy to understand and maintain
2. **Testability**: Comprehensive test coverage with clear patterns
3. **Reactivity**: Modern Angular Signals for efficient updates
4. **Separation of Concerns**: Container/Presentational pattern
5. **Future-Proof**: Ready for API migration and feature additions