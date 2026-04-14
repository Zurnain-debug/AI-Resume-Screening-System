import React, { useState } from 'react';
import { Layout, Menu, Button, Card, Table, Tag, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ResumeUpload from '../components/ResumeUpload';
import { jobService, resumeService } from '../services/apiService';

const { Sider, Content } = Layout;

const CandidateDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentMenu === 'jobs') {
      fetchJobs();
    } else if (currentMenu === 'applications') {
      fetchResumes();
    }
  }, [currentMenu]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobs();
      setJobs(response.data.filter(job => job.status === 'Open'));
    } catch (error) {
      message.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeService.getResumes();
      setResumes(response.data);
    } catch (error) {
      message.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: 'jobs',
      label: 'Available Jobs',
    },
    {
      key: 'upload',
      label: 'Apply for Job',
    },
    {
      key: 'applications',
      label: 'My Applications',
    },
  ];

  const jobColumns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Experience Level',
      dataIndex: 'experienceLevel',
      key: 'experienceLevel',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
  ];

  const resumeColumns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Job',
      dataIndex: ['jobId', 'title'],
      key: 'jobTitle',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Processed' ? 'green' : status === 'Failed' ? 'red' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Uploaded At',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const renderContent = () => {
    switch (currentMenu) {
      case 'jobs':
        return (
          <Card title="Available Job Postings">
            <Table columns={jobColumns} dataSource={jobs} loading={loading} rowKey="_id" />
          </Card>
        );
      case 'upload':
        return <ResumeUpload />;
      case 'applications':
        return (
          <Card title="My Applications">
            <Table columns={resumeColumns} dataSource={resumes} loading={loading} rowKey="_id" />
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

export default CandidateDashboard;
