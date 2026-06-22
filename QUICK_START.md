# Quick Start Guide - AI Resume Screening System

Get the entire system running in 5 minutes!

## 🚀 Prerequisites

Make sure you have installed:
- **Node.js** 14+ (https://nodejs.org)
- **Python** 3.8+ (https://python.org)
- **Git** (https://git-scm.com)

Verify installations:
```bash
node --version     # Should be v14.0.0 or higher
npm --version      # Should be 6.0.0 or higher
python --version   # Should be 3.8.0 or higher
```

## 📦 Clone & Setup (2 minutes)

```bash
# Clone repository
git clone https://github.com/Zurnain-debug/AI-Resume-Screening-System.git
cd "ai resume screening system"

# Backend setup
cd backend
npm install
cd ..

# Frontend setup
cd frontend
npm install
cd ..

# AI Module setup
cd ai-module
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

## 🏃 Run (3 steps = 3 different terminals)

### Terminal 1: AI Module (Port 5001)
```bash
cd ai-module
source venv/Scripts/activate  # Windows: venv\Scripts\activate
python app.py
```
✅ You should see: `Running on http://127.0.0.1:5001`

### Terminal 2: Backend (Port 5000)
```bash
cd backend
npm run dev
```
✅ You should see: `Server listening on port 5000`

### Terminal 3: Frontend (Port 3001)
```bash
cd frontend
npm start
```
✅ Browser automatically opens http://localhost:3001

## 🧪 Quick Test

1. **Register as HR:**
   - Open http://localhost:3001
   - Click "Register"
   - Email: hr@test.com | Password: Test123! | Role: HR
   - Click "Register" → Login

2. **Create a Job:**
   - Navigate to "Job Management"
   - Click "Create New Job"
   - Title: "Senior Developer"
   - Skills: "React, JavaScript, Python"
   - Experience: "5 years"
   - Click "Post Job"

3. **View Sample Resume:**
   - Go to "Sample Resumes"
   - Click on "Priya Sharma - Frontend Developer"
   - Click "Copy Content"

4. **Upload Resume:**
   - Create file: `resume.txt`
   - Paste sample content
   - Drag into upload area
   - Select the job you created
   - Wait for processing (~3 seconds)

5. **View Results:**
   - Go to "Results"
   - Click "View Rankings"
   - See your score and match breakdown

✅ Done! The system works!

## 📂 Project Structure

```
ai resume screening system/
├── backend/              # Node.js/Express server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── package.json
│   └── server.js
├── frontend/             # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── ai-module/            # Python Flask
│   ├── src/
│   │   ├── analyzer_enhanced.py
│   │   └── preprocessing_enhanced.py
│   ├── app.py
│   └── requirements.txt
└── docs/                 # Documentation
```

## 🔌 API Endpoints Quick Reference

**No Auth Required:**
- `GET /api/samples` - List sample resumes
- `GET /api/health` - Server health

**Auth Required (Add header: `Authorization: Bearer {token}`):**
```bash
# Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

# Jobs
POST /api/jobs - Create job
GET /api/jobs - List jobs
PUT /api/jobs/:id - Update job

# Resumes
POST /api/resumes/upload - Upload resume
GET /api/resumes - List user resumes

# Results
GET /api/results - Get results
GET /api/results/job/:jobId/ranking - Get ranking
```

## 🆘 Common Issues

### "Port already in use"
```bash
# Kill process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### "ModuleNotFoundError" in Python
```bash
# Reinstall dependencies
cd ai-module
pip install -r requirements.txt --force-reinstall
```

### "npm ERR! Cannot find module"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Cannot connect to MongoDB"
- Make sure MongoDB is running locally, or
- Update connection string in `backend/src/config/database.js`

## 📚 Documentation

- **Full System Guide:** [SYSTEM_IMPROVEMENTS.md](SYSTEM_IMPROVEMENTS.md)
- **Complete Testing:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Docs:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## 🎯 Next Steps

1. **Explore Sample Resumes** → Understand the format
2. **Upload Your Resume** → Test the AI analysis
3. **Create More Jobs** → Try different scoring scenarios
4. **Review Admin Panel** → Update candidate status and ratings
5. **Read Full Docs** → Understand system architecture

## 💡 Tips

- Resumes process in background (non-blocking)
- Processing takes 2-3 seconds
- Sample resumes are excellent for testing
- Use admin dashboard to manage candidates
- Check browser console (F12) for API debugging

## 🚀 Deployment

When ready to deploy:

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Use Docker:**
   ```bash
   docker-compose up --build
   ```

3. **Deploy to cloud:** See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

## 📞 Support

- Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for troubleshooting
- Review error messages in browser console (F12)
- Check terminal output for API errors

## ✅ Success Checklist

- [ ] All 3 services running (ports 5000, 5001, 3001)
- [ ] Can register and login
- [ ] Can create a job
- [ ] Can view sample resumes
- [ ] Can upload resume
- [ ] Can see analysis results
- [ ] Can update candidate status

🎉 **Congratulations! You have a fully functional AI Resume Screening System!**

---

**For detailed information, see the comprehensive documentation files in the `/docs` folder.**
