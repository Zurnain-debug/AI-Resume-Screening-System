# AI Module — Overview and Audit

This document summarizes the AI implementation found in the workspace `ai-module/`. It is a static audit (no execution) of preprocessing, analyzer code, Flask routes, and scoring logic. It documents current behavior, scoring formulas, limitations, and recommended non-ML-breaking improvements.

## AI Overview

- Location: `ai-module/src/`
- Core approach: TF-IDF vectorization (scikit-learn's `TfidfVectorizer`) + cosine similarity to compute content similarity between resume text and job description.
- Skill matching: simple substring matching against `required_skills` passed by the caller.
- Two analyzer variants present:
  - `analyzer.py` — baseline `ResumeMatcher` using TF-IDF similarity and simple skill-confidence heuristic.
  - `analyzer_enhanced.py` — enhanced `AdvancedResumeMatcher` with weighted scoring combining content similarity, skill-match percentage, and experience match.
- Serving: `app.py` exposes Flask endpoints `/health`, `/analyze`, and `/batch-analyze` and currently calls `analyzer_enhanced.analyze_resume`.

## Resume Processing Flow

```mermaid
flowchart TD
  A[Upload / Provide Resume Text] --> B[Text Extraction (backend)]
  B --> C[AI Module HTTP POST /analyze]
  C --> D[Preprocessing (cleaning, tokenization, stopword removal)]
  D --> E[TF-IDF vectorization]
  E --> F[Cosine similarity between resume & job]
  F --> G[Skill matching (substring) & experience extraction (enhanced)]
  G --> H[Scoring & ranking logic]
  H --> I[Result object returned: similarityScore, percentageMatch, matchedSkills, missingSkills, recommendedAction]
```

- `app.py` supports `batch-analyze` which runs the same analysis for multiple resumes and sorts results by `similarityScore` descending.

## Text Extraction

- Text extraction occurs outside the Python analyzer: the backend (`backend/src/middleware/textExtractor.js`) extracts text from PDF/DOCX/TXT using `pdf-parse` and `mammoth`.
- The analyzer expects a plain string `resumeText` (already extracted) and `jobDescription` in the POST payload.

## Cleaning

Implemented in `ai-module/src/preprocessing.py` (function `preprocess_text`):
- Lowercases text.
- Removes non-alphabetic characters and digits via regex: `re.sub(r'[^a-zA-Z\s]', '', text)`.
- Tokenizes using NLTK `word_tokenize()` when available; falls back to simple split.
- Removes stop words using NLTK `stopwords.words('english')` when available; falls back to an embedded stop-word list.
- Filters out tokens shorter than 3 characters.
- Returns a space-joined string of cleaned tokens for TF-IDF ingestion.

Notes:
- No lemmatization or stemming is applied.
- No named-entity extraction for people, organizations, or dates.

## TF-IDF

- Implemented using scikit-learn's `TfidfVectorizer(max_features=500, stop_words='english')` in `analyzer.py` and `analyzer_enhanced.py`.
- The vectorizer is instantiated per `ResumeMatcher` instance and is fit with `fit_transform([resume_processed, job_processed])` — i.e., TF-IDF is computed on-the-fly using the pair of documents being compared.

Implication:
- Because TF-IDF IDF values are computed from the two-document mini-corpus per request, IDF is not global; similarity reflects relative term importance between the candidate resume and the given job description only. This is acceptable but can cause variability across comparisons and prevents reuse of a precomputed IDF across many resumes.

## Cosine Similarity

- Computed with `cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]` which yields a float in [0.0, 1.0].
- `analyzer.py` returns `similarityScore` as the raw cosine score (float) and `percentageMatch = int(similarityScore * 100)`.

## Ranking Logic

Two levels of ranking logic exist:

1) Baseline (`analyzer.py`):
- Primary signal: content similarity (cosine similarity).
- Secondary signal: simple skill presence; matched skill confidences are a linear transform of similarity: `confidence = round(similarity_score * 0.8 + 0.2, 2)`.
- Percentage match derived as int(similarity_score * 100).
- Recommended action thresholds: `>=70 => Strong`, `>=40 => Good`, else `Consider reviewing`.

