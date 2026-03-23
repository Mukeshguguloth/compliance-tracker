import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api';

function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editData, setEditData] = useState({});

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'In Progress':
        return 'in-progress';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority) => {
    return priority?.toLowerCase() || '';
  };

  const isOverdue = (task) => {
    if (task.status === 'Completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.due_date < today;
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setEditingTaskId(null);
        onTaskUpdated();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          onTaskDeleted();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditStart = (task) => {
    setEditingTaskId(task.id);
    setEditData({
      title: task.title,
      status: task.status,
      priority: task.priority,
      description: task.description
    });
  };

  const handleEditSave = (taskId) => {
    updateTask(taskId, editData);
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>Add a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="tasks-list">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`task-card ${isOverdue(task) ? 'overdue' : ''} ${task.status === 'Completed' ? 'completed' : ''}`}
        >
          {editingTaskId === task.id ? (
            <div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </div>

              <div className="task-actions">
                <button className="btn-success" onClick={() => handleEditSave(task.id)}>
                  Save
                </button>
                <button className="btn-secondary" onClick={() => setEditingTaskId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-header">
                <div className="task-title">{task.title}</div>
                <div className="task-badges">
                  {isOverdue(task) && (
                    <span className="badge badge-overdue">OVERDUE</span>
                  )}
                  <span className={`badge badge-status ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className="badge badge-category">{task.category}</span>
                  <span className={`badge badge-priority ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              {task.description && (
                <div className="task-description">{task.description}</div>
              )}

              <div className="task-meta">
                <div className="task-date">
                  📅 Due: {new Date(task.due_date).toLocaleDateString()}
                </div>

                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button className="btn-secondary" onClick={() => handleEditStart(task)}>
                    Edit
                  </button>

                  <button className="btn-danger" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;