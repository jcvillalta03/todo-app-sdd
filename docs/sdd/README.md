# Spec-Driven Development Guide

This repository demonstrates **Spec-Driven Development (SDD)** using **SpecKit**, a framework for creating structured, testable feature specifications. This guide walks through the complete SDD process used to build the Todo List application, from initial constitution to final implementation.

## What is Spec-Driven Development?

Spec-Driven Development is a methodology that emphasizes **defining clear, testable specifications before writing code**. By establishing requirements, acceptance criteria, and test scenarios upfront, teams can:

- Reduce ambiguity and miscommunication
- Enable parallel development with clear contracts
- Ensure traceability from requirements to implementation
- Maintain high code quality through test-first development
- Create living documentation that stays synchronized with code

**SpecKit** provides the tooling and structure to make SDD practical, with commands that generate and validate specifications, plans, and task breakdowns.

## The SDD Process: A Complete Walkthrough

### Phase 1: Establish Governance (One-Time Setup)

#### Step 1: Create the Constitution

The **Constitution** is the foundational governance document that defines how SDD will be practiced in your project. It establishes the non-negotiable principles, development workflows, and quality gates that all features must follow.

**What we did:**
- Executed `/speckit.constitution` in Cursor
- Generated a starter constitution template
- Customized it for our Angular project context, including:
  - Test-Driven Development (TDD) as mandatory
  - Service-based state management requirements
  - Container/Presentational component pattern
  - Tailwind CSS styling standards
  - 95% test coverage threshold

**Artifacts created:**
- `.specify/memory/constitution.md` - The authoritative governance document

**Why this matters:**
The constitution ensures consistency across all features. Every specification, plan, and implementation must align with these principles, providing a shared understanding and preventing technical debt from creeping in.

