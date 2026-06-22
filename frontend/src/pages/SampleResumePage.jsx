import React from 'react';
import { Card } from 'antd';
import SampleResumeGallery from '../components/SampleResumeGallery';

const SampleResumePage = () => (
  <Card title="Sample Resumes" style={{ minHeight: '100vh' }}>
    <SampleResumeGallery />
  </Card>
);

export default SampleResumePage;
