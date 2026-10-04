/**
 * Statistics Model
 * Represents computed progress and task metrics
 */
export class Statistics {
  constructor({
    totalTasks = 0,
    completedTasks = 0,
    activeTasks = 0,
    completionPercentage = 0.0,
    tasksByPriority = { Low: 0, Medium: 0, High: 0, Critical: 0 },
    tasksByCategory = new Map(),
  } = {}) {
    this.totalTasks = totalTasks;
    this.completedTasks = completedTasks;
    this.activeTasks = activeTasks;
    this.completionPercentage = completionPercentage;
    this.tasksByPriority = tasksByPriority;
    this.tasksByCategory = tasksByCategory;
  }
}
