import React from 'react';
import RegisterComponent from '../components/RegisterComponent';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card } from 'antd';

const RegisterPage = ({ onSuccess }) => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    onSuccess();
    navigate('/');
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={20} md={12} lg={8}>
        <Card>
          <RegisterComponent onSuccess={handleRegisterSuccess} />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Already have an account?</p>
            <Button type="link" onClick={() => navigate('/login')}>
              Login here
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;
