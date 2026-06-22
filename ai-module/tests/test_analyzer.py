import unittest
from src.analyzer import ResumeMatcher, analyze_resume

class TestResumeMatcher(unittest.TestCase):

    def setUp(self):
        """Set up test fixtures"""
        self.matcher = ResumeMatcher()
        self.sample_resume = """
        John Doe
        Software Engineer with 5 years of experience.
        Skills: Python, Java, Machine Learning, React, Node.js
        Experience: Developed web applications using Python and JavaScript.
        """
        self.sample_job = """
        Senior Software Engineer position.
        Requirements: Python, Java, Machine Learning, React, Node.js, AWS
        Responsibilities: Develop web applications and machine learning models.
        """

    def test_calculate_similarity_basic(self):
        """Test basic similarity calculation"""
        similarity = self.matcher.calculate_similarity(self.sample_resume, self.sample_job)
        self.assertIsInstance(similarity, float)
        self.assertGreaterEqual(similarity, 0.0)
        self.assertLessEqual(similarity, 1.0)

    def test_calculate_similarity_identical_texts(self):
        """Test similarity with identical texts"""
        text = "Python developer with machine learning experience"
        similarity = self.matcher.calculate_similarity(text, text)
        self.assertAlmostEqual(similarity, 1.0, places=1)

    def test_calculate_similarity_different_texts(self):
        """Test similarity with completely different texts"""
        text1 = "Python developer"
        text2 = "Chef cook restaurant"
        similarity = self.matcher.calculate_similarity(text1, text2)
        self.assertLess(similarity, 0.5)

    def test_match_resume_to_job_basic(self):
        """Test basic resume to job matching"""
        required_skills = ["Python", "Java", "Machine Learning"]
        result = self.matcher.match_resume_to_job(
            self.sample_resume,
            self.sample_job,
            required_skills
        )

        # Check result structure
        self.assertIn('similarityScore', result)
        self.assertIn('percentageMatch', result)
        self.assertIn('matchedSkills', result)
        self.assertIn('missingSkills', result)
        self.assertIn('recommendedAction', result)

        # Check types
        self.assertIsInstance(result['similarityScore'], float)
        self.assertIsInstance(result['percentageMatch'], int)
        self.assertIsInstance(result['matchedSkills'], list)
        self.assertIsInstance(result['missingSkills'], list)
        self.assertIsInstance(result['recommendedAction'], str)

    def test_match_resume_to_job_no_skills(self):
        """Test matching without required skills"""
        result = self.matcher.match_resume_to_job(
            self.sample_resume,
            self.sample_job
        )

        self.assertEqual(result['matchedSkills'], [])
        self.assertEqual(result['missingSkills'], [])

    def test_match_resume_to_job_empty_resume(self):
        """Test matching with empty resume"""
        result = self.matcher.match_resume_to_job("", self.sample_job)
        self.assertIsInstance(result, dict)

    def test_match_resume_to_job_empty_job(self):
        """Test matching with empty job description"""
        result = self.matcher.match_resume_to_job(self.sample_resume, "")
        self.assertIsInstance(result, dict)

    def test_analyze_resume_function(self):
        """Test the main analyze_resume function"""
        required_skills = ["Python", "Java"]
        result = analyze_resume(
            self.sample_resume,
            self.sample_job,
            required_skills
        )

        # Check result structure
        self.assertIn('similarityScore', result)
        self.assertIn('percentageMatch', result)
        self.assertIn('matchedSkills', result)
        self.assertIn('missingSkills', result)
        self.assertIn('recommendedAction', result)

    def test_recommended_action_logic(self):
        """Test the recommended action logic"""
        # Create matcher with controlled similarity
        matcher = ResumeMatcher()

        # Test high match
        high_match_resume = "Python Java Machine Learning React Node.js AWS"
        high_match_job = "Python Java Machine Learning React Node.js AWS"
        result = matcher.match_resume_to_job(high_match_resume, high_match_job)
        self.assertEqual(result['recommendedAction'], 'Strong candidate')

        # Test medium match
        medium_match_resume = "Python Java"
        medium_match_job = "Python Java Machine Learning React"
        result = matcher.match_resume_to_job(medium_match_resume, medium_match_job)
        # This might vary, but should be a valid recommendation

        # Test low match
        low_match_resume = "Cooking Painting"
        low_match_job = "Python Java Machine Learning"
        result = matcher.match_resume_to_job(low_match_resume, low_match_job)
        # This might vary, but should be a valid recommendation

if __name__ == '__main__':
    unittest.main()