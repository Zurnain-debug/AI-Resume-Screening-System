from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .preprocessing_enhanced import (
    preprocess_text, extract_skills, extract_experience_years,
    extract_education, normalize_text, GENERIC_SKILLS
)


class AdvancedResumeMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=500, stop_words='english')

    def calculate_similarity(self, resume_text, job_description):
        """Calculate cosine similarity between resume and job description."""
        resume_processed = preprocess_text(resume_text)
        job_processed = preprocess_text(job_description)

        tfidf_matrix = self.vectorizer.fit_transform([resume_processed, job_processed])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        return float(similarity)

    def calculate_skill_match(self, matched_skills, required_skills):
        """Calculate skill match percentage."""
        if not required_skills:
            return 50.0  # Neutral score if no required skills

        match_count = len(matched_skills)
        total_required = len(required_skills)
        skill_match_percentage = (match_count / total_required) * 100
        return min(skill_match_percentage, 100)

    def normalize_experience_required(self, job_years_required):
        if isinstance(job_years_required, str):
            level = job_years_required.strip().lower()
            if level == 'entry':
                return 1
            if level == 'mid':
                return 3
            if level == 'senior':
                return 5
            try:
                return float(job_years_required)
            except ValueError:
                return 0
        if isinstance(job_years_required, (int, float)):
            return job_years_required
        return 0

    def calculate_experience_score(self, resume_years, job_years_required):
        """Calculate experience match score."""
        job_years_required = self.normalize_experience_required(job_years_required)

        if job_years_required <= 0:
            return 100.0

        if resume_years < job_years_required:
            ratio = (resume_years / job_years_required) * 100
            return min(ratio, 100)
        else:
            return 100.0

    def match_resume_to_job(self, resume_text, job_description, required_skills=None, required_experience=0):
        """Comprehensive resume-to-job matching with weighted scoring."""
        if required_skills is None:
            required_skills = []

        # Normalize inputs
        resume_clean = normalize_text(resume_text)
        job_clean = normalize_text(job_description)

        # Calculate similarity score (50% weight)
        similarity_score = self.calculate_similarity(resume_text, job_description)

        # Extract and match skills (30% weight)
        matched_skills = extract_skills(resume_text, required_skills)
        skill_match_score = self.calculate_skill_match(matched_skills, required_skills)

        # Extract experience and match (20% weight)
        experience_years = extract_experience_years(resume_text)
        experience_score = self.calculate_experience_score(experience_years, required_experience)

        # Missing skills
        missing_skills = [skill for skill in required_skills if skill not in matched_skills]

        # Weighted final score
        final_score = (
            (similarity_score * 100 * 0.50) +
            (skill_match_score * 0.30) +
            (experience_score * 0.20)
        ) / 100

        # Matched skills with confidence
        matched_skills_with_confidence = [
            {
                'skill': skill,
                'confidence': round(min(100, (similarity_score * 0.8 + 0.2) * 100), 1)
            }
            for skill in matched_skills
        ]

        percentage_match = int(final_score * 100)

        # Recommendation
        if percentage_match >= 80:
            recommendation = 'Strong candidate - Highly recommended'
        elif percentage_match >= 60:
            recommendation = 'Good candidate - Consider for interview'
        elif percentage_match >= 40:
            recommendation = 'Fair candidate - Review further'
        else:
            recommendation = 'Weak candidate - Not recommended'

        return {
            'similarityScore': round(final_score, 2),
            'percentageMatch': min(100, percentage_match),
            'matchedSkills': matched_skills_with_confidence,
            'missingSkills': missing_skills,
            'experienceYears': experience_years,
            'skillMatchPercentage': round(skill_match_score, 1),
            'experienceMatchPercentage': round(experience_score, 1),
            'recommendedAction': recommendation,
            'matchBreakdown': {
                'content_similarity': round(similarity_score * 100, 1),
                'skill_match': round(skill_match_score, 1),
                'experience_match': round(experience_score, 1)
            }
        }


def analyze_resume(resume_text, job_description, required_skills=None, required_experience=0):
    """Main function to analyze resume against job description."""
    matcher = AdvancedResumeMatcher()
    result = matcher.match_resume_to_job(
        resume_text, job_description, required_skills, required_experience
    )
    return result
