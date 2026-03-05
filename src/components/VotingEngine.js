import React from 'react';
import './VotingEngine.css';

const VotingEngine = ({ poll, onVote, hasVoted, userVote, onViewResults, currentUser }) => {
  if (hasVoted) {
    return (
      <div className="voted-state">
        <div className="check-icon">✓</div>
        <h3>You've voted, {currentUser.name}!</h3>
        <p>You chose: <strong>{poll.options[userVote.optionIndex]}</strong></p>
        <p className="vote-time">{new Date(userVote.timestamp).toLocaleString()}</p>
        <button onClick={onViewResults} className="view-results-btn">
          View Results
        </button>
      </div>
    );
  }

  return (
    <div className="voting-engine">
      <h3>Cast your vote</h3>
      <div className="options-grid">
        {poll.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onVote(poll.id, index)}
            className="vote-option"
            disabled={poll.isExpired}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
      {poll.isExpired && <p className="expired-message">⏰ This poll has ended</p>}
    </div>
  );
};

export default VotingEngine;