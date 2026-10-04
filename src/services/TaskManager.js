import { Task, Priority, TaskStatus } from '../models/Task.js';
import { TaskList } from '../models/TaskList.js';

/**
 * TaskManager Service
 * Handles task CRUD operations and validation
 */
export class TaskManager {
  constructor() {
    this.taskList = new TaskList();
  }

  /**
   * Create a new task
   * @returns {{ success: boolean, data?: Task, error?: string }}
   */
  createTask(title, options = {}) {
    // Validate title
    const titleValidation = this.validateTitle(title);
    if (!titleValidation.valid) {
      return { success: false, error: titleValidation.error };
    }

    // Validate priority if provided
    if (options.priority) {
      const priorityValidation = this.validatePriority(options.priority);
      if (!priorityValidation.valid) {
        return { success: false, error: priorityValidation.error };
      }
    }

    // Validate category if provided
    if (options.category) {
      const categoryValidation = this.validateCategory(options.category);
      if (!categoryValidation.valid) {
        return { success: false, error: categoryValidation.error };
      }
    }

    // Validate description if provided
    if (options.description) {
      const descriptionValidation = this.validateDescription(options.description);
      if (!descriptionValidation.valid) {
        return { success: false, error: descriptionValidation.error };
      }
    }

    // Create task with defaults
    const task = new Task({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: options.description?.trim() || '',
      priority: options.priority || Priority.Medium,
      category: options.category?.trim() || 'Uncategorized',
      status: TaskStatus.Active,
      createdAt: new Date().toISOString(),
      completedAt: null,
    });

    this.taskList.add(task);
    return { success: true, data: task };
  }

  /**
   * Get a task by ID
   */
  getTask(taskId) {
    const task = this.taskList.get(taskId);
    if (!task) {
      return { success: false, error: `Task not found: ${taskId}` };
    }
    return { success: true, data: task };
  }

  /**
   * Get all tasks
   */
  getAllTasks() {
    return this.taskList.getAll();
  }

  /**
   * Update an existing task
   */
  updateTask(taskId, updates) {
    // Check if task exists
    const existing = this.taskList.get(taskId);
    if (!existing) {
      return { success: false, error: `Task not found: ${taskId}` };
    }

    // Validate updates
    if (updates.title !== undefined) {
      const titleValidation = this.validateTitle(updates.title);
      if (!titleValidation.valid) {
        return { success: false, error: titleValidation.error };
      }
      updates.title = updates.title.trim();
    }

    if (updates.priority !== undefined) {
      const priorityValidation = this.validatePriority(updates.priority);
      if (!priorityValidation.valid) {
        return { success: false, error: priorityValidation.error };
      }
    }

    if (updates.category !== undefined) {
      const categoryValidation = this.validateCategory(updates.category);
      if (!categoryValidation.valid) {
        return { success: false, error: categoryValidation.error };
      }
      updates.category = updates.category.trim();
    }

    if (updates.description !== undefined) {
      const descriptionValidation = this.validateDescription(updates.description);
      if (!descriptionValidation.valid) {
        return { success: false, error: descriptionValidation.error };
      }
      updates.description = updates.description.trim();
    }

    try {
      const updatedTask = this.taskList.update(taskId, updates);
      return { success: true, data: updatedTask };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark a task as complete
   */
  completeTask(taskId) {
    const existing = this.taskList.get(taskId);
    if (!existing) {
      return { success: false, error: `Task not found: ${taskId}` };
    }

    try {
      const updatedTask = this.taskList.update(taskId, {
        status: TaskStatus.Completed,
        completedAt: new Date().toISOString(),
      });
      return { success: true, data: updatedTask };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a task
   */
  deleteTask(taskId) {
    const existing = this.taskList.get(taskId);
    if (!existing) {
      return { success: false, error: `Task not found: ${taskId}` };
    }

    this.taskList.remove(taskId);
    return { success: true };
  }

  /**
   * Load tasks from an array (for initialization from storage)
   */
  loadTasks(tasks) {
    this.taskList = new TaskList(tasks.map((t) => Task.fromJSON(t)));
  }

  // Validation methods

  validateTitle(title) {
    if (!title || title.trim().length === 0) {
      return { valid: false, error: 'Task title cannot be empty' };
    }
    if (title.length > 200) {
      return { valid: false, error: 'Task title cannot exceed 200 characters' };
    }
    return { valid: true };
  }

  validatePriority(priority) {
    const validPriorities = Object.values(Priority);
    if (!validPriorities.includes(priority)) {
      return {
        valid: false,
        error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
      };
    }
    return { valid: true };
  }

  validateCategory(category) {
    if (!category || category.trim().length === 0) {
      return { valid: false, error: 'Category cannot be empty' };
    }
    if (category.length > 50) {
      return { valid: false, error: 'Category cannot exceed 50 characters' };
    }
    return { valid: true };
  }

  validateDescription(description) {
    if (description.length > 1000) {
      return {
        valid: false,
        error: 'Description cannot exceed 1000 characters',
      };
    }
    return { valid: true };
  }
}
