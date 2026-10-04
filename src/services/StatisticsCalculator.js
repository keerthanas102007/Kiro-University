/**
 * StatisticsCalculator Service
 * Computes progress metrics and task statistics
 */
export class StatisticsCalculator {
  /**
   * Calculate all statistics for the given tasks
   * @param {Array} tasks - Array of task objects
   * @returns {Object} - Statistics object
   */
  calculateStatistics(tasks) {
    const totalTasks = this.countTotal(tasks);
    const completedTasks = this.countCompleted(tasks);
    const activeTasks = totalTasks - completedTasks;
    const completionPercentage = this.calculateCompletionPercentage(completedTasks, totalTasks);
    const tasksByPriority = this.groupByPriority(tasks);
    const tasksByCategory = this.groupByCategory(tasks);

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      completionPercentage,
      tasksByPriority,
      tasksByCategory
    };
  }

  /**
   * Count total number of tasks
   */
  countTotal(tasks) {
    return tasks.length;
  }

  /**
   * Count completed tasks
   */
  countCompleted(tasks) {
    return tasks.filter(task => task.status === 'completed').length;
  }

  /**
   * Calculate completion percentage rounded to 1 decimal place
   */
  calculateCompletionPercentage(completed, total) {
    if (total === 0) return 0.0;
    return Math.round((completed / total) * 1000) / 10;
  }

  /**
   * Group tasks by priority level
   */
  groupByPriority(tasks) {
    const counts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };

    tasks.forEach(task => {
      if (Object.prototype.hasOwnProperty.call(counts, task.priority)) {
        counts[task.priority]++;
      }
    });

    return counts;
  }

  /**
   * Group tasks by category
   */
  groupByCategory(tasks) {
    const counts = {};

    tasks.forEach(task => {
      if (!counts[task.category]) {
        counts[task.category] = 0;
      }
      counts[task.category]++;
    });

    return counts;
  }
}
