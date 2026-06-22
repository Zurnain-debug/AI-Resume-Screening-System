import unittest
from src.preprocessing import preprocess_text, extract_skills, tokenize

class TestPreprocessing(unittest.TestCase):

    def test_preprocess_text_basic(self):
        """Test basic text preprocessing"""
        input_text = "Hello, World! This is a test."
        expected = "hello world test"
        result = preprocess_text(input_text)
        self.assertEqual(result, expected)

    def test_preprocess_text_with_numbers(self):
        """Test preprocessing with numbers and special characters"""
        input_text = "Python 3.9, JavaScript, and C++ are programming languages."
        expected = "python javascript programming languages"
        result = preprocess_text(input_text)
        self.assertEqual(result, expected)

    def test_preprocess_text_empty(self):
        """Test preprocessing with empty string"""
        input_text = ""
        expected = ""
        result = preprocess_text(input_text)
        self.assertEqual(result, expected)

    def test_preprocess_text_non_string(self):
        """Test preprocessing with non-string input"""
        input_text = 12345
        expected = ""
        result = preprocess_text(input_text)
        self.assertEqual(result, expected)

    def test_extract_skills_basic(self):
        """Test basic skill extraction"""
        text = "I know Python, Java, and machine learning."
        required_skills = ["python", "java", "javascript"]
        expected = ["python", "java"]
        result = extract_skills(text, required_skills)
        self.assertEqual(result, expected)

    def test_extract_skills_case_insensitive(self):
        """Test case insensitive skill extraction"""
        text = "I know PYTHON and java."
        required_skills = ["Python", "Java"]
        expected = ["Python", "Java"]
        result = extract_skills(text, required_skills)
        self.assertEqual(result, expected)

    def test_extract_skills_no_match(self):
        """Test skill extraction with no matches"""
        text = "I know cooking and painting."
        required_skills = ["python", "java"]
        expected = []
        result = extract_skills(text, required_skills)
        self.assertEqual(result, expected)

    def test_extract_skills_empty_required(self):
        """Test skill extraction with empty required skills"""
        text = "I know python and java."
        required_skills = []
        expected = []
        result = extract_skills(text, required_skills)
        self.assertEqual(result, expected)

    def test_tokenize_basic(self):
        """Test basic tokenization"""
        text = "Hello world"
        expected = ["hello", "world"]
        result = tokenize(text)
        self.assertEqual(result, expected)

    def test_tokenize_with_punctuation(self):
        """Test tokenization with punctuation"""
        text = "Hello, world!"
        expected = ["hello", ",", "world", "!"]
        result = tokenize(text)
        self.assertEqual(result, expected)

if __name__ == '__main__':
    unittest.main()