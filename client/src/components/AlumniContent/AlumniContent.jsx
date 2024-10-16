import React from "react";
import searchIcon from "../../assets/svgs/search-outline.svg";
import "./AlumniContent.css";
import grid from "../../assets/svgs/grid-outline.svg";
import square from "../../assets/svgs/square-outline.svg";
import AlumniCards from "../AlumniCards/AlumniCards";

const AlumniContent = () => {
  return (
    <>
      <div className="container">
        <div className="alumni-card-container card p-4 shadow-sm">
          {/* Alumni Header */}
          <div className="d-flex mb-4 alumni-header">
            {/* Search Bar */}
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Connect with an alumni"
                aria-label="Connect with an alumni"
              />
              <button className="btn btn-outline-secondary">
                <img
                  className="search-icon"
                  src={searchIcon}
                  alt="Search Icon"
                />
              </button>
            </div>

            {/* Switch View Button */}
            <div className="switch-view-wrapper">
              <img src={square} alt="Square Icon" />
              <img src={grid} alt="Grid Icon" />
            </div>
          </div>

          {/* Alumni Main Cards */}
          <div className="alumni-main-cards">
            <AlumniCards />
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniContent;
