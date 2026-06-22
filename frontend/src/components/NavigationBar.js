import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { authService } from '../services/apiService';

const NavigationBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      authService.logout();
      onLogout();
      navigate('/');
    }
  };

  return (
    <header className="site-header">
      <div className="site-brand">
        <Link to="/" className="brand-logo">
          <span className="brand-mark">AI</span>
          <span>Resume Analyzer</span>
        </Link>
      </div>
      <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
        <Link to="#home" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="#features" onClick={() => setMenuOpen(false)}>Jobs</Link>
        <Link to="#upload" onClick={() => setMenuOpen(false)}>Upload Resume</Link>
        <Link to="#dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
      </nav>
      <div className="nav-actions">
        {user ? (
          <Dropdown menu={{ items: userMenu, onClick: handleMenuClick }} placement="bottomRight" trigger={['click']}>
            <Button type="text" className="profile-button">
              {user?.name || 'Account'}
            </Button>
          </Dropdown>
        ) : (
          <>
            <Button type="text" className="nav-button" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button className="btn btn-primary" onClick={() => navigate('/register')}>
              Signup
            </Button>
          </>
        )}
        <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <MenuOutlined />
        </button>
      </div>
    </header>
  );
};

export default NavigationBar;
