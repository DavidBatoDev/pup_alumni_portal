import React, { useState } from 'react';
import './DiscussionCardThread.css';

const DiscussionCardThread = ({ thread }) => {
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
    <div className="p-3 discussion-card-thread">
      <div className="d-flex flex-column">
        {/* Thread Metadata */}
        <div className='d-flex gap-2 w-100 mb-2 align-bottom align-items-center'>
          <p className="thread-author">{thread?.author}</p>
          <span>&middot;</span>
          <p className='thread-num'>Active {thread?.activity} ago</p>
          <span>&middot;</span>
          <p className='thread-num'>{thread?.views} views</p>
        </div>
        
        {/* Thread Title */}
        <h3 className="thread-title mb-2">{thread?.title}</h3>

        {/* Thread Tags */}
        <div className="d-flex flex-wrap gap-2 mb-2">
          {thread?.tags.map((tag, index) => (
            <p key={index} className="thread-tag">{tag}</p>
          ))}
        </div>

        {/* Thread Body */}
        <p className="thread-body my-1">{thread?.body}</p>

        {/* Thread Image */}
        <div className="image-container">
          <img src="https://placehold.co/500x800" alt={thread?.title} className="thread-image" />
        </div>

        {/* Thread Actions */}
        <div className="thread-actions d-flex gap-2 mt-2">
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

          {/* Reply Button */}
          <a className="btn btn-reply d-inline-flex gap-2 align-items-center justify-content-center">
            <i className="fas fa-reply"></i>
            {thread?.replies}
          </a>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCardThread;
