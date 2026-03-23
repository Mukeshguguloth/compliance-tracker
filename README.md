# Mini Compliance Tracker

A simple web application to track compliance tasks for different clients. Built with Node.js/Express backend and React frontend.

## Features

- ✅ View list of clients
- ✅ View and manage tasks for selected client
- ✅ Add new compliance tasks
- ✅ Update task status (Pending → In Progress → Completed)
- ✅ Filter tasks by status and category
- ✅ Highlight overdue pending tasks
- ✅ View task statistics (Total, Pending, Completed, In Progress, Overdue)
- ✅ Edit and delete tasks
- ✅ Responsive design

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite3** for data persistence
- **CORS** enabled for frontend communication

### Frontend
- **React 18** for UI components
- **Vite** for build and development server
- **Vanilla CSS** for styling (no external UI libraries)

## Project Structure

```
Mini_Compliance_Tracker/
├── Backend/
│   ├── server.js          # Express application & API endpoints
│   ├── db.js              # Database initialization & helpers
│   ├── seed.js            # Database seeding with sample data
│   ├── package.json
│   ├── .env
│   └── compliance.db      # SQLite database (auto-created)
├── Frontend/
│   ├── src/
│   │   ├── main.jsx       # React entry point
│   │   ├── App.jsx        # Main App component
│   │   └── components/
│   │       ├── ClientList.jsx
│   │       ├── TaskList.jsx
│   │       ├── AddTaskForm.jsx
│   │       └── Stats.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env
│   └── dist/              # Built files (after npm run build)
└── .gitignore
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm installed

### Backend Setup

1. Navigate to Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The backend will start on `http://localhost:5000`

The database will be automatically created and seeded with sample data on first run.

### Frontend Setup

In a new terminal:

1. Navigate to Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

### Access the Application

Open your browser and go to: `http://localhost:3000`

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get specific client
- `GET /api/clients/:clientId/tasks` - Get tasks for a client (supports filters)
- `GET /api/clients/:clientId/stats` - Get statistics for a client

### Tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Metadata
- `GET /api/categories` - Get all unique categories
- `GET /api/statuses` - Get all unique statuses
- `GET /api/health` - Health check

### Query Parameters
- `status` - Filter by status (All, Pending, In Progress, Completed)
- `category` - Filter by category

## Sample Data

The application comes with pre-seeded data:

### Clients
- Acme Corporation (USA, LLC)
- TechStart Inc (Canada, Corporation)
- Global Traders Ltd (UK, Ltd)
- Innovation Labs GmbH (Germany, GmbH)

### Tasks
Each client has 2-3 sample tasks with different statuses, categories, and due dates.

## Key Features Explained

### Overdue Highlighting
Tasks with:
- Status: Pending
- Due date before today

Are marked with a red "OVERDUE" badge and highlighted with a red left border.

### Task Filters
- **Status Filter**: Show all/pending/in-progress/completed tasks
- **Category Filter**: Show tasks from specific compliance categories

### Statistics Dashboard
Shows real-time counts of:
- Total tasks
- Pending tasks
- In Progress tasks
- Completed tasks
- Overdue pending tasks

## Tradeoffs

1. **No Authentication**: This is a demo app. In production, add JWT-based authentication.

2. **SQLite Database**: While not ideal for high-concurrency scenarios, it's perfect for this small application. Scale to PostgreSQL if needed.

3. **CSS-only Styling**: No UI framework used to keep dependencies minimal and build size small. Trade-off: less polish for faster development.

4. **No Pagination**: All tasks loaded at once. For 1000+ tasks, implement pagination.

5. **No Search**: Filtering by status/category only. Could add full-text search using SQLite FTS.

6. **In-memory Updates**: Frontend updates happen optimistically. Error handling could be improved for network failures.

## Assumptions

1. **Single User**: No multi-user support or role-based access control.

2. **Simple Validation**: Basic server-side validation. Frontend validation is done too.

3. **Date Format**: Uses ISO date format (`YYYY-MM-DD`).

4. **Task Priorities**: Limited to Low, Medium, High.

5. **Task Statuses**: Limited to Pending, In Progress, Completed.

6. **No Notifications**: No email or push notifications for overdue tasks.

7. **No Audit Trail**: No history of task changes logged.

## Future Enhancements (Optional)

- [ ] User authentication and multi-user support
- [ ] Task assignment to team members
- [ ] Email notifications for approaching/overdue tasks
- [ ] Task search functionality
- [ ] Task sorting (by due date, priority, etc.)
- [ ] Export tasks to CSV/PDF
- [ ] Task comments and activity log
- [ ] Recurring tasks
- [ ] Task attachments
- [ ] Dark mode
- [ ] calendar view

## Development Notes

### Adding New Features

1. **Backend**: Update API endpoints in `server.js`
2. **Database**: Update schema in `db.js`
3. **Seed Data**: Add sample data to `seed.js`
4. **Frontend**: Create new components in `src/components/`

### Building for Production

Frontend:
```bash
cd Frontend
npm run build
# Output goes to Frontend/dist/
```

Backend can run directly with:
```bash
cd Backend
npm install --production
npm start
```

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure:
- Backend is running on port 5000
- Frontend is running on port 3000
- CORS is enabled in server.js

### Database Issues
To reset the database:
```bash
cd Backend
rm compliance.db
npm start
```

### Port Already in Use
If ports 5000 or 3000 are in use:
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`

## License

This project is open source and available under the MIT License.

---

**Built for LedgersCFO Compliance Team**
