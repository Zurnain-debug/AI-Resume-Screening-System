import React, { useState, useEffect } from 'react';
import { Card, Spin, message, Row, Col, Statistic, Pie } from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { resultService } from '../services/apiService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = ({ jobId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchAnalytics();
    }
  }, [jobId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await resultService.getAnalytics(jobId);
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!jobId) {
    return <Card>Please select a job to view analytics</Card>;
  }

  const chartData = data?.distributionChart && {
    labels: data.distributionChart.labels,
    datasets: [
      {
        label: 'Number of Candidates',
        data: data.distributionChart.data,
        backgroundColor: [
          'rgba(75, 192, 75, 0.6)',
          'rgba(255, 193, 7, 0.6)',
          'rgba(244, 67, 54, 0.6)',
        ],
      },
    ],
  };

  return (
    <Spin spinning={loading}>
      <Card title="Analytics Dashboard">
        {data && (
          <>
            <Row gutter={16} style={{ marginBottom: '30px' }}>
              <Col span={6}>
                <Statistic title="Total Applicants" value={data.totalApplicants} />
              </Col>
              <Col span={6}>
                <Statistic title="Average Score" value={`${data.averageScore}%`} />
              </Col>
              <Col span={6}>
                <Statistic title="High Matches" value={data.highMatches} />
              </Col>
              <Col span={6}>
                <Statistic title="Medium Matches" value={data.mediumMatches} />
              </Col>
            </Row>

            {chartData && (
              <Card title="Score Distribution">
                <Bar data={chartData} />
              </Card>
            )}

            {data.topMatches && (
              <Card title="Top Matches" style={{ marginTop: '20px' }}>
                {data.topMatches.map((match, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <strong>{index + 1}. {match.candidateName}</strong> - Score: {match.score}%
                  </div>
                ))}
              </Card>
            )}
          </>
        )}
      </Card>
    </Spin>
  );
};

export default AnalyticsDashboard;
