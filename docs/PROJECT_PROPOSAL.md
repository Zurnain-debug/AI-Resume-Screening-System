Project Proposal — AI Resume Screening System

Purpose

This proposal documents the intent, scope, and implementation approach for the AI Resume Screening System present in this repository. It reflects the current implemented architecture and features (no new features are introduced).

Scope

- Provide HR teams with automated resume screening and ranking for job postings.
- Provide candidates the ability to register, browse jobs, and upload resumes for analysis.
- Deliver analytics and ranking data to HR users for informed screening decisions.

Stakeholders

- HR Users: create jobs, view candidates, run analytics, update results.
- Candidates: register, browse jobs, upload resumes, view application status.
- Developers / DevOps: maintain the service, deploy components.

Objectives

- Implement a reproducible TF-IDF + Cosine Similarity based resume-to-job matching system.
- Expose REST API endpoints for auth, jobs, resume upload/processing, results, and sample resumes.
- Provide a modular AI module (Flask) that accepts extracted resume text and job descriptions and returns a match result.

Architecture (Implemented)

- Frontend: React application (SPA) providing UI components and routes.
- Backend: Node.js + Express REST API with MongoDB (Mongoose models for User, Job, Resume, Result), middleware for file extraction and authentication.
- AI Module: Python Flask app providing `/analyze` and `/batch-analyze` endpoints. Uses scikit-learn TF-IDF and cosine similarity with light preprocessing (NLTK-based tokenization and stopword removal).
- Storage: MongoDB stores user accounts, jobs, resumes (metadata + extracted text), and analysis results.

Constraints & Non-Goals

- The system uses TF-IDF and cosine similarity; no neural embeddings or LLMs are used or introduced.
- No model retraining or new ML models are part of this proposal.
- All behavior and endpoints documented strictly reflect implemented code in the repository.

Deliverables

- REST API accessible endpoints (auth, jobs, resumes, results, samples).
- AI Module endpoint and documentation describing TF-IDF and scoring logic.
- Project documentation and design artifacts (SRS, UML, DB design, API docs).

Timeline (Suggested)

- Documentation & QA: 1 week
- Integration tests & CI setup: 1–2 weeks
- Hardening and deployment: 1 week

Risks

- Per-request TF-IDF fitting can produce non-uniform IDF statistics across requests; consider caching per-job.
- Naive skill matching is substring-based and sensitive to phrasing.

Approved Architecture: The implementation present in the repository (no additions).