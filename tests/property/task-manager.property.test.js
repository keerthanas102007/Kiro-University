import fc from 'fast-check';
import { TaskManager } from '../../src/services/TaskManager.js';
import { Priority, TaskStatus } from '../../src/models/Task.js';

describe('TaskManager Property-Based Tests', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  // Arbitraries
  const validTitleArb = fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0);
  const invalidTitleArb = fc.oneof(
    fc.constant(''),
    fc.constant('   '),
    fc.string({ minLength: 201, maxLength: 300 })
  );
  const descriptionArb = fc.string({ minLength: 0, maxLength: 500 });
  const priorityArb = fc.constantFrom('Low', 'Medium', 'High', 'Critical');
  const categoryArb = fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0);

  // Property 1: Task Creation Produces Valid Task Objects
  test('Property 1: Task creation produces valid task objects for any valid title', () => {
    fc.assert(
      fc.property(validTitleArb, descriptionArb, priorityArb, categoryArb, (title, description, priority, category) => {
        const mgr = new TaskManager();
        const result = mgr.createTask(title, { description, priority, category });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(typeof result.data.id).toBe('string');
        expect(result.data.id.length).toBeGreaterThan(0);
        expect(result.data.title).toBe(title.trim());
        expect(result.data.description).toBe(description.trim());
        expect(result.data.priority).toBe(priority);
        expect(result.data.category).toBe(category.trim());
        expect(result.data.status).toBe(TaskStatus.Active);
        expect(typeof result.data.createdAt).toBe('string');
        expect(result.data.completedAt).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  // Property 2: Invalid Task Titles Are Rejected
  test('Property 2: Invalid task titles are rejected with error', () => {
    fc.assert(
      fc.property(invalidTitleArb, (invalidTitle) => {
        const mgr = new TaskManager();
        const result = mgr.createTask(invalidTitle);

        expect(result.success).toBe(false);
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  // Property 3: Task Editing Preserves Creation Timestamp
  test('Property 3: Task editing preserves original creation timestamp', () => {
    fc.assert(
      fc.property(validTitleArb, validTitleArb, (initialTitle, newTitle) => {
        const mgr = new TaskManager();
        const created = mgr.createTask(initialTitle);
        expect(created.success).toBe(true);

        const originalCreatedAt = created.data.createdAt;
        const updated = mgr.updateTask(created.data.id, { title: newTitle });

        expect(updated.success).toBe(true);
        expect(updated.data.title).toBe(newTitle.trim());
        expect(updated.data.createdAt).toBe(originalCreatedAt);
      }),
      { numRuns: 100 }
    );
  });

  // Property 4: Task Completion Updates Status and Timestamp
  test('Property 4: Task completion updates status to completed and sets completedAt timestamp', () => {
    fc.assert(
      fc.property(validTitleArb, (title) => {
        const mgr = new TaskManager();
        const created = mgr.createTask(title);
        expect(created.success).toBe(true);

        const completed = mgr.completeTask(created.data.id);
        expect(completed.success).toBe(true);
        expect(completed.data.status).toBe(TaskStatus.Completed);
        expect(typeof completed.data.completedAt).toBe('string');

        // Uncompleting
        const uncompleted = mgr.updateTask(created.data.id, { status: TaskStatus.Active, completedAt: null });
        expect(uncompleted.success).toBe(true);
        expect(uncompleted.data.status).toBe(TaskStatus.Active);
        expect(uncompleted.data.completedAt).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  // Property 5: Task Deletion Removes Task from List
  test('Property 5: Task deletion removes task from task list', () => {
    fc.assert(
      fc.property(validTitleArb, (title) => {
        const mgr = new TaskManager();
        const created = mgr.createTask(title);
        const taskId = created.data.id;

        const deleted = mgr.deleteTask(taskId);
        expect(deleted.success).toBe(true);

        const retrieved = mgr.getTask(taskId);
        expect(retrieved.success).toBe(false);
        expect(mgr.getAllTasks().find((t) => t.id === taskId)).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  // Property 6 & 7: Priority Validation
  test('Property 6 & 7: Priority validation accepts valid priorities and rejects invalid priority values', () => {
    const invalidPriorityArb = fc.string().filter((s) => s.length > 0 && !['Low', 'Medium', 'High', 'Critical'].includes(s));

    fc.assert(
      fc.property(validTitleArb, invalidPriorityArb, (title, invalidPriority) => {
        const mgr = new TaskManager();
        const result = mgr.createTask(title, { priority: invalidPriority });
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid priority');
      }),
      { numRuns: 100 }
    );
  });

  // Property 8 & 9: Category Validation
  test('Property 8 & 9: Category validation accepts valid categories and rejects category >50 chars', () => {
    const tooLongCategoryArb = fc.string({ minLength: 51, maxLength: 100 });

    fc.assert(
      fc.property(validTitleArb, tooLongCategoryArb, (title, longCategory) => {
        const mgr = new TaskManager();
        const result = mgr.createTask(title, { category: longCategory });
        expect(result.success).toBe(false);
        expect(result.error.toLowerCase()).toContain('category');
      }),
      { numRuns: 100 }
    );
  });

  // Property 10: Default Values Are Applied
  test('Property 10: Default values are applied when optional properties are omitted', () => {
    fc.assert(
      fc.property(validTitleArb, (title) => {
        const mgr = new TaskManager();
        const result = mgr.createTask(title);

        expect(result.success).toBe(true);
        expect(result.data.priority).toBe(Priority.Medium);
        expect(result.data.category).toBe('Uncategorized');
        expect(result.data.description).toBe('');
      }),
      { numRuns: 100 }
    );
  });
});
