import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

def preprocess_text(text):
    """
    Preprocess text by:
    - Converting to lowercase
    - Removing special characters
    - Removing stop words
    - Tokenizing
    """
    if not isinstance(text, str):
        text = str(text)
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words and len(token) > 2]
    
    return ' '.join(tokens)

def extract_skills(text, required_skills=None):
    """
    Extract skills from text.
    Matches skills from a predefined list or from required_skills parameter.
    """
    if required_skills is None:
        required_skills = []
    
    text_lower = text.lower()
    matched_skills = []
    
    for skill in required_skills:
        skill_lower = skill.lower()
        if skill_lower in text_lower:
            matched_skills.append(skill)
    
    return matched_skills

def tokenize(text):
    """Tokenize text into words"""
    return word_tokenize(text.lower())
