import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeDatabase, getDatabase, run, get, all } from './db.js';
import { seedDatabase } from './seed.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Global database instance
let db;

// Initialize database and start server
async function startServer() {
  try {
    db = await initializeDatabase();
    await seedDatabase(db);
    console.log('Database initialized and seeded');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// ==================== API ENDPOINTS ====================

// GET all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await all(db, 'SELECT * FROM clients ORDER BY company_name');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single client
app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await get(db, 'SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all tasks for a client
app.get('/api/clients/:clientId/tasks', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, category } = req.query;

    let query = 'SELECT * FROM tasks WHERE client_id = ?';
    const params = [clientId];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY due_date ASC';

    const tasks = await all(db, query, params);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET task statistics for a client
app.get('/api/clients/:clientId/stats', async (req, res) => {
  try {
    const { clientId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const tasks = await all(
      db,
      `SELECT status, due_date FROM tasks WHERE client_id = ?`,
      [clientId]
    );

    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      overdue: tasks.filter(t => t.status === 'Pending' && t.due_date < today).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all unique categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await all(
      db,
      'SELECT DISTINCT category FROM tasks ORDER BY category'
    );
    const categories = result.map(r => r.category);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all unique statuses
app.get('/api/statuses', async (req, res) => {
  try {
    const result = await all(
      db,
      'SELECT DISTINCT status FROM tasks ORDER BY status'
    );
    const statuses = result.map(r => r.status);
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { client_id, title, description, category, due_date, status, priority } = req.body;

    // Validation
    if (!client_id || !title || !category || !due_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await run(
      db,
      `INSERT INTO tasks (client_id, title, description, category, due_date, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id,
        title,
        description || null,
        category,
        due_date,
        status || 'Pending',
        priority || 'Medium'
      ]
    );

    const task = await get(db, 'SELECT * FROM tasks WHERE id = ?', [result.id]);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE task status
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, description, due_date, title, category } = req.body;

    // Get current task
    const task = await get(db, 'SELECT * FROM tasks WHERE id = ?', [id]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(due_date);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    
    await run(db, query, values);
    const updatedTask = await get(db, 'SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await get(db, 'SELECT * FROM tasks WHERE id = ?', [id]);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await run(db, 'DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

startServer();
