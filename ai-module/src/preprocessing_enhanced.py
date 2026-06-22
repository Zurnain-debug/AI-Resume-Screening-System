import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data
for resource in ['punkt', 'stopwords']:
    try:
        nltk.data.find(f'tokenizers/{resource}' if resource == 'punkt' else f'corpora/{resource}')
    except LookupError:
        try:
            nltk.download(resource, quiet=True)
        except Exception:
            pass

COMMON_STOP_WORDS = set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll",
    "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's",
    'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and',
    'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against',
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in',
    'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should',
    "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn',
    "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma',
    'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn',
    "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
])

EDUCATION_PATTERNS = [
    r'bachelor(?:s| of science| of arts)?',
    r'master(?:s| of science| of arts)?',
    r'btech|b\.tech|mtech|m\.tech',
    r'diploma',
    r'phd|doctorate',
    r'certification',
    r'certified'
]

GENERIC_SKILLS = [
    'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue', 'nodejs', 'node', 'express', 'django', 'flask',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'machine learning', 'nlp', 'deep learning', 'data analysis', 'data science',
    'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'git', 'ci/cd', 'jenkins',
    'communication', 'project management', 'leadership', 'agile', 'scrum', 'team work',
    'html', 'css', 'sass', 'less', 'webpack', 'rest', 'graphql', 'api',
    'testing', 'unit test', 'integration test', 'jest', 'pytest', 'mocha'
]


def normalize_text(text):
    """Normalize text: lowercase, remove extra spaces, keep alphanumeric and basic punctuation."""
    if not isinstance(text, str):
        text = str(text)

    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    return text.strip()


def tokenize(text):
    """Tokenize text into meaningful tokens."""
    text = normalize_text(text)
    try:
        tokens = word_tokenize(text)
    except (LookupError, ImportError):
        tokens = text.split()
    return [token for token in tokens if token not in COMMON_STOP_WORDS and len(token) > 2]


def preprocess_text(text):
    """Preprocess text for analysis."""
    tokens = tokenize(text)
    return ' '.join(tokens)


def extract_skills(text, required_skills=None):
    """Extract skills from resume text with pattern matching."""
    if required_skills is None:
        required_skills = []

    normalized_text = normalize_text(text)
    matched_skills = []

    # Match required skills
    for skill in required_skills:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, normalized_text):
            matched_skills.append(skill)

    # Add generic skills found
    for skill in GENERIC_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, normalized_text) and skill not in matched_skills:
            matched_skills.append(skill)

    return matched_skills


def extract_experience_years(text):
    """Extract years of experience from text."""
    normalized_text = normalize_text(text)
    years = 0

    # Look for "X years" pattern
    for match in re.finditer(r'(\d+)\s*\+?\s*years', normalized_text):
        try:
            years = max(years, int(match.group(1)))
        except ValueError:
            continue

    # Look for year ranges
    ranges = re.findall(r'(\d{4})\s*[-–]\s*(\d{4}|present|current)', normalized_text)
    for start, end in ranges:
        try:
            year_start = int(start)
            year_end = int(end) if end not in ['present', 'current'] else 2026
            years = max(years, year_end - year_start)
        except ValueError:
            continue

    return years


def extract_education(text):
    """Extract education level from text."""
    normalized_text = normalize_text(text)
    found = []
    for pattern in EDUCATION_PATTERNS:
        if re.search(pattern, normalized_text):
            # Clean pattern
            clean = pattern.replace('(?:s| of science| of arts)?', '').strip('^$\\b').replace('\\', '')
            if clean not in found:
                found.append(clean)
    return found


def extract_sections(text):
    """Extract common resume sections."""
    sections = {}
    normalized_text = text.lower()

    # Define section patterns
    section_patterns = {
        'experience': r'(?:work experience|professional experience|experience)',
        'education': r'(?:education|academic|degree|qualification)',
        'skills': r'(?:technical skills|skills|competencies|expertise)',
        'projects': r'(?:projects|portfolio|work samples)'
    }

    for section_name, pattern in section_patterns.items():
        if re.search(pattern, normalized_text):
            sections[section_name] = True
        else:
            sections[section_name] = False

    return sections
