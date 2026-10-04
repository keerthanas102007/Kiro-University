/**
 * TaskList Model
 * Manages a collection of tasks using Map for efficient lookups
 */
export class TaskList {
  constructor(tasks = []) {
    this.tasks = new Map();
    tasks.forEach((task) => this.add(task));
  }

  /**
   * Add a task to the list
   */
  add(task) {
    this.tasks.set(task.id, task);
  }

  /**
   * Update an existing task
   * @returns {Task} The updated task
   * @throws {Error} If task not found
   */
  update(taskId, updates) {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(taskId, updatedTask);
    return updatedTask;
  }

  /**
   * Remove a task from the list
   */
  remove(taskId) {
    this.tasks.delete(taskId);
  }

  /**
   * Get a specific task by ID
   */
  get(taskId) {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks as an array
   */
  getAll() {
    return Array.from(this.tasks.values());
  }

  /**
   * Get the number of tasks
   */
  size() {
    return this.tasks.size;
  }
}
