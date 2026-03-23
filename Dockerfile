# Multi-stage build for backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY Backend/package*.json ./
RUN npm ci --only=production

# Multi-stage build for frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY Frontend/package*.json ./
RUN npm ci
COPY Frontend/ ./
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend /app/backend

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Install serve to run frontend
RUN npm install -g serve

# Expose ports
EXPOSE 5000 3000

# Start both backend and frontend
CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/dist -l 3000"]
