import './DiscussionComment.css';
import { Link } from 'react-router-dom';

const DiscussionComment = ({ comment, replies }) => {
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

        {replies?.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <DiscussionComment key={reply.id} comment={reply} replies={reply.replies} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DiscussionComment;