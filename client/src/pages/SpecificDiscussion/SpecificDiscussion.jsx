import { useState, useEffect, useRef } from 'react';
import useNode from '../../hooks/useNode';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Add this line to import Bootstrap JS

import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/discussionimage.jpg';
import Navbar from '../../components/Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from "../../api";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CircularLoader from '../../components/CircularLoader/CircularLoader';

import DiscussionNavbar from '../../components/DiscussionNavbar/DiscussionNavbar';
import DiscussionCardThread from '../../components/DiscussionCardThread/DiscussionCardThread';
import DiscussionComment from '../../components/DiscussionComment/DiscussionComment';
import ModalContainer from '../../components/ModalContainer/ModalContainer';

import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import 'swiper/css';

import "./SpecificDiscussion.css";

const SpecificDiscussion = () => {
  SwiperCore.use([Navigation, Pagination]);
  const [thread, setThread] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(false);

  const { threadId } = useParams();
  const [newComment, setNewComment] = useState('');
  const commentSectionRef = useRef(null);

  const [commentTree, setCommentTree] = useState([]);
  const { insertNode, editNode, deleteNode, buildTree } = useNode();

  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  const handleOpenImage = (images) => {
    setCurrentImages(images);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setCurrentImages([]);
  };

  const scrollToCommentSection = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({
        behavior: 'smooth', // Ensures smooth scrolling
        block: 'start', // Aligns to the top of the container
      });
    }
  };

  const submitVote = async (threadId, vote) => {
    try {
      const response = await api.post(`api/threads/${threadId}/vote`, { vote: vote })

      if (response.status !== 201 && response.status !== 200) {
        // Handle HTTP errors
        const errorData = response.data
        const message = errorData.message ?? "An error has occurred.";
        const errorMsg = errorData.error ?? '';
        console.error(`Error voting thread ${threadId}: ${vote} -> ${message} : ${errorMsg}`);
        setError(`${message} ${errorMsg}`);
        return;
      }

      if (response.status === 201) {
        console.log(`Thread ID: ${threadId} has been successfully ${vote}d`);
      }

      if (response.status === 200) {
        console.log(`Vote for Thread ID ${threadId} has been nullified`);
      }
    }
    catch (error) {
      console.error('Network error or no response:', error);
      setError("Network error or no response from the server.");
    }
  };

  // Fetch threads
  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/threads/${threadId}`);

        const thread = response.data.data;

        const formattedThread = {
          ...thread,
          updated_at: timeAgo(thread.updated_at),
          created_at: timeAgo(thread.created_at),
        }
        setThread(formattedThread);
        console.log("Threads:", formattedThread);

        const formattedComments = thread.comments.map((comment) => ({
          ...comment,
          created_at: timeAgo(comment.created_at),
        }));
        setComments(formattedComments);
        console.log('Comments:', commentTree)

        // Build the initial comment tree
        const tree = buildTree(formattedComments);
        setCommentTree(tree);

      } catch (error) {
        setError(error.message);
        console.error(`Error fetching thread ID: ${thread.id}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreadData();
  }, [threadId]);

  // Create new comment or reply
  const createCommentOrReply = async (comment, parent_comment_id = null) => {
    try {
      setCommentLoading(true);
      const body = { content: comment };
      if (parent_comment_id !== null) {
        body.parent_comment_id = parent_comment_id;
      }

      const response = await api.post(`/api/threads/${threadId}/comment`, body);
      console.log(response.data);

      const newComment = response.data.data;

      const formattedComment = {
        ...newComment,
        created_at: timeAgo(newComment.created_at),
        replies: []
      };

      setComments((prevComments) => [...prevComments, formattedComment]);

      // Update the comment tree
      setCommentTree((prevTree) =>
        parent_comment_id
          ? prevTree.map((root) => insertNode(root, parent_comment_id, formattedComment))
          : [...prevTree, formattedComment]
      );
    } catch (error) {
      setError(error.message);
      console.error('Error creating comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 60 * 60 * 24 * 365,
      month: 60 * 60 * 24 * 30,
      week: 60 * 60 * 24 * 7,
      day: 60 * 60 * 24,
      hour: 60 * 60,
      minute: 60,
      second: 1,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(diffInSeconds / value);
      if (count >= 1) {
        return `${count}${key.charAt(0)} ago`;
      }
    }
    return 'just now';
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createCommentOrReply(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="specific-discussions-page">
      <Navbar />
      <BannerSmall
        bannerTitle={'Discussions'}
        bannerImage={bannerImage}
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'Discussions', link: '/discussions' },
          { label: thread?.title || '...', link: "" },
        ]}
      />
      <div className="background discussion-background"></div>

      {loading && <CircularLoader />}
      {error && (
        <CustomAlert
          message={error}
          severity="error"
          onClose={() => setError(false)}
        />
      )}

      {/* Content Container */}
      <div className="container-fluid glass specific-discussion-content">
        <DiscussionNavbar viewMode={'card'} />
        <div className="row specific-discussion-container">

          {/* DiscussionCardThread Post */}
          {!loading && <DiscussionCardThread thread={thread} handleComment={scrollToCommentSection} submitVote={submitVote} handleOpenImage={handleOpenImage} />}

          {/* Comments Input */}
          <form onSubmit={handleCommentSubmit} className="w-100 mb-3" ref={commentSectionRef}>
            <input
              type="text"
              className="form-control py-0 px-3 raleway specific-discussion-search flex-grow-1"
              placeholder="Add a Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </form>

          {/* Comments Section */}
          <div className='d-flex flex-column gap-2'>
            {commentTree.length > 0 ? (
              commentTree.map(comment => (
                <DiscussionComment key={comment.comment_id} comment={comment} replies={comment.replies} submitReply={createCommentOrReply} />
              ))
            ) : (
              <div className="d-flex justify-content-center align-items-center w-100">
                <p className="text-center">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* View Images Modal */}
      <ModalContainer
        showModal={showImageModal}
        title={"Showing " + currentImages.length + " pictures"}
        closeModal={closeImageModal}
        hideHeader={true}
        hidePadding={true}
      >
        <Swiper
          navigation
          pagination={{ clickable: true }} // Ensure pagination is enabled and clickable
          className="h-100 w-100 position-relative swiper-container"
        >
          {currentImages.map((image, index) => (
            <SwiperSlide className="d-flex " key={index}>
              <div className="swiper-slide-background" style={{ backgroundImage: `url(${image?.image_path})` }}></div>
              <img src={image.image_path} className="d-block w-100 img-fluid swiper-slide-image" alt={`Slide ${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </ModalContainer>

      <MainFooter />
    </div>
  );
};

export default SpecificDiscussion;