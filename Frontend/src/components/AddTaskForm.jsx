import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api';

function AddTaskForm({ clientId, categories, onTaskAdded, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories.length > 0 ? categories[0] : '',
    due_date: '',
    status: 'Pending',
    priority: 'Medium'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }
    if (!formData.due_date) {
      setError('Due date is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          due_date: formData.due_date,
          status: formData.status,
          priority: formData.priority
        })
      });

      if (response.ok) {
        onTaskAdded();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add task');
      }
    } catch (err) {
      setError('Error adding task: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Annual Tax Filing"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional details about the task..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Due Date *</label>
          <input
            id="due_date"
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">Initial Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          className="btn-success"
          style={{ flex: 1 }}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          style={{ flex: 1 }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;
