# Deployment Guide

This guide covers deploying the Compliance Tracker to various platforms.

## Option 1: Render.com (Recommended - Free Tier Available)

Render.com offers a free tier that's perfect for small projects like this.

### Steps:

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/compliance-tracker.git
   git push -u origin master
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Choose the repository

4. **Configure Service**
   - **Name**: compliance-tracker
   - **Environment**: Node
   - **Build Command**: `cd Backend && npm install && cd ../Frontend && npm install && npm run build`
   - **Start Command**: `cd Backend && PORT=$PORT npm start`
   - **Plan**: Free

5. **Add Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: Leave empty (Render sets this)

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be live at `https://your-app-name.onrender.com`

### Alternative: Deploy with Docker

1. Create a Web Service
2. Select Docker from the environment
3. Render will automatically detect and use the Dockerfile

## Option 2: Railway.app

Railway is another excellent alternative with free tier credits.

### Steps:

1. **Push to GitHub** (same as above)

2. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

3. **Import Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

4. **Configure**
   - Railway will auto-detect the Node.js project
   - Set environment variables if needed

5. **Deploy**
   - Click "Deploy"
   - Your app will be live

## Option 3: Heroku (Paid but reliable)

Heroku discontinued its free tier, but it's still a reliable option if you want to pay a small monthly fee.

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku master

# Open app
heroku open
```

## Option 4: DigitalOcean App Platform

1. Create DigitalOcean account
2. Go to App Platform
3. Connect your GitHub repo
4. Configure build and run commands (same as Render)

## Option 5: Local Deployment (Testing)

### Requirements
- Node.js 16+
- npm

### Steps:

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **For Development**
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

3. **For Production**
   ```bash
   npm run build
   npm start
   ```

## Option 6: Docker Deployment

### Using Docker Compose (Local)

```bash
docker-compose up
```

Visit http://localhost:3000

### Using Docker with Cloud Provider

Most cloud providers support Docker. Use the provided Dockerfile:

```bash
docker build -t compliance-tracker .
docker run -p 5000:5000 -p 3000:3000 compliance-tracker
```

## Environment Variables

For production deployments, you may need to set:

**Backend (.env)**
```
PORT=5000
NODE_ENV=production
DATABASE_URL=compliance.db
```

**Frontend (.env or .env.production)**
```
VITE_API_BASE=https://your-api-domain.com/api
```

## Troubleshooting

### CORS Issues on Deployed App

If frontend can't reach backend, update the API URL in frontend:

1. Update `Frontend/.env`:
   ```
   VITE_API_BASE=https://your-backend-domain.com/api
   ```

2. Rebuild frontend:
   ```bash
   cd Frontend
   npm run build
   ```

3. Redeploy

### Database Not Persisting

The SQLite database is file-based. On serverless platforms that don't persist the filesystem, consider:

1. **Moving to PostgreSQL** (most cloud providers offer free tiers)
2. **Using persistent volumes** if your platform supports them
3. **Using SQLite with better persistence** configuration

### Port Issues

If the deployment fails with port issues:
- Don't hardcode ports in the app
- Use environment variables: `process.env.PORT || 5000`
- Most platforms automatically set the PORT environment variable

## Performance Optimization

Once deployed, consider:

1. **Enable Gzip Compression** - Add to server.js
2. **Cache Static Assets** - Configure in Vite
3. **Use CDN** - Serve frontend from CDN
4. **Database Optimization** - Add indexes for frequently queried fields

## Monitoring

After deployment:

- Monitor application logs
- Set up error tracking (Sentry.io offers free tier)
- Monitor response times
- Set up simple uptime monitoring

---

**For quick deployment, we recommend Render.com or Railway.app!**
