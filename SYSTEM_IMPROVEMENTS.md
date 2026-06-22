# AI Resume Screening System - Enhanced Edition

A professional, full-stack AI-powered resume screening and candidate ranking platform with intelligent ML-based matching, sample resumes, and comprehensive admin reporting.

## 🚀 Key Features

### 1. **Smart Resume Analysis**
- Automatic text extraction from PDF, DOCX, and TXT files
- AI-powered resume parsing using TF-IDF and cosine similarity
- Weighted scoring algorithm combining:
  - Content similarity (50%)
  - Skill matching (30%)
  - Experience matching (20%)
- Real-time processing with async background jobs

### 2. **Candidate Ranking & Scoring**
- Intelligent candidate ranking by match percentage
- Detailed match breakdown (content, skills, experience)
- Matched and missing skills identification
- Experience years extraction
- Confidence scores for each matched skill

### 3. **Sample Resumes**
- 3 professional sample resumes included:
  - Frontend Developer (Priya Sharma)
  - Data Scientist (Arjun Patel)
  - HR Manager (Nisha Gupta)
- Users can view, copy, and customize samples
- Realistic content with clearly labeled sections

### 4. **Admin Dashboard**
- Real-time candidate analytics
- Score breakdown visualization
- Candidate status tracking (new, reviewing, shortlisted, rejected, offered, hired)
- Admin rating system (1-5 stars)
- Internal notes for collaboration
- Comprehensive result details view

### 5. **Modern UI/UX**
- Professional SaaS-style landing page
- Dark theme with glassmorphism design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Drag-and-drop resume upload

## 📋 System Architecture

```
┌─────────────────────────────────────────┐
│          Frontend (React)                 │
│  - Landing Page & Sample Gallery         │
│  - Resume Upload (Drag & Drop)           │
│  - Admin Results Dashboard               │
│  - Candidate Tracking                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Backend (Node.js/Express)         │
│  - Resume Upload & Processing            │
│  - Result Tracking & Analytics           │
│  - Admin Status Management               │
│  - Sample Resume API                     │
│  - JWT Authentication                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      AI Module (Python/Flask)            │
│  - Resume Text Analysis                  │
│  - Skill Extraction & Matching          │
│  - Experience Scoring                    │
│  - Weighted Match Calculation            │
│  - ML-Based Candidate Evaluation        │
└─────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with React Router
- **Ant Design** (UI components)
- **Axios** (API client)
- **Chart.js** (Analytics visualization)
- **Tailwind CSS** (Modern styling)

### Backend
- **Node.js + Express.js** (Server)
- **MongoDB** (Database)
- **JWT** (Authentication)
- **Multer** (File upload)
- **PDF-Parse** & **Mammoth** (Document parsing)

### AI Module
- **Python 3.8+** (ML framework)
- **Flask** (Web service)
- **scikit-learn** (ML algorithms)
- **NLTK** (NLP preprocessing)
- **NumPy & Pandas** (Data processing)

## 📦 Enhanced Components

### New Files Created
```
ai-module/
  └── src/
      ├── preprocessing_enhanced.py  (Advanced text analysis)
      └── analyzer_enhanced.py       (Weighted scoring algorithm)

backend/
  ├── src/
  │   ├── controllers/
  │   │   └── sampleResumeController.js
  │   ├── data/
  │   │   └── sampleResumes.js      (3 professional samples)
  │   ├── routes/
  │   │   └── sampleResumeRoutes.js
  │   └── models/
  │       └── Result.js             (Enhanced with admin fields)
  └── server.js                      (Updated with sample routes)

frontend/
  └── src/
      └── components/
          ├── SampleResumeGallery.js    (Sample viewer)
          └── AdminResultsViewer.js     (Admin dashboard)
```

## 🔄 Resume Processing Workflow

```
1. Candidate uploads resume (PDF/DOCX/TXT)
   ↓
2. Backend extracts text instantly
   ↓
3. AI module analyzes in background
   - Extracts skills, experience, education
   - Calculates similarity scores
   - Generates match breakdown
   ↓
4. Results stored with metadata
   ↓
