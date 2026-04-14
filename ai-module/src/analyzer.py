from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .preprocessing import preprocess_text, extract_skills

class ResumeMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=500, stop_words='english')
    
    def calculate_similarity(self, resume_text, job_description):
        """
        Calculate cosine similarity between resume and job description
        Returns: similarity score (0-1)
        """
        # Preprocess texts
        resume_processed = preprocess_text(resume_text)
        job_processed = preprocess_text(job_description)
        
        # Fit and transform
        tfidf_matrix = self.vectorizer.fit_transform([resume_processed, job_processed])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        return float(similarity)
    
    def match_resume_to_job(self, resume_text, job_description, required_skills=None):
        """
        Comprehensive resume-to-job matching analysis
        """
        if required_skills is None:
            required_skills = []
        
        # Calculate similarity score
        similarity_score = self.calculate_similarity(resume_text, job_description)
        
        # Extract matched skills
        matched_skills = extract_skills(resume_text, required_skills)
        
        # Extract missing skills
        missing_skills = [skill for skill in required_skills if skill not in matched_skills]
        
        # Calculate match skills with confidence scores
        matched_skills_with_confidence = [
            {
                'skill': skill,
                'confidence': round(similarity_score * 0.8 + 0.2, 2)  # Adjusted confidence
            }
            for skill in matched_skills
        ]
        
        # Calculate percentage match
        percentage_match = int(similarity_score * 100)
        
        return {
            'similarityScore': similarity_score,
            'percentageMatch': percentage_match,
            'matchedSkills': matched_skills_with_confidence,
            'missingSkills': missing_skills,
            'recommendedAction': 'Strong candidate' if percentage_match >= 70 else 'Good candidate' if percentage_match >= 40 else 'Consider reviewing'
        }

def analyze_resume(resume_text, job_description, required_skills=None):
    """
    Main function to analyze resume against job description
    """
    matcher = ResumeMatcher()
    result = matcher.match_resume_to_job(resume_text, job_description, required_skills)
    return result
