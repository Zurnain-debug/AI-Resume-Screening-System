from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from src.analyzer import analyze_resume

app = Flask(__name__)
CORS(app)

# Load configuration
app.config.from_object(Config)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI Module is running', 'service': 'Resume Analyzer'}), 200

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Endpoint to analyze a resume against a job description
    
    Expected JSON:
    {
        "resumeText": "resume content...",
        "jobDescription": "job description...",
        "requiredSkills": ["skill1", "skill2", ...]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        resume_text = data.get('resumeText', '')
        job_description = data.get('jobDescription', '')
        required_skills = data.get('requiredSkills', [])
        
        if not resume_text or not job_description:
            return jsonify({'error': 'resumeText and jobDescription are required'}), 400
        
        # Analyze resume
        result = analyze_resume(resume_text, job_description, required_skills)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch-analyze', methods=['POST'])
def batch_analyze():
    """
    Endpoint to analyze multiple resumes against a job description
    
    Expected JSON:
    {
        "resumes": ["resume1...", "resume2...", ...],
        "jobDescription": "job description...",
        "requiredSkills": ["skill1", "skill2", ...]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        resumes = data.get('resumes', [])
        job_description = data.get('jobDescription', '')
        required_skills = data.get('requiredSkills', [])
        
        if not resumes or not job_description:
            return jsonify({'error': 'resumes and jobDescription are required'}), 400
        
        # Analyze all resumes
        results = []
        for resume_text in resumes:
            result = analyze_resume(resume_text, job_description, required_skills)
            results.append(result)
        
        # Sort by similarity score (descending)
        results.sort(key=lambda x: x['similarityScore'], reverse=True)
        
        return jsonify({'results': results, 'total': len(results)}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=app.config['DEBUG'])
