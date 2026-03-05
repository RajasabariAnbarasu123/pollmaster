import React, { useState } from 'react';
import './ResultVisualization.css';

const ResultVisualization = ({ poll, userVote, onBack, voters, userType }) => {
  const [showVoters, setShowVoters] = useState(false);
  const totalVotes = poll.totalVotes || 0;

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const winnerIndex = totalVotes > 0 
    ? poll.votes.indexOf(Math.max(...poll.votes)) 
    : -1;

  return (
    <div className="results">
      <div className="results-header">
        <h3>Results</h3>
        <span className="total-votes">Total: {totalVotes}</span>
      </div>

      {poll.winner && poll.isExpired && (
        <div className="winner-banner">
          <span className="trophy">🏆</span>
          <span>
            {poll.winner.type === 'winner' 
              ? `${poll.winner.option} wins with ${poll.winner.percentage}%`
              : `Tie: ${poll.winner.options.join(' vs ')}`}
          </span>
        </div>
      )}

      {totalVotes === 0 ? (
        <div className="no-votes">
          <div className="no-votes-icon">🗳️</div>
          <p>No votes yet</p>
        </div>
      ) : (
        <div className="results-list">
          {poll.options.map((option, index) => {
            const percentage = calculatePercentage(poll.votes[index]);
            const isWinner = index === winnerIndex;

            return (
              <div key={index} className="result-item">
                <div className="result-label">
                  <div className="option-info">
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                    {isWinner && <span className="winner-badge">👑</span>}
                    {userVote?.optionIndex === index && <span className="your-vote">✓</span>}
                  </div>
                  <span className="vote-count">{poll.votes[index]} ({percentage}%)</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${isWinner ? 'winner' : ''}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {userType === 'admin' && voters.length > 0 && (
        <button className="toggle-voters" onClick={() => setShowVoters(!showVoters)}>
          {showVoters ? 'Hide' : 'Show'} Voters ({voters.length})
        </button>
      )}

      {showVoters && userType === 'admin' && (
        <div className="voters-list">
          {voters.map((voter, i) => (
            <div key={i} className="voter-item">
              <span>{voter.userAvatar}</span>
              <span>{voter.userName}</span>
              <span className="voter-time">{new Date(voter.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onBack} className="back-btn">
        ← Back
      </button>
    </div>
  );
};

export default ResultVisualization;