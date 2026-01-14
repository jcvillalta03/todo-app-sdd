# Quickstart: Todo List Feature

**Date**: 2026-01-14  
**Feature**: Todo List (001-todo-list)

## Overview

The Todo List feature allows users to track weekly tasks with priority levels (1-5), optional due dates, and visual past-due indicators. The implementation follows Angular 21 best practices with service-based state management, container/presentational component pattern, and TDD methodology.

## Architecture

### Service Layer
- **TodoDataService**: Manages todo items state using Angular Signals, persists to localStorage

### Component Layer
- **TodoContainerComponent**: Container component that handles service interactions and form state
- **TodoListComponent**: Presentational component that displays list of todos
- **TodoItemComponent**: Presentational component that displays a single todo item
- **TodoFormComponent**: Presentational component for adding/editing todos

### Data Model
- **TodoItem**: Interface defining todo item structure (id, description, priority, dueDate, createdAt)

## Key Concepts

### Priority System
- Numeric scale: 1 (lowest) to 5 (highest)
- Default: 3 if not specified
- Sorting: Primary by priority (descending), secondary by creation time (ascending)

### Due Dates
- Format: ISO date string (YYYY-MM-DD)
- Optional field
- Past-due detection: Items with due date today or earlier are flagged

### State Management
- Uses Angular Signals for reactive state
- Service exposes readonly signals to components
- Computed signals for sorted list and past-due filtering

## Development Workflow

### TDD Process
1. Write test (should fail)
2. Implement minimal code to pass
3. Refactor
4. Repeat

### Running Tests (w/o coverage)
```bash
npm test
```

### Running Tests (w/ coverage)
```bash
npm run test:ci
```

### Running Development Server
```bash
npm start
```

## File Structure

```
src/app/
├── services/
│   ├── todo-data.service.ts          # State management service
│   └── todo-data.service.spec.ts     # Service tests
├── components/
│   ├── todo-container/               # Container component
│   ├── todo-list/                    # List presentational component
│   ├── todo-item/                    # Item presentational component
│   └── todo-form/                    # Form presentational component
└── models/
    └── todo-item.model.ts            # TodoItem interface
```

## Usage Examples

### Adding a Todo Item
```typescript
// In TodoContainerComponent
this.todoService.addTodo('Complete project report', 5, '2026-01-20');
```

### Getting Todos
```typescript
// In TodoContainerComponent
todos = this.todoService.getTodos(); // ReadonlySignal<TodoItem[]>
sortedTodos = this.todoService.getSortedTodos(); // Signal<TodoItem[]>
```

### Updating a Todo Item
```typescript
this.todoService.updateTodo(itemId, { 
  description: 'Updated description',
  priority: 4 
});
```

### Removing a Todo Item
```typescript
this.todoService.removeTodo(itemId);
```

## Testing Strategy

### Service Tests
- Test signal updates
- Test localStorage persistence
- Test validation rules
- Test error handling

### Component Tests
- **Presentational**: Test rendering, inputs, outputs
- **Container**: Test service integration, state management

### Test Examples
```typescript
// Service test
it('should add a todo item', () => {
  service.addTodo('Test todo', 3);
  expect(service.getTodos()().length).toBe(1);
});

// Presentational component test
it('should render todo items', async () => {
  const { getAllByRole } = await render(TodoListComponent, {
    componentInputs: { todos: mockTodos }
  });
  expect(getAllByRole('listitem').length).toBe(mockTodos.length);
});
```

## Styling

All styling uses Tailwind CSS utility classes:
- List layout: `flex flex-col gap-2`
- Past-due items: `text-red-600` or `border-red-600`
- Form inputs: `border rounded px-4 py-2`

Tests verify critical Tailwind classes are present.

## Data Persistence

- Storage: Browser localStorage
- Key: `'todo-app-items'`
- Format: JSON array of TodoItem objects
- Migration: Service interface designed for future API integration

## Common Tasks

### Adding a New Field to TodoItem
1. Update `TodoItem` interface in `todo-item.model.ts`
2. Update service methods to handle new field
3. Update component templates to display new field
4. Update tests

### Changing Priority Range
1. Update validation in `TodoDataService`
2. Update default priority value
3. Update UI controls (if applicable)
4. Update tests

### Migrating to API
1. Replace localStorage calls with HTTP calls in service
2. Service interface remains unchanged
3. Components require no changes

## Troubleshooting

### Items Not Persisting
- Check localStorage is enabled in browser
- Check for quota exceeded errors
- Verify service is calling localStorage methods

### Past-Due Not Updating
- Verify date comparison logic (date-only, no time)
- Check computed signal is recalculating
- Ensure dueDate format is YYYY-MM-DD

### Tests Failing
- Ensure localStorage is mocked in service tests
- Verify component inputs/outputs match test expectations
- Check Tailwind classes are correctly asserted

## Next Steps

1. Review [data-model.md](./data-model.md) for entity details
2. Review [contracts/todo-data-service.md](./contracts/todo-data-service.md) for service interface
3. Review [research.md](./research.md) for technical decisions
4. Proceed to task breakdown with `/speckit.tasks`
