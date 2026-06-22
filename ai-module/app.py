from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from src.analyzer_enhanced import analyze_resume

app = Flask(__name__)
CORS(app)

# Load configuration
app.config.from_object(Config)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'AI Module is running',
        'service': 'Resume Analyzer v2.0',
        'features': ['resume_analysis', 'skill_matching', 'experience_scoring', 'batch_processing']
    }), 200

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Advanced resume analysis endpoint with weighted scoring.
    
    Expected JSON:
    {
        "resumeText": "resume content...",
        "jobDescription": "job description...",
        "requiredSkills": ["skill1", "skill2", ...],
        "requiredExperience": 3
    }
    
    Returns comprehensive match analysis with breakdown.
    """
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'Invalid JSON data provided'}), 400

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        resume_text = data.get('resumeText', '')
        job_description = data.get('jobDescription', '')
        required_skills = data.get('requiredSkills', [])
        required_experience = data.get('requiredExperience', 0)

        if not resume_text or not job_description:
            return jsonify({'error': 'resumeText and jobDescription are required'}), 400

        # Analyze resume with enhanced scoring
        result = analyze_resume(resume_text, job_description, required_skills, required_experience)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

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
        if data is None:
            return jsonify({'error': 'Invalid JSON data provided'}), 400
        
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
