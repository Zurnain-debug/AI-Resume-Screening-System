# System Architecture

## Overview

The AI Resume Screening System uses a microservices architecture with three main components:

1. **Frontend (React.js)** - User Interface
2. **Backend (Node.js/Express)** - API Server & Business Logic
3. **AI Module (Python/Flask)** - Resume Analysis Engine

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                           │
│                      (React.js Frontend)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP/HTTPS (REST API)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Express.js Backend                            │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Auth Routes  │ Job Routes   │ Resume       │ Result       │  │
│  │              │              │ Routes       │ Routes       │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Controllers & Middleware                        │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Auth | File Upload | Text Extraction            │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────┬──────────────────────────────────────────────────┬──────┘
         │                                                  │
     (REST API)                                       (REST API)
         │                                                  │
┌────────▼──────────────────┐              ┌───────────────▼────┐
│   MongoDB Database        │              │  Python/Flask API  │
│  ┌──────────────────────┐ │              │  ┌─────────────┐   │
│  │ • Users              │ │              │  │ NLP/ML      │   │
│  │ • Jobs               │ │              │  │ Processing  │   │
│  │ • Resumes            │ │              │  │ • TF-IDF    │   │
│  │ • Results            │ │              │  │ • Cosine    │   │
│  │ • Analytics          │ │              │  │   Similarity│   │
│  └──────────────────────┘ │              │  │ • Skill     │   │
└───────────────────────────┘              │  │   Extraction│   │
                                            │  └─────────────┘   │
                                            └────────────────────┘
```

## Data Flow

### 1. User Registration/Login Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ POST /auth/register or /auth/login
       ▼
┌─────────────────────────────────────────┐
│   Express Backend (Auth Controller)     │
│  • Hash password (bcrypt)               │
│  • Validate credentials                 │
│  • Generate JWT token                   │
└──────┬──────────────────────────────────┘
       │ Write User
       ▼
┌──────────────────────────────────────┐
│         MongoDB Database             │
│  [Users Collection]                  │
└──────────────────────────────────────┘
       │
       │ Return token
       ▼
┌─────────────────────────┐
│    Frontend (React)     │
│  Store token in localStorage
└─────────────────────────┘
```

### 2. Job Posting Flow

```
┌─────────────┐
│   HR User   │
└──────┬──────┘
       │ POST /api/jobs (with JWT token)
       ▼
┌─────────────────────────────────────────┐
│   Express Backend (Job Controller)      │
│  • Verify JWT token                     │
│  • Check HR role                        │
│  • Validate job data                    │
└──────┬──────────────────────────────────┘
       │ Write Job Document
       ▼
┌──────────────────────────────────────┐
│         MongoDB Database             │
│  [Jobs Collection]                   │
└──────────────────────────────────────┘
```

### 3. Resume Upload & Processing Flow

```
┌─────────────────┐
│  Candidate User │
└────────┬────────┘
         │ POST /api/resumes/upload
         │ (multipart/form-data)
         │ - resume file
         │ - jobId
         ▼
┌──────────────────────────────────────────────────┐
│   Express Backend (Resume Controller)            │
│  • Verify JWT token                              │
│  • Validate file format (PDF/DOCX/TXT)          │
│  • Store file in uploads/ folder                 │
│  • Create Resume document                        │
└──────┬──────────────────────────────────────────┘
       │
       ├─────────────────┬────────────────────┐
       │                 │                    │
    Store File      Write to DB          Update Status
       │                 │                    │
       ▼                 ▼                    ▼
[uploads/]        [Resumes Coll.]    [Resume Status]
                                      = "Uploaded"
       │
       │ Later: POST /api/resumes/process
       │ - resumeId
       ▼
┌──────────────────────────────────────────────────┐
│   Express Backend (Resume Controller)            │
│  • Extract text from resume file                 │
│  • Fetch job description from DB                 │
│  • Update status to "Processing"                 │
└──────┬──────────────────────────────────────────┘
       │
       │ Send to AI Module
       │ POST http://localhost:5001/analyze
       │ {
       │   resumeText: "...",
       │   jobDescription: "...",
       │   requiredSkills: [...]
       │ }
       ▼
┌──────────────────────────────────────────┐
│     Python AI Module (Flask)             │
│  • Preprocess texts                      │
│  • Extract features (TF-IDF)             │
│  • Calculate cosine similarity           │
│  • Extract matched & missing skills      │
│  • Return scores and analysis            │
└──────┬──────────────────────────────────┘
       │
       │ Return results
       │ {
       │   similarityScore: 0.87,
       │   percentageMatch: 87,
       │   matchedSkills: [...],
       │   missingSkills: [...]
       │ }
       ▼
┌──────────────────────────────────────────┐
│   Express Backend                        │
│  • Create Result document                │
│  • Update Resume status to "Processed"   │
└──────┬──────────────────────────────────┘
       │
       │ Write to DB
       ▼
┌──────────────────────────────────────┐
│      MongoDB Database               │
│  [Results Collection]               │
│  [Resumes Collection - updated]     │
└──────────────────────────────────────┘
```

### 4. Ranking & Analytics Flow

