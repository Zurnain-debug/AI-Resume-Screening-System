import React from 'react';
import LoginComponent from '../components/LoginComponent';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Card, Row, Col } from 'antd';

const LoginPage = ({ onSuccess }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    onSuccess();
    navigate('/');
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={20} md={12} lg={8}>
        <Card>
          <LoginComponent onSuccess={handleLoginSuccess} />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Don't have an account?</p>
            <Button type="link" onClick={() => navigate('/register')}>
              Register here
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
