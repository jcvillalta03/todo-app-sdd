# Spec Driven Development

This repository used Spec-Driven Development with SpecKit to create the Todo list application.

SpecKit provides a framework for structured, testable feature specifications, helping teams clearly define user requirements, acceptance criteria, and test scenarios before implementation.

The process followed can is detailed below

## Process followed

### 1. Created Constitution (done once, updated infrquestly)

The **SpecKit constitution** is a structured markdown file that serves as the high-level governance and process agreement for a project. It defines the core rules, roles, artifact types, and team behaviors for using Spec Driven Development (SDD) within the repository. 

**Generating a SpecKit Constitution:**

   - Run: `/speckit.constitution` in Cursor  
     This generates a starter constitution in markdown, and inspects repository
   - Edit the markdown to fit your project's context: update participants, artifact types, review process, etc.
   - Commit the constitution to the `docs/sdd/` directory (e.g., as `CONSTITUTION.md`).

The constitution is referenced before any major spec or feature is created, ensuring everyone follows the agreed process.

**Why it matters:** The constitution provides firm guidelines and traceability, enabling an effective SDD cycle—clear feature specs, testable acceptance criteria, and aligned team understanding before implementation begins.

See [Step 1: Create Todo List Feature Specification #1 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/1) for the output from this step


### 2. Created Plan 

To establish the project's initial roadmap using SpecKit, I executed the `/speckit.plan` command. This generated a comprehensive planning artifact, including a proposed feature roadmap, quickstart guide, and development sequence, tailored for Spec Driven Development.  
I carefully reviewed the generated plan and accompanying quickstart instructions to ensure that the outlined milestones, deliverables, and conventions aligned with our team's goals and the SDD process. After confirming the plan's clarity, completeness, and suitability for our Todo List project, I moved on to the next step  

**Why this step matters in SpecKit:**  
Generating and reviewing the plan at this stage ensures that all contributors have a shared, explicit understanding of project priorities and implementation approach, as defined by SpecKit's philosophy. By locking in the plan before writing code or specs, we minimize ambiguity, shorten feedback cycles, and guarantee that every implementation step references a consensus-driven roadmap.

See [Planning & Implementation - User Story 1 | Add & VIew Todos #3 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/3) for the output from this step

### 3. Created Task List

To operationalize the project roadmap generated in the planning step, I executed the `/speckit.tasks` command. This SpecKit feature automatically takes the high-level plan and decomposes it into clear, actionable development tasks, each mapped directly to feature requirements and user stories.  
I carefully reviewed the generated task list for completeness, relevance, and proper alignment with our acceptance criteria. Once satisfied, I moved on to the next step

See [Planning & Implementation - User Story 1 | Add & VIew Todos #3 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/3) for the output from this step

### 4. Began Implementation on Foundation/Setup Tasks and the first User Story: Add/View Todos

To initiate development in line with SpecKit's test-first philosophy, I executed the `/speckit.implement` command. This triggered an automated workflow that generated implementation scaffolding and initial test suites, beginning with the foundational setup and the MVP (Minimum Viable Product) features as defined in our task list. By leveraging `/speckit.implement`, SpecKit ensured that all code and tests were directly traceable to the tasks, that line up with user stories and acceptance criteria established in our specifications.

After reviewing the generated output—including both test stubs and implementation code for the setup and core todo list functionality—I submitted a pull request for team review, ensuring each step remained tightly coupled to our defined SDD process.

See [Planning & Implementation - User Story 1 | Add & VIew Todos #3 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/3) for the output from this step

### 5. Implemented Second User Story - Edit Todos

To advance to the next development phase—implementing User Story 2 (Edit Todos)—I once again leveraged SpecKit's `/speckit.implement` command. This command activated SpecKit's automated workflow for task decomposition and test-driven scaffolding, ensuring that all new code for editing todos was mapped precisely to our specification requirements and acceptance criteria.


See [Implementation - User Story 2 | Edit Todos #5 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/5) for the output from this step

### 5. Implemented Third User Story - Remove Todos

To advance to the next development phase—implementing User Story 3 (Remove Todos)—I once again leveraged SpecKit's `/speckit.implement` command.

See [Implementation - User Story 3 | Remove Todos #6 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/6) for the output from this step

### 5. Implementation Cleanup and Documentation

To advance to the next development phase—implementing User Story 3 (Remove Todos)—I once again leveraged SpecKit's `/speckit.implement` command and looked for any remaining work to be done. The assistant recommended documentation.

See [Implementation - Cleanup & Documentation #7 PR](https://github.com/jcvillalta03/todo-app-sdd/pull/7) for the output from this step