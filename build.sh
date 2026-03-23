#!/bin/bash
# Build script for Render deployment

# Install backend dependencies
cd Backend
npm install
cd ..

# Build frontend
cd Frontend
npm install
npm run build
cd ..

echo "Build complete!"
