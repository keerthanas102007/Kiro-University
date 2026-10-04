import fc from 'fast-check';
import { StorageService } from '../../src/services/StorageService.js';

describe('StorageService Property-Based Tests', () => {
  let storageService;

  beforeEach(() => {
    localStorage.clear();
    storageService = new StorageService();
  });

  const taskArb = fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
    description: fc.string({ minLength: 0, maxLength: 200 }),
    priority: fc.constantFrom('Low', 'Medium', 'High', 'Critical'),
    category: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    status: fc.constantFrom('active', 'completed'),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }).map((d) => d.toISOString()),
    completedAt: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2026-01-01') }).map((d) => d.toISOString()), { nil: null }),
  });

  const taskListArb = fc.array(taskArb, { minLength: 0, maxLength: 30 });

  // Property 17: Storage Round-Trip Preserves Data
  test('Property 17: Saving and loading tasks from storage preserves all properties and tasks accurately', () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        localStorage.clear();

        const saveResult = storageService.saveTasks(tasks);
        expect(saveResult.success).toBe(true);

        const loadResult = storageService.loadTasks();
        expect(loadResult.success).toBe(true);
        expect(loadResult.data).toBeDefined();

        expect(loadResult.data).toEqual(tasks);
      }),
      { numRuns: 100 }
    );
  });

  // Property 18: Invalid Storage Data Triggers Error Handling
  test('Property 18: Invalid JSON or corrupted data structure triggers error recovery', () => {
    const invalidJsonArb = fc.oneof(
      fc.constant('{ invalid json '),
      fc.constant('12345'),
      fc.constant('"just a string"'),
      fc.constant('[{"id": "1"}]') // missing required fields title, priority, etc.
    );

    fc.assert(
      fc.property(invalidJsonArb, (corruptedData) => {
        localStorage.setItem('todoAppTasks', corruptedData);

        const loadResult = storageService.loadTasks();
        expect(loadResult.success).toBe(false);
        expect(Array.isArray(loadResult.data)).toBe(true);
        expect(loadResult.data.length).toBe(0);
      }),
      { numRuns: 50 }
    );
  });
});
