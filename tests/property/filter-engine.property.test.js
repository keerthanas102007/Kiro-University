import fc from 'fast-check';
import { FilterEngine } from '../../src/services/FilterEngine.js';

describe('FilterEngine Property-Based Tests', () => {
  let filterEngine;

  beforeEach(() => {
    filterEngine = new FilterEngine();
  });

  const taskArb = fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 0, maxLength: 200 }),
    priority: fc.constantFrom('Low', 'Medium', 'High', 'Critical'),
    category: fc.constantFrom('Work', 'Personal', 'Shopping', 'Health', 'Finance'),
    status: fc.constantFrom('active', 'completed'),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }).map((d) => d.toISOString()),
    completedAt: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }).map((d) => d.toISOString()), { nil: null }),
  });

  const taskListArb = fc.array(taskArb, { minLength: 0, maxLength: 50 });

  // Property 11: Search Returns Only Matching Tasks
  test('Property 11: Search returns only tasks where query appears in title or description', () => {
    fc.assert(
      fc.property(taskListArb, fc.string({ minLength: 1, maxLength: 10 }), (tasks, query) => {
        const results = filterEngine.searchTasks(tasks, query);
        const lowerQuery = query.toLowerCase();

        results.forEach((task) => {
          const matchesTitle = task.title.toLowerCase().includes(lowerQuery);
          const matchesDesc = task.description.toLowerCase().includes(lowerQuery);
          expect(matchesTitle || matchesDesc).toBe(true);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Property 13: Filters Match All Selected Criteria
  test('Property 13: Filters return tasks that match all selected filter criteria', () => {
    const filterCriteriaArb = fc.record({
      priorities: fc.subarray(['Low', 'Medium', 'High', 'Critical']),
      categories: fc.subarray(['Work', 'Personal', 'Shopping', 'Health', 'Finance']),
      statuses: fc.subarray(['active', 'completed']),
    });

    fc.assert(
      fc.property(taskListArb, filterCriteriaArb, (tasks, criteria) => {
        const results = filterEngine.applyFilters(tasks, criteria);

        results.forEach((task) => {
          if (criteria.priorities && criteria.priorities.length > 0) {
            expect(criteria.priorities.includes(task.priority)).toBe(true);
          }
          if (criteria.categories && criteria.categories.length > 0) {
            expect(criteria.categories.includes(task.category)).toBe(true);
          }
          if (criteria.statuses && criteria.statuses.length > 0) {
            expect(criteria.statuses.includes(task.status)).toBe(true);
          }
        });
      }),
      { numRuns: 100 }
    );
  });

  // Property 14: Sort Orders Tasks Correctly
  test('Property 14: Sort orders tasks correctly by priority', () => {
    const priorityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };

    fc.assert(
      fc.property(taskListArb, fc.constantFrom('asc', 'desc'), (tasks, sortOrder) => {
        const sorted = filterEngine.sortTasks(tasks, 'priority', sortOrder);

        for (let i = 0; i < sorted.length - 1; i++) {
          const weightA = priorityWeight[sorted[i].priority];
          const weightB = priorityWeight[sorted[i + 1].priority];

          if (sortOrder === 'desc') {
            expect(weightA).toBeGreaterThanOrEqual(weightB);
          } else {
            expect(weightA).toBeLessThanOrEqual(weightB);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  // Property 23: Filter and Sort Operations Are Pure Functions
  test('Property 23: Filter and sort operations are pure functions that do not mutate input array', () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        const tasksSnapshot = JSON.stringify(tasks);

        filterEngine.applyFilters(tasks, {
          searchQuery: 'a',
          priorities: ['High'],
          sortBy: 'priority',
          sortOrder: 'desc',
        });

        expect(JSON.stringify(tasks)).toBe(tasksSnapshot);
      }),
      { numRuns: 100 }
    );
  });
});
