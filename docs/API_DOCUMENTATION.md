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
    "matchBreakdown": {
      "content_similarity": 87,
      "skill_match": 85,
      "experience_match": 92
    },
    "candidateStatus": "shortlisted",
    "adminRating": 4,
    "adminNotes": "Strong technical skills, good communication",
    "ranking": 1,
    "candidateId": {
      "_id": "63f5d9012345678abcd",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

#### Get Ranking for Job
```http
GET /results/job/:jobId/ranking
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "jobId": "63f5e5678901234abcd",
  "jobTitle": "Senior Python Developer",
  "totalApplicants": 25,
  "averageScore": 72,
  "ranking": [
    {
      "_id": "63f5f5678901234abcd",
      "percentageMatch": 92,
      "candidateId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "candidateStatus": "shortlisted",
      "matchedSkills": ["Python", "Django", "PostgreSQL"]
    },
    {
      "_id": "63f5f5678901234efgh",
      "percentageMatch": 85,
      "candidateId": {
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "candidateStatus": "reviewing",
      "matchedSkills": ["Python", "Django"]
    }
  ]
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
  "jobId": "63f5e5678901234abcd",
  "totalApplicants": 25,
  "averageScore": 72.5,
  "scoreDistribution": {
    "excellent": 5,
    "good": 8,
    "fair": 7,
    "poor": 5
  },
  "shortlistedCount": 8,
  "rejectedCount": 5,
  "topSkills": [
    {"skill": "Python", "matchCount": 20},
    {"skill": "Django", "matchCount": 18}
  ],
  "missingSkills": [
    {"skill": "Kubernetes", "missingCount": 15},
    {"skill": "Docker", "missingCount": 12}
  ]
}
```

#### Get Specific Result Details
```http
GET /results/:resultId
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "_id": "63f5f5678901234abcd",
  "resumeId": "63f5f1234567890abcd",
  "jobId": "63f5e5678901234abcd",
  "candidateId": {
    "_id": "63f5d9012345678abcd",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  },
  "percentageMatch": 87,
  "similarityScore": 0.87,
  "matchBreakdown": {
    "content_similarity": 87,
    "skill_match": 85,
    "experience_match": 92
  },
  "matchedSkills": [
    {"skill": "Python", "confidence": 0.95},
    {"skill": "Django", "confidence": 0.92},
    {"skill": "PostgreSQL", "confidence": 0.88}
  ],
  "missingSkills": ["Kubernetes", "Terraform"],
  "experienceYears": 7,
  "recommendedAction": "Strong technical match. Consider for interview.",
  "candidateStatus": "shortlisted",
  "adminRating": 4,
  "adminNotes": "Excellent Python skills, good Django experience",
  "feedback": "87% match score with strong technical background",
  "analyzedAt": "2023-02-23T11:05:00Z",
  "updatedAt": "2023-02-23T12:30:00Z"
}
```

#### Update Result (HR Only)
```http
PUT /results/:resultId
Authorization: Bearer <token>
Content-Type: application/json

{
  "adminNotes": "Strong candidate, schedule interview.",
  "adminRating": 5,
  "candidateStatus": "interview_scheduled"
}
```

**Response** (200 OK):
```json
{
  "_id": "63f5f5678901234abcd",
  "adminNotes": "Strong candidate, schedule interview.",
  "adminRating": 5,
  "candidateStatus": "interview_scheduled",
  "updatedAt": "2023-02-23T12:45:00Z"
}
```

---

### 5. Sample Resumes

#### List Sample Resumes
```http
GET /samples
```

**Response** (200 OK):
```json
{
  "samples": [
    {"id": "resume1", "name": "John Doe", "role": "Software Engineer"},
    {"id": "resume2", "name": "Jane Smith", "role": "Product Manager"}
  ]
}
```

#### Get Sample Resume
```http
GET /samples/:type
```

**Response** (200 OK):
```json
{
  "resume": {
    "id": "resume1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "content": "..."
  }
}
```

#### Update Result (Admin Only)
```http
PUT /results/:resultId
Authorization: Bearer <token>
Content-Type: application/json

{
  "candidateStatus": "interview_scheduled",
  "adminRating": 5,
  "adminNotes": "Scheduled for technical interview on Feb 25"
}
```

**Response** (200 OK):
```json
{
  "message": "Result updated successfully",
  "result": {
    "_id": "63f5f5678901234abcd",
    "percentageMatch": 87,
    "candidateStatus": "interview_scheduled",
    "adminRating": 5,
    "adminNotes": "Scheduled for technical interview on Feb 25",
    "updatedAt": "2023-02-23T12:35:00Z"
  }
}
```

---

### 5. Sample Resumes (NEW)

#### List All Sample Resumes
```http
GET /samples
```

No authentication required. Returns list of available sample resumes.

**Response** (200 OK):
```json
{
  "samples": [
    {
      "id": "frontend_developer",
      "name": "Priya Sharma",
      "role": "Senior Frontend Developer",
      "email": "priya.sharma@example.com",
      "phone": "+91-9876543210"
    },
    {
      "id": "data_scientist",
      "name": "Arjun Patel",
      "role": "Data Scientist",
      "email": "arjun.patel@example.com",
      "phone": "+91-9876543211"
    },
    {
      "id": "hr_specialist",
      "name": "Nisha Gupta",
      "role": "HR Manager",
      "email": "nisha.gupta@example.com",
      "phone": "+91-9876543212"
    }
  ]
}
```

#### Get Specific Sample Resume
```http
GET /samples/:type
```

Where `:type` can be: `frontend_developer`, `data_scientist`, or `hr_specialist`

**Response** (200 OK):
```json
{
  "resume": {
    "id": "frontend_developer",
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "phone": "+91-9876543210",
    "content": "PRIYA SHARMA\n\nSenior Frontend Developer\npriya.sharma@example.com | +91-9876543210 | New Delhi, India\n\nPROFESSIONAL SUMMARY\nExperienced Senior Frontend Developer with 5+ years of expertise in React, TypeScript, and modern web technologies...\n\n[Full resume content with education, experience, skills, etc.]"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "ErrorType",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid input or malformed JSON |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (e.g., email already registered) |
| 413 | Payload Too Large | File size exceeds limit (>5MB) |
| 500 | Internal Server Error | Server error (check logs) |

### Example Error Response
```json
{
  "message": "Invalid file format. Only PDF, DOCX, and TXT are allowed",
  "error": "ValidationError",
  "statusCode": 400
}
```

---

## Rate Limiting

- **Standard Users**: 100 requests per 15 minutes
- **Resume Upload**: 10 uploads per hour
- **AI Analysis**: 5 concurrent analyses

---

## Pagination

For endpoints returning lists, use query parameters:

```http
GET /jobs?page=1&limit=10
GET /resumes?page=2&limit=20
```

Response includes metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

## WebSocket Events (Real-time Updates)

Connect to WebSocket for real-time resume processing updates:

```javascript
const socket = io('http://localhost:5000');
socket.on('resume:processing', (data) => {
  console.log('Resume processing:', data);
});
socket.on('resume:completed', (data) => {
  console.log('Resume analysis complete:', data);
});
```

---

## Authentication Flow

1. **Register User**
   ```
   POST /auth/register → Receive token
   ```

2. **Login**
   ```
   POST /auth/login → Receive token
   ```

3. **Use Token in Requests**
   ```
   Authorization: Bearer <token>
   ```

4. **Token Expires**
   - JWT tokens expire after 24 hours
   - Use refresh token to get new token
   ```
   POST /auth/refresh
   ```

---

## Example Workflow

### Complete Resume Screening Workflow

```bash
# 1. Register as HR
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Manager",
    "email": "hr@company.com",
    "password": "secure123",
    "role": "HR",
    "company": "Tech Corp"
  }'

# 2. Login and save token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@company.com",
    "password": "secure123"
  }' | jq -r '.token')

# 3. Create job
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "requiredSkills": ["React", "Node.js"],
    "experienceLevel": "Senior"
  }'

# 4. Upload resume
curl -X POST http://localhost:5000/api/resumes/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@resume.pdf" \
  -F "jobId=<job-id>"

# 5. Get results
curl http://localhost:5000/api/results \
  -H "Authorization: Bearer $TOKEN"
```

---

## API Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 2023 | Initial release |
| 1.1 | Feb 2023 | Added sample resumes endpoint |
| 1.2 | Feb 2023 | Enhanced results with score breakdown |

---

For more information, see [README.md](../README.md) and [QUICK_START.md](../QUICK_START.md)

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
