import './DiscussionTableThread.css';

const DiscussionTableThread = ({ thread }) => {
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
          {/* <p className="thread-body">{thread.body}</p> */}
          <div className="d-flex flex-wrap">
            {thread?.tags.map((tag) => (
              <p className="thread-tag">{tag}</p>
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
          <button className='btn btn-primary upvote'>
            <i className="fas fa-up-long"></i>
          </button>
          <button className='btn' disabled>{thread?.votes}</button>
          <button className='btn btn-primary downvote'>
            <i className="fas fa-down-long"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DiscussionTableThread;