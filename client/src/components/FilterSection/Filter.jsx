import React from 'react'
import './FilterSection.css'
import filterIcon from "../../assets/svgs/filter-outline.svg"


const Filter = () => {

    return (
        <div>
            <div className="filter-section row">
            {/* Filter Section */}
            <div className="col-md-12 filter-container">
              <div className="card shadow-sm p-4 bg-white rounded">

                <div className="box-header d-flex">
                  <h4 className="filter-title mb-3">FILTER</h4>
                  <img className="filter-icon"src={filterIcon} alt="Filter Icon" />
                </div>
                

                {/* Search Filter */}
                <div className="form-group mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a tag"
                  />
                </div>

                {/* Date Filter */}
                <div className="filter-group mb-4">
                  <label className="filter-label mb-2">DATE</label>
                  <div className="date-picker mb-2">
                    <label>From</label>
                    <input type="date" className="form-control"/>
                  </div>
                  <div className="date-picker">
                    <label>Until</label>
                    <input type="date" className="form-control" />
                  </div>
                </div>

                {/* Type Filter */}
                <div className="filter-group mb-4">
                  <label className="filter-label mb-2">TYPE</label>
                  <div className="form-check-group ">
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">Virtual</label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">Face-to-face</label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">Reunion</label>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="filter-group mb-4">
                  <label className="filter-label mb-2">CATEGORY</label>
                  <div className="form-check-group">
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">Career</label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">Social</label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">Faculty</label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">
                        Student Engagement
                      </label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">Service</label>
                    </div>
                  </div>
                </div>

                {/* Organization Filter */}
                <div className="filter-group">
                  <label className="filter-label mb-2">ORGANIZATION</label>
                  <div className="form-check-group">
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">
                        PUP Alumni Association
                      </label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label">
                        College of Science
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );

};

export default Filter;
