import { useState, useEffect } from 'react';

import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/discussionimage.jpg';
import Navbar from '../../components/Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from "../../api";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CircularLoader from '../../components/CircularLoader/CircularLoader';

import DiscussionNavbar from '../../components/DiscussionNavbar/DiscussionNavbar';
import DiscussionActionBar from '../../components/DiscussionActionBar/DiscussionActionBar';
import DiscussionTableHeader from '../../components/DiscussionTableHeader/DiscussionTableheader';
import DiscussionTableThread from '../../components/DiscussionTableThread/DiscussionTableThread';
import DiscussionCardThread from '../../components/DiscussionCardThread/DiscussionCardThread';
import DiscussionThreadModal from '../../components/DiscussionThreadModal/DiscussionThreadModal'; // Import DiscussionThreadModal

import "./Discussions.css";

const Discussions = () => {
  const [threads, setThreads] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Best');
  const [viewMode, setViewMode] = useState('compact');
  const [error, setError] = useState(false);

  // Modal visibility state
  const [showModal, setShowModal] = useState(false);

  // Fetch threads
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/threads');
        console.log(response.data);

        const formattedThreads = response.data.data.map((thread) => ({
          ...thread,
          updated_at: timeAgo(thread.updated_at),
        }));

        setThreads(formattedThreads);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

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

  const handleCreateThread = (threadData) => {
    const now = new Date().toISOString(); // Get the current timestamp
    console.log('New thread created:', threadData);

    // Add new thread locally
    setThreads((prevThreads) => [
      ...prevThreads,
      {
        ...threadData,
        tags: threadData.tags.map((tag) => ({ name: tag, tag_id: Math.random() })), // Ensure tags have name and tag_id
        author: "You", // Replace with current user's name or author data
        updated_at: timeAgo(now), // Use the `timeAgo` function to calculate the time difference
        views: 0, // Default view count
        up_votes: 0, // Default votes
        down_votes: 0,
        comments: 0, // Default comment count
      },
    ]);

    setShowModal(false); // Close modal
  };


  return (
    <div className="discussions-page">
      <Navbar />
      <BannerSmall
        bannerTitle={'Discussions'}
        bannerImage={bannerImage}
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'Discussions', link: '/discussions' },
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
      <div className="container-fluid glass discussion-content">
        <DiscussionNavbar viewMode={viewMode} />
        <div className="row discussion-container">
          <div className="col-md-12">
            {/* Pass modal trigger to the action bar */}
            <DiscussionActionBar
              filter={filter}
              setFilter={setFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onCreate={() => setShowModal(true)} // Open modal
            />
            {viewMode === 'compact' ? (
              <table className="thread-list table table-hover mt-3">
                <DiscussionTableHeader />
                <tbody className="thread-list">
                  {threads?.map((thread) => (
                    <DiscussionTableThread
                      key={thread.id}
                      thread={thread}
                      voteThread={() => console.log('Vote thread')} // Placeholder
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="card-list d-flex flex-column py-4 gap-4">
                {threads?.map((thread) => (
                  <>
                    <DiscussionCardThread key={thread.id} thread={thread} />
                    <hr />
                  </>
                ))}
                {/* Put a pagination feature here  */}
                <p className='mx-auto text-secondary raleway'>Looks like you’re all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discussion Thread Modal */}
      <DiscussionThreadModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        onCreateThread={handleCreateThread} // Pass handler
      />

      <MainFooter />
    </div>
  );
};

export default Discussions;