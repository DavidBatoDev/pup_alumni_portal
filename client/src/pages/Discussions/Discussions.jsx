import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/discussionimage.jpg';
import Navbar from '../../components/Navbar/Navbar';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from "../../api";
import CustomAlert from "../../components/CustomAlert/CustomAlert"; // Import CustomAlert

import DiscussionNavbar from '../../components/DiscussionNavbar/DiscussionNavbar';
import DiscussionActionBar from '../../components/DiscussionActionBar/DiscussionActionBar';
import DiscussionTableHeader from '../../components/DiscussionTableHeader/DiscussionTableheader';
import DiscussionTableThread from '../../components/DiscussionTableThread/DiscussionTableThread';
import DiscussionCardThread from '../../components/DiscussionCardThread/DiscussionCardThread';

import "./Discussions.css";

const Discussions = () => {
  const [threads, setThreads] = useState([
    {
      id: 1,
      title: "Thread 1",
      body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum accusamus necessitatibus repellat amet, laudantium, tenetur expedita incidunt harum, consequatur iusto ab ut. Sed, et quae adipisci voluptatum alias doloribus omnis?",
      author: "Author 1",
      tags: ["Moderators"],
      replies: 10,
      views: 100,
      activity: '1w',
      votes: 10,
    },
    {
      id: 2,
      title: "Thread 2",
      body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum accusamus necessitatibus repellat amet, laudantium, tenetur expedita incidunt harum, consequatur iusto ab ut. Sed, et quae adipisci voluptatum alias doloribus omnis?",
      author: "Author 2",
      tags: ["PUP Event", "Social Talk"],
      replies: 10,
      views: 100,
      activity: '2d',
      votes: 10,
    }
  ]);
  const [sortBy, setSortBy] = useState();
  const [filter, setFilter] = useState('Best');
  const [viewMode, setViewMode] = useState('compact');
  const [error, setError] = useState(false);

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
                      {threads.map((thread) => (<DiscussionTableThread key={thread.id} thread={thread} />))}
                    </tbody>
                  </table>
                )

                // Card View (Flex + Cards)
                : viewMode == 'card' &&
                <div className='card-list d-flex flex-column py-4 gap-4'>
                  {threads.map((thread) => (
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