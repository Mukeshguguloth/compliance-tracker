import React from 'react';

function ClientList({ clients, selectedClientId, onSelectClient }) {
  return (
    <div>
      <h2>Clients</h2>
      <ul className="client-list">
        {clients.map(client => (
          <li
            key={client.id}
            className={`client-item ${selectedClientId === client.id ? 'active' : ''}`}
            onClick={() => onSelectClient(client.id)}
          >
            <strong>{client.company_name}</strong>
            <div style={{ fontSize: '0.85em', opacity: '0.8', marginTop: '4px' }}>
              {client.country}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientList;
