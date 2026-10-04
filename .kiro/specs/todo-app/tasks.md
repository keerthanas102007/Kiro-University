# Implementation Plan: Todo App

## Overview

This plan implements a client-side todo application using vanilla JavaScript/TypeScript with a layered architecture. The implementation follows a bottom-up approach: models → services → controllers → views → integration.

## Tasks

- [ ] 1. Set up project structure and core models
  - [ ] 1.1 Initialize project with build tooling (Vite), ESLint, Prettier, and Jest/fast-check
    - Create package.json with dependencies
    - Configure build pipeline and test runners
    - Set up project directory structure (src/models, src/services, src/controllers, src/views)
    - _Requirements: 8.4, 8.5_
  
  - [ ] 1.2 Implement Task and TaskList models
    - Create Task interface with all required properties (id, title, description, priority, category, status, createdAt, completedAt)
    - Implement TaskList class with Map-based storage and CRUD methods
    - Add Priority and TaskStatus enums
    - _Requirements: 2.5_
  
  - [ ] 1.3 Implement FilterCriteria and Statistics models
    - Create FilterCriteria interface with search, filter, and sort options
    - Create Statistics interface for progress tracking data
    - Add SortField and SortOrder enums
    - _Requirements: 3.1, 5.1, 5.2_

- [ ]* 1.4 Write unit tests for Task and TaskList models
    - Test TaskList CRUD operations
    - Test edge cases (empty lists, duplicate IDs)
    - _Requirements: 2.5_

- [ ] 2. Implement core services
  - [ ] 2.1 Implement TaskManager service with validation
    - Create TaskManager class with task CRUD operations
    - Implement validation for title (1-200 chars), description (≤1000 chars), category (1-50 chars), priority enum
    - Add UUID generation and ISO 8601 timestamp handling
    - Implement default values (priority="Medium", category="Uncategorized", description="")
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.7, 1.9, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8_
  
  - [ ]* 2.2 Write property tests for TaskManager validation
    - **Property 1: Task Creation Produces Valid Task Objects**
    - **Validates: Requirements 1.1, 1.9, 2.5**
  
  - [ ]* 2.3 Write property tests for TaskManager validation edge cases
    - **Property 2: Invalid Task Titles Are Rejected**
    - **Property 6: Valid Priorities Are Accepted**
    - **Property 7: Invalid Priorities Are Rejected**
    - **Property 8: Valid Categories Are Accepted**
    - **Property 9: Invalid Categories Are Rejected**
    - **Validates: Requirements 1.2, 2.1, 2.2, 2.3, 2.4**
  
  - [ ]* 2.4 Write property tests for TaskManager operations
    - **Property 3: Task Editing Preserves Creation Timestamp**
    - **Property 4: Task Completion Updates Status and Timestamp**
    - **Property 5: Task Deletion Removes Task from List**
    - **Property 10: Default Values Are Applied**
    - **Validates: Requirements 1.3, 1.5, 1.7, 2.6, 2.7, 2.8**

- [ ] 3. Implement FilterEngine service
  - [ ] 3.1 Implement search functionality
    - Create FilterEngine class with case-insensitive substring search
    - Implement search query validation (1-500 chars)
    - Search across both title and description fields
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 3.2 Implement filter and sort operations
    - Add priority, category, and status filters
    - Implement sort by priority (Critical > High > Medium > Low), createdAt, and completedAt
    - Support ascending and descending sort orders
    - Apply filters in order: priority → category → status → search → sort
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [ ]* 3.3 Write property tests for FilterEngine
    - **Property 11: Search Returns Only Matching Tasks**
    - **Property 12: Invalid Search Queries Are Rejected**
    - **Property 13: Filters Match All Selected Criteria**
    - **Property 14: Sort Orders Tasks Correctly**
    - **Property 15: Combined Search and Filter Apply in Correct Order**
    - **Property 16: Filter Operations Preserve Sort Option**
    - **Property 23: Filter and Sort Operations Are Pure Functions**
    - **Validates: Requirements 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 8.3**

- [ ] 4. Implement StatisticsCalculator service
  - [ ] 4.1 Implement statistics calculation
    - Create StatisticsCalculator class with calculation methods
    - Calculate total tasks, completed tasks, completion percentage (rounded to 1 decimal)
    - Group tasks by priority and category
    - Handle zero-task edge case (0.0% completion)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 4.2 Write property tests for StatisticsCalculator
    - **Property 19: Task Count Statistics Are Accurate**
    - **Property 20: Completion Percentage Is Calculated Correctly**
    - **Property 21: Priority Grouping Is Accurate**
    - **Property 22: Category Grouping Is Accurate**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

