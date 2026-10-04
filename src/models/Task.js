/**
 * Task Priority Levels
 */
export const Priority = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
};

/**
 * Task Status Values
 */
export const TaskStatus = {
  Active: 'active',
  Completed: 'completed',
};

/**
 * Task Model
 * Represents a single todo task with all required properties
 */
export class Task {
  constructor({
    id,
    title,
    description = '',
    priority = Priority.Medium,
    category = 'Uncategorized',
    status = TaskStatus.Active,
    createdAt,
    completedAt = null,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.category = category;
    this.status = status;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
  }

  /**
   * Create a Task from a plain object (e.g., from JSON)
   */
  static fromJSON(json) {
    return new Task(json);
  }

  /**
   * Convert Task to plain object for serialization
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      category: this.category,
      status: this.status,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
    };
  }
}
