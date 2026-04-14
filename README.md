# AI Resume Screening System

## Overview

The AI Resume Screening System is a modern, intelligent recruitment platform designed to assist Human Resource (HR) departments in managing and automating the hiring process. Using AI-powered resume analysis, organizations can process hundreds of resumes efficiently and make data-driven hiring decisions.

## Features

### HR Features
- **Job Postings Management**: Create, update, and manage job descriptions with required skills
- **Resume Screening**: Automated AI-powered resume analysis against job requirements
- **Candidate Ranking**: View candidates ranked by similarity score with job description
- **Analytics Dashboard**: Visualize candidate quality, score distribution, and key metrics
- **Performance Insights**: Track hiring metrics and make data-driven decisions

### Candidate Features
- **Job Search**: Browse available job postings
- **Resume Upload**: Submit resumes for job applications (PDF, DOCX, TXT formats)
- **Application Status**: Track submitted applications and processing status
- **Match Score**: View how well your resume matches job requirements

## Technology Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

### Frontend
- **Framework**: React.js
- **UI Library**: Ant Design
- **Charts**: Chart.js + React ChartJS 2
- **HTTP Client**: Axios

### AI Module
- **Language**: Python
- **Framework**: Flask
- **ML Library**: Scikit-learn
- **NLP**: NLTK
- **Algorithm**: TF-IDF + Cosine Similarity

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-screening
   JWT_SECRET=your_jwt_secret_key_here
   PYTHON_API_URL=http://localhost:5001
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### AI Module Setup

1. Navigate to ai-module directory:
   ```bash
   cd ai-module
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the Python API:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Jobs
- `GET /api/jobs` - Get all job postings
- `GET /api/jobs/:id` - Get specific job details
- `POST /api/jobs` - Create new job (HR only)
- `PUT /api/jobs/:id` - Update job (HR only)
- `DELETE /api/jobs/:id` - Delete job (HR only)

### Resumes
- `POST /api/resumes/upload` - Upload resume file
- `POST /api/resumes/process` - Process resume and generate score
- `GET /api/resumes` - Get resumes (filtered by jobId or candidateId)
- `GET /api/resumes/:id` - Get specific resume details

### Results & Analytics
- `GET /api/results` - Get all results (HR only)
- `GET /api/results/job/:jobId/ranking` - Get candidate ranking for job
- `GET /api/results/job/:jobId/analytics` - Get analytics for job
- `GET /api/results/:id` - Get specific result details

### AI Module
- `GET /health` - Health check
- `POST /analyze` - Analyze single resume
- `POST /batch-analyze` - Analyze multiple resumes

## Usage Guide

### For HR Managers

1. **Register**: Create an account with HR role and company name
2. **Create Job Posting**: 
   - Go to Job Postings section
   - Click "Create Job" button
   - Fill in job title, description, required skills
   - Submit
3. **View Applications**:
   - Go to Candidate Ranking
   - Select a job posting
   - View candidates ranked by match score
4. **Analyze Results**:
   - Go to Analytics section
   - Select a job posting
   - View distribution charts and key metrics
   - Identify top candidates

### For Candidates

1. **Register**: Create an account with Candidate role
2. **Browse Jobs**: 
   - View available job postings in the system
   - Read job descriptions and requirements
3. **Apply**:
   - Click "Apply for Job"
   - Select job posting
   - Upload resume (PDF, DOCX, or TXT)
4. **Track Status**:
   - Go to "My Applications"
   - View status of submitted resumes
   - Check when applications were processed

## AI Algorithm Explanation

### Preprocessing
1. Convert text to lowercase
2. Remove special characters
3. Tokenize text into words
4. Remove stop words (common words like "the", "and")

### TF-IDF Analysis
- Calculates importance of each word in the resume relative to the job description
- Higher weight to rare but meaningful terms
- Lower weight to common terms

### Similarity Calculation
- Uses Cosine Similarity to compare resume and job description vectors
- Outputs score between 0 and 1
- 0.9+ = Very high match
- 0.5-0.9 = Good match
- <0.5 = Lower match

### Skill Matching
- Extracts required skills from job description
- Searches for these skills in resume
- Calculates confidence scores
- Identifies missing skills

## Project Structure

```
ai-resume-screening-system/
├── backend/
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, upload, text extraction
│   │   └── config/         # Configuration
│   ├── uploads/            # Resume storage
│   ├── package.json
│   ├── server.js           # Entry point
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json
│   ├── .env
│   └── public/
│
├── ai-module/
│   ├── src/
│   │   ├── preprocessing.py  # Text preprocessing
│   │   └── analyzer.py       # Resume analysis logic
│   ├── app.py               # Flask app entry point
│   ├── config.py            # Configuration
│   ├── requirements.txt     # Python dependencies
│   └── .env
│
└── docs/                    # Documentation
```

## Docker Deployment

### Build and Run with Docker

1. **Build images**:
   ```bash
   docker build -t resume-screening-backend ./backend
   docker build -t resume-screening-ai ./ai-module
   docker build -t resume-screening-frontend ./frontend
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up
   ```

## Performance Optimization

- **Batch Processing**: Process multiple resumes concurrently
- **Caching**: Cache job descriptions for faster analysis
- **Indexing**: Database indexes on frequently queried fields
- **Lazy Loading**: Load data on demand in UI

## Security Considerations

- **Password Hashing**: Bcrypt for password encryption
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Implement rate limiting on API endpoints
- **Input Validation**: Validate all user inputs
- **CORS**: Configure CORS for secure cross-origin requests
- **HTTPS**: Use HTTPS in production

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify network connectivity

### AI Module Not Responding
- Ensure Python API is running on port 5001
- Check PYTHON_API_URL in backend .env
- Verify Flask server is accessible

### Resume Upload Failures
- Check file format (PDF, DOCX, TXT only)
- Verify file size (max 5MB)
- Check backend uploads folder permissions

## Future Enhancements

- [ ] Multi-language support
- [ ] Video resume screening
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Resume templates
- [ ] Bulk import candidates
- [ ] Integration with HR systems (Workday, SAP)
- [ ] Machine learning model improvements
- [ ] Real-time notifications
- [ ] Mobile app

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please contact:
- Email: support@resumescreening.com
- GitHub Issues: [Project Issues](https://github.com/yourrepo/issues)

## Authors

- AI Resume Screening Development Team

## Acknowledgments

- Scikit-learn for ML algorithms
- NLTK for NLP processing
- Ant Design for UI components
- Chart.js for data visualization
