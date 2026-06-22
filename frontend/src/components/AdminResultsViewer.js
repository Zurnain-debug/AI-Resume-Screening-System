import React, { useState, useEffect } from 'react';
import { Table, Card, Spin, message, Tag, Button, Modal, Rate, Input, Select, Row, Col, Statistic, Progress } from 'antd';
import { resultService } from '../services/apiService';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined
} from '@ant-design/icons';

const AdminResultsViewer = ({ jobId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [adminRating, setAdminRating] = useState(0);
  const [candidateStatus, setCandidateStatus] = useState('new');

  useEffect(() => {
    if (jobId) {
      fetchResults();
    }
  }, [jobId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await resultService.getRanking(jobId);
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    new: 'blue',
    reviewing: 'purple',
    shortlisted: 'green',
    rejected: 'red',
    interview_scheduled: 'orange',
    offered: 'gold',
    hired: 'green'
  };

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank) => <strong>#{rank}</strong>
    },
    {
      title: 'Candidate Name',
      dataIndex: ['candidateId', 'name'],
      key: 'candidateName',
      render: (text) => text || 'Unknown'
    },
    {
      title: 'Email',
      dataIndex: ['candidateId', 'email'],
      key: 'email'
    },
    {
      title: 'Match Score',
      dataIndex: 'percentageMatch',
      key: 'percentageMatch',
      render: (score) => (
        <div>
          <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>
            {score}%
          </Tag>
          <Progress percent={score} size="small" style={{ width: '100px', marginTop: '4px' }} />
        </div>
      )
    },
    {
      title: 'Matched Skills',
      dataIndex: 'matchedSkills',
      key: 'matchedSkills',
      render: (skills) => (
        <div>
          {skills && skills.slice(0, 3).map((skill) => (
            <Tag key={skill.skill} color="blue">{skill.skill}</Tag>
          ))}
          {skills && skills.length > 3 && <Tag>+{skills.length - 3}</Tag>}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'candidateStatus',
      key: 'candidateStatus',
      render: (status) => (
        <Tag color={statusColors[status] || 'blue'}>
          {status.replace(/_/g, ' ').toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'adminRating',
      key: 'adminRating',
      render: (rating) => rating ? <Rate disabled value={rating} /> : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => openDetailsModal(record)}
        >
          Details
        </Button>
      )
    }
  ];

  const openDetailsModal = (record) => {
    setSelectedResult(record);
    setAdminNotes(record.adminNotes || '');
    setAdminRating(record.adminRating || 0);
    setCandidateStatus(record.candidateStatus || 'new');
    setModalVisible(true);
  };

  const handleUpdateResult = async () => {
    if (!selectedResult?._id) {
      message.error('No result selected');
      return;
    }

    try {
      await resultService.updateResult(selectedResult._id, {
        adminNotes,
        adminRating,
        candidateStatus
      });
      message.success('Candidate information updated successfully');
      setModalVisible(false);
      fetchResults();
    } catch (error) {
      message.error('Failed to update candidate information');
    }
  };

  return (
    <div className="admin-results-viewer">
      <Spin spinning={loading}>
        {data && (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Applicants"
                    value={data.totalApplicants}
                    prefix="👥"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Average Score"
                    value={data.averageScore}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Top Match"
                    value={data.ranking[0]?.percentageMatch || 0}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Shortlisted"
                    value={data.ranking?.filter(r => r.candidateStatus === 'shortlisted').length || 0}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="Candidate Ranking & Scores">
              <Table
                columns={columns}
                dataSource={data.ranking}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            </Card>
          </>
        )}
      </Spin>

      <Modal
        title={selectedResult?.candidateId?.name}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleUpdateResult}>
            Save Changes
          </Button>
        ]}
        width="90%"
        style={{ maxWidth: '800px' }}
      >
        {selectedResult && (
          <div className="result-detail-modal">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <h3>Score Breakdown</h3>
                <Row gutter={16}>
                  <Col xs={24} sm={12} md={8}>
                    <Card>
                      <Statistic
                        title="Overall Match"
                        value={selectedResult.percentageMatch}
                        suffix="%"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Card>
                      <Statistic
                        title="Content Similarity"
                        value={selectedResult.matchBreakdown?.content_similarity || 0}
                        suffix="%"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Card>
                      <Statistic
                        title="Skill Match"
                        value={selectedResult.matchBreakdown?.skill_match || 0}
                        suffix="%"
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <h3>Matched Skills</h3>
                <div>
                  {selectedResult.matchedSkills?.map((skill) => (
                    <Tag key={skill.skill} color="green" style={{ marginRight: '8px', marginBottom: '8px' }}>
                      {skill.skill} ({skill.confidence}%)
                    </Tag>
                  ))}
                </div>
              </Col>

              <Col span={24}>
                <h3>Missing Skills</h3>
                <div>
                  {selectedResult.missingSkills?.length > 0 ? (
                    selectedResult.missingSkills.map((skill) => (
                      <Tag key={skill} color="red" style={{ marginRight: '8px', marginBottom: '8px' }}>
                        {skill}
                      </Tag>
                    ))
                  ) : (
                    <p>No missing skills</p>
                  )}
                </div>
              </Col>

              <Col span={24}>
                <h3>Admin Rating</h3>
                <Rate value={adminRating} onChange={setAdminRating} />
              </Col>

              <Col span={24}>
                <h3>Candidate Status</h3>
                <Select
                  style={{ width: '100%' }}
                  value={candidateStatus}
                  onChange={setCandidateStatus}
                  options={[
                    { label: 'New', value: 'new' },
                    { label: 'Reviewing', value: 'reviewing' },
                    { label: 'Shortlisted', value: 'shortlisted' },
                    { label: 'Rejected', value: 'rejected' },
                    { label: 'Interview Scheduled', value: 'interview_scheduled' },
                    { label: 'Offered', value: 'offered' },
                    { label: 'Hired', value: 'hired' }
                  ]}
                />
              </Col>

              <Col span={24}>
                <h3>Admin Notes</h3>
                <Input.TextArea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this candidate..."
                />
              </Col>

              <Col span={24}>
                <Card>
                  <p><strong>Recommendation:</strong> {selectedResult.recommendedAction}</p>
                  <p><strong>Experience:</strong> {selectedResult.experienceYears} years</p>
                  <p><strong>Feedback:</strong> {selectedResult.feedback}</p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminResultsViewer;
