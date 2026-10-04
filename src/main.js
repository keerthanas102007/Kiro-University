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
      this.renderTasks();
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
