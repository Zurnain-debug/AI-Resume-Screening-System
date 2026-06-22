# Viva Q&A — AI Resume Screening System

## Expected Questions and Strong Technical Answers

### Q1: What problem does this system solve?
**Answer:** It automates the initial resume screening phase by comparing candidate resumes to job requirements, reducing manual review time and improving consistency in early-stage filtering.

### Q2: What technologies are used in the implementation?
**Answer:** The frontend is built in React. The backend uses Node.js with Express and MongoDB via Mongoose. The AI module is a Python Flask service using scikit-learn for TF-IDF and cosine similarity. File extraction uses `pdf-parse` and `mammoth`.

### Q3: Why TF-IDF and cosine similarity?
**Answer:** TF-IDF is a classical, interpretable text similarity technique that measures term importance in documents. Cosine similarity assesses how closely the resume and job description align in vector space. This approach is lightweight and appropriate for structured resume matching.

### Q4: How are resumes processed?
**Answer:** The backend extracts text from uploaded files, sends the text and job description to the AI module, which preprocesses, vectorizes, and computes similarity. The result is stored in MongoDB as a `Result` document.

### Q5: How is authorization handled?
**Answer:** JWT-based authentication verifies users. Role middleware enforces HR-only routes for job creation, result viewing, analytics, and result updates. Candidates can only access their resume data.

### Q6: What is the AI module responsible for?
**Answer:** The AI module performs text preprocessing, TF-IDF vectorization, cosine similarity calculation, simple skill matching, and experience scoring in the enhanced analyzer. It exposes `/analyze` and `/batch-analyze` endpoints.

### Q7: How does the system handle candidate skills?
**Answer:** It matches candidate resumes against required skills using substring containment. The enhanced module computes skill match percentage and includes matched/missing skills in the result.

### Q8: What are the main deployment risks?
**Answer:** Required environment variables can block startup if missing. Local MongoDB uses weak default credentials and should be replaced with Atlas or secure storage in production. The AI module is a separate service, so network availability is critical.

### Q9: How would you scale this system?
**Answer:** Separate services into containers or Kubernetes pods. Use MongoDB Atlas for managed data, object storage for resumes, and a load-balanced backend. The AI service can be horizontally scaled behind a gateway if the TF-IDF analysis becomes a bottleneck.

### Q10: Why is there no LLM or neural model?
**Answer:** The current implementation is intentionally classical to keep the approach interpretable and lightweight. The instructions specified not to introduce LLMs or retrain models, so the system uses TF-IDF and cosine similarity.

### Q11: What future improvements are feasible?
**Answer:** Improve skill normalization and synonyms, add shared storage for resumes, enhance experience extraction, add production monitoring, and migrate frontend API config to runtime environment variables.

### Q12: How is data modeled in the database?
**Answer:** There are four main collections: `users`, `jobs`, `resumes`, and `results`. Relationships are implemented via ObjectId references: users create jobs, candidates upload resumes against jobs, and results link resumes to jobs and candidates.

### Q13: How are results ranked?
**Answer:** The enhanced module produces a combined score from cosine similarity, skill-match percentage, and experience match. The backend can return ranking views sorted by similarity or score.

### Q14: What is the limitation of per-request TF-IDF?
**Answer:** IDF is computed from the current resume-job pair only, so term importance is not globally normalized across the dataset. This can cause score variability between different comparisons.

### Q15: How does the system support auditability?
**Answer:** Results and resume metadata are persisted in MongoDB, including similarity scores, feedback, matched and missing skills, and HR-admin notes. This allows HR to review and audit decisions.
