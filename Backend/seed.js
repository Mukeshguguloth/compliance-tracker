import { run } from './db.js';

export async function seedDatabase(db) {
  try {
    // Check if clients already exist
    const clientCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM clients', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (clientCount > 0) {
      console.log('Database already seeded');
      return;
    }

    // Insert seed clients
    const clients = [
      { company_name: 'Acme Corporation', country: 'USA', entity_type: 'LLC' },
      { company_name: 'TechStart Inc', country: 'Canada', entity_type: 'Corporation' },
      { company_name: 'Global Traders Ltd', country: 'UK', entity_type: 'Ltd' },
      { company_name: 'Innovation Labs GmbH', country: 'Germany', entity_type: 'GmbH' },
    ];

    const insertedClientIds = [];
    for (const client of clients) {
      const result = await run(db, 
        'INSERT INTO clients (company_name, country, entity_type) VALUES (?, ?, ?)',
        [client.company_name, client.country, client.entity_type]
      );
      insertedClientIds.push(result.id);
    }

    console.log('Inserted clients:', insertedClientIds);

    // Insert seed tasks
    const today = new Date();
    const tasks = [
      // Tasks for client 1 (Acme)
      {
        client_id: insertedClientIds[0],
        title: 'Annual Tax Filing',
        description: 'Complete annual tax return filing',
        category: 'Tax',
        status: 'Completed',
        priority: 'High',
        due_date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        client_id: insertedClientIds[0],
        title: 'Quarterly Compliance Report',
        description: 'Submit Q1 compliance report',
        category: 'Reporting',
        status: 'Pending',
        priority: 'Medium',
        due_date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        client_id: insertedClientIds[0],
        title: 'Audit Preparation',
        description: 'Prepare documents for external audit',
        category: 'Audit',
        status: 'In Progress',
        priority: 'High',
        due_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      // Tasks for client 2 (TechStart)
      {
        client_id: insertedClientIds[1],
        title: 'Employee Benefits Compliance',
        description: 'Ensure compliance with benefits regulations',
        category: 'HR',
        status: 'Pending',
        priority: 'Medium',
        due_date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        client_id: insertedClientIds[1],
        title: 'Data Protection Review',
        description: 'Review GDPR compliance',
        category: 'Data Privacy',
        status: 'Completed',
        priority: 'High',
        due_date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      // Tasks for client 3 (Global Traders)
      {
        client_id: insertedClientIds[2],
        title: 'Import/Export License Renewal',
        description: 'Renew international trade licenses',
        category: 'Licensing',
        status: 'Pending',
        priority: 'High',
        due_date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        client_id: insertedClientIds[2],
        title: 'Trade Documentation',
        description: 'Complete trade compliance documentation',
        category: 'Documentation',
        status: 'In Progress',
        priority: 'Medium',
        due_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      // Tasks for client 4 (Innovation Labs)
      {
        client_id: insertedClientIds[3],
        title: 'Environmental Compliance Audit',
        description: 'Conduct environmental compliance review',
        category: 'Environmental',
        status: 'Pending',
        priority: 'Medium',
        due_date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        client_id: insertedClientIds[3],
        title: 'Health & Safety Review',
        description: 'Review workplace safety compliance',
        category: 'Health & Safety',
        status: 'Completed',
        priority: 'High',
        due_date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
    ];

    for (const task of tasks) {
      await run(db,
        `INSERT INTO tasks (client_id, title, description, category, due_date, status, priority) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [task.client_id, task.title, task.description, task.category, task.due_date, task.status, task.priority]
      );
    }

    console.log('Seeded database with clients and tasks');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
