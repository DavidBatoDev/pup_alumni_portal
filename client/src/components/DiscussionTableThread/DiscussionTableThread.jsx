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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track if mobile view
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

  // Update `isMobile` based on window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="discussion-table-thread mobile-layout">
        <div className="image-container">
          {thread?.images && thread?.images.length > 0 ? (
            <img src={thread.images[0].image_path} alt={thread.title} className="thread-image" />
          ) : (
            <i className="fa-2x fa-regular fa-comments mx-auto"></i>
          )}
        </div>

        <div>

          <div className='d-flex justify-content-center'>
            <h3 className="thread-title">{thread?.title}</h3>        
          </div>

          <div className='d-flex justify-content-center'>
            <p className="thread-author">{thread?.author?.name}</p>
          </div>
          
          <div className="tags">
            <div className="tag-container">
              {thread?.tags.map((tag) => (
                <div key={tag.tag_id} className="tag-container">
                  <i
                    className="fa-solid fa-circle fa-2xs"
                    style={{ color: getColorByTagId(tag.tag_id) }}
                  ></i>
                  <p className="thread-tag">{tag.name}</p>
                </div>
              ))}
            </div>
        </div>
        </div>
      
        <div className='d-flex justify-content-center gap-4'>
          <div className="thread-num">Replies 
            <p>{thread?.comments_count || 0}</p>
          </div>

          <div className="thread-num">Views
            <p>{thread?.views}</p>
          </div>

          <div className="thread-num">Last Activity
            <p>{thread?.updated_at}</p>
          </div>
         
        </div>

        <div className='voting-group'>
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
          </div>
        </div>
       
    );
  }

  // Desktop Layout (Table Row)
  return (
    <tr className="discussion-table-thread" onClick={handleRowClick}>
      <td>
        {thread?.images && thread?.images.length > 0 ? (
          <div className="image-container">
            <img src={thread?.images[0].image_path} alt={thread?.title} className="thread-image" />
          </div>
        ) : (
          <div className="w-100 h-100">
            <i className="fa-2x fa-regular fa-comments mx-auto"></i>
          </div>
        )}
      </td>
      <td className="flex-grow-1">
        <div className="d-flex flex-column justify-content-between thread-details h-100">
          <h3 className="thread-title">{thread?.title}</h3>
          <p className="thread-author">{thread?.author?.name}</p>
          <div className="tags">
            {thread?.tags.map((tag) => (
              <div key={tag.tag_id} className="tag-container">
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
      <td>
        <p className="thread-num">{thread?.comments_count || 0}</p>
      </td>
      <td>
        <p className="thread-num">{thread?.views}</p>
      </td>
      <td>
        <p className="thread-num">{thread?.updated_at}</p>
      </td>
      <td>
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
