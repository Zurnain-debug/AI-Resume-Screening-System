import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Spin, message } from 'antd';
import { resultService, getApiErrorMessage } from '../services/apiService';

const CandidateRanking = ({ jobId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchRanking();
    }
  }, [jobId]);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const response = await resultService.getRanking(jobId);
      setData(response.data);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, 'Failed to fetch ranking');
      message.error(errorMessage);
      console.error('CandidateRanking fetchRanking error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!jobId) {
    return <Card>Please select a job to view candidate ranking</Card>;
  }

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Candidate Name',
      dataIndex: ['candidateId', 'name'],
      key: 'candidateName',
    },
    {
      title: 'Email',
      dataIndex: ['candidateId', 'email'],
      key: 'email',
    },
    {
      title: 'Match Score',
      dataIndex: 'percentageMatch',
      key: 'percentageMatch',
      render: (score) => (
        <Tag color={score >= 70 ? 'green' : score >= 40 ? 'orange' : 'red'}>
          {score}%
        </Tag>
      ),
    },
    {
      title: 'Matched Skills',
      dataIndex: 'matchedSkills',
      key: 'matchedSkills',
      render: (skills) => (
        <>
          {skills.map((skill) => (
            <Tag key={skill.skill} color="blue">{skill.skill}</Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Card title={`Candidate Ranking - ${data?.job?.title}`}>
        {data && (
          <div>
            <p>Total Applicants: {data.totalApplicants}</p>
            <p>Average Score: {data.averageScore}%</p>
            <Table columns={columns} dataSource={data.ranking} rowKey={(record) => record._id} />
          </div>
        )}
      </Card>
    </Spin>
  );
};

export default CandidateRanking;
