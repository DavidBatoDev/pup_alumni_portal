import React, { useState, useEffect } from 'react';
import './EventsFilterSection.css';
import SearchBar from '../SearchBar/SearchBar';

const EventsFilterSection = ({ filters = {}, onFilterChange = () => { } }) => {
  const defaultFilters = {
    searchTerm: '',
    startDate: '',
    endDate: '',
    types: [],
    categories: [],
    organizations: [],
    ...filters,
  };

  const [localFilters, setLocalFilters] = useState(defaultFilters);

  // Function to reset filters
  const resetFilters = () => {
    const resetState = {
      searchTerm: '',
      startDate: '',
      endDate: '',
      types: [],
      categories: [],
      organizations: []
    };
    setLocalFilters(resetState);
    onFilterChange(resetState); // Ensure the parent component is notified of the reset
  };

  // State to manage collapse
  const [isCollapsed, setIsCollapsed] = useState({
    search: true,
    date: true,
    type: true,
    category: true,
    organization: true,
  });

  // Handle changes in search, date, and checkbox filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleCheckboxChange = (e, group) => {
    const { name, checked } = e.target;
    setLocalFilters((prevFilters) => {
      const groupValues = prevFilters[group] || [];
      const updatedGroupValues = checked
        ? [...groupValues, name]
        : groupValues.filter((val) => val !== name);
      return { ...prevFilters, [group]: updatedGroupValues };
    });
  };

  const handleSearch = (searchTerm) => {
    setLocalFilters((prevFilters) => ({ ...prevFilters, searchTerm }));
  };

  // Toggle collapse state
  const toggleCollapse = (section) => {
    setIsCollapsed((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // Automatically apply filters whenever the user changes the input
  useEffect(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  return (
    <div className="filter-section">
      <div className="filter-events-container col-md-12 w-90 p-4 d-flex flex-column gap-1 justify-content-between">

        {/* Header */}
        <div className="box-header d-flex">
          <p className="filter-title crimson-text mb-3">Filters</p>
          <button className="btn btn-filter fa-solid filter-icon fa-filter-circle-xmark" onClick={resetFilters}></button>
        </div>

        {/* Search Filter */}
        <div className="filter-group">
          <button
            onClick={() => toggleCollapse('search')}
            className={`btn btn-link ${!isCollapsed.search ? 'active' : ''}`}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            Search
          </button>
          {!isCollapsed.search && (
            <div className='w-100 mb-2'>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for an event"
                buttonVisible={false}
              />
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="filter-group">
          <button
            onClick={() => toggleCollapse('date')}
            className={`btn btn-link ${!isCollapsed.date ? 'active' : ''}`}
          >
            <i className="fa-regular fa-calendar"></i>
            Date
          </button>
          {!isCollapsed.date && (
            <div className="d-flex flex-column gap-2 w-100 mb-2">
              <div className="date-picker">
                <label className="filter-label-sm raleway">From</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={localFilters.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="date-picker">
                <label className="filter-label-sm">Until</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={localFilters.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <button
            onClick={() => toggleCollapse('type')}
            className={`btn btn-link ${!isCollapsed.type ? 'active' : ''}`}
          >
            <i className="fa-solid fa-list"></i>
            Type
          </button>
          {!isCollapsed.type && (
            <div className="d-flex flex-column gap-2 w-100 mb-2">
              <div className="form-check-group">
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
          )}
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <button
            onClick={() => toggleCollapse('category')}
            className={`btn btn-link ${!isCollapsed.category ? 'active' : ''}`}
          >
            <i className="fa-solid fa-sharp fa-users-line"></i>
            Category
          </button>
          {!isCollapsed.category && (
            <div className="d-flex flex-column gap-2 w-100">
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
          )}
        </div>

        {/* Organization Filter */}
        <div className="filter-group">
          <button
            onClick={() => toggleCollapse('organization')}
            className={`btn btn-link ${!isCollapsed.organization ? 'active' : ''}`}
          >
            <i className="fa-regular fa-building"></i>
            Organization
          </button>
          {!isCollapsed.organization && (
            <div className=" d-flex flex-column gap-2 w-100 mb-2">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsFilterSection;
