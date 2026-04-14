import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { authService } from '../services/apiService';

const LoginComponent = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [errorDetails, setErrorDetails] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorDetails(null);
    try {
      const response = await authService.login(values);
      authService.setToken(response.data.token);
      message.success('Login successful! Redirecting...');
      setTimeout(() => onSuccess(), 500);
    } catch (error) {
      const errorData = error.response?.data;
      
      // Display detailed error information
      if (errorData) {
        setErrorDetails({
          error: errorData.error,
          reason: errorData.reason,
          suggestion: errorData.suggestion,
          code: errorData.code
        });
        message.error(errorData.error);
      } else if (error.message === 'Network Error') {
        setErrorDetails({
          error: 'Network Error',
          reason: 'Unable to connect to the server. Please check your internet connection',
          code: 'NETWORK_ERROR'
        });
        message.error('Network Error: Cannot reach the server');
      } else {
        setErrorDetails({
          error: 'Login Failed',
          reason: error.message || 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        });
        message.error('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Login" style={{ maxWidth: '450px', margin: '50px auto' }}>
      {errorDetails && (
        <Alert
          message={errorDetails.error}
          description={
            <div style={{ marginTop: '8px' }}>
              <p><strong>Reason:</strong> {errorDetails.reason}</p>
              {errorDetails.suggestion && (
                <p><strong>Suggestion:</strong> {errorDetails.suggestion}</p>
              )}
              {process.env.NODE_ENV === 'development' && (
                <p style={{ color: '#999', fontSize: '12px' }}>Code: {errorDetails.code}</p>
              )}
            </div>
          }
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '20px' }}
          closable
          onClose={() => setErrorDetails(null)}
        />
      )}
      
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Invalid email format' }
          ]}
        >
          <Input placeholder="john@example.com" maxLength={100} />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        
        <Button type="primary" htmlType="submit" block loading={loading} size="large">
          Login
        </Button>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
        <small>Don't have an account? Register first</small>
      </div>
    </Card>
  );
};

export default LoginComponent;
