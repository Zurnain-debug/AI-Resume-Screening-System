Database Design — MongoDB (Mongoose Schemas)

This document describes the implemented database schema for MongoDB as used by the application. It reflects the `backend/src/models` Mongoose definitions.

Collections

1) users
- Purpose: store registered users (candidates and HR).
- Fields:
  - `_id`: ObjectId (primary key)
  - `name`: string, required
  - `email`: string, required, unique
  - `password`: string (hashed), required
  - `role`: enum ['HR','Candidate'], required
  - `company`: string (optional)
  - `phone`: string (optional)
  - `createdAt`, `updatedAt`: Date
- Indexes:
  - Unique index on `email`.

2) jobs
- Purpose: store job postings.
- Fields:
  - `_id`: ObjectId
  - `title`: string, required
  - `description`: string, required
  - `requiredSkills`: [string]
  - `experienceLevel`: enum ['Entry','Mid','Senior']
  - `salary`: { min: Number, max: Number }
  - `department`: string
  - `location`: string
  - `createdBy`: ObjectId -> `users._id`
  - `status`: enum ['Open','Closed']
  - `createdAt`, `updatedAt`
- Indexes:
  - Consider index on `createdBy` and `status` for filtering/listing.

3) resumes
- Purpose: track uploaded resume files and processing state.
- Fields:
  - `_id`: ObjectId
  - `candidateId`: ObjectId -> `users._id`
  - `jobId`: ObjectId -> `jobs._id`
  - `filePath`: string (local disk path)
  - `fileName`: string
  - `fileType`: enum ['PDF','DOCX','TXT']
  - `extractedText`: string (full extracted text)
  - `uploadedAt`: Date
  - `processedAt`: Date
  - `status`: enum ['Uploaded','Processing','Processed','Failed']
- Indexes:
  - Compound index on `candidateId` and `jobId` may help lookups.

4) results
- Purpose: store analysis results produced by AI module.
- Fields:
  - `_id`: ObjectId
  - `resumeId`: ObjectId -> `resumes._id`
  - `jobId`: ObjectId -> `jobs._id`
  - `candidateId`: ObjectId -> `users._id`
  - `similarityScore`: Number (0.0 - 1.0)
  - `percentageMatch`: Number (0 - 100)
  - `matchedSkills`: [{ skill: String, confidence: Number }]
  - `missingSkills`: [String]
  - `experienceYears`: Number
  - `ranking`: Number (optional)
  - `feedback`: String
  - `matchBreakdown`: { content_similarity: Number, skill_match: Number, experience_match: Number }
  - `recommendedAction`: String
  - `adminNotes`: String
  - `adminRating`: Number (1 - 5)
  - `candidateStatus`: enum ['new','reviewing','shortlisted','rejected','interview_scheduled','offered','hired']
  - `analyzedAt`, `updatedAt` : Date
- Indexes:
  - Index on `jobId` to support ranking and analytics queries.
  - Index on `candidateId` for candidate-specific views.

Design Notes

- `extractedText` stores full resume text; consider using text indexes if free-text search is needed.
- `results` contains computed numeric fields for fast aggregation (similarityScore, percentageMatch) to avoid recomputation during analytics.
- File storage is local under `uploads/` per `uploadMiddleware`. For distributed deployments, consider S3 or similar and store canonical object URLs in `filePath`.

Backups & Retention

- Implement scheduled backups for MongoDB.
- Clean-up policy for `uploads/` files when corresponding resumes or results are deleted.

Security

- Store passwords hashed with bcrypt (implemented in `User` model pre-save hook).
- Ensure `filePath` access is restricted to authenticated requests that own the resource.
