import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar/Navbar';
import BannerSmall from '../../components/Banner/BannerSmall';
import bannerImage from '../../assets/images/alumnimage.jpg';
import './Alumni.css';

import grid from "../../assets/svgs/grid-outline.svg";
import menuIcon from "../../assets/svgs/menu-outline.svg";
import AlumniCards from "../../components/AlumniCards/AlumniCards";
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import api from "../../api";
import SearchBar from "../../components/SearchBar/SearchBar";
import MainFooter from "../../components/MainFooter/MainFooter";

const Alumni = () => {
  const [viewMode, setViewMode] = useState("list"); // State for the active view mode
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const profilesPerPage = 6; // Number of profiles to show per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAlumniProfiles = async () => {
      try {
        setLoading(true);

        const response = await api.get('/api/alumni');
        setProfiles(response.data.data);
      } catch (error) {
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniProfiles();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (profile.current_job_title && profile.current_job_title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="position-relative">
      {loading && <CircularLoader />}
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <Navbar />
      <BannerSmall bannerImage={bannerImage} bannerTitle="Alumnis" breadcrumbs={[
        { label: 'Home', link: '/' },
        { label: 'Alumni', link: '/alumni' },
      ]} />
      <div className="background alumni-background"></div>

      <div className="alumni-section glass">
        <div className="alumni-header">
          <h2>Ready to Connect? The alumni network is waiting!</h2>
          <h5>
            Reconnect with old friends, make new connections, and unlock opportunities with our vibrant alumni network.
          </h5>
        </div>



        {!loading && !error && (
          <div className="alumni-card-container d-flex card shadow-sm">


            {/* SearchBar and View Buttons */}
            <div className="d-flex mb-md-1 py-3 alumni-action-bar flex-wrap justify-content-center align-items-center gap-2 gap-md-3">
              <div className="flex-grow-1">
                <SearchBar onSearch={handleSearch} placeholder="Connect with an alumni" buttonVisible={true} />
              </div>
              <div className="switch-view-wrapper d-md-flex d-none">
                <div className={`view-img ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
                  <img src={menuIcon} alt="List Icon" />
                </div>
                <div className={`view-img ${viewMode === "grid" ? "active" : ""}`}onClick={() => setViewMode("grid")}>
                  <img src={grid} alt="Grid Icon" />
                </div>
              </div>
            </div>

            {/* Alumni Main Cards */}
            <div className="alumni-main-cards">
              <AlumniCards viewMode={viewMode} profiles={currentProfiles} loading={loading} />
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  {/* Previous Button */}
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      aria-label="Previous"
                      disabled={currentPage === 1}
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={`page-item ${index + 1 === currentPage ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  {/* Next Button */}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      aria-label="Next"
                      disabled={currentPage === totalPages}
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
      <MainFooter />
    </div>
  );
};

export default Alumni;
