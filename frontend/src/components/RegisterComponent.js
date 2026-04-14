import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, message, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { authService } from '../services/apiService';

const RegisterComponent = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [errorDetails, setErrorDetails] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorDetails(null);
    try {
      const response = await authService.register(values);
      authService.setToken(response.data.token);
      message.success('Registration successful! Welcome aboard!');
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
          error: 'Registration Failed',
          reason: error.message || 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        });
        message.error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Register New Account" style={{ maxWidth: '500px', margin: '30px auto' }}>
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
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: 'Please enter your full name' },
            { min: 2, message: 'Name must be at least 2 characters' }
          ]}
        >
          <Input placeholder="John Doe" maxLength={100} />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email Address"
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
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 6, message: 'Password must be at least 6 characters' },
            { max: 50, message: 'Password must be less than 50 characters' }
          ]}
        >
          <Input.Password placeholder="Minimum 6 characters" maxLength={50} />
        </Form.Item>
        
        <Form.Item
          name="role"
          label="Select Your Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Choose: HR Manager or Candidate">
            <Select.Option value="HR">HR Manager</Select.Option>
            <Select.Option value="Candidate">Candidate</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
        >
          {({ getFieldValue }) =>
            getFieldValue('role') === 'HR' ? (
              <Form.Item
                name="company"
                label="Company Name"
                rules={[
                  { required: true, message: 'Please enter your company name' },
                  { min: 2, message: 'Company name must be at least 2 characters' }
                ]}
              >
                <Input placeholder="Your Organization" maxLength={100} />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="Phone Number (Optional)"
          rules={[
            { 
              pattern: /^[0-9\-\+\(\)\s]*$/, 
              message: 'Please enter a valid phone number' 
            }
          ]}
        >
          <Input placeholder="+1 (555) 123-4567" maxLength={20} />
        </Form.Item>
        
        <Button type="primary" htmlType="submit" block loading={loading} size="large">
          Create Account
        </Button>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
        <small>Already have an account? Log in instead</small>
      </div>
    </Card>
  );
};

export default RegisterComponent;
