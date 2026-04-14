import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Card, Row, Col, Select, message, Spin } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import JobManagement from '../components/JobManagement';
import CandidateRanking from '../components/CandidateRanking';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { jobService, resultService } from '../services/apiService';

const { Sider, Content } = Layout;

const HRDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('jobs');
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
      setJobs(response.data);
    } catch (error) {
      message.error('Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const menuItems = [
    {
      key: 'jobs',
      label: 'Job Postings',
    },
    {
      key: 'ranking',
      label: 'Candidate Ranking',
    },
    {
      key: 'analytics',
      label: 'Analytics',
    },
  ];

  const renderContent = () => {
    switch (currentMenu) {
      case 'jobs':
        return <JobManagement />;
      case 'ranking':
        return (
          <Card title="Candidate Ranking">
            <Select
              placeholder="Select a job"
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
            <CandidateRanking jobId={selectedJobId} />
          </Card>
        );
      case 'analytics':
        return (
          <Card title="Analytics">
            <Select
              placeholder="Select a job"
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
            <AnalyticsDashboard jobId={selectedJobId} />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['jobs']}
          items={menuItems}
          onClick={(e) => setCurrentMenu(e.key)}
        />
      </Sider>
      <Layout>
        <div style={{ padding: '16px', background: '#fff' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </div>
        <Content style={{ margin: '16px', background: '#fff', padding: '24px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HRDashboard;
