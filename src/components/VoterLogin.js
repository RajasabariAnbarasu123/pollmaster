import React, { useState } from 'react';
import './VoterLogin.css';

const VoterLogin = ({ voters, onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const voter = voters.find(
      v => v.username === credentials.username && v.password === credentials.password
    );

    if (voter) {
      onLogin(voter);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="voter-login-form">
      <h2>Voter Login</h2>
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
      <button type="submit" className="login-btn">Login to Vote</button>
    </form>
  );
};

export default VoterLogin;