```
┌─────────────┐
│   HR User   │
└──────┬──────┘
       │ GET /api/results/job/:jobId/ranking
       │ GET /api/results/job/:jobId/analytics
       ▼
┌─────────────────────────────────────────────┐
│   Express Backend (Result Controller)       │
│  • Verify HR role                           │
│  • Query Results where jobId = X            │
│  • Sort by percentageMatch (desc)           │
│  • Calculate statistics                     │
└──────┬──────────────────────────────────────┘
       │
       │ Query Database
       ▼
┌──────────────────────────────────────┐
│      MongoDB Database               │
│  [Results Collection]               │
│  [Resumes Collection]               │
│  [Users Collection]                 │
└──────┬───────────────────────────────┘
       │
       │ Backend processes data:
       │ • Aggregation
       │ • Ranking
       │ • Statistics
       │ • Distribution analysis
       ▼
┌──────────────────────────────────────┐
│   Return JSON response               │
│  {                                   │
│    ranking: [...],                   │
│    totalApplicants: 15,              │
│    averageScore: 72.5,               │
│    distributionChart: {...}          │
│  }                                   │
└──────┬───────────────────────────────┘
       │
       │ HTTP response
       ▼
┌─────────────────────────┐
│  Frontend (React)       │
│  • Render table         │
│  • Render charts        │
│  • Display analytics    │
└─────────────────────────┘
```

## Component Interactions

### User Authentication

```
User → Frontend → Backend → Database
              ↓
            JWT Token (stored in localStorage)
              ↓
All subsequent requests include:
Authorization: Bearer <token>
              ↓
Backend validates token
```

### Resume Processing Pipeline

```
Resume File Upload
       │
       ├─→ File Validation (type, size)
       │
       ├─→ File Storage
       │
       ├─→ Text Extraction
       │   ├─→ PDF parsing (pdfjs)
       │   ├─→ DOCX parsing (mammoth)
       │   └─→ TXT reading (fs)
       │
       ├─→ Send to AI Module
       │   ├─→ Text Preprocessing
       │   ├─→ NLP Processing
       │   ├─→ Feature Extraction (TF-IDF)
       │   ├─→ Similarity Calculation (Cosine)
       │   └─→ Skill Matching
       │
       └─→ Store Results in Database
           ├─→ Update Resume Status
           └─→ Create Result Document
```

## Technology Rationale

### Frontend: React.js + Ant Design
- **Why React**: 
  - Component-based architecture
  - Efficient re-rendering with Virtual DOM
  - Large ecosystem and community support
  - Easy state management with hooks

- **Why Ant Design**:
  - Professional UI components
  - Responsive design
  - Built-in accessibility features
  - Extensive documentation

### Backend: Node.js + Express.js
- **Why Node.js**:
  - JavaScript across full stack
  - Non-blocking I/O for handling multiple requests
  - Real-time capabilities with WebSockets
  - Lightweight and fast

- **Why Express.js**:
  - Lightweight framework
  - Middleware support
  - Easy routing
  - Widely used in industry

### Database: MongoDB
- **Why MongoDB**:
  - Flexible schema (documents store various data types)
  - Scalability with sharding
  - Good for rapid prototyping
  - JSON-like documents match JavaScript objects
  - Good aggregation framework for analytics

### AI Module: Python + Flask + Scikit-learn
- **Why Python**:
  - Excellent ML/NLP libraries
  - Easy to understand and maintain
  - Industry standard for data science

- **Why Flask**:
  - Lightweight Python web framework
  - Easy to create REST API
  - Less overhead than Django

- **Why Scikit-learn**:
  - Industry-standard ML library
  - TF-IDF vectorizer
  - Cosine similarity implementation
  - Well-documented

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer (Nginx/HAProxy)
       │
       ├─→ Backend Instance 1 (5000)
       ├─→ Backend Instance 2 (5001)
       └─→ Backend Instance 3 (5002)
            ↓
       MongoDB Replica Set
            │
            ├─→ Primary Node
            ├─→ Secondary Node 1
            └─→ Secondary Node 2
```

### Rate Limiting & Caching

```
Frontend
  ↓
API Gateway (Rate Limit)
  ↓
Redis Cache Layer
  ↓
Backend
  ↓
Database
```

## Security Architecture

```
┌─────────────────────────────────────┐
│        HTTPS/TLS Encryption         │
└────────┬────────────────────────────┘
         │
┌────────▼────────────────────────────┐
│       CORS & Origin Validation      │
└────────┬────────────────────────────┘
         │
┌────────▼────────────────────────────┐
│      JWT Token Verification         │
│  (secret key stored on server)      │
└────────┬────────────────────────────┘
         │
┌────────▼────────────────────────────┐
│      Role-Based Access Control      │
│  HR ← → Candidate                   │
└────────┬────────────────────────────┘
         │
┌────────▼────────────────────────────┐
│    Input Validation & Sanitization  │
│  (prevent injection attacks)        │
└────────┬────────────────────────────┘
         │
┌────────▼────────────────────────────┐
│       Database Layer Security       │
│  (parameterized queries)            │
└─────────────────────────────────────┘
```

## Deployment Architecture

```
                    Internet
                       │
           ┌───────────┴───────────┐
           │                       │
    ┌──────▼──────┐         ┌──────▼──────┐
    │   CDN (S3)  │         │   Reverse   │
    │             │         │   Proxy     │
    │ (Frontend)  │         │  (Nginx)    │
    └─────────────┘         └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
            ┌───────▼────────┐  ┌──▼────────┐  ┌─▼──────────┐
            │ Backend        │  │  AI       │  │ Background │
            │ Instance 1     │  │ Module(s) │  │ Jobs       │
            │ (Port 5000)    │  │           │  │ (Queue)    │
            └───────┬────────┘  └─────┬─────┘  └────────────┘
                    │                 │
                    ├─────────────────┤
                    │                 │
            ┌───────▼──────────┐  ┌───▼─────────┐
            │  MongoDB Config  │  │   Redis     │
            │  Server (Replica)│  │  (Cache)    │
            └──────────────────┘  └─────────────┘
```
