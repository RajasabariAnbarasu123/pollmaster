import React, { useState } from 'react';
import PollCreation from './PollCreation';
import './AdminDashboard.css';

const AdminDashboard = ({ onCreatePoll, onCreateVoter, onDeleteVoter, voters, polls }) => {
  const [activeTab, setActiveTab] = useState('create-poll');
  const [newVoter, setNewVoter] = useState({ username: '', password: '', name: '' });

  const handleCreateVoter = (e) => {
    e.preventDefault();
    if (newVoter.username && newVoter.password && newVoter.name) {
      onCreateVoter(newVoter);
      setNewVoter({ username: '', password: '', name: '' });
    }
  };
 

  return (
    <div className="admin-dashboard">
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'create-poll' ? 'active' : ''}`}
          onClick={() => setActiveTab('create-poll')}
        >
          📝 Create Poll
        </button>
        <button 
          className={`tab ${activeTab === 'manage-voters' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage-voters')}
        >
          👥 Manage Voters
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'create-poll' && (
          <PollCreation onCreatePoll={onCreatePoll} />
        )}

        {activeTab === 'manage-voters' && (
          <div className="manage-voters">
            <h3>Create New Voter</h3>
            <form onSubmit={handleCreateVoter} className="create-voter-form">
              <input
                type="text"
                placeholder="Full Name"
                value={newVoter.name}
                onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={newVoter.username}
                onChange={(e) => setNewVoter({ ...newVoter, username: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newVoter.password}
                onChange={(e) => setNewVoter({ ...newVoter, password: e.target.value })}
                required
              />
              <button type="submit" className="create-btn">Create Voter</button>
            </form>

            <h3>Existing Voters</h3>
            <div className="voters-list">
              {voters.map(voter => (
                <div key={voter.id} className="voter-card">
                  <div className="voter-info">
                    <span className="voter-avatar">{voter.avatar}</span>
                    <div>
                      <strong>{voter.name}</strong>
                      <p>@{voter.username}</p>
                    </div>
                  </div>
                  <button 
                    className="delete-voter-btn"
                    onClick={() => onDeleteVoter(voter.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <div>
                  <h4>Total Polls</h4>
                  <p className="stat-number">{polls.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div>
                  <h4>Total Voters</h4>
                  <p className="stat-number">{voters.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🗳️</span>
                <div>
                  <h4>Total Votes</h4>
                  <p className="stat-number">
                    {polls.reduce((acc, poll) => acc + (poll.totalVotes || 0), 0)}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <div>
                  <h4>Active Polls</h4>
                  <p className="stat-number">
                    {polls.filter(p => !p.isExpired).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;