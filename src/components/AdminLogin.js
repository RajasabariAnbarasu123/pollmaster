import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check against stored admin or use default
    const storedData = JSON.parse(localStorage.getItem('pollMasterData') || '{}');
    const admin = storedData.admin || { username: 'admin', password: 'admin123', name: 'Administrator' };
    
    if (credentials.username === admin.username && credentials.password === admin.password) {
      onLogin(admin);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-login-form">
      <h2>Admin Login</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="login-btn">Login as Admin</button>
      <p className="demo-credentials">Demo: admin / admin123</p>
    </form>
  );
};

export default AdminLogin;