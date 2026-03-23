import React from 'react';

function Stats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total Tasks</div>
        <div className="stat-value">{stats.total}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Pending</div>
        <div className="stat-value">{stats.pending}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">In Progress</div>
        <div className="stat-value">{stats.inProgress}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Completed</div>
        <div className="stat-value">{stats.completed}</div>
      </div>
      <div className="stat-card overdue">
        <div className="stat-label">Overdue</div>
        <div className="stat-value">{stats.overdue}</div>
      </div>
    </div>
  );
}

export default Stats;
