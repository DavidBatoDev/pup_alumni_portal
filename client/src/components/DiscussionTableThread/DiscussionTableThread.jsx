import React, { useState } from 'react';
import './DiscussionTableThread.css';

const DiscussionTableThread = ({ thread }) => {
  const [vote, setVote] = useState(null); // null: no vote, 'up': upvoted, 'down': downvoted
  const [voteCount, setVoteCount] = useState(thread?.votes || 0);

  // Handles the upvote button click
  const handleUpvote = () => {
    if (vote === 'up') {
      // If already upvoted, undo the vote
      setVote(null);
      setVoteCount((prev) => prev - 1);
    } else {
      // Apply upvote; adjust vote count based on current state
      setVote('up');
      setVoteCount((prev) => (vote === 'down' ? prev + 2 : prev + 1));
    }
  };

  // Handles the downvote button click
  const handleDownvote = () => {
    if (vote === 'down') {
      // If already downvoted, undo the vote
      setVote(null);
      setVoteCount((prev) => prev + 1);
    } else {
      // Apply downvote; adjust vote count based on current state
      setVote('down');
      setVoteCount((prev) => (vote === 'up' ? prev - 2 : prev - 1));
    }
  };

  return (
    <tr className="discussion-table-thread">
      {/* Thread Image */}
      <td>
        <div className="image-container">
          <img src="https://placehold.co/16x9" alt={thread?.title} className="thread-image" />
        </div>
      </td>

      {/* Thread Title Detail */}
      <td className="flex-grow-1">
        <div className="d-flex flex-column justify-content-between thread-details h-100">
          <div className='d-flex flex-column m-0'>
            <h3 className="thread-title">{thread?.title}</h3>
            <p className="thread-author">{thread?.author}</p>
          </div>
          <div className="d-flex flex-wrap">
            {thread?.tags.map((tag, index) => (
              <p key={index} className="thread-tag">{tag}</p>
            ))}
          </div>
        </div>
      </td>

      {/* Thread Replies */}
      <td>
        <p className='thread-num'>{thread?.replies}</p>
      </td>

      {/* Thread Views */}
      <td>
        <p className='thread-num'>{thread?.views}</p>
      </td>

      {/* Thread Activity */}
      <td>
        <p className='thread-num'>{thread?.activity}</p>
      </td>

      {/* Thread Interactions */}
      <td>
        <div className='btn-group vote-group' role="vote" aria-label="Vote Buttons">
          {/* Upvote Button */}
          <button
            className={`btn btn-primary upvote ${vote === 'up' ? 'active' : ''}`}
            onClick={handleUpvote}
          >
            <i className="fas fa-up-long"></i>
          </button>

           {/* Display Vote Count with Dynamic Styling */}
           <button
              className={`btn vote-count ${vote === 'up' ? 'upvote' : vote === 'down' ? 'downvote' : ''}`}
              disabled
            >
              {voteCount}
            </button>

          {/* Downvote Button */}
          <button
            className={`btn btn-primary downvote ${vote === 'down' ? 'active' : ''}`}
            onClick={handleDownvote}
          >
            <i className="fas fa-down-long"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DiscussionTableThread;
