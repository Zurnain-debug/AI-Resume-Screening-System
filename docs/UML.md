UML Diagrams (Mermaid)

All diagrams reflect implemented functionality and endpoints.

1) Use Case Diagram

```mermaid
%%{init: {"theme": "default"}}%%
flowchart TB
  actor_HR(((HR))])
  actor_Candidate(((Candidate))])
  subgraph System[AI Resume Screening System]
    UC1([Register / Login])
    UC2([Create / Manage Jobs])
    UC3([Browse Jobs])
    UC4([Upload Resume])
    UC5([Process Resume / Analyze])
    UC6([View Results / Ranking])
    UC7([View Analytics])
    UC8([Download Sample Resumes])
    UC9([Update Result Notes / Status])
  end
  actor_Candidate --> UC1
  actor_Candidate --> UC3
  actor_Candidate --> UC4
  actor_HR --> UC1
  actor_HR --> UC2
  actor_HR --> UC6
  actor_HR --> UC7
  actor_HR --> UC9
  UC8 <-- actor_Candidate
  UC8 <-- actor_HR
```

2) Activity Diagram — Resume Upload & Processing

```mermaid
flowchart TD
  A[Candidate uploads resume (POST /api/resumes/upload)] --> B[Backend extracts text (pdf-parse, mammoth)]
  B --> C[Resume saved as Document (status: Processing)]
  C --> D[Backend calls AI Module: POST /analyze]
  D --> E[AI Module preprocesses -> TF-IDF -> cosine similarity -> scoring]
  E --> F[Backend saves Result document and marks resume Processed]
  F --> G[HR/Candidate can fetch result (GET /api/results/:id / GET /api/resumes/:id)]
```

3) Sequence Diagram — Resume Analyze Flow

```mermaid
sequenceDiagram
  participant Candidate
  participant Frontend
  participant Backend
  participant AI
  participant DB

  Candidate->>Frontend: Fill form + attach file
  Frontend->>Backend: POST /api/resumes/upload (multipart)
  Backend->>Backend: extractText(file)
  Backend->>DB: create Resume (status: Processing)
  Backend->>AI: POST /analyze {resumeText, jobDescription, requiredSkills}
  AI-->>Backend: analysisResult
  Backend->>DB: create Result, update Resume(status: Processed)
  Backend-->>Frontend: 201 Resume + processing started
  Frontend->>Backend: GET /api/results/job/:jobId/ranking (HR)
  Backend->>DB: aggregate Results
  Backend-->>Frontend: ranking payload
```

4) ERD — Data Model

```mermaid
erDiagram
  USER ||--o{ JOB : creates
  USER ||--o{ RESUME : uploads
  JOB ||--o{ RESUME : accepts
  RESUME ||--o{ RESULT : generates
  JOB ||--o{ RESULT : relates_to

  USER {
    ObjectId _id PK
    string name
    string email
    string password
    string role
    string company
    string phone
  }
  JOB {
    ObjectId _id PK
    string title
    string description
    string[] requiredSkills
    string experienceLevel
    object salary
    ObjectId createdBy FK
    string status
  }
  RESUME {
    ObjectId _id PK
    ObjectId candidateId FK
    ObjectId jobId FK
    string filePath
    string fileName
    string fileType
    string extractedText
    string status
    date processedAt
  }
  RESULT {
    ObjectId _id PK
    ObjectId resumeId FK
    ObjectId jobId FK
    ObjectId candidateId FK
    number similarityScore
    number percentageMatch
    array matchedSkills
    array missingSkills
    number experienceYears
    number ranking
    string feedback
    object matchBreakdown
    string recommendedAction
    string candidateStatus
  }
```

Notes

- The ERD matches Mongoose models in `backend/src/models/` and uses implemented relationships: `createdBy`, `candidateId`, `jobId`, and `resumeId`.
