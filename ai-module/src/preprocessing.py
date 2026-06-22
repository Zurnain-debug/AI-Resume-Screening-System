import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    try:
        nltk.download('punkt', quiet=True)
    except:
        pass

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    try:
        nltk.download('stopwords', quiet=True)
    except:
        pass

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    try:
        nltk.download('punkt_tab', quiet=True)
    except:
        pass

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

    # Try NLTK tokenization first, fallback to simple split
    try:
        tokens = word_tokenize(text)
    except (LookupError, ImportError):
        # Fallback: simple split by whitespace
        tokens = text.split()

    # Try to get stop words, fallback to common English stop words
    try:
        stop_words = set(stopwords.words('english'))
    except (LookupError, ImportError):
        # Fallback: common English stop words
        stop_words = set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"])

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
    try:
        return word_tokenize(text.lower())
    except (LookupError, ImportError):
        # Fallback: simple split by whitespace
        return text.lower().split()
