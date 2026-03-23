import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { initializeDatabase, getDatabase, run, get, all } from './db.js';
import { seedDatabase } from './seed.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Fix for ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 👇 SERVE FRONTEND (IMPORTANT 🔥)
app.use(express.static(path.join(__dirname, 'dist')));

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

// GET tasks for client
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

// CREATE task
app.post('/api/tasks', async (req, res) => {
  try {
    const { client_id, title, description, category, due_date, status, priority } = req.body;

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

// UPDATE task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await run(db, 'UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    const updatedTask = await get(db, 'SELECT * FROM tasks WHERE id = ?', [id]);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 👇 CATCH ALL ROUTE (VERY IMPORTANT 🔥)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

startServer();