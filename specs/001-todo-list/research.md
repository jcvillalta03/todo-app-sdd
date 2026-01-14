# Research: Todo List Feature

**Date**: 2026-01-14  
**Feature**: Todo List (001-todo-list)

## Research Areas

### 1. Angular Signals for State Management

**Decision**: Use Angular Signals (`signal()`, `computed()`) in TodoDataService for reactive state management.

**Rationale**: 
- Angular 21 recommends signals for reactive state management
- Signals provide automatic change detection and efficient updates
- `computed()` signals enable derived state (e.g., sorted list, past-due items)
- Signals work seamlessly with local storage persistence
- Aligns with constitution requirement for service-based state management

**Alternatives considered**:
- RxJS Observables: More complex, signals are the modern Angular approach
- Plain state objects: No reactivity, requires manual change detection

**Implementation notes**:
- Use `signal<TodoItem[]>()` for todo items array
- Use `computed()` for sorted list (by priority, then creation time)
- Use `computed()` for past-due detection
- Expose readonly signals via `asReadonly()` to prevent external mutation

### 2. LocalStorage API Patterns

**Decision**: Use browser `localStorage` API with JSON serialization for persistence.

**Rationale**:
- Constitution requires local storage initially with future API-ready design
- localStorage is synchronous and simple for MVP
- JSON serialization handles TodoItem objects cleanly
- Service abstraction allows future API replacement without component changes

**Alternatives considered**:
- IndexedDB: Overkill for simple todo list, adds complexity
- SessionStorage: Data lost on tab close, not suitable for persistence requirement
- In-memory only: Violates FR-011 (persistence requirement)

**Implementation notes**:
- Storage key: `'todo-app-items'`
- Serialize/deserialize on service methods (add, update, remove)
- Handle localStorage errors gracefully (quota exceeded, disabled)
- Service interface remains unchanged for future API migration

### 3. Date Handling in TypeScript/Angular

**Decision**: Use native JavaScript `Date` objects with date-only comparison (ignore time component).

**Rationale**:
- Spec requires date-only (no time component)
- JavaScript Date handles date parsing and comparison well
- Use `toISOString().split('T')[0]` for date-only string format (YYYY-MM-DD)
- Compare dates using date-only string comparison or date object comparison

**Alternatives considered**:
- date-fns library: Adds dependency, native Date sufficient
- Moment.js: Deprecated, not recommended
- Custom date string format: Less standard, harder to validate

**Implementation notes**:
- Store due date as ISO date string (YYYY-MM-DD) in TodoItem model
- Parse to Date object for comparison
- Past-due detection: compare due date (date-only) with today (date-only)
- Timezone: Use local timezone for "today" comparison (per edge case note)

### 4. Container/Presentational Pattern in Angular

**Decision**: Separate TodoContainerComponent (container) from TodoListComponent and TodoItemComponent (presentational).

**Rationale**:
- Constitution Principle III requires container/presentational separation
- Container handles service injection, state management, side effects
- Presentational components receive inputs, emit outputs, no service dependencies
- Enables independent testing: presentational with mock data, container with service integration

**Component breakdown**:
- **TodoContainerComponent**: Injects TodoDataService, manages form state, handles add/update/remove operations
- **TodoListComponent**: Presentational - receives `todos` input, emits selection/action events
- **TodoItemComponent**: Presentational - displays single todo item, emits edit/delete events
- **TodoFormComponent**: Presentational - form inputs/outputs, emits submit/cancel events

**Testing strategy**:
- Presentational: Test rendering, input binding, output emission
- Container: Test service integration, state updates, side effects

### 5. Testing Patterns with @testing-library/angular

**Decision**: Use @testing-library/angular for component testing with Vitest.

**Rationale**:
- Constitution requires Vitest with @testing-library/angular
- Testing Library focuses on user interactions and accessibility
- Matches TDD workflow: write tests first, verify behavior from user perspective
- Supports both presentational and container component testing patterns

**Testing patterns**:
- **Service tests**: Direct service instantiation, test signal updates, localStorage interactions
- **Presentational component tests**: Render with inputs, query by role/text, fire events, assert outputs
- **Container component tests**: Render with service provider, test user interactions, verify service calls
- **Integration tests**: Test full user workflows (add → view → update → remove)

**Test structure**:
- Unit tests: `*.spec.ts` files co-located with components/services
- Test descriptions: Use "should [expected behavior] when [condition]" format
- Arrange-Act-Assert pattern
- Mock localStorage in service tests

### 6. Tailwind CSS Utility Classes for Todo UI

**Decision**: Use Tailwind utility classes for all styling, verify critical classes in tests.

**Rationale**:
- Constitution Principle IV requires Tailwind CSS only
- Utility-first approach provides consistent styling
- Test class presence to ensure UI consistency

**Key styling requirements**:
- List layout: `flex`, `flex-col`, `gap-*` utilities
- Past-due indication: `text-red-*`, `border-red-*`, or `bg-red-*` utilities
- Form inputs: `border`, `rounded`, `px-*`, `py-*` utilities
- Priority display: Color coding or badge styling with Tailwind utilities

**Testing approach**:
- Assert presence of critical Tailwind classes in component tests
- Example: `expect(element).toHaveClass('text-red-600')` for past-due items

## Summary

All research areas resolved. No NEEDS CLARIFICATION markers remain. Technical decisions align with constitution principles and Angular 21 best practices. Ready to proceed to Phase 1 design.
