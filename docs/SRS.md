Software Requirements Specification (SRS)

1. Introduction

1.1 Purpose
This SRS documents system behavior derived from implemented code in the repository. It describes functional and non-functional requirements that the current implementation satisfies.

1.2 Document Conventions
Requirements are categorized as Functional Requirements (FR) and Non-Functional Requirements (NFR).

2. System Overview

The system is a web-based AI resume screening platform comprising:
- A React frontend (user interface).
- A Node.js/Express backend providing REST APIs and file handling.
- A Python Flask AI module performing TF-IDF analysis and producing match results.
- A MongoDB database storing users, jobs, resumes, and results.

3. Functional Requirements

FR1 — User Management
- FR1.1: User can register (`POST /api/auth/register`).
- FR1.2: User can login (`POST /api/auth/login`) and receive JWT.
- FR1.3: Authenticated users can retrieve their profile (`GET /api/auth/profile`).

FR2 — Job Management (HR role)
- FR2.1: HR can create a job (`POST /api/jobs/`) — requires JWT and HR role.
- FR2.2: List jobs (`GET /api/jobs/`) with optional `status` query param.
- FR2.3: Get job details (`GET /api/jobs/:id`).
- FR2.4: Update a job (`PUT /api/jobs/:id`) — HR-only.
- FR2.5: Delete a job (`DELETE /api/jobs/:id`) — HR-only.

FR3 — Resume Handling
- FR3.1: Candidate can upload a resume file (`POST /api/resumes/upload`) — accepts PDF/DOCX/TXT via multipart form data.
- FR3.2: Trigger processing (`POST /api/resumes/process`) to analyze an uploaded resume (protected endpoint).
- FR3.3: List resumes (`GET /api/resumes/`) for candidate or job (authenticated).
- FR3.4: Retrieve resume metadata (`GET /api/resumes/:id`).

FR4 — Analysis Results & Analytics (HR role)
- FR4.1: HR can fetch results (`GET /api/results/`) — HR-only.
- FR4.2: Fetch ranking for a job (`GET /api/results/job/:jobId/ranking`) — HR-only.
- FR4.3: Fetch analytics for a job (`GET /api/results/job/:jobId/analytics`) — HR-only.
- FR4.4: Fetch a single result (`GET /api/results/:id`).
- FR4.5: Update a result (`PUT /api/results/:id`) — HR-only; updates admin notes, adminRating, candidateStatus.

FR5 — Sample Resumes
- FR5.1: List available sample resumes (`GET /api/samples/`).
- FR5.2: Download a sample by type (`GET /api/samples/:type`).

FR6 — AI Module
- FR6.1: Health check (`GET /health`).
- FR6.2: Analyze a single resume (`POST /analyze`) — returns similarityScore, percentageMatch, matchedSkills, missingSkills, recommendedAction, matchBreakdown.
- FR6.3: Batch analyze resumes (`POST /batch-analyze`) — returns sorted results by similarity.

4. Non-Functional Requirements

NFR1 — Security
- JWT-based authentication for protected endpoints.
- Role-based authorization for HR-only operations.

NFR2 — Performance
- File uploads limited to 5MB (configurable in `uploadMiddleware`).
- AI analysis uses per-request TF-IDF vectorization (no precomputed IDF). Consider caching to reduce CPU overhead.

NFR3 — Reliability
- Resume processing is performed synchronously (on-demand) and asynchronously via background process calls in the backend; failures mark resume status as `Failed`.

NFR4 — Maintainability
- Modular codebase: separate controllers, routes, middleware, models, and an external AI module.

5. Data Requirements

- MongoDB stores collections: `users`, `jobs`, `resumes`, `results` — see `DATABASE_DESIGN.md` for schema details.

6. Constraints

- TF-IDF and cosine similarity approach must remain as implemented; no changes to replace TF-IDF or introduce embeddings/LLMs.
- No code execution was performed during requirements gathering; this SRS is derived via static inspection of the codebase.

7. Acceptance Criteria

- All endpoints listed in this SRS exist and respond according to controller logic present in the repository.
- AI module returns result objects consistent with `Result` model fields stored in MongoDB.

Appendix: Implemented files referenced
- `backend/src/routes/*`
- `backend/src/controllers/*`
- `backend/src/models/*`
- `ai-module/app.py`, `ai-module/src/analyzer*.py`, `ai-module/src/preprocessing.py`