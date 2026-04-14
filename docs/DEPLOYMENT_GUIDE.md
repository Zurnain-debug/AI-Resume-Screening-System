# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js and Python installed locally (for development)
- MongoDB instance (local or cloud)

## Local Development Setup

### Step 1: Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-screening
   JWT_SECRET=your_jwt_secret_key_changed
   PYTHON_API_URL=http://localhost:5001
   NODE_ENV=development
   ```

5. Start MongoDB:
   ```bash
   mongod
   ```

6. Run backend:
   ```bash
   npm run dev
   ```

### Step 2: AI Module Setup

1. Navigate to ai-module directory:
   ```bash
   cd ai-module
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run AI module:
   ```bash
   python app.py
   ```

### Step 3: Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

Application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- AI Module: http://localhost:5001

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose installed

### Build and Run

1. From root directory, run:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - MongoDB: localhost:27017

### Stop Services

```bash
docker-compose down
```

## Production Deployment

### AWS Deployment

#### 1. Set up EC2 Instance

1. Create EC2 instance (Ubuntu 20.04 LTS)
2. SSH into instance:
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. Install Docker and Docker Compose:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker ubuntu
   ```

#### 2. Deploy with Docker Compose

1. Clone repository:
   ```bash
   git clone your-repo-url
   cd ai-resume-screening-system
   ```

2. Create production `.env`:
   ```bash
   cat > .env << EOF
   PORT=5000
   MONGODB_URI=mongodb://mongodb:27017/resume-screening
   JWT_SECRET=your_production_secret_key
   PYTHON_API_URL=http://localhost:5001
   NODE_ENV=production
   EOF
   ```

3. Build and start services:
   ```bash
   docker-compose up -d
   ```

#### 3. Set up Nginx Reverse Proxy

1. Install Nginx:
   ```bash
   sudo apt install nginx
   ```

2. Create Nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

3. Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }

       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

4. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

#### 4. Set up SSL Certificate

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Get SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### Heroku Deployment

1. Install Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```

4. Add MongoDB add-on:
   ```bash
   heroku addons:create mongolab
   ```

5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```

6. Deploy:
   ```bash
   git push heroku main
   ```

### Vercel Deployment (Frontend Only)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/resume-screening
JWT_SECRET=your_jwt_secret_key
PYTHON_API_URL=http://localhost:5001
NODE_ENV=production
```

### AI Module (.env)
```
PORT=5001
FLASK_ENV=production
DEBUG=False
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-domain.com/api
```

## Database Setup

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Whitelist IP address
5. Get connection string
6. Update MONGODB_URI in backend .env

### Local MongoDB

1. Install MongoDB
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. Connection string:
   ```
   mongodb://localhost:27017/resume-screening
   ```

## Monitoring & Logging

### PM2 Process Manager (Alternative to Docker)

1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Create ecosystem.config.js:
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'backend',
         script: 'backend/server.js',
         env: { NODE_ENV: 'production' }
       },
       {
         name: 'ai-module',
         script: 'ai-module/app.py',
         interpreter: 'python'
       }
     ]
   };
   ```

3. Start with PM2:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## Backup & Recovery

### MongoDB Backup

```bash
mongodump --uri "mongodb://localhost:27017/resume-screening" --out /backup/mongodb
```

### MongoDB Restore

```bash
mongorestore --uri "mongodb://localhost:27017/resume-screening" /backup/mongodb
```

## Performance Optimization

### Caching

Add Redis caching:
```bash
docker run -d -p 6379:6379 redis:alpine
```

### CDN Setup

Use CloudFront for static assets in S3

### Database Indexing

```javascript
// Create indexes in MongoDB
db.resumes.createIndex({ jobId: 1, candidateId: 1 })
db.results.createIndex({ jobId: 1, percentageMatch: -1 })
```

## Troubleshooting

### Container not starting
```bash
docker logs container_name
```

### Port already in use
```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection failed
- Check MongoDB service is running
- Verify connection string
- Check network connectivity

### API endpoints not responding
- Check backend logs
- Verify environment variables
- Check CORS configuration

## Support

For deployment issues, contact:
- support@resumescreening.com
- Create issue on GitHub
