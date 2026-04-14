# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "HR",
  "company": "Tech Company Inc.",
  "phone": "1234567890"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "63f5d1234567890abcd",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "HR"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "63f5d1234567890abcd",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "HR"
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "_id": "63f5d1234567890abcd",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "HR",
  "company": "Tech Company Inc.",
  "phone": "1234567890"
}
```

---

### 2. Job Management

#### Create Job (HR Only)
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Python Developer",
  "description": "We are looking for an experienced Python developer...",
  "requiredSkills": ["Python", "Django", "PostgreSQL", "Docker"],
  "experienceLevel": "Senior",
  "salary": {
    "min": 100000,
    "max": 150000
  },
  "department": "Engineering",
  "location": "San Francisco, CA"
}
```

**Response** (201 Created):
```json
{
  "message": "Job created successfully",
  "job": {
    "_id": "63f5e5678901234abcd",
    "title": "Senior Python Developer",
    "description": "We are looking for an experienced Python developer...",
    "requiredSkills": ["Python", "Django", "PostgreSQL", "Docker"],
    "experienceLevel": "Senior",
    "status": "Open",
    "createdAt": "2023-02-23T10:30:00Z"
  }
}
```

#### Get All Jobs
```http
GET /jobs
GET /jobs?status=Open
```

**Response** (200 OK):
```json
[
  {
    "_id": "63f5e5678901234abcd",
    "title": "Senior Python Developer",
    "description": "...",
    "requiredSkills": ["Python", "Django"],
    "experienceLevel": "Senior",
    "status": "Open",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "createdBy": {
      "_id": "63f5d1234567890abcd",
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Tech Company Inc."
    }
  }
]
```

#### Get Specific Job
```http
GET /jobs/:jobId
```

#### Update Job (HR Only)
```http
PUT /jobs/:jobId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Closed",
  "requiredSkills": ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"]
}
```

#### Delete Job (HR Only)
```http
DELETE /jobs/:jobId
Authorization: Bearer <token>
```

---

### 3. Resume Management

#### Upload Resume
```http
POST /resumes/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- resume: <file> (PDF, DOCX, or TXT, max 5MB)
- jobId: "63f5e5678901234abcd"
```

**Response** (201 Created):
```json
{
  "message": "Resume uploaded successfully",
  "resume": {
    "_id": "63f5f1234567890abcd",
    "candidateId": "63f5d9012345678abcd",
    "jobId": "63f5e5678901234abcd",
    "fileName": "john_doe_resume.pdf",
    "fileType": "PDF",
    "status": "Uploaded",
    "uploadedAt": "2023-02-23T11:00:00Z"
  }
}
```

#### Process Resume (Generate Score)
```http
POST /resumes/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "resumeId": "63f5f1234567890abcd"
}
```

**Response** (200 OK):
```json
{
  "message": "Resume processed successfully",
  "result": {
    "_id": "63f5f5678901234abcd",
    "resumeId": "63f5f1234567890abcd",
    "jobId": "63f5e5678901234abcd",
    "similarityScore": 0.87,
    "percentageMatch": 87,
    "matchedSkills": [
      {"skill": "Python", "confidence": 0.95},
      {"skill": "Django", "confidence": 0.92}
    ],
    "missingSkills": ["Kubernetes"],
    "ranking": 1,
    "feedback": "Match Score: 87%. Key skills matched: Python, Django"
  }
}
```

#### Get Resumes
```http
GET /resumes
Authorization: Bearer <token>
GET /resumes?jobId=63f5e5678901234abcd
```

**Response** (200 OK):
```json
[
  {
    "_id": "63f5f1234567890abcd",
    "fileName": "john_doe_resume.pdf",
    "fileType": "PDF",
    "status": "Processed",
    "uploadedAt": "2023-02-23T11:00:00Z",
    "candidateId": {
      "_id": "63f5d9012345678abcd",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "jobId": {
      "_id": "63f5e5678901234abcd",
      "title": "Senior Python Developer"
    }
  }
]
```

---

### 4. Results & Analytics

#### Get Results
```http
GET /results
Authorization: Bearer <token>
GET /results?jobId=63f5e5678901234abcd
```

**Response** (200 OK):
```json
[
  {
    "_id": "63f5f5678901234abcd",
    "percentageMatch": 87,
    "similarityScore": 0.87,
    "matchedSkills": [{"skill": "Python", "confidence": 0.95}],
    "missingSkills": ["Kubernetes"],
    "ranking": 1,
    "candidateId": {
      "_id": "63f5d9012345678abcd",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

#### Get Candidate Ranking for Job
```http
GET /results/job/:jobId/ranking
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "job": {
    "id": "63f5e5678901234abcd",
    "title": "Senior Python Developer",
    "description": "..."
  },
  "ranking": [
    {
      "rank": 1,
      "candidateId": {"name": "John Doe", "email": "john@example.com"},
      "percentageMatch": 87,
      "matchedSkills": [{"skill": "Python", "confidence": 0.95}]
    },
    {
      "rank": 2,
      "candidateId": {"name": "Jane Smith", "email": "jane@example.com"},
      "percentageMatch": 76,
      "matchedSkills": [{"skill": "Python", "confidence": 0.88}]
    }
  ],
  "totalApplicants": 15,
  "averageScore": "72.50"
}
```

#### Get Analytics for Job
```http
GET /results/job/:jobId/analytics
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "totalApplicants": 15,
  "averageScore": "72.50",
  "highMatches": 5,
  "mediumMatches": 7,
  "lowMatches": 3,
  "topMatches": [
    {
      "candidateName": "John Doe",
      "score": 87,
      "matchedSkills": [{"skill": "Python", "confidence": 0.95}]
    }
  ],
  "distributionChart": {
    "labels": ["70-100%", "40-70%", "<40%"],
    "data": [5, 7, 3]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!",
  "message": "Error details here"
}
```

## Rate Limiting

To implement rate limiting, configure the backend with:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## Pagination (Future Enhancement)

```http
GET /results?page=1&limit=20
```

## Filtering (Future Enhancement)

```http
GET /results?jobId=63f5e5678901234abcd&minScore=70&maxScore=100
```
