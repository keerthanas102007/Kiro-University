/**
 * FilterEngine Service
 * Handles search, filter, and sort operations on tasks
 */
export class FilterEngine {
  /**
   * Apply all filters, search, and sort to tasks
   * @param {Array} tasks - Array of task objects
   * @param {Object} criteria - Filter criteria
   * @returns {Array} - Filtered and sorted tasks
   */
  applyFilters(tasks, criteria = {}) {
    let filtered = [...tasks];

    // Apply priority filter
    if (criteria.priorities && criteria.priorities.length > 0) {
      filtered = this.filterByPriority(filtered, criteria.priorities);
    }

    // Apply category filter
    if (criteria.categories && criteria.categories.length > 0) {
      filtered = this.filterByCategory(filtered, criteria.categories);
    }

    // Apply status filter
    if (criteria.statuses && criteria.statuses.length > 0) {
      filtered = this.filterByStatus(filtered, criteria.statuses);
    }

    // Apply search query
    if (criteria.searchQuery && criteria.searchQuery.trim().length > 0) {
      filtered = this.searchTasks(filtered, criteria.searchQuery.trim());
    }

    // Apply sort
    if (criteria.sortBy) {
      filtered = this.sortTasks(filtered, criteria.sortBy, criteria.sortOrder || 'desc');
    }

    return filtered;
  }

  /**
   * Search tasks by title or description (case-insensitive)
   */
  searchTasks(tasks, query) {
    if (!query || query.length === 0) return tasks;

    const lowerQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter tasks by priority
   */
  filterByPriority(tasks, priorities) {
    return tasks.filter(task => priorities.includes(task.priority));
  }

  /**
   * Filter tasks by category
   */
  filterByCategory(tasks, categories) {
    return tasks.filter(task => categories.includes(task.category));
  }

  /**
   * Filter tasks by status
   */
  filterByStatus(tasks, statuses) {
    return tasks.filter(task => statuses.includes(task.status));
  }

  /**
   * Sort tasks by specified field and order
   */
  sortTasks(tasks, sortBy, order = 'desc') {
    const sorted = [...tasks];
    
    const priorityWeight = {
      'Critical': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'priority':
          comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'completedAt':
          // Handle null completedAt values
          if (!a.completedAt && !b.completedAt) return 0;
          if (!a.completedAt) return 1;
          if (!b.completedAt) return -1;
          comparison = new Date(a.completedAt) - new Date(b.completedAt);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return order === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  /**
   * Get all unique categories from tasks
   */
  getUniqueCategories(tasks) {
    const categories = tasks.map(task => task.category);
    return [...new Set(categories)].sort();
  }
}
