import React, { useState } from 'react';
import { Spin, message } from 'antd';

const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleFiles = (file) => {
    if (!file) {
      message.error('Please choose a valid document');
      return;
    }

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
      message.error('Only PDF, DOCX, and TXT files are supported');
      return;
    }

    setIsUploading(true);
    setSuccess('');
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(file);
      setSuccess('Resume uploaded successfully');
    }, 1000);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    handleFiles(file);
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    handleFiles(file);
  };

  return (
    <section className="section upload-section" id="upload">
      <div className="section-heading">
        <span>Resume Upload</span>
        <h2>Drag & drop resumes for fast AI screening</h2>
        <p>Simply drop a resume file and let the AI generate candidate match scores instantly.</p>
      </div>
      <div
        className={`upload-card ${dragActive ? 'upload-active' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <h3>Drag & drop your file here</h3>
          <p>Accepted formats: PDF, DOCX, TXT</p>
          <label className="upload-button">
            Choose file
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleChange} hidden />
          </label>
        </div>
        <div className="upload-hint">or browse from your device</div>
      </div>
      <Spin spinning={isUploading}>
        {success && <div className="upload-success">{success}</div>}
        {selectedFile && (
          <div className="upload-preview">
            <div>
              <span>File</span>
              <strong>{selectedFile.name}</strong>
            </div>
            <div>
              <span>Size</span>
              <strong>{(selectedFile.size / 1024).toFixed(2)} KB</strong>
            </div>
          </div>
        )}
      </Spin>
    </section>
  );
};

export default UploadSection;
