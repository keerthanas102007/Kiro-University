/**
 * StorageService
 * Handles data persistence using browser LocalStorage
 */
export class StorageService {
  constructor() {
    this.STORAGE_KEY = 'todoAppTasks';
  }

  /**
   * Save tasks to localStorage
   * @param {Array} tasks - Array of task objects
   * @returns {Object} - { success: boolean, error?: string }
   */
  saveTasks(tasks) {
    try {
      const data = JSON.stringify(tasks);
      localStorage.setItem(this.STORAGE_KEY, data);
      return { success: true };
    } catch (error) {
      // Handle quota exceeded or other storage errors
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded:', error);
        return { 
          success: false, 
          error: 'Storage quota exceeded. Some changes may not be saved.' 
        };
      }
      
      console.error('Failed to save tasks:', error);
      return { 
        success: false, 
        error: 'Failed to save tasks to storage.' 
      };
    }
  }

  /**
   * Load tasks from localStorage
   * @returns {Object} - { success: boolean, data?: Array, error?: string }
   */
  loadTasks() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      
      // No data stored yet
      if (!data) {
        return { success: true, data: [] };
      }

      const tasks = JSON.parse(data);
      
      // Validate the data structure
      if (!Array.isArray(tasks)) {
        console.error('Invalid task data: not an array');
        return { 
          success: false, 
          error: 'Invalid task data format',
          data: [] 
        };
      }

      // Validate each task has required fields
      const isValid = tasks.every(task => 
        task.id && 
        task.title && 
        task.priority && 
        task.category && 
        task.status && 
        task.createdAt
      );

      if (!isValid) {
        console.error('Invalid task data: missing required fields');
        return { 
          success: false, 
          error: 'Corrupted task data',
          data: [] 
        };
      }

      return { success: true, data: tasks };
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return { 
        success: false, 
        error: 'Failed to load tasks from storage',
        data: [] 
      };
    }
  }

  /**
   * Clear all tasks from localStorage
   */
  clearTasks() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear tasks:', error);
      return { 
        success: false, 
        error: 'Failed to clear tasks from storage' 
      };
    }
  }
}
