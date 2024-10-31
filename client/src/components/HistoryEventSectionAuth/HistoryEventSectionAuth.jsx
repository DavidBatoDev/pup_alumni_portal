// src/components/HistoryEventSectionAuth/HistoryEventSectionAuth.jsx

import React, { useState, useRef, useEffect } from 'react';
import UserEventListing from '../UserEvents/UserEventListing';
import EventsFilterSection from '../EventsFilterSection/EventsFilterSection';
import './HistoryEventSectionAuth.css';
import searchIcon from "../../assets/svgs/search-outline.svg";
import menuIcon from "../../assets/svgs/menu-outline.svg";
import { Link } from 'react-router-dom';
import HistoryEventListing from '../HistoryEventListing/HistoryEventListing';

const HistoryEventSectionAuth = ({ events }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;
    const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(false);
    const filterRef = useRef(null);
    const [filters, setFilters] = useState({
        searchTerm: '',
        startDate: '',
        endDate: '',
        types: [],
        categories: [],
        organizations: []
    });
    const [maxVisibleCategories, setMaxVisibleCategories] = useState(4);
    const categories = ['Career', 'Social', 'Science', 'Computer', 'Education', 'Technology'];


    const toggleFilterSection = () => setIsFilterSectionVisible(!isFilterSectionVisible);

    const updateMaxVisibleCategories = () => {
        const screenWidth = window.innerWidth;
        setMaxVisibleCategories(screenWidth < 400 ? 1 : screenWidth < 600 ? 2 : screenWidth < 768 ? 3 : 4);
    };

    useEffect(() => {
        updateMaxVisibleCategories();
        window.addEventListener('resize', updateMaxVisibleCategories);
        return () => window.removeEventListener('resize', updateMaxVisibleCategories);
    }, []);

    const handleCategoryClick = (category) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            categories: prevFilters.categories.includes(category)
                ? prevFilters.categories.filter((cat) => cat !== category)
                : [...prevFilters.categories, category],
        }));
    };

    const filteredEvents = events.filter((event) => {
        const matchesSearch = filters.searchTerm
            ? event.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
            : true;

        const matchesType = filters.types.length
            ? filters.types.includes(event.type)
            : true;

        const matchesCategory = filters.categories.length
            ? filters.categories.includes(event.category)
            : true;

        const matchesOrganization = filters.organizations.length
            ? filters.organizations.includes(event.organization)
            : true;

        const matchesDate = filters.startDate && filters.endDate
            ? new Date(event.date) >= new Date(filters.startDate) &&
              new Date(event.date) <= new Date(filters.endDate)
            : true;

        return matchesSearch && matchesType && matchesCategory && matchesOrganization && matchesDate;
    });

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    return (
        <div className="container">
            <div className="events-card-container card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4 event-header">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for an event"
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
                        />
                        <button className="btn btn-outline-secondary">
                            <img className="search-icon" src={searchIcon} alt="Search Icon" />
                        </button>
                    </div>

                    <div className="filter-search-section">
                        <div className="filter-search-categories">
                            {categories.slice(0, maxVisibleCategories).map((category) => (
                                <div
                                    key={category}
                                    className={`filter-search ${filters.categories.includes(category) ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>

                        <div className="filter-search-all" onClick={toggleFilterSection}>
                            <img src={menuIcon} alt="Menu Icon" />
                            <div className="filter-search">All</div>
                        </div>
                    </div>

                    <div className="filter-event-wrapper">
                        <h3 className="text-muted">
                            Previous Events: <span className="text-danger">{filteredEvents.length}</span>
                        </h3>
                    </div>
                </div>

                <div className="row">
                    {currentEvents.map((event, index) => (
                        <div key={index} className="col-12">
                            <HistoryEventListing eventData={event} />
                        </div>
                    ))}
                </div>

                {currentPage === totalPages && (
                    <div className="d-flex justify-content-center mt-4">
                        <Link to={`/events/events-history`} className="view-event-history">
                            View Events History
                        </Link>
                    </div>
                )}

                <div className="pagination-container d-flex justify-content-center mt-2">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {isFilterSectionVisible && (
                <div ref={filterRef} className="filter-section-overlay slide-in">
                    <EventsFilterSection filters={filters} onFilterChange={handleFilterChange} />
                </div>
            )}
            {isFilterSectionVisible && (
                <div className="overlay-background" onClick={() => setIsFilterSectionVisible(false)}></div>
            )}
        </div>
    );
};

export default HistoryEventSectionAuth;