2) Enhanced (`analyzer_enhanced.py`):
- Weighted aggregation across three measures:
  - Content similarity weight: 50%
  - Skill match weight: 30%
  - Experience match weight: 20%
- Implementation details:
  - `similarity_score` computed via TF-IDF + cosine.
  - `skill_match_score` computed as (# matched required skills / # required skills) * 100.
  - `experience_score` calculated by comparing extracted resume years vs job required years (100% if resume >= required).
- Final score: weighted average combined and normalized to a 0-1 `final_score` then multiplied to `percentage_match = int(final_score * 100)`.
- Recommendation mapping uses thresholds: >=80 → Strong, >=60 → Good, >=40 → Fair, else Weak.

Mermaid diagram for scoring:

```mermaid
flowchart LR
  S[Similarity Score (0-1)] --> W1[weighted 50%]
  K[Skill Match % (0-100)] --> W2[weighted 30%]
  E[Experience Score % (0-100)] --> W3[weighted 20%]
  W1 --> SUM[Weighted Sum]
  W2 --> SUM
  W3 --> SUM
  SUM --> N[Normalize -> final_score (0-1)]
  N --> P[percentageMatch = int(final_score*100)]
  P --> R[recommendedAction thresholds]
```

## Confidence

- Skill-level confidence (baseline) is a shallow heuristic based on overall similarity: `confidence = similarity_score * 0.8 + 0.2`.
- Enhanced matcher outputs richer `matchBreakdown` with separate contributions for content, skill match and experience.
- No formal calibration or statistical confidence intervals are provided. Scores are deterministic for a fixed input sequence but depend on on-the-fly TF-IDF fitting.

## Limitations

- On-the-fly TF-IDF fitting: IDF computed per pair reduces stability across comparisons and prevents incremental learning or global term importance.
- Substring skill matching: `extract_skills` uses naive substring containment. This can miss synonyms or differently-worded skills ("nlp" vs "natural language processing") and can produce false positives (matching "c" inside other words if not careful).
- No semantic or embedding-based similarity (intentionally; no LLMs introduced per requirements). TF-IDF captures lexical overlap but not semantic equivalence.
- No lemmatization/stemming: related token forms ("optimize" vs "optimization") are treated separately unless TF-IDF vocabulary captures them.
- Stopword removal may be aggressive: removing tokens shorter than three characters may drop meaningful acronyms (e.g., "C#" was removed by regex, "Go" removed by length filter).
- Experience extraction: basic heuristic in enhanced preprocessing; may not catch complex date ranges or ambiguous CV timelines.
- No canonical skill ontology or synonyms list; skill matching is caller-provided via `requiredSkills` only.
- Per-request vectorizer instantiation may add latency under high load; there is no caching of vectorizers or precomputed IDF.

## Future Improvements (without replacing TF-IDF or introducing LLMs)

- Precompute and persist an IDF model across a representative corpus (job descriptions + resumes) and load the vectorizer with `idf_` precomputed. Keep TF-IDF approach but stabilize IDF to improve cross-comparison consistency.
- Improve skill matching:
  - Normalize skill phrases (lowercase, remove punctuation) and match on token boundaries.
  - Maintain a small synonyms/aliases map for common skills (e.g., "nlp" <-> "natural language processing").
  - Use fuzzy matching (Levenshtein or token-set ratio) for slight variants.
- Add light-weight linguistic normalization: lemmatization (NLTK/WordNet or spaCy optional) to group token forms.
- Add named-entity recognition (NER) heuristics to better extract experience, employer names, and durations (can be rule-based or lightweight spaCy pipeline without any LLMs).
- Cache or reuse a warmed vectorizer for a given job description when scoring multiple resumes against the same job to avoid repeated fit costs and to ensure consistent IDF for that job scope.
- Expand `matchBreakdown` to include per-skill evidence (e.g., sentence/snippet where skill was found).
- Add unit tests and small integration harness for the analyzer to assert expected numerical ranges for synthetic resume/job pairs.

---

Generated by static code inspection of the workspace on 2026-06-21.

Files inspected:
- `ai-module/src/preprocessing.py`
- `ai-module/src/analyzer.py`
- `ai-module/src/analyzer_enhanced.py`
- `ai-module/app.py`

If you want, I can also generate a short developer checklist to implement the recommended improvements. STOP.
