import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message, Modal, Tabs, Tag, Row, Col } from 'antd';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import axios from 'axios';

const SampleResumeGallery = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSampleResumes();
  }, []);

  const fetchSampleResumes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/samples');
      setSamples(response.data.samples || []);
    } catch (error) {
      message.error('Failed to fetch sample resumes');
    } finally {
      setLoading(false);
    }
  };

  const viewSampleResume = async (sampleId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/samples/${sampleId}`);
      setSelectedSample(response.data.resume);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to load sample resume');
    } finally {
      setLoading(false);
    }
  };

  const copySampleContent = () => {
    if (selectedSample) {
      navigator.clipboard.writeText(selectedSample.content);
      message.success('Resume content copied to clipboard!');
    }
  };

  return (
    <div className="sample-resume-gallery">
      <div className="gallery-header">
        <h2>Sample Resumes</h2>
        <p>View sample resumes to understand the format and create your own</p>
      </div>

      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {samples.map((sample) => (
            <Col key={sample.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="sample-card"
                onClick={() => viewSampleResume(sample.id)}
              >
                <div className="sample-card-content">
                  <h3>{sample.name}</h3>
                  <p className="role-tag">{sample.role}</p>
                  <p className="email">{sample.email}</p>
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: '12px' }}
                  >
                    View Resume
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <Modal
        title={selectedSample?.name}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={copySampleContent}>
            Copy Content
          </Button>,
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width="90%"
        style={{ maxWidth: '900px' }}
      >
        {selectedSample && (
          <div className="sample-resume-preview">
            <div className="resume-header">
              <h2>{selectedSample.name}</h2>
              <p>{selectedSample.email} | {selectedSample.phone}</p>
            </div>
            <div className="resume-content">
              {selectedSample.content.split('\n').map((line, idx) => (
                <p key={idx} style={{ whiteSpace: 'pre-wrap' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .sample-resume-gallery {
          padding: 24px;
        }

        .gallery-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .gallery-header h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .sample-card {
          text-align: center;
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .sample-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .sample-card-content h3 {
          margin: 12px 0 8px;
          font-size: 16px;
        }

        .role-tag {
          color: #1890ff;
          font-weight: 600;
          margin: 8px 0;
        }

        .email {
          color: #666;
          font-size: 12px;
        }

        .sample-resume-preview {
          max-height: 600px;
          overflow-y: auto;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .resume-header {
          text-align: center;
          margin-bottom: 24px;
          border-bottom: 1px solid #d9d9d9;
          padding-bottom: 16px;
        }

        .resume-content {
          line-height: 1.8;
          font-family: 'Courier New', monospace;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default SampleResumeGallery;
