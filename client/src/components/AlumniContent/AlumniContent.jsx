import React, { useState, useEffect } from "react";
import searchIcon from "../../assets/svgs/search-outline.svg";
import grid from "../../assets/svgs/grid-outline.svg";
import menuIcon from "../../assets/svgs/menu-outline.svg";
import AlumniCards from "../AlumniCards/AlumniCards";
import CircularLoader from "../CircularLoader/CircularLoader"; // Import the loader
import "./AlumniContent.css";
import api from "../../api";

const AlumniContent = () => {

  const [viewMode, setViewMode] = useState("list"); // State for the active view mode
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const profilesPerPage = 6; // Number of profiles to show per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profiles, setProfiles] = useState([]);

  // Dummy Data (use this while you don't have actual data from the API)
  const dummyData = [
    // Your dummy data here...
  ];

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

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(profiles.length / profilesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="alumni-card-container card p-4 shadow-sm">
        {/* Alumni Header */}
        <div className="mb-4 alumni-header">
          {/* Search Bar */}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Connect with an alumni"
              aria-label="Connect with an alumni"
            />
            <button className="btn btn-outline-secondary">
              <img className="search-icon" src={searchIcon} alt="Search Icon" />
            </button>
          </div>

          {/* Switch View Button */}
          <div className="switch-view-wrapper">
            <div
              className={`view-img ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <img src={menuIcon} alt="List Icon" />
            </div>
            <div
              className={`view-img ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <img src={grid} alt="Grid Icon" />
            </div>
          </div>
        </div>

        {/* Alumni Main Cards */}
        {loading ? (
          // Display CircularLoader while loading
          <CircularLoader />
        ) : error ? (
          // Display an error message if something goes wrong
          <div className="alert alert-danger">Error: {error}</div>
        ) : (
          <>
            {/* Render Alumni Cards when data is ready */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default AlumniContent;
