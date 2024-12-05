import React, { useState, useRef } from 'react';
import UserEventListing from '../UserEvents/UserEventListing';
import EventsFilterSection from '../EventsFilterSection/EventsFilterSection';
import './EventAuth.css';
import menuIcon from "../../assets/svgs/menu-outline.svg";
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import noevent from '/noevent.svg'

const EventAuth = ({ events, isTabletView, maxVisibleCategories, toggleFilterSection, filters, setFilters, handleFilterChange }) => {
    const [currentPage, setCurrentPage] = useState(1); // State for managing the current page
    const eventsPerPage = 3; // Number of events to display per page

    const categories = ['Career', 'Social', 'Faculty', 'Student Engagement', 'Service'];

    // Handle click events for category selection
    const handleCategoryClick = (category) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            categories: prevFilters.categories.includes(category)
                ? prevFilters.categories.filter((cat) => cat !== category)
                : [...prevFilters.categories, category],
        }));
    };

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / eventsPerPage) || 1;

    // Handle page change in pagination
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search functionality
    const handleSearch = (searchTerm) => {
        handleFilterChange({ ...filters, searchTerm });

    };

    return (
        <div className="event-auth-container">
            <div className="events-card-container card p-4 shadow-sm">
                <div className="event-header flex-md-nowrap flex-wrap d-flex flex-row justify-content-md-between justify-content-center align-items-center gap-2">
                    {/* Search Bar */}
                    <SearchBar onSearch={handleSearch} placeholder="Search for an event" buttonVisible={true}/>

                    {/* Filter Search Section with Categories (Visible only on Mobile) */}
                    {isTabletView && (
                        <div className="filter-search-section d-flex align-items-center justify-content-between gap-2">
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
                                <i className="fa-solid fa-filter"></i>
                                <div className="filter-search">All</div>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Events Count */}
                    <div className="filter-event-wrapper">
                        <h3 className="text-muted">
                            Upcoming Events: <span className="text-danger">{events.length}</span>
                        </h3>

                        {/* Render link inside filter-event-wrapper for mobile */}
                        {isTabletView && currentPage === totalPages && (
                            <Link to={`/events/events-history`} className="view-event-history">
                                View Events History
                            </Link>
                        )}
                    </div>
                </div>

                {/* Event Listings */}
                <div className="row">
                    {currentEvents.map((event, index) => (
                        <div key={index} className="col-12">
                            {events.length >= 1 &&  <UserEventListing eventData={event} />}
                            {events.length == 0 && <h1 src={noevent} alt="No Event" />}
                        </div>
                    ))}
                </div>

                {/* Render link outside for non-mobile view */}
                {!isTabletView && currentPage === totalPages && (
                    <div className="d-flex justify-content-center mt-4">
                        <Link to={`/events/events-history`} className="view-event-history">
                            View Events History
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                <div className="pagination-container d-flex justify-content-center mt-4">
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
        </div>
    );
};

export default EventAuth;
