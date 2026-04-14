import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Space, message } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';

const { Header } = Layout;

const NavigationBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: user?.name || 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      authService.logout();
      onLogout();
      message.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <Header style={{ background: '#001529', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        Resume Screening System
      </div>
      <Dropdown menu={{ items: userMenu, onClick: handleMenuClick }} placement="bottomRight">
        <Button type="text" style={{ color: 'white' }}>
          {user?.name || 'User'} <UserOutlined />
        </Button>
      </Dropdown>
    </Header>
  );
};

export default NavigationBar;
