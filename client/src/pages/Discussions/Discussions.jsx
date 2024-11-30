import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
import SearchBar from '../../components/SearchBar/SearchBar';

import "./Discussions.css";
import axios from 'axios';

const Discussions = () => {
  const [threads, setThreads] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Best');
  const [viewMode, setViewMode] = useState('compact');
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal visibility state
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

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

  // Submit vote for a thread
  const submitVote = async (threadId, vote) => {
    try {
      const response = await api.post(`api/threads/${threadId}/vote`, { vote: vote });

      if (response.status !== 201 && response.status !== 200) {
        // Handle HTTP errors
        const errorData = response.data;
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
    } catch (error) {
      console.error('Network error or no response:', error);
      setError("Network error or no response from the server.");
    }
  };

  // Format time ago from a date string
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

  // Handle thread creation
  const handleCreateThread = async (threadBody) => {
    console.log('New thread created (body):', threadBody);

    try {
      setLoading(true);
      const response = await axios.post('/api/threads',
        threadBody, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          }
        });

      if (response.status === 200 || response.status === 201) {
        // Get the new Thread Data from response
        const newThread = response.data.data;

        const formattedNewThread = { ...newThread, updated_at: timeAgo(newThread.updated_at) };

        console.log("Thread Created: ", formattedNewThread);

        // Add new thread locally and close modal
        setThreads((prevThreads) => [...prevThreads, formattedNewThread]);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('Error creating thread. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setThreads(threads); // Reset threads to show all
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread?.tags?.some(tag => tag.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    thread?.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="col-md-12 table-responsive">
            {/* Pass modal trigger to the action bar */}
            <DiscussionActionBar
              filter={filter}
              setFilter={setFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onCreate={() => setShowModal(true)} // Open modal
              onSearch={handleSearch} // Pass search handler
            />
            {viewMode === 'compact' ? (
              <table className="w-100 table table-sm table-hover mt-3">
                {/* Conditionally render the table header */}
                <DiscussionTableHeader />
                <tbody className="w-100">
                  {filteredThreads?.map((thread) => (
                    <DiscussionTableThread
                      key={thread.thread_id}
                      thread={thread}
                      submitVote={submitVote}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="card-list d-flex flex-column py-4 gap-4">
                {filteredThreads?.map((thread) => (
                  <>
                    <DiscussionCardThread
                      key={thread.thread_id}
                      thread={thread}
                      handleComment={() => navigate(`/discussions/${thread.thread_id}`)}
                      submitVote={submitVote}
                    />
                    <hr />
                  </>
                ))}
                {/* Put a pagination feature here */}
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
