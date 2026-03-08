import React from 'react';
import './PollList.css';

const PollList = ({ polls, onSelectPoll, onDeletePoll, currentPollId, currentUser, userType }) => {
  const getTimeRemaining = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const distance = end - now;

    if (distance < 0) return 'Ended';
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return `${minutes}m left`;
  };

  const activePolls = polls.filter(p => !p.isExpired);
  const expiredPolls = polls.filter(p => p.isExpired);

  const PollCard = ({ poll }) => (
    <div
      className={`poll-card ${currentPollId === poll.id ? 'active' : ''} ${poll.isExpired ? 'expired' : ''}`}
      onClick={() => onSelectPoll(poll)}
    >
      <div className="poll-card-header">
        <h4>{poll.question}</h4>
        <div className="badges">
          {userType === 'voter' && poll.voters?.[currentUser?.id] && (
            <span className="badge voted">✓</span>
          )}
        </div>
      </div>

      <div className="poll-card-stats">
        <span>👥 {poll.totalVotes || 0}</span>
        <span>📝 {poll.options.length}</span>
      </div>

      <div className={`poll-card-time ${poll.isExpired ? 'expired' : ''}`}>
        {poll.isExpired ? '⏰ Ended' : `⏳ ${getTimeRemaining(poll.endTime)}`}
      </div>

      {poll.winner && poll.isExpired && (
        <div className="winner-info">
          🏆 {poll.winner.type === 'winner' ? poll.winner.option : 'Tie'}
        </div>
      )}

      {userType === 'admin' && (
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDeletePoll(poll.id);
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );

  return (
    <div className="poll-list">
      {polls.length === 0 ? (
        <div className="empty-polls">
          <div className="empty-icon">📊</div>
          <p>No polls yet</p>
          {userType === 'admin' && <p className="hint">Create your first poll!</p>}
        </div>
      ) : (
        <>
          {activePolls.length > 0 && (
            <div className="poll-section">
              <h5>Active Polls</h5>
              {activePolls.map(poll => <PollCard key={poll.id} poll={poll} />)}
            </div>
          )}
          
          {expiredPolls.length > 0 && (
            <div className="poll-section">
              <h5>Ended Polls</h5>
              {expiredPolls.map(poll => <PollCard key={poll.id} poll={poll} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PollList;