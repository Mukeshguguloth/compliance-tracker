import React, { useState, useEffect } from 'react';
import ClientList from './components/ClientList';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import Stats from './components/Stats';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://compliance-tracker-no9p.onrender.com/api';

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filters, setFilters] = useState({ status: 'All', category: 'All' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch tasks and stats when selected client changes
  useEffect(() => {
    if (selectedClientId) {
      fetchTasks();
      fetchStats();
      fetchCategories();
      fetchStatuses();
    }
  }, [selectedClientId, filters]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/clients`);
      const data = await response.json();
      setClients(data);
      if (data.length > 0 && !selectedClientId) {
        setSelectedClientId(data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/clients/${selectedClientId}/tasks?${params}`);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${selectedClientId}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statuses`);
      const data = await response.json();
      setStatuses(data);
    } catch (err) {
      console.error('Failed to fetch statuses', err);
    }
  };

  const handleTaskAdded = () => {
    setShowAddModal(false);
    fetchTasks();
    fetchStats();
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    fetchStats();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
    fetchStats();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="app">
      <header>
        <h1>🔒 Compliance Tracker</h1>
        <p>Manage compliance tasks for your clients</p>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="empty-state">
            <h3>Loading...</h3>
          </div>
        ) : (
          <div className="main-content">
            <div className="sidebar">
              <ClientList
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
              />
            </div>

            <div className="content-area">
              {selectedClient ? (
                <>
                  <h2>Tasks for {selectedClient.company_name}</h2>
                  <p style={{ marginBottom: '20px', color: '#666' }}>
                    {selectedClient.country} • {selectedClient.entity_type}
                  </p>

                  {stats && <Stats stats={stats} />}

                  <div className="filters-section">
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>

                    <button onClick={() => setShowAddModal(true)}>
                      + Add New Task
                    </button>
                  </div>

                  <TaskList
                    tasks={tasks}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />

                  {showAddModal && (
                    <div className="modal active">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h2>Add New Task</h2>
                          <button
                            className="close-btn"
                            onClick={() => setShowAddModal(false)}
                          >
                            ×
                          </button>
                        </div>
                        <AddTaskForm
                          clientId={selectedClientId}
                          categories={categories}
                          onTaskAdded={handleTaskAdded}
                          onCancel={() => setShowAddModal(false)}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-client-selected">
                  <h3>No client selected</h3>
                  <p>Select a client from the sidebar to view tasks</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
