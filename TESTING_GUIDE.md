# AI Resume Screening System - Testing Guide

Complete testing guide for validating the enhanced AI Resume Screening System with all new features.

## 🎯 Test Objectives

1. Validate resume upload and text extraction
2. Verify AI analysis and scoring accuracy
3. Test sample resume functionality
4. Check admin dashboard and result management
5. Verify responsive UI design

## ✅ Pre-Testing Setup

### 1. Start All Services

**Terminal 1 - AI Module (Python)**
```bash
cd ai-module
source venv/Scripts/activate  # Windows: venv\Scripts\activate
python app.py
# Expected output: Running on http://127.0.0.1:5001
```

**Terminal 2 - Backend (Node.js)**
```bash
cd backend
npm run dev
# Expected output: Server running on http://localhost:5000
```

**Terminal 3 - Frontend (React)**
```bash
cd frontend
npm start
# Expected output: React app running on http://localhost:3001
```

### 2. Verify All Endpoints

```bash
# Check AI module health
curl http://localhost:5001/health

# Check backend health
curl http://localhost:5000/api/health

# List sample resumes
curl http://localhost:5000/api/samples
```

All should return 200 status with JSON response.

## 🧪 Test Scenarios

### Test 1: User Registration & Login

**Steps:**
1. Open http://localhost:3001 in browser
2. Click "Register" on navigation bar
3. Fill registration form:
   - Email: testhr@example.com
   - Password: Test123!
   - Role: HR Manager
4. Click "Register"
5. Should redirect to login page
6. Log in with above credentials
7. Should redirect to HR Dashboard

**Expected Result:** ✅ User successfully registers and logs in

---

### Test 2: View Sample Resumes

**Steps:**
1. From HomePage (if logged out) or after login, navigate to sample resumes section
2. Click on "Sample Resume Gallery" or access `/samples`
3. Observe three sample resume cards:
   - Priya Sharma - Frontend Developer
   - Arjun Patel - Data Scientist
   - Nisha Gupta - HR Manager
4. Click on any card to view full resume
5. Click "Copy Content" button
6. Verify content is copied to clipboard

**Expected Result:** ✅ All 3 samples display correctly with proper content and copy functionality

**Validation Points:**
- [ ] Sample names display correctly
- [ ] Resume content shows full details (education, experience, skills)
- [ ] Copy button works (message appears)
- [ ] All samples load without errors

---

### Test 3: Create Job Posting

**Steps:**
1. Log in as HR (testhr@example.com)
2. Navigate to "Job Management" section
3. Click "Create New Job"
4. Fill job form:
   - Title: Senior Frontend Developer
   - Description: Looking for 5+ years React/TypeScript expert
   - Required Skills: React, JavaScript, TypeScript, Node.js, CSS, REST API
   - Required Experience: 5 years
   - Location: Remote
5. Click "Post Job"

**Expected Result:** ✅ Job successfully created and appears in job list

**Validation Points:**
- [ ] Job form submits without errors
- [ ] Job appears in HR Dashboard
- [ ] Job details saved correctly

---

### Test 4: Upload Resume & Auto-Analysis

**Steps:**
1. Create a candidate account or switch to candidate view
2. Go to "Upload Resume" section
3. Use sample resume content:
   - Copy Priya Sharma resume content (Frontend Developer)
   - Create a file: `priya_resume.txt`
   - Paste content
4. Drag and drop file into upload area OR click to select
5. Wait for upload to complete
6. Observe loading state during processing

**Expected Result:** ✅ Resume uploaded and automatically analyzed

**Validation Points:**
- [ ] File upload completes
- [ ] Spinner shows during processing (2-3 seconds)
- [ ] Success message appears
- [ ] Uploaded resume appears in "My Resumes"

---

### Test 5: View Analysis Results

**Steps:**
1. After resume upload completes, navigate to Results/Analytics
2. Select the job you applied to
3. Observe the results table showing:
   - Your ranking
   - Match percentage
   - Matched skills
   - Recommendation
4. Click on your result to view details

**Expected Result:** ✅ Detailed analysis results display

**Validation Points:**
- [ ] Match percentage shows (should be 60-85% for frontend dev vs senior frontend dev)
- [ ] Matched skills listed (React, JavaScript, TypeScript, etc.)
- [ ] Score breakdown visible
- [ ] Recommendation text shows

