import './DiscussionCardThread.css';

const DiscussionCardThread = ({ thread }) => {
  return (
    <div className="p-3 discussion-card-thread">
      <div className="d-flex flex-column">
        <div className='d-flex gap-2 w-100 align-bottom'>
          <p className="thread-author">{thread?.author}</p>
          {/* <div className='flex-grow-1'></div> */}
          <span>&middot;</span>
          <p className='thread-num'>Active {thread?.activity} ago</p>
          <span>&middot;</span>
          <p className='thread-num'>{thread?.views} views</p>
        </div>
        <h3 className="thread-title mb-2">{thread?.title}</h3>
        <div className="d-flex flex-wrap gap-2">
          {thread?.tags.map((tag, index) => (
            <p key={index} className="thread-tag">{tag}</p>
          ))}
        </div>
        <p className="thread-body my-2">{thread?.body}</p>
        <div className="image-container">
          <img src="https://placehold.co/500x800" alt={thread?.title} className="thread-image" />
        </div>
        <div className="thread-actions d-flex gap-2 mt-2">
          <div className='btn-group vote-group' role="vote" aria-label="Vote Buttons">
            <button className='btn btn-primary upvote'>
              <i className="fas fa-up-long"></i>
            </button>
            <button className='btn' disabled>{thread?.votes}</button>
            <button className='btn btn-primary downvote'>
              <i className="fas fa-down-long"></i>
            </button>
          </div>

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