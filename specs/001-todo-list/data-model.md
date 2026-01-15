# Data Model: Todo List Feature

**Date**: 2026-01-14  
**Feature**: Todo List (001-todo-list)

## Entities

### TodoItem

Represents a single task the user wants to track.

**Attributes**:
- `id: string` (required) - Unique identifier for the todo item (UUID or timestamp-based)
- `description: string` (required) - Text description of the task
- `priority: number` (optional, default: 3) - Numeric priority from 1-5 (1 = lowest, 5 = highest)
- `dueDate: string | null` (optional) - ISO date string (YYYY-MM-DD format) or null if no due date
- `createdAt: string` (required) - ISO timestamp of when the item was created (for sorting by creation time)

**Validation Rules**:
- `description`: Must be non-empty string (trimmed length > 0)
- `priority`: Must be integer between 1 and 5 (inclusive) if provided
- `dueDate`: Must be valid ISO date string (YYYY-MM-DD) or null
- `id`: Must be unique across all todo items
- `createdAt`: Automatically set on creation, immutable

**State Transitions**:
- **Created**: New item added with description (and optionally priority, dueDate)
- **Updated**: Description, priority, or dueDate modified
- **Removed**: Item deleted from list

**Storage**:
- Stored in browser localStorage as JSON array
- Key: `'todo-app-items'`
- Serialization: `JSON.stringify(todoItems[])`
- Deserialization: `JSON.parse(localStorage.getItem('todo-app-items') || '[]')`

**Sorting Rules**:
- Primary: Priority (descending: 5 → 1)
- Secondary: Creation time (ascending: oldest first)
- Items with same priority and creation time: Maintain insertion order

**Derived Properties** (computed):
- `isPastDue: boolean` - True if dueDate exists and is today or earlier (date-only comparison)
- `hasDueDate: boolean` - True if dueDate is not null

## Data Flow

1. **Create**: User input → TodoFormComponent → TodoContainerComponent → TodoDataService.addTodo() → Signal update → localStorage save
2. **Read**: TodoDataService.getTodos() → Readonly signal → TodoContainerComponent → TodoListComponent → TodoItemComponent (rendering)
3. **Update**: User edit → TodoItemComponent event → TodoContainerComponent → TodoDataService.updateTodo() → Signal update → localStorage save
4. **Delete**: User delete → TodoItemComponent event → TodoContainerComponent → TodoDataService.removeTodo() → Signal update → localStorage save

## LocalStorage Schema

```json
{
  "todo-app-items": [
    {
      "id": "uuid-or-timestamp",
      "description": "Complete project report",
      "priority": 5,
      "dueDate": "2026-01-20",
      "createdAt": "2026-01-14T10:30:00.000Z"
    },
    {
      "id": "uuid-or-timestamp-2",
      "description": "Buy groceries",
      "priority": 3,
      "dueDate": null,
      "createdAt": "2026-01-14T11:00:00.000Z"
    }
  ]
}
```

## Error Handling

- **localStorage quota exceeded**: Show user-friendly error, prevent data loss by not saving new items until space available
- **localStorage disabled**: Gracefully degrade to in-memory only, show warning to user
- **Invalid data on load**: Validate on deserialization, filter out invalid items, log warnings
- **Missing required fields**: Validation in service methods, throw errors for invalid data

## Future API Migration

Service interface designed to support future API integration:

- Current: `localStorage.getItem/setItem` in service methods
- Future: Replace with HTTP calls to API endpoints
- Service interface remains unchanged: `addTodo()`, `updateTodo()`, `removeTodo()`, `getTodos()`
- Components require no changes when migrating to API
