import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const DiscussionTableThread = ({ thread, submitVote }) => {
  const [vote, setVote] = useState(thread?.user_vote || null); // null: no vote, 'upvote': upvoted, 'downvote': downvoted
  const [voteCount, setVoteCount] = useState(thread?.upvotes - thread?.downvotes || 0);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/discussions/${thread?.thread_id}`);
  };

  const handleVote = (newVote) => {
    if (vote === newVote) {
      setVote(null);
      setVoteCount((prev) => (newVote === 'upvote' ? prev - 1 : prev + 1));
      submitVote(thread?.thread_id, "null");
    } else {
      setVote(newVote);
      setVoteCount((prev) => {
        if (newVote === 'upvote') {
          return vote === 'downvote' ? prev + 2 : prev + 1;
        } else {
          return vote === 'upvote' ? prev - 2 : prev - 1;
        }
      });
      submitVote(thread?.thread_id, newVote);
    }
    console.log(thread?.thread_id, newVote);
  };

  const getColorByTagId = (tagId) => {
    const index = tagId % tag_colors.length;
    return tag_colors[index];
  };

  return (
    <tr className="discussion-table-thread" onClick={handleRowClick}>
      <td data-cell="image" className="image-td">
        {thread?.images && thread?.images.length > 0 ? (
          <div className="image-container">
            <img src={thread?.images[0].image_path} alt={thread?.title} className="img-fluid" />
          </div>
        ) : (
          <div className="w-100 h-100">
            <i className="fa-2x fa-regular fa-comments mx-auto"></i>
          </div>
        )}
      </td>
      <td data-cell="details" className="flex-grow-1">
        <div className="d-flex flex-column justify-content-between thread-details h-100">
          <h3 className="thread-title">{thread?.title}</h3>
          <p className="thread-author">{thread?.author?.name}</p>
          <div className="d-flex flex-wrap gap-2">
            {thread?.tags.map((tag) => (
              <div key={tag.tag_id} className="d-flex justify-content-start align-items-center tag-container">
                <i
                  className="fa-solid fa-circle fa-2xs"
                  style={{ color: getColorByTagId(tag.tag_id) }}
                ></i>
                <p className="thread-tag">{tag.name}</p>
              </div>
            ))}
          </div>
        </div>
      </td>
      <td data-cell="comments">
        <p className="thread-num">{thread?.comments?.length ?? 0}</p>
      </td>
      <td data-cell="views">
        <p className="thread-num">{thread?.views}</p>
      </td>
      <td data-cell="updated">
        <p className="thread-num">{thread?.updated_at}</p>
      </td>
      <td data-cell="votes">
        <div className="btn-group">
          <button
            className={`btn btn-primary upvote ${vote === 'upvote' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleVote('upvote');
            }}
          >
            <i className="fas fa-up-long"></i>
          </button>
          <button className={`btn vote-count ${vote}`}>{voteCount}</button>
          <button
            className={`btn btn-primary downvote ${vote === 'downvote' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleVote('downvote');
            }}
          >
            <i className="fas fa-down-long"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DiscussionTableThread;
