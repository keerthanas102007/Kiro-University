import fc from 'fast-check';
import { StatisticsCalculator } from '../../src/services/StatisticsCalculator.js';

describe('StatisticsCalculator Property-Based Tests', () => {
  let statsCalc;

  beforeEach(() => {
    statsCalc = new StatisticsCalculator();
  });

  const taskArb = fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ minLength: 0, maxLength: 100 }),
    priority: fc.constantFrom('Low', 'Medium', 'High', 'Critical'),
    category: fc.constantFrom('Work', 'Personal', 'Shopping', 'Health', 'Finance'),
    status: fc.constantFrom('active', 'completed'),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }).map((d) => d.toISOString()),
    completedAt: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }).map((d) => d.toISOString()), { nil: null }),
  });

  const taskListArb = fc.array(taskArb, { minLength: 0, maxLength: 50 });

  // Property 19: Task Count Statistics Are Accurate
  test('Property 19: Task count statistics equal total, completed, and active task counts', () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        const stats = statsCalc.calculateStatistics(tasks);

        const expectedTotal = tasks.length;
        const expectedCompleted = tasks.filter((t) => t.status === 'completed').length;
        const expectedActive = expectedTotal - expectedCompleted;

        expect(stats.totalTasks).toBe(expectedTotal);
        expect(stats.completedTasks).toBe(expectedCompleted);
        expect(stats.activeTasks).toBe(expectedActive);
      }),
      { numRuns: 100 }
    );
  });

  // Property 20: Completion Percentage Is Calculated Correctly
  test('Property 20: Completion percentage is correctly calculated and rounded to 1 decimal place', () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        const stats = statsCalc.calculateStatistics(tasks);

        if (tasks.length === 0) {
          expect(stats.completionPercentage).toBe(0.0);
        } else {
          const completedCount = tasks.filter((t) => t.status === 'completed').length;
          const expectedPercentage = Math.round((completedCount / tasks.length) * 1000) / 10;
          expect(stats.completionPercentage).toBe(expectedPercentage);
        }
      }),
      { numRuns: 100 }
    );
  });

  // Property 21: Priority Grouping Is Accurate
  test('Property 21: Priority grouping counts match actual number of tasks per priority level', () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        const stats = statsCalc.calculateStatistics(tasks);

        ['Low', 'Medium', 'High', 'Critical'].forEach((p) => {
          const expectedCount = tasks.filter((t) => t.priority === p).length;
          expect(stats.tasksByPriority[p]).toBe(expectedCount);
        });
      }),
      { numRuns: 100 }
    );
  });

  // Property 22: Category Grouping Is Accurate
  test('Property 22: Category grouping counts match actual number of tasks per category', () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        const stats = statsCalc.calculateStatistics(tasks);

        Object.keys(stats.tasksByCategory).forEach((cat) => {
          const expectedCount = tasks.filter((t) => t.category === cat).length;
          expect(stats.tasksByCategory[cat]).toBe(expectedCount);
        });
      }),
      { numRuns: 100 }
    );
  });
});
