import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Tag, message, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { jobService } from '../services/apiService';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobs();
      setJobs(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch jobs';
      message.error(`Failed to fetch jobs: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    form.setFieldsValue(job);
    setModalVisible(true);
  };

  const handleDeleteJob = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    try {
      await jobService.deleteJob(id);
      message.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete job';
      message.error(`Failed to delete job: ${errorMessage}`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingJob) {
        await jobService.updateJob(editingJob._id, values);
        message.success('Job updated successfully');
      } else {
        await jobService.createJob(values);
        message.success('Job created successfully');
      }
      setModalVisible(false);
      fetchJobs();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save job';
      message.error(`Failed to save job: ${errorMessage}`);
    }
  };

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Open' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Required Skills',
      dataIndex: 'requiredSkills',
      key: 'requiredSkills',
      render: (skills) => (
        <>
          {skills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button data-testid={`edit-${record._id}`} icon={<EditOutlined />} onClick={() => handleEditJob(record)}>
            Edit
          </Button>
          <Button data-testid={`delete-${record._id}`} danger icon={<DeleteOutlined />} onClick={() => handleDeleteJob(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateJob} style={{ marginBottom: '20px' }}>
        Create Job
      </Button>

      <Table columns={columns} dataSource={jobs} loading={loading} rowKey="_id" />

      <Modal
        title={editingJob ? 'Edit Job' : 'Create Job'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Job Title"
            rules={[{ required: true, message: 'Please enter job title' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter job description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="requiredSkills"
            label="Required Skills (comma separated)"
          >
            <Input placeholder="Python, JavaScript, React" />
          </Form.Item>
          
          <Form.Item
            name="experienceLevel"
            label="Experience Level"
            initialValue="Mid"
            rules={[{ required: true, message: 'Please select experience level' }]}
          >
            <Select placeholder="Select experience level">
              <Select.Option value="Entry">Entry Level</Select.Option>
              <Select.Option value="Mid">Mid Level</Select.Option>
              <Select.Option value="Senior">Senior Level</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobManagement;
