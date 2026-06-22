import React, { useState, useEffect } from 'react';
import { Card, Select, Spin, Empty, Alert } from 'antd';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { jobService } from '../services/apiService';

const AnalyticsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobService.getJobs();
      setJobs(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Analytics" style={{ minHeight: '100vh' }}>
      {error && (
        <Alert
          type="error"
          message="Unable to load jobs"
          description={error}
          style={{ marginBottom: 24 }}
        />
      )}

      <Spin spinning={loading}>
        {!loading && jobs.length === 0 ? (
          <Empty description="No job postings available. Create a job to view analytics." />
        ) : (
          <>
            <Select
              placeholder="Select a job"
              value={selectedJobId}
              onChange={setSelectedJobId}
              style={{ width: '100%', marginBottom: 24 }}
              options={jobs.map((job) => ({
                label: job.title,
                value: job._id,
              }))}
            />
            <AnalyticsDashboard jobId={selectedJobId} />
          </>
        )}
      </Spin>
    </Card>
  );
};

export default AnalyticsPage;
