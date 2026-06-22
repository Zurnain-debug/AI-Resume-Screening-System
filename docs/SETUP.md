# Setup Guide

## Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (local or cloud)
- npm or yarn

## Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your MongoDB URI and JWT secret:
   ```ini
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-screening
   JWT_SECRET=your_jwt_secret_key_here
   PYTHON_API_URL=http://localhost:5001
   NODE_ENV=development
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

## AI Module Setup
1. Navigate to the ai-module directory:
   ```bash
   cd ai-module
   ```
2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
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
5. Create `.env` from `.env.example` and update if needed:
   ```bash
   cp .env.example .env
   ```
6. Start the Python API:
   ```bash
   python app.py
   ```

## Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables
### Frontend
- `REACT_APP_API_URL` - Base URL for backend API requests

### Backend
- `PORT` - Backend server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PYTHON_API_URL` - AI module base URL
- `NODE_ENV` - Node environment

### AI Module
- `PORT` - Flask port
- `FLASK_ENV` - Flask environment value

## Notes
- The frontend is available at `http://localhost:3000` by default.
- The backend expects the AI module at `http://localhost:5001` unless `PYTHON_API_URL` is updated.
- The AI module exposes `/health`, `/analyze`, and `/batch-analyze`.
