import React from 'react';
import { Card } from 'antd';
import JobManagement from '../components/JobManagement';

const JobManagementPage = () => (
  <Card title="Job Management" style={{ minHeight: '100vh' }}>
    <JobManagement />
  </Card>
);

export default JobManagementPage;
