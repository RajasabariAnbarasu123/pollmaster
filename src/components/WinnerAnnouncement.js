import React, { useEffect } from 'react';
import './WinnerAnnouncement.css';

const WinnerAnnouncement = ({ poll, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!poll.winner) return null;

  return (
    <div className="winner-overlay">
      <div className="winner-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="winner-icon">🏆</div>
        <h2>Poll Ended!</h2>
        <h3>{poll.question}</h3>
        
        {poll.winner.type === 'winner' && (
          <div className="winner-detail">
            <p className="winner-label">Winner</p>
            <div className="winner-option">{poll.winner.option}</div>
            <div className="winner-stats">
              <span>{poll.winner.votes} votes</span>
              <span>{poll.winner.percentage}%</span>
            </div>
          </div>
        )}

        {poll.winner.type === 'tie' && (
          <div className="winner-detail">
            <p className="winner-label">Tie</p>
            <div className="tie-options">
              {poll.winner.options.map((opt, i) => (
                <span key={i} className="tie-option">{opt}</span>
              ))}
            </div>
            <div className="winner-stats">
              <span>{poll.winner.votes} votes each</span>
              <span>{poll.winner.percentage}%</span>
            </div>
          </div>
        )}

        <div className="total-votes">Total: {poll.totalVotes} votes</div>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;