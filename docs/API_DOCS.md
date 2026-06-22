API Documentation — Implemented Endpoints

Base path: `/api` (backend server mounts routes under `/api`, per `backend/server.js` configuration)

Authentication

- POST /api/auth/register
  - Public
  - Body: { name, email, password, role (HR|Candidate), company?, phone? }
  - Response: 201 with user and JWT on success

- POST /api/auth/login
  - Public
  - Body: { email, password }
  - Response: 200 with JWT and user info on success

- GET /api/auth/profile
  - Auth required (JWT)
  - Response: 200 with user profile

Jobs

- POST /api/jobs/
  - Auth required, role: HR
  - Body: { title, description, requiredSkills (array|string), experienceLevel, salary, department, location }
  - Response: 201 job created

- GET /api/jobs/
  - Public
  - Query params: `status` (optional)
  - Response: 200 list of jobs

- GET /api/jobs/:id
  - Public
  - Response: 200 job details

- PUT /api/jobs/:id
  - Auth required, role: HR (owner or HR)
  - Body: job fields to update
  - Response: 200 updated job

- DELETE /api/jobs/:id
  - Auth required, role: HR (owner or HR)
  - Response: 200 on success

Resumes

- POST /api/resumes/upload
  - Auth required (Candidate)
  - Multipart form: `resume` file (PDF|DOCX|TXT), `jobId` in body
  - Response: 201 resume created (status Processing)

- POST /api/resumes/process
  - Auth required
  - Body: { resumeId }
  - Response: 200 processing result or 500 on AI failure

- GET /api/resumes/
  - Auth required
  - Query: `jobId` optional; returns candidate resumes or job-specific list for HR
  - Response: 200 list of resumes

- GET /api/resumes/:id
  - Auth required
  - Response: 200 resume metadata (includes extractedText when available)

Results

- GET /api/results/
  - Auth required, role: HR
  - Response: 200 list of results

- GET /api/results/job/:jobId/ranking
  - Auth required, role: HR
  - Response: 200 ranking payload (sorted candidates)

- GET /api/results/job/:jobId/analytics
  - Auth required, role: HR
  - Response: 200 analytics distribution for job matches

- GET /api/results/:id
  - Auth required
  - Response: 200 single result

- PUT /api/results/:id
  - Auth required, role: HR
  - Body: allowed fields: `adminNotes`, `adminRating`, `candidateStatus`, `feedback` (controller restricts fields)
  - Response: 200 updated result

Sample Resumes

- GET /api/samples/
  - Public
  - Response: 200 list of available sample resumes

- GET /api/samples/:type
  - Public
  - Response: 200 file download for sample of given type

AI Module (separate Flask service)

- GET /health
  - Public
  - Response: 200 status information

- POST /analyze
  - Public (AI service endpoint)
  - Body: { resumeText, jobDescription, requiredSkills?, requiredExperience? }
  - Response: 200 JSON result with fields: `similarityScore` (0-1), `percentageMatch` (0-100), `matchedSkills`, `missingSkills`, `experienceYears`, `recommendedAction`, `matchBreakdown`.

- POST /batch-analyze
  - Public
  - Body: { resumes: [string], jobDescription, requiredSkills }
  - Response: 200 { results: [...], total }

Errors

- Standard express JSON error responses are used: `{ error: 'message' }` with appropriate HTTP status codes.

Authentication & Authorization

- JWT token required in `Authorization: Bearer <token>` header for protected endpoints.
- Role-based authorization enforced by `roleMiddleware(['HR'])` for HR-only endpoints.

Notes

- File uploads limited to 5MB by `uploadMiddleware` and restricted to PDF, DOCX, TXT.
- AI module URL is configurable via `process.env.PYTHON_API_URL` used by backend when calling `/analyze`.

References

- Route definitions: `backend/src/routes/*`
- Controllers: `backend/src/controllers/*`