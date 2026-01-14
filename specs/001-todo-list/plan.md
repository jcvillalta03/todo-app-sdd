# Implementation Plan: Todo List

**Branch**: `001-todo-list` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-list/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a todo list feature allowing users to track weekly tasks with priority (1-5), optional due dates, and visual past-due indicators. The feature follows Angular 21 best practices with service-based state management, container/presentational component pattern, and TDD methodology. Data persistence uses browser local storage with future API-ready service design.

## Technical Context

**Language/Version**: TypeScript 5.9.2 with strict type checking  
**Primary Dependencies**: Angular 21.0.0, Tailwind CSS 4.1.12, RxJS 7.8.0  
**Storage**: Browser LocalStorage (per constitution - future-proof service design for API migration)  
**Testing**: Vitest 4.0.8 with @testing-library/angular 19.0.0  
**Target Platform**: Web browser (Angular web application)  
**Project Type**: Web application (single-page Angular app)  
**Performance Goals**: Page load <1s (SC-002), add item <30s (SC-001), update <20s (SC-003), remove <10s (SC-004)  
**Constraints**: TDD mandatory, service-based state management, container/presentational pattern, Tailwind CSS only  
**Scale/Scope**: Single-user todo list for weekly task tracking (local storage, no multi-user requirements)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gates

✅ **TDD Compliance**: All components and services will have tests written before implementation (Red-Green-Refactor cycle)  
✅ **Service-Based State**: Todo data managed through Angular service (TodoDataService) with signals  
✅ **Container/Presentational Pattern**: Container component handles service interactions, presentational components render UI  
✅ **Tailwind CSS**: All styling uses Tailwind utility classes, verified in tests  
✅ **Future-Proof Service**: Service interface designed for local storage now, API-ready later

### Post-Phase 1 Gates (to be re-evaluated)

- TDD workflow maintained in design
- Service interface remains stable for future API integration
- Component separation (container/presentational) preserved

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── services/
│   │   ├── todo-data.service.ts
│   │   └── todo-data.service.spec.ts
│   ├── components/
│   │   ├── todo-container/
│   │   │   ├── todo-container.component.ts
│   │   │   ├── todo-container.component.html
│   │   │   └── todo-container.component.spec.ts
│   │   ├── todo-list/
│   │   │   ├── todo-list.component.ts
│   │   │   ├── todo-list.component.html
│   │   │   └── todo-list.component.spec.ts
│   │   ├── todo-item/
│   │   │   ├── todo-item.component.ts
│   │   │   ├── todo-item.component.html
│   │   │   └── todo-item.component.spec.ts
│   │   └── todo-form/
│   │       ├── todo-form.component.ts
│   │       ├── todo-form.component.html
│   │       └── todo-form.component.spec.ts
│   ├── models/
│   │   └── todo-item.model.ts
│   └── app.ts (updated to include todo feature)
```

**Structure Decision**: Single Angular web application following existing project structure. Services in `src/app/services/`, components in `src/app/components/` with feature-based subdirectories. Models in `src/app/models/`. All components are standalone per Angular 21 best practices.

## Phase 0: Research Complete

**Output**: [research.md](./research.md)

All technical decisions resolved:
- Angular Signals for state management
- LocalStorage API patterns
- Date handling approach
- Container/presentational component pattern
- Testing patterns with @testing-library/angular
- Tailwind CSS styling approach

## Phase 1: Design Complete

**Outputs**:
- [data-model.md](./data-model.md) - Entity definitions, validation rules, storage schema
- [contracts/todo-data-service.md](./contracts/todo-data-service.md) - Service interface contract
- [quickstart.md](./quickstart.md) - Developer quickstart guide

### Post-Phase 1 Constitution Check

✅ **TDD Compliance**: Design supports TDD workflow with clear test boundaries  
✅ **Service-Based State**: TodoDataService designed with signals, localStorage persistence  
✅ **Container/Presentational Pattern**: Component separation clearly defined  
✅ **Tailwind CSS**: Styling approach documented with test verification strategy  
✅ **Future-Proof Service**: Service interface designed for API migration without component changes

## Complexity Tracking

> **No violations** - All design decisions align with constitution principles.
