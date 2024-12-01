import { useState } from 'react';
import './DiscussionComment.css';
import { Link } from 'react-router-dom';

const DiscussionComment = ({ comment, replies, submitReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);  // State to toggle replies visibility

  const handleReply = (e) => {
    e.preventDefault();
    submitReply(replyContent, comment?.comment_id);
    setReplyContent('');
    setShowReplyBox(false);
  }

  return (
    <div className='comment-card d-flex p-3 gap-2 w-100'>
      <div className='d-flex flex-column align-items-center gap-4'>
        <Link to={`/profile/${comment?.author?.alumni_id}`} >
          <img
            src={comment?.author?.profile_picture || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
            className="img-fluid rounded-circle alumni-profile-img mr-2"
            alt=""
          />
        </Link>
        {replies?.length > 0 && <div className='reply-line'></div>}
      </div>

      <div className='d-flex flex-column gap-1 w-100'>
        <Link style={{ textDecoration: 'none' }} to={`/profile/${comment?.author?.alumni_id}`}>
          <p className="comment-author">{comment?.author?.name}</p>
        </Link>
        <p className="comment-num">{comment?.created_at}</p>
        <p className="comment-text crimson-text">{comment?.content}</p>

        <div className="reply-wrapper">
          
        </div>
        {/* Reply Box  */}
        {showReplyBox ? (
          <form onSubmit={handleReply} className="w-100 h-50">
            <input
              type="text"
              className="form-control py-0 px-3 reply-input flex-grow-1 raleway"
              placeholder="Write a reply..."
              autoFocus
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className='d-flex justify-content-end gap-2 mb-3 mt-1'>
              <button className='btn btn-cancel btn-light btn-primary raleway' onClick={() => setShowReplyBox(false)}>Cancel</button>
              <button type="submit" className='btn btn-submit-reply btn-light btn-primary raleway'>Reply</button>
            </div>
          </form>
        ) :
        // Reply Button
        (
        <div className="reply-container">
          <button onClick={() => setShowReplyBox(true)} className='btn btn-reply btn-light btn-primary raleway'>Reply</button>
        </div>)
        }

        {/* Reply Section */}
        {replies?.length > 0 && (
          <div className="replies">
            <button 
              className="btn btn-toggle-replies" 
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? 'Hide  ' : 'Show '}
            </button>
            
            {showReplies && (
              <div className="reply-list">
                {replies?.map((reply) => (
                  <DiscussionComment 
                    key={reply.comment_id} 
                    comment={reply} 
                    replies={reply.replies} 
                    submitReply={submitReply}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default DiscussionComment;