5. Admin views detailed results
   - Scores and breakdown
   - Matched/missing skills
   - Status tracking
   - Rating & notes
```

## 🎯 Scoring Algorithm

### Final Score Calculation
```
Final Score = (Similarity × 0.50) + (Skill Match × 0.30) + (Experience Match × 0.20)
```

### Score Breakdown
- **Content Similarity** (50%): TF-IDF cosine similarity between resume and job description
- **Skill Match** (30%): Percentage of required skills found in resume
- **Experience Match** (20%): Years of experience vs required experience

### Recommendations
- **80-100%**: Strong candidate - Highly recommended
- **60-79%**: Good candidate - Consider for interview
- **40-59%**: Fair candidate - Review further
- **0-39%**: Weak candidate - Not recommended

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- Python 3.8+
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Zurnain-debug/AI-Resume-Screening-System.git
cd "ai resume screening system"
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up Python AI module**
```bash
cd ../ai-module
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running the System

**Terminal 1 - Backend (port 5000)**
```bash
cd backend
npm run dev
# or
npm start
```

**Terminal 2 - AI Module (port 5001)**
```bash
cd ai-module
source venv/Scripts/activate
python app.py
```

**Terminal 3 - Frontend (port 3001)**
```bash
cd frontend
npm start
```

## 📚 API Endpoints

### Sample Resumes
```
GET  /api/samples                    - List all sample resumes
GET  /api/samples/:type             - Get specific sample resume
```

### Resume Processing
```
POST /api/resumes/upload            - Upload resume (auto-processes)
GET  /api/resumes                   - Get user's resumes
GET  /api/resumes/:id              - Get specific resume
```

### Results & Analytics
```
GET  /api/results                   - Get all results (filtered by jobId)
GET  /api/results/job/:jobId/ranking    - Get ranking for job
GET  /api/results/job/:jobId/analytics  - Get analytics for job
GET  /api/results/:id               - Get specific result details
```

## 🧪 Testing with Sample Resumes

1. **Create a job posting** (as HR)
   - Title: "Senior Frontend Developer"
   - Skills: React, JavaScript, TypeScript, Node.js
   - Experience: 5 years

2. **Download sample resume**
   - Go to /samples page
   - Select "Priya Sharma - Frontend Developer"
   - Copy the content

3. **Upload and test**
   - Apply for the job with sample resume
   - System automatically analyzes and scores
   - View results in admin dashboard
   - Check detailed match breakdown

## 📊 Admin Dashboard Features

### Candidate Management
- View all candidates with scores
- Filter by job, score band, status
- Rate candidates (1-5 stars)
- Add internal notes
- Track candidate status (6 stages)

### Analytics
- Total applicants count
- Average match score
- Score distribution chart
- Top candidates list
- Match rate metrics

### Scoring Details
- Overall match percentage
- Content similarity breakdown
- Skill match analysis
- Experience match percentage
- Recommended action

## 🔐 Authentication

- JWT-based authentication
- Role-based access (HR, Candidate)
- Secure token storage (localStorage)
- Automatic session timeout

## 🎨 UI/UX Improvements

- **Modern Design**: Dark theme with purple gradient
- **Glassmorphism**: Soft glass effect cards
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG 2.1 compliant

## 📈 Performance Optimizations

- Async resume processing (non-blocking)
- Background job handling
- Efficient text extraction
- Optimized TF-IDF vectorization
- Result caching

## 🐛 Known Limitations

- Sample resumes are stored in-memory (not persistent)
- Resume processing may take 1-3 seconds for large files
- Maximum file size: 10MB

## 🚧 Future Enhancements

- [ ] Resume ATS optimization recommendations
- [ ] Candidate interview scheduling
- [ ] Email notifications for HR
- [ ] Export reports (PDF/Excel)
- [ ] Custom scoring weights
- [ ] Machine learning model improvements
- [ ] Multi-language support
- [ ] Bulk upload processing

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit PRs or open issues for bugs and feature requests.

## 📞 Support

For issues or questions, please contact: support@airesumescreener.com

---

**Built with ❤️ for modern recruitment teams**