- [ ] 5. Implement StorageService with error handling
  - [ ] 5.1 Implement storage persistence and recovery
    - Create StorageService class using LocalStorage API
    - Implement save/load operations with JSON serialization
    - Add schema validation for loaded data
    - Implement error recovery: retry once after 1 second for non-quota errors
    - Handle quota exceeded errors with user notifications
    - Initialize with empty list on schema validation failure
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 5.2 Write property tests for StorageService
    - **Property 17: Storage Round-Trip Preserves Data**
    - **Property 18: Invalid Storage Data Triggers Error Handling**
    - **Validates: Requirements 4.2, 4.4**
  
  - [ ]* 5.3 Write integration tests for StorageService
    - Test actual LocalStorage API interactions
    - Mock quota exceeded scenarios
    - Test retry logic with simulated failures
    - _Requirements: 4.5, 4.6_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement controllers
  - [ ] 7.1 Implement TaskController
    - Create TaskController coordinating TaskManager and StorageService
    - Add handlers for create, update, complete, delete operations
    - Implement persistAndRefresh method to save and update views
    - Add error handling with user notifications
    - _Requirements: 1.1, 1.3, 1.5, 1.7, 4.1, 8.1_
  
  - [ ] 7.2 Implement FilterController
    - Create FilterController coordinating FilterEngine and TaskManager
    - Add handlers for search, filter, and sort operations
    - Preserve sort option across filter changes
    - _Requirements: 3.1, 3.4, 3.5, 3.8, 8.1_
  
  - [ ] 7.3 Implement StatisticsController
    - Create StatisticsController coordinating StatisticsCalculator and TaskManager
    - Add refresh method triggered after task operations
    - _Requirements: 5.7, 5.8, 5.9, 5.10, 5.11, 8.1_

- [ ]* 7.4 Write unit tests for controllers
    - Test controller coordination between services
    - Test error handling and notification triggers
    - _Requirements: 8.1_

- [ ] 8. Implement views and UI
  - [ ] 8.1 Implement TaskListView with animations
    - Create TaskListView rendering task cards
    - Implement CSS animations for add (opacity 0→1, translateY -20px→0)
    - Implement animations for delete (opacity 1→0, translateY 0→+20px)
    - Implement animations for complete (background transition, strikethrough)
    - All animations complete within 300ms
    - Handle animation conflicts (cancel in-progress, start new)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [ ] 8.2 Implement TaskFormView
    - Create TaskFormView with form inputs for title, description, priority, category
    - Add form validation error display
    - Wire up onSubmit handler to TaskController
    - _Requirements: 1.1, 1.2, 2.1, 2.3_
  
  - [ ] 8.3 Implement FilterView
    - Create FilterView with search input and filter controls
    - Add priority, category, status filter checkboxes
    - Add sort option dropdown (priority/createdAt/completedAt, asc/desc)
    - Wire up handlers to FilterController
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [ ] 8.4 Implement StatisticsView
    - Create StatisticsView displaying progress metrics
    - Render completion percentage with progress bar
    - Display priority and category breakdowns
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

- [ ]* 8.5 Write unit tests for views
    - Test view rendering with various data states
    - Test event delegation to controllers
    - Test animation timing and conflict handling
    - _Requirements: 7.5, 7.6_

- [ ] 9. Implement responsive layout
  - [ ] 9.1 Add responsive CSS with breakpoints
    - Mobile (<768px): single-column, full-width cards, 44px touch targets
    - Tablet (768-1024px): two-column layout (task list + statistics)
    - Desktop (>1024px): three-column layout (filters + task list + statistics)
    - Add 300ms transitions for layout changes
    - Preserve state across breakpoint transitions
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 9.2 Write integration tests for responsive behavior
    - Test layout at each breakpoint
    - Test state preservation across transitions
    - _Requirements: 6.4_

- [ ] 10. Wire application together
  - [ ] 10.1 Create main application entry point
    - Initialize all services, controllers, and views
    - Load tasks from storage on startup
    - Wire up event handlers between views and controllers
    - Add error notification system
    - _Requirements: 4.2, 8.4, 8.6_
  
  - [ ] 10.2 Create HTML structure and mount application
    - Create index.html with semantic structure
    - Add CSS styling for all components
    - Mount application to DOM on DOMContentLoaded
    - _Requirements: 6.1, 6.2, 6.3, 8.4_

- [ ]* 10.3 Write end-to-end tests
    - Test complete task creation workflow
    - Test search and filter workflows
    - Test persistence across page reloads
    - _Requirements: 4.1, 4.2_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test tasks that can be skipped for faster MVP delivery
- All 23 correctness properties from the design are covered by property tests
- Build tooling (Vite) provides fast development with HMR and production bundling
- LocalStorage provides persistence without backend dependencies
- Layered architecture ensures clean separation: Models → Services → Controllers → Views
- Bottom-up implementation allows incremental testing at each layer

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "3.1"] },
    { "id": 4, "tasks": ["3.2", "4.1"] },
    { "id": 5, "tasks": ["3.3", "4.2", "5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "7.1", "7.2", "7.3"] },
    { "id": 7, "tasks": ["7.4", "8.1", "8.2", "8.3", "8.4"] },
    { "id": 8, "tasks": ["8.5", "9.1"] },
    { "id": 9, "tasks": ["9.2", "10.1"] },
    { "id": 10, "tasks": ["10.2"] },
    { "id": 11, "tasks": ["10.3"] }
  ]
}
```
