import React, { useState, useEffect } from 'react';
import './App.css';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import VoterLogin from './components/VoterLogin';
import PollList from './components/PollList';
import VotingEngine from './components/VotingEngine';
import ResultVisualization from './components/ResultVisualization';
import WinnerAnnouncement from './components/WinnerAnnouncement';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' or 'voter'
  const [polls, setPolls] = useState([]);
  const [voters, setVoters] = useState([]);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);
  const [winnerPoll, setWinnerPoll] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize admin account
  useEffect(() => {
    const initializeData = () => {
      const savedData = localStorage.getItem('pollMasterData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setPolls(parsedData.polls || []);
          setVoters(parsedData.voters || []);
          checkExpiredPolls(parsedData.polls || []);
        } catch (error) {
          console.error('Error loading data:', error);
          initializeDefaultData();
        }
      } else {
        initializeDefaultData();
      }
      setIsLoading(false);
    };

    initializeData();
    const interval = setInterval(checkExpiredPolls, 60000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (polls.length > 0 || voters.length > 0) {
      saveData();
    }
  });

  const initializeDefaultData = () => {
    // Create default admin
    const defaultAdmin = {
      id: 'admin1',
      username: 'admin',
      password: 'admin123',
      name: 'Administrator',
      role: 'admin'
    };

    // Create sample voters
    const sampleVoters = [
      { id: 'voter1', username: 'alice', password: 'alice123', name: 'Alice Johnson', avatar: '👩‍💼', hasVoted: {} },
      { id: 'voter2', username: 'bob', password: 'bob123', name: 'Bob Smith', avatar: '👨‍💻', hasVoted: {} },
      { id: 'voter3', username: 'carol', password: 'carol123', name: 'Carol Davis', avatar: '👩‍🎨', hasVoted: {} },
    ];

    // Create sample polls
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const samplePolls = [
      {
        id: 'poll1',
        question: 'What is your favorite programming language?',
        description: 'Choose the language you enjoy coding in the most',
        options: ['JavaScript', 'Python', 'Java', 'C++'],
        votes: [15, 12, 8, 5],
        totalVotes: 40,
        createdAt: now.toISOString(),
        endTime: tomorrow.toISOString(),
        createdBy: 'admin1',
        createdByName: 'Administrator',
        isExpired: false,
        voters: {}
      }
    ];

    setVoters(sampleVoters);
    setPolls(samplePolls);
    
    // Save to localStorage
    localStorage.setItem('pollMasterData', JSON.stringify({
      admin: defaultAdmin,
      voters: sampleVoters,
      polls: samplePolls
    }));
  };

  const saveData = () => {
    try {
      const dataToSave = {
        voters,
        polls,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('pollMasterData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const checkExpiredPolls = (pollList = polls) => {
    const now = new Date().getTime();
    let hasChanges = false;
    
    const updatedPolls = pollList.map(poll => {
      if (!poll.isExpired && new Date(poll.endTime).getTime() < now) {
        hasChanges = true;
        const winner = calculateWinner(poll);
        if (!poll.winner) {
          setWinnerPoll({ ...poll, winner });
          setShowWinnerAnnouncement(true);
          setTimeout(() => setShowWinnerAnnouncement(false), 5000);
        }
        return { ...poll, isExpired: true, winner };
      }
      return poll;
    });

    if (hasChanges) {
      setPolls(updatedPolls);
    }
  };

  const calculateWinner = (poll) => {
    if (!poll.votes || poll.totalVotes === 0) {
      return { type: 'no_votes' };
    }

    const maxVotes = Math.max(...poll.votes);
    const winnerIndices = poll.votes.reduce((indices, vote, index) => {
      if (vote === maxVotes) indices.push(index);
      return indices;
    }, []);

    if (winnerIndices.length === 1) {
      return {
        type: 'winner',
        optionIndex: winnerIndices[0],
        option: poll.options[winnerIndices[0]],
        votes: maxVotes,
        percentage: ((maxVotes / poll.totalVotes) * 100).toFixed(1)
      };
    } else {
      return {
        type: 'tie',
        options: winnerIndices.map(index => poll.options[index]),
        votes: maxVotes,
        percentage: ((maxVotes / poll.totalVotes) * 100).toFixed(1)
      };
    }
  };

  const handleAdminLogin = (adminUser) => {
    setUser(adminUser);
    setUserType('admin');
  };

  const handleVoterLogin = (voterUser) => {
    setUser(voterUser);
    setUserType('voter');
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    setCurrentPoll(null);
    setShowResults(false);
  };

  const createPoll = (pollData) => {
    if (userType !== 'admin') return;

    const endTime = new Date(pollData.endDate + 'T' + pollData.endTime);
    
    const newPoll = {
      id: 'poll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      question: pollData.question,
      description: pollData.description || '',
      options: pollData.options,
      votes: new Array(pollData.options.length).fill(0),
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      endTime: endTime.toISOString(),
      createdBy: user.id,
      createdByName: user.name,
      isExpired: false,
      voters: {}
    };
    
    setPolls(prev => [...prev, newPoll]);
    showNotification('✅ Poll created successfully!', 'success');
  };

  const createVoter = (voterData) => {
    if (userType !== 'admin') return;

    const newVoter = {
      id: 'voter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      username: voterData.username,
      password: voterData.password,
      name: voterData.name,
      avatar: getRandomAvatar(),
      hasVoted: {}
    };

    setVoters(prev => [...prev, newVoter]);
    showNotification('✅ Voter account created!', 'success');
  };

  const getRandomAvatar = () => {
    const avatars = ['👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🔧', '👩‍🏫', '👨‍🚀', '👩‍⚕️', '👨‍🍳'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const deleteVoter = (voterId) => {
    if (userType !== 'admin') return;
    setVoters(prev => prev.filter(v => v.id !== voterId));
    showNotification('🗑️ Voter deleted', 'info');
  };

  const deletePoll = (pollId) => {
    if (userType !== 'admin') return;
    setPolls(prev => prev.filter(p => p.id !== pollId));
    if (currentPoll?.id === pollId) {
      setCurrentPoll(null);
      setShowResults(false);
    }
    showNotification('🗑️ Poll deleted', 'info');
  };

  const handleVote = (pollId, optionIndex) => {
    if (userType !== 'voter') return false;

    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return false;

    const poll = polls[pollIndex];
    
    if (poll.isExpired) {
      showNotification('⏰ This poll has expired!', 'error');
      return false;
    }

    if (poll.voters?.[user.id]) {
      showNotification(`⚠️ You have already voted!`, 'warning');
      return false;
    }

    // Update poll votes
    const updatedPolls = [...polls];
    const updatedPoll = { ...poll };
    
    updatedPoll.votes[optionIndex] += 1;
    updatedPoll.totalVotes += 1;
    
    updatedPoll.voters = {
      ...updatedPoll.voters,
      [user.id]: {
        optionIndex,
        timestamp: new Date().toISOString(),
        userName: user.name,
        userAvatar: user.avatar
      }
    };

    // Update voter's hasVoted record
    const updatedVoters = voters.map(v => 
      v.id === user.id 
        ? { ...v, hasVoted: { ...v.hasVoted, [pollId]: true } }
        : v
    );

    updatedPolls[pollIndex] = updatedPoll;
    setPolls(updatedPolls);
    setVoters(updatedVoters);
    setCurrentPoll(updatedPoll);
    setShowResults(true);
    
    showNotification('✅ Vote recorded!', 'success');
    return true;
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const getFilteredPolls = () => {
    let filtered = polls;
    
    if (searchTerm) {
      filtered = filtered.filter(poll => 
        poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    switch(filter) {
      case 'active':
        filtered = filtered.filter(poll => !poll.isExpired);
        break;
      case 'expired':
        filtered = filtered.filter(poll => poll.isExpired);
        break;
      case 'voted':
        if (userType === 'voter') {
          filtered = filtered.filter(poll => poll.voters?.[user.id]);
        }
        break;
      default: break;
    }
    
    return filtered;
  };

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Show login if no user
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>👥 PollMaster</h1>
          <p className="auth-subtitle">Choose your role to continue</p>
          <div className="auth-buttons">
            <button onClick={() => setUserType('admin-login')} className="auth-btn admin">
              👑 Admin Login
            </button>
            <button onClick={() => setUserType('voter-login')} className="auth-btn voter">
              👤 Voter Login
            </button>
          </div>
          {userType === 'admin-login' && (
            <AdminLogin onLogin={handleAdminLogin} />
          )}
          {userType === 'voter-login' && (
            <VoterLogin voters={voters} onLogin={handleVoterLogin} />
          )}
        </div>
      </div>
    );
  }

  const filteredPolls = getFilteredPolls();

  return (
    <div className="app">
      {showWinnerAnnouncement && winnerPoll && (
        <WinnerAnnouncement poll={winnerPoll} onClose={() => setShowWinnerAnnouncement(false)} />
      )}

      <header className="app-header">
        <div className="header-content" onClick={() => {
          setCurrentPoll(null);
          setShowResults(false);
        }}>
          <h1 className="app-title">👥 PollMaster</h1>
          <p className="app-subtitle">
            {userType === 'admin' ? 'Administrator Panel' : 'Voter Portal'}
          </p>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Logout</span>
            <button onClick={handleLogout} className="logout-btn" title="Logout">➜]</button>
          </div>
        </div>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3>📋 Polls</h3>
          </div>

          <div className="sidebar-filters">
            <input
              type="text"
              placeholder="🔍 Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <div className="filter-chips">
              <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                All
              </button>
              <button className={`chip ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
                Active
              </button>
              <button className={`chip ${filter === 'expired' ? 'active' : ''}`} onClick={() => setFilter('expired')}>
                Expired
              </button>
              {userType === 'voter' && (
                <button className={`chip ${filter === 'voted' ? 'active' : ''}`} onClick={() => setFilter('voted')}>
                  Voted
                </button>
              )}
            </div>
          </div>

          <PollList 
            polls={filteredPolls} 
            onSelectPoll={setCurrentPoll}
            onDeletePoll={deletePoll}
            currentPollId={currentPoll?.id}
            currentUser={user}
            userType={userType}
          />
        </aside>

        <main className="main-content">
          {userType === 'admin' && !currentPoll && (
            <AdminDashboard 
              onCreatePoll={createPoll}
              onCreateVoter={createVoter}
              onDeleteVoter={deleteVoter}
              voters={voters}
              polls={polls}
            />
          )}

          {currentPoll && (
            <div className="poll-view">
              <div className="poll-header">
                <h2>{currentPoll.question}</h2>
                {currentPoll.description && <p className="description">{currentPoll.description}</p>}
                
                <div className="poll-meta">
                  <span className="meta-item">👥 {currentPoll.totalVotes || 0} votes</span>
                  <span className="meta-item">⏰ {new Date(currentPoll.endTime).toLocaleString()}</span>
                  {currentPoll.isExpired && <span className="meta-item expired">🏁 Ended</span>}
                </div>
              </div>

              {userType === 'voter' && !showResults ? (
                <VotingEngine 
                  poll={currentPoll}
                  onVote={handleVote}
                  hasVoted={!!currentPoll.voters?.[user.id]}
                  userVote={currentPoll.voters?.[user.id]}
                  onViewResults={() => setShowResults(true)}
                  currentUser={user}
                />
              ) : (
                <ResultVisualization 
                  poll={currentPoll}
                  userVote={currentPoll.voters?.[user.id]}
                  onBack={() => setShowResults(false)}
                  voters={Object.values(currentPoll.voters || {})}
                  userType={userType}
                />
              )}
            </div>
          )}

          {!currentPoll && userType === 'voter' && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>Welcome, {user.name}!</h3>
              <p>Select a poll from the sidebar to start voting</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;