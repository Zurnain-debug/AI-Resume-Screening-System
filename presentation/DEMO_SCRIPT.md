# Demo Script — AI Resume Screening System

## Objective
Guide the audience through a concise, 10–15 minute live demo showing the implemented system end-to-end.

## Demo Walkthrough

### Step 1: Open the Frontend
- Navigate to the React app landing page.
- Point out navigation options: candidate dashboard, HR dashboard, login/register.

### Step 2: Candidate Flow
- Register or login as a candidate.
- Browse available jobs.
- Select a job and upload a resume file.
- Explain that the backend extracts text and triggers analysis.
- Note the file formats supported: PDF, DOCX, TXT.

### Step 3: Backend/AI Interaction (Narration)
- Describe what happens after upload:
  - Resume is stored in backend.
  - Extracted text is sent to the AI Flask service.
  - The AI service applies TF-IDF and cosine similarity.
  - Results are saved to MongoDB.

### Step 4: HR Flow
- Login as an HR user.
- Show the HR dashboard and list of jobs.
- Open a job and view candidate ranking.
- Highlight analytics and result details.

### Step 5: Result Review and Update
- Open a candidate result.
- Show fields: similarity score, percentage match, matched/missing skills, feedback.
- Update an HR note, rating, or candidate status.
- Explain that this workflow supports human-in-the-loop decision-making.

### Step 6: Analytics Overview
- Show the analytics page for a job.
- Point out trends or summaries available to HR.
- Emphasize how analytics help prioritize candidates.

### Step 7: Conclusion
- Reiterate the value: speed, consistency, and better early-stage screening.
- Mention that the live demo uses the implemented code and endpoints only.

## Demo Timing
- Candidate workflow: 3 minutes.
- Narrative AI/backend explanation: 2 minutes.
- HR review and ranking: 3 minutes.
- Analytics overview: 2 minutes.
- Wrap-up: 1–2 minutes.

## Notes for Presenter
- Keep the demo focused on core flows; avoid showing incomplete or peripheral pages.
- If upload fails, explain it as a file-format or env issue; the main architecture remains the same.
- Emphasize that the AI module is separate and can be scaled independently.
- Call out the modular design: frontend ⇄ backend ⇄ AI module ⇄ MongoDB.
