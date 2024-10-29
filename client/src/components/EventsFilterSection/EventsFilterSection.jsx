import React, { useState, useEffect } from 'react';
import './EventsFilterSection.css';
import filterIcon from "../../assets/svgs/filter-outline.svg";

const EventsFilterSection = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters); // Local state to handle changes before applying

  // Handle changes in search, date, and checkbox filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleCheckboxChange = (e, group) => {
    const { name, checked } = e.target;
    setLocalFilters((prevFilters) => {
      const groupValues = prevFilters[group];
      const updatedGroupValues = checked ? [...groupValues, name] : groupValues.filter((val) => val !== name);
      return { ...prevFilters, [group]: updatedGroupValues };
    });
  };

  // Automatically apply filters whenever the user changes the input
  useEffect(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  return (
    <div>
      <div className="filter-section">
        <div className="col-md-12 filter-container">
          <div className="card shadow-sm p-4 bg-white rounded">
            <div className="box-header d-flex">
              <h4 className="filter-title mb-3">FILTER</h4>
              <img className="filter-icon" src={filterIcon} alt="Filter Icon" />
            </div>

            {/* Search Filter */}
            <div className="form-group mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search for a tag"
                name="searchTerm"
                value={localFilters.searchTerm}
                onChange={handleInputChange}
              />
            </div>

            {/* Date Filter */}
            <div className="filter-group mb-4">
              <label className="filter-label mb-2">DATE</label>
              <div className="date-picker mb-2">
                <label>From</label>
                <input type="date" className="form-control" name="startDate" value={localFilters.startDate} onChange={handleInputChange} />
              </div>
              <div className="date-picker">
                <label>Until</label>
                <input type="date" className="form-control" name="endDate" value={localFilters.endDate} onChange={handleInputChange} />
              </div>
            </div>

            {/* Type Filter */}
            <div className="filter-group mb-4">
              <label className="filter-label mb-2">TYPE</label>
              <div className="form-check-group ">
                {['Virtual', 'Face-to-face', 'Reunion'].map((type) => (
                  <div className="form-check d-flex align-items-center" key={type}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={type}
                      checked={localFilters.types.includes(type)}
                      onChange={(e) => handleCheckboxChange(e, 'types')}
                    />
                    <label className="form-check-label">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group mb-4">
              <label className="filter-label mb-2">CATEGORY</label>
              <div className="form-check-group">
                {['Career', 'Social', 'Faculty', 'Student Engagement', 'Service'].map((category) => (
                  <div className="form-check d-flex align-items-center" key={category}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={category}
                      checked={localFilters.categories.includes(category)}
                      onChange={(e) => handleCheckboxChange(e, 'categories')}
                    />
                    <label className="form-check-label">{category}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization Filter */}
            <div className="filter-group">
              <label className="filter-label mb-2">ORGANIZATION</label>
              <div className="form-check-group">
                {['PUP Alumni Association', 'College of Science'].map((organization) => (
                  <div className="form-check d-flex align-items-center" key={organization}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={organization}
                      checked={localFilters.organizations.includes(organization)}
                      onChange={(e) => handleCheckboxChange(e, 'organizations')}
                    />
                    <label className="form-check-label">{organization}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsFilterSection;
