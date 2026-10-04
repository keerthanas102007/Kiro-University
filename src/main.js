import { TaskManager } from './services/TaskManager.js';
import { StorageService } from './services/StorageService.js';
import { FilterEngine } from './services/FilterEngine.js';
import { StatisticsCalculator } from './services/StatisticsCalculator.js';

/**
 * Main Application Entry Point
 */
class App {
  constructor() {
    this.taskManager = new TaskManager();
    this.storageService = new StorageService();
    this.filterEngine = new FilterEngine();
    this.statisticsCalculator = new StatisticsCalculator();
    this.filterCriteria = {
      searchQuery: '',
      priorities: [],
      categories: [],
      statuses: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    this.init();
  }

  async init() {
    console.log('Todo App initialized');
    
    // Load tasks from storage
    const loadResult = this.storageService.loadTasks();
    
    if (loadResult.success && loadResult.data.length > 0) {
      // Load existing tasks
      this.taskManager.loadTasks(loadResult.data);
      console.log(`Loaded ${loadResult.data.length} tasks from storage`);
    } else if (!loadResult.success) {
      // Show error notification if data was corrupted
      this.showNotification(
        'error',
        'Previous task data could not be recovered. Starting with empty list.'
      );
    } else {
      // No tasks stored, create a welcome task
      const result = this.taskManager.createTask('Welcome to Todo App', {
        description: 'This is your first task. Try creating, completing, or deleting tasks!',
        priority: 'Medium',
        category: 'Getting Started',
      });

      if (result.success) {
        console.log('Sample task created:', result.data);
        this.saveTasks();
      }
    }

    this.renderTaskForm();
    this.renderFilterPanel();
    this.renderStatistics();
    this.renderTasks();
  }

  /**
   * Save all tasks to localStorage
   */
  saveTasks() {
    const tasks = this.taskManager.getAllTasks();
    const result = this.storageService.saveTasks(tasks.map(task => task));
    
    if (!result.success) {
      this.showNotification('error', result.error);
    }
  }

  /**
   * Show a notification to the user
   */
  showNotification(type, message) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.style.cssText = `
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      background: ${type === 'error' ? '#fee2e2' : '#dbeafe'};
      color: ${type === 'error' ? '#991b1b' : '#1e40af'};
      border: 1px solid ${type === 'error' ? '#fecaca' : '#bfdbfe'};
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  renderFilterPanel() {
    const filterContainer = document.getElementById('filter-view');
    if (!filterContainer) return;

    const allTasks = this.taskManager.getAllTasks();
    const categories = this.filterEngine.getUniqueCategories(allTasks);

    filterContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Search -->
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #374151;">
            Search
          </label>
          <input 
            type="text" 
            id="search-input"
            placeholder="Search tasks..." 
            value="${this.filterCriteria.searchQuery}"
            style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem;"
          />
        </div>

        <!-- Sort -->
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #374151;">
            Sort By
          </label>
          <select 
            id="sort-select"
            style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem;"
          >
            <option value="createdAt-desc" ${this.filterCriteria.sortBy === 'createdAt' && this.filterCriteria.sortOrder === 'desc' ? 'selected' : ''}>Newest First</option>
            <option value="createdAt-asc" ${this.filterCriteria.sortBy === 'createdAt' && this.filterCriteria.sortOrder === 'asc' ? 'selected' : ''}>Oldest First</option>
            <option value="priority-desc" ${this.filterCriteria.sortBy === 'priority' && this.filterCriteria.sortOrder === 'desc' ? 'selected' : ''}>Priority (High to Low)</option>
            <option value="priority-asc" ${this.filterCriteria.sortBy === 'priority' && this.filterCriteria.sortOrder === 'asc' ? 'selected' : ''}>Priority (Low to High)</option>
            <option value="title-asc" ${this.filterCriteria.sortBy === 'title' && this.filterCriteria.sortOrder === 'asc' ? 'selected' : ''}>Title (A-Z)</option>
            <option value="title-desc" ${this.filterCriteria.sortBy === 'title' && this.filterCriteria.sortOrder === 'desc' ? 'selected' : ''}>Title (Z-A)</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #374151;">
            Priority
          </label>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${['Critical', 'High', 'Medium', 'Low'].map(priority => `
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input 
                  type="checkbox" 
                  class="priority-filter" 
                  value="${priority}"
                  ${this.filterCriteria.priorities.includes(priority) ? 'checked' : ''}
                  style="cursor: pointer;"
                />
                <span style="font-size: 0.875rem;">${priority}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #374151;">
            Status
          </label>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input 
                type="checkbox" 
                class="status-filter" 
                value="active"
                ${this.filterCriteria.statuses.includes('active') ? 'checked' : ''}
                style="cursor: pointer;"
              />
              <span style="font-size: 0.875rem;">Active</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input 
                type="checkbox" 
                class="status-filter" 
                value="completed"
                ${this.filterCriteria.statuses.includes('completed') ? 'checked' : ''}
                style="cursor: pointer;"
              />
              <span style="font-size: 0.875rem;">Completed</span>
            </label>
          </div>
        </div>

        <!-- Category Filter -->
        ${categories.length > 0 ? `
          <div>
            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #374151;">
              Category
            </label>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 200px; overflow-y: auto;">
              ${categories.map(category => `
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input 
                    type="checkbox" 
                    class="category-filter" 
                    value="${this.escapeHtml(category)}"
                    ${this.filterCriteria.categories.includes(category) ? 'checked' : ''}
                    style="cursor: pointer;"
                  />
                  <span style="font-size: 0.875rem;">${this.escapeHtml(category)}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Clear Filters -->
        <button 
          id="clear-filters-btn"
          style="
            background: #6b7280; 
            color: white; 
            padding: 0.5rem; 
            border: none; 
            border-radius: 6px; 
            font-size: 0.875rem; 
            cursor: pointer;
          "
        >
          Clear All Filters
        </button>
      </div>
    `;

    // Attach event listeners
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.filterCriteria.searchQuery = e.target.value;
      this.renderTasks();
    });

    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      const [sortBy, sortOrder] = e.target.value.split('-');
      this.filterCriteria.sortBy = sortBy;
      this.filterCriteria.sortOrder = sortOrder;
      this.renderTasks();
    });

    document.querySelectorAll('.priority-filter').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.filterCriteria.priorities.push(e.target.value);
        } else {
          this.filterCriteria.priorities = this.filterCriteria.priorities.filter(p => p !== e.target.value);
        }
        this.renderTasks();
      });
    });

    document.querySelectorAll('.status-filter').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.filterCriteria.statuses.push(e.target.value);
        } else {
          this.filterCriteria.statuses = this.filterCriteria.statuses.filter(s => s !== e.target.value);
        }
        this.renderTasks();
      });
    });

    document.querySelectorAll('.category-filter').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.filterCriteria.categories.push(e.target.value);
        } else {
          this.filterCriteria.categories = this.filterCriteria.categories.filter(c => c !== e.target.value);
        }
        this.renderTasks();
      });
    });

    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
      this.filterCriteria = {
        searchQuery: '',
        priorities: [],
        categories: [],
        statuses: [],
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      this.renderFilterPanel();
      this.renderTasks();
    });
  }

  renderStatistics() {
    const statisticsContainer = document.getElementById('statistics-view');
    if (!statisticsContainer) return;

    const allTasks = this.taskManager.getAllTasks();
    const stats = this.statisticsCalculator.calculateStatistics(allTasks);

    const categories = Object.keys(stats.tasksByCategory);

    statisticsContainer.innerHTML = `
      <div class="stats-container">
        <!-- Progress Bar Section -->
        <div class="stats-progress-card">
          <div class="stats-progress-header">
            <span class="stats-progress-title">Overall Progress</span>
            <span class="stats-progress-percent" id="stats-percentage">${stats.completionPercentage}%</span>
          </div>
          <div class="progress-bar-track" aria-label="Progress bar">
            <div 
              class="progress-bar-fill" 
              id="stats-progress-fill"
              style="width: ${stats.completionPercentage}%;"
            ></div>
          </div>
        </div>

        <!-- Metric Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value" id="stat-total">${stats.totalTasks}</span>
            <span class="stat-label">Total Tasks</span>
          </div>
          <div class="stat-card stat-card-active">
            <span class="stat-value" id="stat-active">${stats.activeTasks}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat-card stat-card-completed">
            <span class="stat-value" id="stat-completed">${stats.completedTasks}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>

        <!-- Priority Breakdown -->
        <div class="stats-section">
          <h4 class="stats-section-title">Priority Breakdown</h4>
          <div class="stats-pills-list">
            <div class="stat-pill stat-pill-critical">
              <span>Critical</span>
              <strong>${stats.tasksByPriority.Critical || 0}</strong>
            </div>
            <div class="stat-pill stat-pill-high">
              <span>High</span>
              <strong>${stats.tasksByPriority.High || 0}</strong>
            </div>
            <div class="stat-pill stat-pill-medium">
              <span>Medium</span>
              <strong>${stats.tasksByPriority.Medium || 0}</strong>
            </div>
            <div class="stat-pill stat-pill-low">
              <span>Low</span>
              <strong>${stats.tasksByPriority.Low || 0}</strong>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        ${categories.length > 0 ? `
          <div class="stats-section">
            <h4 class="stats-section-title">Category Breakdown</h4>
            <div class="stats-categories-list">
              ${categories.map(cat => `
                <div class="stat-category-item">
                  <span class="stat-category-name">${this.escapeHtml(cat)}</span>
                  <span class="stat-category-count">${stats.tasksByCategory[cat]}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderTaskForm() {
    const formContainer = document.getElementById('task-form-view');
    if (!formContainer) return;

    formContainer.innerHTML = `
      <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1rem; color: #111827;">Add New Task</h3>
        <form id="task-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <input 
            type="text" 
            id="task-title" 
            placeholder="Task title (required)" 
            required
            style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 1rem;"
          />
          <textarea 
            id="task-description" 
            placeholder="Description (optional)" 
            rows="3"
            style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 1rem; resize: vertical;"
          ></textarea>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <select 
              id="task-priority"
              style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 1rem;"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium" selected>Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
            <input 
              type="text" 
              id="task-category" 
              placeholder="Category (optional)"
              style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 1rem;"
            />
          </div>
          <button 
            type="submit"
            style="background: #4f46e5; color: white; padding: 0.75rem; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; font-weight: 500;"
          >
            Add Task
          </button>
          <div id="form-error" style="color: #ef4444; font-size: 0.875rem; display: none;"></div>
        </form>
      </div>
    `;

    // Add form submit handler
    const form = document.getElementById('task-form');
    form.addEventListener('submit', (e) => this.handleAddTask(e));
  }

  handleAddTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;
    const category = document.getElementById('task-category').value;

    const result = this.taskManager.createTask(title, {
      description,
      priority,
      category: category || undefined, // Use default if empty
    });

    if (result.success) {
      // Clear form
      document.getElementById('task-form').reset();
      document.getElementById('form-error').style.display = 'none';
      
      // Save to storage
      this.saveTasks();
      
      // Re-render filter panel (new category may have been added)
      this.renderFilterPanel();
      
      // Re-render statistics
      this.renderStatistics();
      
      // Re-render tasks
      this.renderTasks();
      
      console.log('Task created:', result.data);
    } else {
      // Show error
      const errorDiv = document.getElementById('form-error');
      errorDiv.textContent = result.error;
      errorDiv.style.display = 'block';
    }
  }

  renderTasks() {
    const allTasks = this.taskManager.getAllTasks();
    const filteredTasks = this.filterEngine.applyFilters(allTasks, this.filterCriteria);
    const taskListView = document.getElementById('task-list-view');
    
    if (!taskListView) return;

    // Show empty state if no tasks match
    if (filteredTasks.length === 0) {
      const hasFilters = this.filterCriteria.searchQuery || 
                         this.filterCriteria.priorities.length > 0 ||
                         this.filterCriteria.categories.length > 0 ||
                         this.filterCriteria.statuses.length > 0;
      
      if (hasFilters) {
        taskListView.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: #6b7280;">
            <p style="font-size: 1.125rem; margin-bottom: 0.5rem;">No tasks found</p>
            <p style="font-size: 0.875rem;">Try adjusting your search or filters</p>
          </div>
        `;
      } else {
        taskListView.innerHTML = '<p style="text-align: center; color: #6b7280;">No tasks yet. Create your first task!</p>';
      }
      return;
    }

    taskListView.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${filteredTasks.map(task => this.renderTaskCard(task)).join('')}
      </div>
    `;

    // Attach event listeners to buttons
    filteredTasks.forEach(task => {
      const completeBtn = document.getElementById(`complete-${task.id}`);
      const deleteBtn = document.getElementById(`delete-${task.id}`);
      
      if (completeBtn) {
        completeBtn.addEventListener('click', () => this.handleToggleComplete(task.id));
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.handleDeleteTask(task.id));
      }
    });
  }

  renderTaskCard(task) {
    const isCompleted = task.status === 'completed';
    
    return `
      <div 
        id="task-${task.id}" 
        class="task-item" 
        style="
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: ${isCompleted ? '#f9fafb' : 'white'};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          opacity: 1;
          transform: translateY(0);
        "
      >
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <h3 style="
            margin: 0; 
            color: ${isCompleted ? '#6b7280' : '#111827'};
            text-decoration: ${isCompleted ? 'line-through' : 'none'};
            flex: 1;
          ">
            ${this.escapeHtml(task.title)}
          </h3>
          <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
            <button
              id="complete-${task.id}"
              style="
                background: ${isCompleted ? '#10b981' : '#4f46e5'};
                color: white;
                border: none;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                cursor: pointer;
                transition: background 0.2s ease;
                min-height: 44px;
                min-width: 44px;
              "
              title="${isCompleted ? 'Mark as active' : 'Mark as complete'}"
            >
              ${isCompleted ? '↩️ Undo' : '✓ Complete'}
            </button>
            <button
              id="delete-${task.id}"
              style="
                background: #ef4444;
                color: white;
                border: none;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                cursor: pointer;
                transition: background 0.2s ease;
                min-height: 44px;
                min-width: 44px;
              "
              title="Delete task"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
        
        ${task.description ? `
          <p style="
            color: ${isCompleted ? '#9ca3af' : '#6b7280'}; 
            font-size: 0.875rem; 
            margin-bottom: 0.5rem;
            text-decoration: ${isCompleted ? 'line-through' : 'none'};
          ">
            ${this.escapeHtml(task.description)}
          </p>
        ` : ''}
        
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
          <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 12px;">
            ${task.priority}
          </span>
          <span style="padding: 0.25rem 0.75rem; background: #f3e8ff; color: #7c3aed; border-radius: 12px;">
            ${this.escapeHtml(task.category)}
          </span>
          <span style="padding: 0.25rem 0.75rem; background: ${isCompleted ? '#d1fae5' : '#fef3c7'}; color: ${isCompleted ? '#065f46' : '#92400e'}; border-radius: 12px;">
            ${isCompleted ? '✓ Completed' : 'Active'}
          </span>
        </div>
      </div>
    `;
  }

  handleToggleComplete(taskId) {
    const task = this.taskManager.getTask(taskId);
    if (!task.success) return;

    let result;
    if (task.data.status === 'completed') {
      // Uncomplete the task - set back to active
      result = this.taskManager.updateTask(taskId, {
        status: 'active',
        completedAt: null,
      });
    } else {
      // Complete the task
      result = this.taskManager.completeTask(taskId);
    }

    if (result.success) {
      // Save to storage
      this.saveTasks();
      
      // Animate the status change
      this.animateTaskCompletion(taskId, result.data.status === 'completed');
      
      // Re-render statistics immediately
      this.renderStatistics();
      
      // Re-render tasks after animation
      setTimeout(() => {
        this.renderTasks();
      }, 300);
    }
  }

  handleDeleteTask(taskId) {
    // Animate removal
    this.animateTaskRemoval(taskId);
    
    // Delete after animation
    setTimeout(() => {
      const result = this.taskManager.deleteTask(taskId);
      if (result.success) {
        // Save to storage
        this.saveTasks();
        
        // Re-render filter panel (category list may have changed)
        this.renderFilterPanel();
        
        // Re-render statistics
        this.renderStatistics();
        
        this.renderTasks();
      }
    }, 300);
  }

  animateTaskCompletion(taskId, isCompleting) {
    const taskElement = document.getElementById(`task-${taskId}`);
    if (!taskElement) return;

    if (isCompleting) {
      // Animate completion
      taskElement.style.transition = 'all 0.3s ease';
      taskElement.style.background = '#f0fdf4';
      taskElement.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        taskElement.style.transform = 'scale(1)';
      }, 150);
    } else {
      // Animate uncomplete
      taskElement.style.transition = 'all 0.3s ease';
      taskElement.style.background = '#ffffff';
      taskElement.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        taskElement.style.transform = 'scale(1)';
      }, 150);
    }
  }

  animateTaskRemoval(taskId) {
    const taskElement = document.getElementById(`task-${taskId}`);
    if (!taskElement) return;

    taskElement.style.transition = 'all 0.3s ease';
    taskElement.style.opacity = '0';
    taskElement.style.transform = 'translateY(20px)';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
