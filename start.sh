#!/bin/bash
# Production startup script

# Start backend server in background
cd Backend
PORT=${PORT:-5000} npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Install serve globally if not present
npm install -g serve 2>/dev/null || true

# Serve frontend on port 3000
cd ../Frontend
serve -s dist -l 3000

# Allow background jobs to continue
wait $BACKEND_PID
