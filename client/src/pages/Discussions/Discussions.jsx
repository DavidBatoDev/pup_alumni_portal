import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/discussionimage.jpg';
import Navbar from '../../components/Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from "../../api";
import CustomAlert from "../../components/CustomAlert/CustomAlert"; // Import CustomAlert
import CircularLoader from '../../components/CircularLoader/CircularLoader';

import DiscussionNavbar from '../../components/DiscussionNavbar/DiscussionNavbar';
import DiscussionActionBar from '../../components/DiscussionActionBar/DiscussionActionBar';
import DiscussionTableHeader from '../../components/DiscussionTableHeader/DiscussionTableheader';
import DiscussionTableThread from '../../components/DiscussionTableThread/DiscussionTableThread';
import DiscussionCardThread from '../../components/DiscussionCardThread/DiscussionCardThread';

import "./Discussions.css";

const Discussions = () => {
  const [threads, setThreads] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Best');
  const [viewMode, setViewMode] = useState('compact');
  const [error, setError] = useState(false);

  // Fetch Thread
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/threads');
        console.log(response.data);

        const formattedThreads = response.data.data.map(thread => ({
          ...thread,
          author: thread.author.first_name + ' ' + thread.author.last_name,
          updated_at: timeAgo(thread.updated_at)
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
      second: 1
    };

    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(diffInSeconds / value);
      if (count >= 1) {
        return `${count}${key.charAt(0)} ago`;
      }
    }
    return 'just now';
  };

  // Vote a thread if thread has been voted
  const voteThread = async (threadId, vote) => {
    try {
      const response = await api.post(`/api/threads/${threadId}/vote`, { vote: vote });
      console.log(response.data);
    } catch (error) {
      console.error('Error voting thread:', error);
      setError(error);
    }
  };

  useEffect(() => {
    console.log(`Filter changed to: ${filter}`);
  }, [filter]);

  useEffect(() => {
    console.log(`ViewMode changed to: ${viewMode}`);
  }, [viewMode]);

  return (
    <div className="discussions-page">
      <Navbar />
      <BannerSmall bannerTitle={'Discussions'} bannerImage={bannerImage}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "Discussions", link: "/discussions" },
        ]}
      />
      <div className='background discussion-background'></div>

      {loading && <CircularLoader />}
      {error && (
        <CustomAlert message={error}
          severity="error"
          onClose={() => setError(false)}
        />
      )}


      {/* Content Container */}
      <div className="container-fluid glass discussion-content">
        <DiscussionNavbar viewMode={viewMode} />
        <div className="row discussion-container">
          <div className="col-md-12">
            <DiscussionActionBar filter={filter} setFilter={setFilter} viewMode={viewMode} setViewMode={setViewMode} />
            {
              // Compact View (Table)
              viewMode == 'compact' ?
                (
                  <table className="thread-list table table-hover mt-3">
                    <DiscussionTableHeader />
                    <tbody className="thread-list">
                      {threads?.map((thread) => (<DiscussionTableThread key={thread.id} thread={thread} voteThread={voteThread} />))}
                    </tbody>
                  </table>
                )

                // Card View (Flex + Cards)
                : viewMode == 'card' &&
                <div className='card-list d-flex flex-column py-4 gap-4'>
                  {threads?.map((thread) => (
                    <DiscussionCardThread key={thread.id} thread={thread} />
                  ))}
                </div>
            }
          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  )
}

export default Discussions;