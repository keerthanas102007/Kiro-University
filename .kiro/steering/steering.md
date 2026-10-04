# Kiro Project Steering Document: Todo App

## 1. Project Overview and Purpose

The **Todo App** is a responsive, animated client-side web application designed to help users organize tasks with priorities, categories, persistent local storage, search/filtering, and progress tracking. 

### Core Objectives
- Provide an intuitive, fast, and delightful task management interface.
- Maintain persistent client-side state across browser sessions.
- Offer actionable progress metrics and priority/category organization.

---

## 2. Technology Stack and Architecture

### Tech Stack
- **Language**: Vanilla JavaScript (ES6+ modules), HTML5, CSS3
- **Build Tool**: Vite (`npm run dev`, `npm run build`)
- **Persistence**: Browser LocalStorage API (`todoAppTasks`)
- **Code Quality**: ESLint, Prettier
- **Test Runner**: Jest, fast-check (property testing)

### Layered Architecture
```
┌─────────────────────────────────────────────┐
│              UI / Main Layer                │
│  - src/main.js (DOM, Event Listeners, View) │
└───────────────┬─────────────────────────────┘
                │ coordinates & renders
                ↓
┌─────────────────────────────────────────────┐
│              Services Layer                 │
│  - TaskManager, StorageService,              │
│    FilterEngine, StatisticsCalculator        │
└───────────────┬─────────────────────────────┘
                │ operates on
                ↓
┌─────────────────────────────────────────────┐
│               Models Layer                  │
│  - Task, TaskList, FilterCriteria,          │
│    Statistics                               │
└─────────────────────────────────────────────┘
```

### Architectural Principles & Boundaries
1. **Unidirectional Dependency Flow**: 
   - Main/UI layer depends on Services.
   - Services depend on Models.
   - Models have zero dependencies on Services or UI logic.
   - **No reverse dependencies permitted.**
2. **State Management**:
   - `TaskManager` is the single source of truth for task mutations.
   - UI views must not directly mutate state objects; all updates pass through `TaskManager`.
3. **Pure Logic Separation**:
   - `FilterEngine` and `StatisticsCalculator` are pure services operating on arrays/collections without side effects or state persistence.

---

## 3. Coding Conventions and Maintainability Rules

### Conventions
- **ES6 Modules**: Use standard `import` / `export` syntax.
- **Naming Conventions**:
  - `PascalCase` for classes and constructors (`Task`, `TaskManager`).
  - `camelCase` for variables, functions, and method names (`createTask`, `calculateStatistics`).
  - `UPPER_SNAKE_CASE` for global constants (`Priority`, `TaskStatus`).
- **Safe Object Property Access**: Use `Object.prototype.hasOwnProperty.call(obj, prop)` instead of invoking `obj.hasOwnProperty(prop)` directly.
- **Validation**:
  - Title: Required, 1 to 200 characters.
  - Description: Optional, maximum 1000 characters.
  - Category: String, max 50 characters (defaults to "Uncategorized").
  - Priority: Enum (`Critical`, `High`, `Medium`, `Low`, defaults to `Medium`).

---

## 4. UI/UX Principles

### Design System
- **Color Palette**: Curated CSS custom properties (`--primary-color: #4f46e5`, `--success-color: #10b981`, `--danger-color: #ef4444`, `--warning-color: #f59e0b`).
- **Typography**: Clean system sans-serif hierarchy for maximum legibility.

### Responsive Breakpoints
- **Mobile (< 768px)**: Single column layout, full-width cards, vertically stacked controls. Minimum 44x44px touch targets.
- **Tablet (768px – 1024px)**: Two column layout (task section left, stats right).
- **Desktop (> 1024px)**: Three column layout (filters left, tasks center, stats right).

### Micro-Animations
- **Task Addition**: Smooth fade-in (`opacity` 0 → 1, `translateY` -20px → 0px, 300ms).
- **Task Removal**: Smooth fade-out (`opacity` 1 → 0, `translateY` 0px → 20px, 300ms).
- **Status Change**: Background transition and strikethrough animation.
- **Progress Bar**: Smooth fill transition (`transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1)`).

---

## 5. Testing and Validation Expectations

- **Unit Tests**: Test boundary conditions, error handlers, and default values for models and services.
- **Property-Based Tests**: Verify correctness properties (e.g. data serialization round-trips, pure filter functions) using `fast-check`.
- **Pre-commit Checks**: Run `npm run lint` and verify build stability prior to submitting changes.

---

## 6. Rules for Preserving Architecture & Avoiding Unrelated Changes

1. **Do Not Regenerate Specification Documents**: Never alter or rewrite `requirements.md`, `design.md`, or `tasks.md` unless explicitly requested.
2. **Do Not Modify Unrelated Files**: Limit code edits strictly to files relevant to the active user request.
3. **Preserve API Contracts**: Retain method signatures and return formats when extending existing services (`TaskManager`, `StorageService`, `FilterEngine`).
4. **Maintain Pure Component Scope**: Keep UI state mutations confined to component methods and delegate state storage to `TaskManager` and `StorageService`.