---

### Test 6: Admin Result Details View

**Steps:**
1. Log in as HR Manager
2. Go to Job Management → Select a job
3. Click "View Rankings" for that job
4. See candidate ranking table with:
   - Rank (#1, #2, #3)
   - Candidate name and email
   - Match score with progress bar
   - Matched skills tags
   - Status badge
5. Click "Details" button on a candidate

**Expected Result:** ✅ Admin details modal opens with full candidate info

**Validation Points:**
- [ ] Table shows all candidates
- [ ] Scores are between 0-100
- [ ] Progress bars fill proportionally
- [ ] Details modal shows:
  - Score breakdown (content, skills, experience)
  - Matched skills with confidence %
  - Missing skills
  - Experience years
  - Recommendation

---

### Test 7: Admin Rating & Status Update

**Steps:**
1. In Admin Details Modal for a candidate
2. Set rating: Click 4 stars
3. Change status: Select "shortlisted" from dropdown
4. Add notes: Type "Strong React/TypeScript skills, good cultural fit"
5. Click "Save Changes"
6. Modal closes, table should update

**Expected Result:** ✅ Admin data saved successfully

**Validation Points:**
- [ ] Rating updates (stars visible)
- [ ] Status changes (badge updates)
- [ ] Notes save without error
- [ ] Changes persist on page refresh

---

### Test 8: Score Breakdown Accuracy

**Instructions:** Verify the AI scoring algorithm is working correctly

**Sample Test Case:**
- Job: Senior Frontend Developer (5+ years React, TypeScript)
- Candidate: Priya Sharma (5 years React/TypeScript)

**Expected Scoring:**
```
Content Similarity: ~75% (resume matches job description well)
Skill Match: ~85% (has 5 of 6 required skills)
Experience Match: 100% (5 years = 5 years required)
Overall: (75 × 0.50) + (85 × 0.30) + (100 × 0.20) = 82% ✅
```

**Steps:**
1. Upload Priya's resume for Senior Frontend Developer job
2. Wait for analysis
3. Check result details
4. Verify match breakdown shows ~80-85%

**Expected Result:** ✅ Score within 75-85% range

---

### Test 9: UI Responsiveness

**Steps:**
1. Access http://localhost:3001 on different screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. Test navigation responsiveness:
   - Menu collapses on mobile
   - All buttons accessible
   - Forms fit on screen
3. Test upload interface:
   - Drag and drop works on all sizes
   - File input clickable

**Expected Result:** ✅ UI responsive and accessible on all screen sizes

**Validation Points:**
- [ ] Navigation menu collapses on mobile
- [ ] Forms are readable without horizontal scroll
- [ ] Buttons have proper touch targets (48px+)
- [ ] Images scale properly

---

### Test 10: Multiple Candidate Comparison

**Steps:**
1. Upload 2-3 resumes for the same job
2. View ranking table
3. Verify candidates are sorted by score (highest first)
4. Check that rankings are correct
5. Export or print ranking (if available)

**Expected Result:** ✅ Candidates properly ranked by match score

**Validation Points:**
- [ ] Ranking order is correct (highest to lowest)
- [ ] All resumes appear in results
- [ ] Scores are accurate and consistent

---

## 📊 Performance Testing

### Test 11: Upload Performance

**Scenario:** Single resume upload

```
Expected Results:
- File upload: < 2 seconds
- Text extraction: < 1 second
- AI analysis: 2-3 seconds
- Total time: < 6 seconds
```

### Test 12: Batch Processing (Optional)

**Scenario:** Upload 5 resumes for same job

```
Expected Results:
- All process in background
- UI remains responsive
- No errors in console
- All results appear in ranking
```

---

## 🐛 Error Handling Tests

### Test 13: Invalid File Upload

**Steps:**
1. Try uploading invalid file format (.txt content in PDF)
2. Try uploading empty file
3. Try uploading very large file (>10MB)

**Expected Result:** ✅ User-friendly error message

**Expected Messages:**
- "Invalid file format. Please upload PDF, DOCX, or TXT"
- "File is empty. Please upload a valid resume"
- "File size exceeds 10MB limit"

---

### Test 14: API Error Handling

**Steps:**
1. Stop Python AI module
2. Try to upload a resume
3. Observe error handling

**Expected Result:** ✅ Graceful error message, not raw 500 error

**Expected:** "AI service temporarily unavailable. Please try again."

---

## 🔍 Data Validation Tests

### Test 15: Scoring Edge Cases

**Test Cases:**

| Scenario | Expected Score | Validation |
|----------|---|---|
| Perfect match (all skills, experience) | 95-100% | ✅ |
| No matching skills | 20-40% | ✅ |
| Only content matches, no skills | 30-50% | ✅ |
| Skills match, but insufficient experience | 40-60% | ✅ |

---

## ✨ Feature Completeness Checklist

- [ ] **Landing Page**
  - [ ] Hero section displays
  - [ ] Feature cards visible
  - [ ] CTA buttons work
  - [ ] Modern design with gradients

- [ ] **Authentication**
  - [ ] Register form works
  - [ ] Login authenticates
  - [ ] Logout clears token
  - [ ] Protected routes redirect

- [ ] **Resume Management**
  - [ ] Upload with drag-drop
  - [ ] File validation
  - [ ] Auto-processing on upload
  - [ ] Resume list shows uploads

- [ ] **AI Analysis**
  - [ ] Skills extracted correctly
  - [ ] Experience calculated
  - [ ] Scores accurate
  - [ ] Feedback provided

- [ ] **Admin Features**
  - [ ] View all candidates
  - [ ] See detailed scores
  - [ ] Update status
  - [ ] Rate candidates
  - [ ] Add notes
  - [ ] View analytics

- [ ] **Sample Resumes**
  - [ ] All 3 samples available
  - [ ] Content displays correctly
  - [ ] Copy functionality works
  - [ ] No API errors

---

## 📋 Regression Testing

After making changes, verify:

1. **All endpoints still respond**
   ```bash
   npm run test:api
   ```

2. **Frontend builds without errors**
   ```bash
   npm run build
   ```

3. **No console errors or warnings**
   - Open browser DevTools (F12)
   - Check Console tab for any errors

4. **Database data persists**
   - Refresh page
   - Verify data still shows

---

## 🚀 Load Testing (Optional)

### Simple Load Test

```bash
# Test API under load (requires Apache Bench)
ab -n 100 -c 10 http://localhost:5000/api/health
```

Expected: All requests complete successfully

---

## 📝 Test Results Documentation

Create a test report:

```markdown
# Test Execution Report
Date: [Date]
Tester: [Name]
Version: 1.0

## Test Summary
- Total Tests: 15
- Passed: [X]
- Failed: [0]
- Skipped: [0]

## Issues Found
[List any bugs]

## Recommendations
[Improvements to make]
```

---

## 🎓 Sample Resume Content Reference

### Priya Sharma - Frontend Developer
- **Experience:** 5 years React, TypeScript
- **Skills:** React, JavaScript, TypeScript, Node.js, Redux, REST API
- **Expected Match:** 80-85% for Senior Frontend Developer

### Arjun Patel - Data Scientist
- **Experience:** 6 years ML/NLP
- **Skills:** Python, scikit-learn, TensorFlow, Machine Learning, NLP
- **Expected Match:** 85-90% for Data Science role

### Nisha Gupta - HR Manager
- **Experience:** 8 years recruitment
- **Skills:** ATS, Recruitment, Analytics, Team Management
- **Expected Match:** 90%+ for HR/Recruitment role

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to AI service"
- Verify Python app running: `curl http://localhost:5001/health`
- Check port 5001 is not blocked
- Restart Python service

### Issue: "Resume text extraction failed"
- Check file format is valid
- Try a different file format (PDF → TXT)
- Check file is not corrupted

### Issue: "Score seems wrong"
- Verify job requirements are set correctly
- Check resume contains expected skills
- Review matching algorithm (see SYSTEM_IMPROVEMENTS.md)

---

## ✅ Sign-Off

All tests should pass before deploying to production.

**Tested By:** _______________  
**Date:** _______________  
**Status:** ✅ PASSED / ❌ FAILED  

---

Happy Testing! 🎉
