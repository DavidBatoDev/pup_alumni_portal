import React, { useState } from 'react';
import './DiscussionTableThread.css';

const tag_colors = [
  '#FF5733', // Red
  '#33FF57', // Green
  '#3357FF', // Blue
  '#FF33A5', // Pink
  '#FFA533', // Orange
  '#A533FF', // Purple
  '#33FFF0', // Cyan
];

const DiscussionTableThread = ({ thread }) => {
  const [vote, setVote] = useState(null); // null: no vote, 'up': upvoted, 'down': downvoted
  const [voteCount, setVoteCount] = useState(thread?.up_votes - thread?.down_votes || 0);

  // Handles the vote button click
  const handleVote = (newVote) => {
    if (newVote === 'downvote' && voteCount === 0) {
      // Prevent downvote if votes are 0
      return;
    }
  
    if (vote === newVote) {
      // Undo the current vote
      setVote(null);
      setVoteCount((prev) => Math.max(0, newVote === 'upvote' ? prev - 1 : prev + 1));
    } else {
      // Switching votes or applying a new vote
      setVote(newVote);
      setVoteCount((prev) => {
        if (newVote === 'upvote') {
          // If switching from downvote to upvote
          return vote === 'downvote' ? prev + 1 : prev + 1;
        } else {
          // If switching from upvote to downvote
          return vote === 'upvote' ? prev - 1 : Math.max(0, prev - 1);
        }
      });
    }
  };

  const getColorByTagId = (tagId) => {
    const index = tagId % tag_colors.length;
    return tag_colors[index];
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
          <div className="d-flex flex-wrap gap-2">
            {thread?.tags.map((tag) => (
              <div key={tag.tag_id} className='d-flex justify-content-start align-items-center tag-container'>
                <i className="fa-solid fa-2xs fa-circle" style={{ color: getColorByTagId(tag.tag_id) }}></i>
                <p className="thread-tag">{tag.name}</p>
              </div>
            ))}
          </div>
        </div>
      </td>

      {/* Thread Replies */}
      <td>
        <p className='thread-num'>{thread?.comments}</p>
      </td>

      {/* Thread Views */}
      <td>
        <p className='thread-num'>{thread?.views}</p>
      </td>

      {/* Thread Activity */}
      <td>
        <p className='thread-num'>{thread?.updated_at}</p>
      </td>

      {/* Thread Interactions */}
      <td>
        <div className='btn-group vote-group' role="vote" aria-label="Vote Buttons">
          {/* Upvote Button */}
          <button
            className={`btn btn-primary upvote ${vote === 'upvote' ? 'active' : ''}`}
            onClick={() => handleVote('upvote')}
          >
            <i className="fas fa-up-long"></i>
          </button>

          {/* Display Vote Count with Dynamic Styling */}
          <button
            className={`btn vote-count ${vote}`}
            disabled
          >
            {voteCount}
          </button>

          {/* Downvote Button */}
          <button
            className={`btn btn-primary downvote ${vote === 'downvote' ? 'active' : ''}`}
            onClick={() => handleVote('downvote')}
          >
            <i className="fas fa-down-long"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DiscussionTableThread;
