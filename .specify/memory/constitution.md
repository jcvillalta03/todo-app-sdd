<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0 (Initial constitution establishment)
Modified Principles: N/A (new file)
Added Sections: Core Principles (5 principles), Technology Stack, Development Workflow, Governance
Removed Sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section already exists and will reference this constitution
  ✅ spec-template.md - No changes needed, already supports TDD and testing requirements
  ✅ tasks-template.md - No changes needed, already supports TDD workflow
Follow-up TODOs: None
-->

# TodoApp Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)

All features MUST follow Test-Driven Development (TDD) methodology. Tests MUST be written before implementation. The Red-Green-Refactor cycle is strictly enforced: Write tests → User approved → Tests fail → Then implement → Refactor.

**Rationale**: TDD ensures code correctness, prevents regressions, and drives better design by forcing clear interfaces and testable components from the start.

### II. Service-Based State Management

All data management MUST be handled through Angular services. Components MUST NOT directly manage complex state. Services MUST be self-contained, independently testable, and structured to allow future API integration without breaking component interfaces.

**Rationale**: Decoupling data logic from components enables easier testing, future API integration, and maintains clear separation of concerns. Services act as the single source of truth for application state.

### III. Container/Presentational Pattern

Components MUST be clearly separated into Container components (managing state and side effects) and Presentational components (rendering UI based on inputs and emitting events). Container components handle service interactions; Presentational components receive data via inputs and communicate via outputs.

**Rationale**: This pattern ensures components are simple, focused, and easily testable. Presentational components can be tested in isolation with mock data, while container components can be tested for integration and side effects.

### IV. Tailwind CSS Styling

All styling MUST use Tailwind CSS utility classes. Custom CSS SHOULD be avoided unless Tailwind utilities are insufficient. Tests MUST verify critical Tailwind utility classes appear in rendered markup.

**Rationale**: Tailwind CSS provides consistent, maintainable styling with utility-first approach. Verifying classes in tests ensures UI consistency and prevents accidental style regressions.

### V. Future-Proof Service Design

Services MUST be designed to support local storage initially but structured such that API integration can be a drop-in replacement without breaking tests or component interfaces. Service interfaces MUST remain stable regardless of data source.

**Rationale**: This approach allows rapid development with local storage while ensuring smooth transition to API-backed services. The interface contract remains unchanged, protecting component code from data source changes.

## Technology Stack

**Framework**: Angular 21 (standalone components, signals, modern control flow)  
**Styling**: Tailwind CSS 4.x  
**Testing**: Vitest with @testing-library/angular  
**Language**: TypeScript with strict type checking  
**State Management**: Angular Signals (via services)

## Development Workflow

**Testing Requirements**: All services and components MUST have unit tests written before implementation. Tests MUST specify all inputs, outputs, and expected behavior. Presentational components require rendering and event emission tests. Container components require integration and side effect tests.

**Code Review**: All PRs MUST verify constitution compliance. Complexity MUST be justified. Tests MUST pass before merge.

**Quality Gates**: No code can be merged without passing tests. TDD workflow MUST be followed (tests written and failing before implementation begins).

## Governance

This constitution supersedes all other development practices and guidelines. Amendments require:

1. Documentation of the proposed change and rationale
2. Approval through project governance process
3. Migration plan for any breaking changes
4. Version increment following semantic versioning:
   - **MAJOR**: Backward incompatible principle removals or redefinitions
   - **MINOR**: New principles added or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes

All development work MUST comply with these principles. Violations require explicit justification and approval. Use `.specify/memory/constitution.md` as the authoritative reference for all development decisions.

**Version**: 1.0.0 | **Ratified**: 2026-01-14 | **Last Amended**: 2026-01-14
