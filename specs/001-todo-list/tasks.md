# Tasks: Todo List

**Input**: Design documents from `/specs/001-todo-list/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: TDD is mandatory per constitution - all components and services must have tests written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/app/` at repository root
- Components: `src/app/components/[component-name]/`
- Services: `src/app/services/`
- Models: `src/app/models/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure verification and preparation

- [x] T001 Verify Angular 21 project structure exists at `src/app/`
- [x] T002 [P] Verify Tailwind CSS 4.1.12 is configured in project
- [x] T003 [P] Verify Vitest 4.0.8 and @testing-library/angular 19.0.0 are installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create TodoItem model interface in `src/app/models/todo-item.model.ts`
- [x] T005 [P] Write tests for TodoDataService in `src/app/services/todo-data.service.spec.ts` (TDD - tests must fail first)
- [x] T006 Implement TodoDataService with signals and localStorage in `src/app/services/todo-data.service.ts` (depends on T004, T005)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and View Todo Items (Priority: P1) 🎯 MVP

**Goal**: Users can create todo items with description, priority, and due date, then see them displayed in a list

**Independent Test**: Add a todo item with description, priority, and due date, then verify it appears in the list with all specified attributes

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Write tests for TodoFormComponent in `src/app/components/todo-form/todo-form.component.spec.ts`
- [x] T008 [P] [US1] Write tests for TodoListComponent in `src/app/components/todo-list/todo-list.component.spec.ts`
- [x] T009 [P] [US1] Write tests for TodoItemComponent in `src/app/components/todo-item/todo-item.component.spec.ts`
- [x] T010 [US1] Write tests for TodoContainerComponent in `src/app/components/todo-container/todo-container.component.spec.ts` (depends on T007, T008, T009)

### Implementation for User Story 1

- [x] T011 [P] [US1] Create TodoFormComponent directory structure at `src/app/components/todo-form/`
- [x] T012 [P] [US1] Create TodoListComponent directory structure at `src/app/components/todo-list/`
- [x] T013 [P] [US1] Create TodoItemComponent directory structure at `src/app/components/todo-item/`
- [x] T014 [P] [US1] Create TodoContainerComponent directory structure at `src/app/components/todo-container/`
- [x] T015 [US1] Implement TodoFormComponent in `src/app/components/todo-form/todo-form.component.ts` with description, priority (1-5), and due date inputs (depends on T011, T007)
- [x] T016 [US1] Create TodoFormComponent template in `src/app/components/todo-form/todo-form.component.html` with Tailwind CSS styling (depends on T015)
- [x] T017 [US1] Implement TodoItemComponent in `src/app/components/todo-item/todo-item.component.ts` to display single todo item (depends on T013, T009)
- [x] T018 [US1] Create TodoItemComponent template in `src/app/components/todo-item/todo-item.component.html` with Tailwind CSS styling showing description, priority, and due date (depends on T017)
- [x] T019 [US1] Implement TodoListComponent in `src/app/components/todo-list/todo-list.component.ts` to display list of todos (depends on T012, T008, T017)
- [x] T020 [US1] Create TodoListComponent template in `src/app/components/todo-list/todo-list.component.html` with Tailwind CSS styling (depends on T019)
- [x] T021 [US1] Implement TodoContainerComponent in `src/app/components/todo-container/todo-container.component.ts` integrating TodoDataService, TodoFormComponent, and TodoListComponent (depends on T014, T010, T015, T019, T006)
- [x] T022 [US1] Create TodoContainerComponent template in `src/app/components/todo-container/todo-container.component.html` with Tailwind CSS styling (depends on T021)
- [x] T023 [US1] Update app.ts to include TodoContainerComponent in main application (depends on T021)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - users can add and view todo items

---

## Phase 4: User Story 2 - Update Todo Items (Priority: P2)

**Goal**: Users can modify an existing todo item's description, priority, or due date

**Independent Test**: Create a todo item, then update its description, priority, or due date, and verify the changes are reflected in the list

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T024 [P] [US2] Write tests for TodoItemComponent edit functionality in `src/app/components/todo-item/todo-item.component.spec.ts` (extend existing tests)
- [x] T025 [US2] Write tests for TodoContainerComponent update operations in `src/app/components/todo-container/todo-container.component.spec.ts` (extend existing tests, depends on T024)

### Implementation for User Story 2

- [x] T026 [US2] Add edit mode to TodoItemComponent in `src/app/components/todo-item/todo-item.component.ts` (depends on T017, T024)
- [x] T027 [US2] Update TodoItemComponent template in `src/app/components/todo-item/todo-item.component.html` to support inline editing with Tailwind CSS styling (depends on T026)
- [x] T028 [US2] Add updateTodo method handling to TodoContainerComponent in `src/app/components/todo-container/todo-container.component.ts` (depends on T021, T025)
- [x] T029 [US2] Update TodoContainerComponent template in `src/app/components/todo-container/todo-container.component.html` to wire up edit events (depends on T028)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can add, view, and update todo items

---

## Phase 5: User Story 3 - Remove Todo Items (Priority: P3)

**Goal**: Users can delete a todo item from their list when it is completed or no longer needed

**Independent Test**: Create a todo item, then remove it, and verify it no longer appears in the list

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T030 [P] [US3] Write tests for TodoItemComponent delete functionality in `src/app/components/todo-item/todo-item.component.spec.ts` (extend existing tests)
- [ ] T031 [US3] Write tests for TodoContainerComponent remove operations in `src/app/components/todo-container/todo-container.component.spec.ts` (extend existing tests, depends on T030)

### Implementation for User Story 3

- [ ] T032 [US3] Add delete button and confirmation to TodoItemComponent in `src/app/components/todo-item/todo-item.component.ts` (depends on T017, T030)
- [ ] T033 [US3] Update TodoItemComponent template in `src/app/components/todo-item/todo-item.component.html` to include delete button with Tailwind CSS styling (depends on T032)
- [ ] T034 [US3] Add removeTodo method handling to TodoContainerComponent in `src/app/components/todo-container/todo-container.component.ts` (depends on T021, T031)
- [ ] T035 [US3] Update TodoContainerComponent template in `src/app/components/todo-container/todo-container.component.html` to wire up delete events (depends on T034)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - users can add, view, update, and remove todo items

---

## Phase 6: User Story 4 - Visual Indication of Past Due Items (Priority: P4)

**Goal**: Users can easily identify todo items that are past their due date through visual flagging

**Independent Test**: Create a todo item with a due date in the past, then verify it is visually flagged as past due

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T036 [P] [US4] Write tests for getPastDueTodos computed signal in `src/app/services/todo-data.service.spec.ts` (extend existing tests)
- [ ] T037 [P] [US4] Write tests for past-due visual indication in `src/app/components/todo-item/todo-item.component.spec.ts` (extend existing tests)

### Implementation for User Story 4

- [ ] T038 [US4] Implement getPastDueTodos computed signal in TodoDataService in `src/app/services/todo-data.service.ts` (depends on T006, T036)
- [ ] T039 [US4] Add isPastDue computed property to TodoItemComponent in `src/app/components/todo-item/todo-item.component.ts` (depends on T017, T037)
- [ ] T040 [US4] Update TodoItemComponent template in `src/app/components/todo-item/todo-item.component.html` to apply Tailwind CSS classes for past-due visual indication (e.g., text-red-600, border-red-600) (depends on T039)
- [ ] T041 [US4] Verify past-due styling appears in TodoItemComponent tests (depends on T040)

**Checkpoint**: All user stories should now be independently functional - users can add, view, update, remove, and see past-due indicators

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T042 [P] Add error handling for localStorage quota exceeded in `src/app/services/todo-data.service.ts`
- [ ] T043 [P] Add error handling for localStorage disabled in `src/app/services/todo-data.service.ts`
- [ ] T044 [P] Add validation error messages to TodoFormComponent in `src/app/components/todo-form/todo-form.component.html`
- [ ] T045 [P] Verify all Tailwind CSS classes are present in component tests
- [ ] T046 Add sorting by priority (desc) then creation time (asc) using getSortedTodos in TodoContainerComponent in `src/app/components/todo-container/todo-container.component.ts`
- [ ] T047 Update TodoContainerComponent to use getSortedTodos instead of getTodos in `src/app/components/todo-container/todo-container.component.ts`
- [ ] T048 Run quickstart.md validation and verify all examples work
- [ ] T049 Code cleanup and refactoring across all components
- [ ] T050 Performance optimization - ensure page load <1s (SC-002)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 components (extends them)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 components (extends them)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on US1 components (extends them)

### Within Each User Story

- Tests (TDD) MUST be written and FAIL before implementation
- Models before services (already done in Phase 2)
- Services before components
- Presentational components before container components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003)
- Foundational tasks: T004 and T005 can run in parallel
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Component directory creation tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members (after US1 is complete)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T007: "Write tests for TodoFormComponent in src/app/components/todo-form/todo-form.component.spec.ts"
Task T008: "Write tests for TodoListComponent in src/app/components/todo-list/todo-list.component.spec.ts"
Task T009: "Write tests for TodoItemComponent in src/app/components/todo-item/todo-item.component.spec.ts"

# Launch all component directory creation together:
Task T011: "Create TodoFormComponent directory structure at src/app/components/todo-form/"
Task T012: "Create TodoListComponent directory structure at src/app/components/todo-list/"
Task T013: "Create TodoItemComponent directory structure at src/app/components/todo-item/"
Task T014: "Create TodoContainerComponent directory structure at src/app/components/todo-container/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (MVP)
   - Developer B: User Story 2 (can start after US1 components exist)
   - Developer C: User Story 3 (can start after US1 components exist)
   - Developer D: User Story 4 (can start after US1 components exist)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD workflow: Write tests first, ensure they fail, then implement
- Verify tests fail before implementing (Red-Green-Refactor cycle)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All styling must use Tailwind CSS utility classes
- Tests must verify critical Tailwind classes are present
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