**Reference:** [Step 1: Create Todo List Feature Specification #1 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/1)

---

### Phase 2: Feature Specification

#### Step 2: Create the Feature Specification

The **Feature Specification** (`spec.md`) is the user-facing document that defines what the feature does, why it exists, and how users will interact with it. It's written in business language, avoiding implementation details.

**What we did:**
- Defined the Todo List feature requirements
- Identified 4 user stories with clear priorities (P1-P4)
- Established acceptance criteria for each story
- Documented edge cases and clarifications
- Created measurable success criteria

**Artifacts created:**
- `specs/001-todo-list/spec.md` - Complete feature specification
- `specs/001-todo-list/checklists/requirements.md` - Quality checklist

**Key elements:**
- **User Stories**: Prioritized journeys (Add/View, Update, Remove, Past-Due Indicators)
- **Functional Requirements**: 12 requirements (FR-001 through FR-012)
- **Success Criteria**: 7 measurable outcomes (SC-001 through SC-007)
- **Edge Cases**: Explicit handling of timezones, long descriptions, non-existent items

**Why this matters:**
The specification serves as the contract between stakeholders and developers. It's testable, unambiguous, and provides the foundation for all subsequent planning and implementation work.

---

### Phase 3: Technical Planning

#### Step 3: Generate the Implementation Plan

The **Implementation Plan** (`plan.md`) translates the feature specification into technical decisions, architecture choices, and development phases. It bridges the gap between "what" (spec) and "how" (implementation).

**What we did:**
- Executed `/speckit.plan` command
- Generated comprehensive planning artifacts including:
  - Technical context (Angular 21, TypeScript, Tailwind CSS)
  - Architecture decisions (Signals, localStorage, Container/Presentational pattern)
  - Phase breakdown (Research → Design → Implementation)
  - Constitution compliance verification

**Artifacts created:**
- `specs/001-todo-list/plan.md` - Implementation roadmap
- `specs/001-todo-list/research.md` - Technical decision log
- `specs/001-todo-list/data-model.md` - Entity definitions
- `specs/001-todo-list/contracts/todo-data-service.md` - Service interface contract
- `specs/001-todo-list/quickstart.md` - Developer quickstart guide

**Key decisions documented:**
- Angular Signals for reactive state management
- localStorage for persistence (with API-ready service design)
- Container/Presentational component pattern
- TDD workflow with Vitest and @testing-library/angular

**Why this matters:**
The plan ensures all technical decisions are explicit and justified. It provides a roadmap that developers can follow, and it documents the "why" behind architectural choices for future reference.

**Reference:** [Planning & Implementation - User Story 1 | Add & View Todos #3 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/3)

---

### Phase 4: Task Decomposition

#### Step 4: Generate the Task List

The **Task List** (`tasks.md`) breaks down the implementation plan into concrete, actionable tasks. Each task is mapped to specific requirements, has clear dependencies, and follows TDD principles.

**What we did:**
- Executed `/speckit.tasks` command
- Generated 50 tasks organized by phase and user story
- Ensured TDD workflow (tests before implementation)
- Established clear dependencies and parallel execution opportunities
- Mapped every task to functional requirements

**Artifacts created:**
- `specs/001-todo-list/tasks.md` - Complete task breakdown

**Task organization:**
- **Phase 1**: Setup (3 tasks) - Infrastructure verification
- **Phase 2**: Foundational (3 tasks) - Core service and models
- **Phase 3**: User Story 1 (17 tasks) - Add and View functionality
- **Phase 4**: User Story 2 (6 tasks) - Update functionality
- **Phase 5**: User Story 3 (6 tasks) - Remove functionality
- **Phase 6**: User Story 4 (6 tasks) - Past-due visual indicators
- **Phase 7**: Polish (9 tasks) - Error handling, validation, optimization

**Key features:**
- Each task includes exact file paths
- Dependencies clearly marked
- Parallel execution opportunities identified with `[P]` markers
- TDD enforced: test tasks before implementation tasks

**Why this matters:**
The task list provides a clear, actionable roadmap. Developers know exactly what to build, in what order, and how tasks relate to requirements. This enables accurate estimation, parallel work, and progress tracking.

**Reference:** [Planning & Implementation - User Story 1 | Add & View Todos #3 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/3)

---

### Phase 5: Implementation

#### Step 5: Implement Foundation and MVP (User Story 1)

Following TDD principles, we began implementation with the foundational infrastructure and the first user story, which represents the Minimum Viable Product (MVP).

**What we did:**
- Executed `/speckit.implement` command
- Implemented foundational components:
  - `TodoItem` model interface
  - `TodoDataService` with Angular Signals and localStorage
- Implemented User Story 1 components:
  - `TodoFormComponent` - Form for adding todos
  - `TodoItemComponent` - Display single todo item
  - `TodoListComponent` - Display list of todos
  - `TodoContainerComponent` - Orchestrates the feature
- Wrote comprehensive tests before implementation (TDD)
- Achieved 100% test coverage for service layer

**Implementation highlights:**
- All components follow Container/Presentational pattern
- Service uses Angular Signals for reactive state
- localStorage persistence with error handling
- Tailwind CSS styling throughout
- Modern Angular 21 patterns (signals-based I/O, `@if`/`@for` control flow)

**Why this matters:**
Starting with the foundation and MVP ensures we have a working, testable system early. Each user story builds on this foundation, maintaining quality and consistency.

**Reference:** [Planning & Implementation - User Story 1 | Add & View Todos #3 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/3)

---

#### Step 6: Implement User Story 2 - Update Functionality

Building on the MVP, we added the ability to edit existing todo items.

**What we did:**
- Extended `TodoItemComponent` with inline editing mode
- Added update handling in `TodoContainerComponent`
- Implemented form validation for edits
- Maintained TDD workflow with tests first

**Key features:**
- Inline editing with save/cancel actions
- Validation ensures data integrity
- Automatic list re-sorting after priority changes
- Past-due status updates when due date changes

**Reference:** [Implementation - User Story 2 | Edit Todos #5 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/5)

---

#### Step 7: Implement User Story 3 - Remove Functionality

Added the ability to delete todo items when completed or no longer needed.

**What we did:**
- Added delete button to `TodoItemComponent`
- Implemented removal logic in service
- Added error handling for non-existent items
- Maintained data integrity throughout

**Key features:**
- Immediate removal from list
- Automatic localStorage update
- Graceful error handling
- List re-renders automatically via signals

**Reference:** [Implementation - User Story 3 | Remove Todos #6 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/6)

---

#### Step 8: Implement User Story 4 - Past-Due Visual Indicators

Added visual highlighting for todo items that are past their due date.

**What we did:**
- Implemented `getPastDueTodos()` computed signal in service
- Added `isPastDue()` method to `TodoItemComponent`
- Applied Tailwind CSS classes for visual indication (red styling)
- Ensured automatic updates when dates change

**Key features:**
- Automatic detection using date comparison
- Visual styling (red text, border, background)
- Updates reactively when due dates change
- 100% accuracy verified through tests

---

#### Step 9: Polish and Cross-Cutting Concerns

Completed the implementation with error handling, validation, and optimizations.

**What we did:**
- Added comprehensive error handling for localStorage (quota exceeded, disabled)
- Implemented form validation with user-friendly error messages
- Added sorting by priority and creation time
- Optimized performance to meet success criteria
- Updated code to follow Angular 21 best practices
- Created comprehensive documentation

**Key improvements:**
- Graceful degradation when localStorage fails
- Clear validation feedback in forms
- Optimized rendering with computed signals
- Complete API and architecture documentation

**Reference:** [Implementation - Cleanup & Documentation #7 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/7)

---

## Final Results

### Implementation Statistics

- **Total Tasks**: 50/50 completed (100%)
- **User Stories**: 4/4 implemented
- **Functional Requirements**: 12/12 satisfied
- **Test Coverage**: 97.32% lines, 91.75% branches (exceeds 95% threshold)
- **Tests**: 92 tests, all passing

### Artifacts Created

**Specification Artifacts:**
- `spec.md` - Feature specification (Status: Complete)
- `plan.md` - Implementation plan
- `tasks.md` - Task breakdown
- `research.md` - Technical decisions
- `data-model.md` - Entity definitions
- `contracts/` - Service interface contracts
- `quickstart.md` - Developer guide

**Implementation Artifacts:**
- 5 components (Container + 4 Presentational)
- 1 service (TodoDataService)
- 1 model (TodoItem)
- 6 test suites (92 tests)
- Comprehensive documentation (README, API docs, Architecture docs)

### Quality Metrics

- ✅ All tests passing
- ✅ Coverage exceeds thresholds
- ✅ Constitution compliance verified
- ✅ All requirements traceable to implementation
- ✅ Modern Angular 21 best practices followed
- ✅ Complete documentation

---

## Key Takeaways

### What Worked Well

1. **Clear Requirements**: The specification provided unambiguous requirements, reducing rework
2. **TDD Discipline**: Writing tests first caught design issues early
3. **Incremental Delivery**: Each user story delivered value independently
4. **Traceability**: Every line of code can be traced back to a requirement
5. **Documentation**: Living documentation stays synchronized with code

### SDD Benefits Realized

- **Reduced Ambiguity**: Clear specifications eliminated guesswork
- **Faster Development**: Parallel work enabled by clear contracts
- **Higher Quality**: TDD and coverage requirements ensured robust code
- **Better Communication**: Shared understanding through explicit artifacts
- **Maintainability**: Clear architecture decisions documented for future developers

---

## Next Steps

For teams adopting SDD:

1. **Start with Constitution**: Establish your project's governance principles
2. **Specify Before Planning**: Write clear, testable specifications
3. **Plan Before Coding**: Make technical decisions explicit
4. **Task Before Implementation**: Break work into actionable, traceable tasks
5. **Test Before Code**: Maintain TDD discipline throughout
6. **Document Continuously**: Keep documentation synchronized with implementation

---

## Resources

- **SpecKit Commands**: `/speckit.constitution`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`, `/speckit.analyze`
- **Constitution**: `.specify/memory/constitution.md`
- **Feature Specification**: `specs/001-todo-list/spec.md`
- **Implementation Plan**: `specs/001-todo-list/plan.md`
- **Task List**: `specs/001-todo-list/tasks.md`
- **Project Documentation**: `README.md`, `docs/API.md`, `docs/ARCHITECTURE.md`