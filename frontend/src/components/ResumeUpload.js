import React, { useState } from 'react';
import { Upload, Button, message, Spin, Select, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { resumeService, jobService } from '../services/apiService';

const ResumeUpload = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await jobService.getJobs();
      setJobs(response.data.filter(job => job.status === 'Open'));
    } catch (error) {
      message.error('Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!selectedJobId) {
      message.error('Please select a job first');
      return false;
    }

    setLoading(true);
    try {
      const response = await resumeService.uploadResume(file, selectedJobId);
      message.success('Resume uploaded successfully');
      setFiles([...files, response.data.resume]);
      return false;
    } catch (error) {
      message.error(error.response?.data?.error || 'Upload failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Upload Resume" style={{ maxWidth: '600px', margin: '30px auto' }}>
      <Spin spinning={loading}>
        <Select
          placeholder="Select a job to apply for"
          loading={jobsLoading}
          onChange={setSelectedJobId}
          style={{ marginBottom: '20px', width: '100%' }}
        >
          {jobs.map(job => (
            <Select.Option key={job._id} value={job._id}>
              {job.title}
            </Select.Option>
          ))}
        </Select>

        <Upload
          customRequest={({ file }) => handleUpload(file)}
          accept=".pdf,.docx,.txt"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>
            Click to Upload Resume (PDF, DOCX, or TXT)
          </Button>
        </Upload>

        {files.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Uploaded Files:</h4>
            {files.map((file, index) => (
              <p key={index}>{file.fileName} - {file.status}</p>
            ))}
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default ResumeUpload;
