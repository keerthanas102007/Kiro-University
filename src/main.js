import { TaskManager } from './services/TaskManager.js';

/**
 * Main Application Entry Point
 */
class App {
  constructor() {
    this.taskManager = new TaskManager();
    this.init();
  }

  async init() {
    console.log('Todo App initialized');
    
    // Create a sample task for demonstration
    const result = this.taskManager.createTask('Welcome to Todo App', {
      description: 'This is your first task. Click to edit or mark as complete.',
      priority: 'Medium',
      category: 'Getting Started',
    });

    if (result.success) {
      console.log('Sample task created:', result.data);
    }

    this.renderTaskForm();
    this.renderTasks();
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
    const tasks = this.taskManager.getAllTasks();
    const taskListView = document.getElementById('task-list-view');
    
    if (!taskListView) return;

    if (tasks.length === 0) {
      taskListView.innerHTML = '<p style="text-align: center; color: #6b7280;">No tasks yet. Create your first task!</p>';
      return;
    }

    taskListView.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${tasks.map(task => this.renderTaskCard(task)).join('')}
      </div>
    `;

    // Attach event listeners to buttons
    tasks.forEach(task => {
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
      // Animate the status change
      this.animateTaskCompletion(taskId, result.data.status === 'completed');
      
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
