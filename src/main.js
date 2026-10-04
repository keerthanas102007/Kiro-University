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
        ${tasks.map(task => `
          <div class="task-item" style="
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          ">
            <h3 style="margin-bottom: 0.5rem; color: #111827;">${this.escapeHtml(task.title)}</h3>
            <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">${this.escapeHtml(task.description)}</p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
              <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 12px;">
                ${task.priority}
              </span>
              <span style="padding: 0.25rem 0.75rem; background: #f3e8ff; color: #7c3aed; border-radius: 12px;">
                ${this.escapeHtml(task.category)}
              </span>
              <span style="padding: 0.25rem 0.75rem; background: #d1fae5; color: #065f46; border-radius: 12px;">
                ${task.status}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
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
