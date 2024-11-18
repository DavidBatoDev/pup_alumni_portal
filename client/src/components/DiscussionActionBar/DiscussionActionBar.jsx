import { useEffect, useState } from "react";
import "./DiscussionActionBar.css";

const DiscussionActionBar = ({filter, setFilter,  viewMode, setViewMode}) => {

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleViewchange = (event) => {
    setViewMode(event.target.value)
  }

  return (
    <div className="discussion-actionbar mt-2">
      <div className='d-flex gap-2'>
        {/* Filter Selection */}
        <select
          className="form-select py-0 discussion-selection"
          onChange={handleFilterChange}
          style={{ width: `${(0.7 * filter.length) + 4}rem` }}
        >
          <option selected value="best">Best</option>
          <option value="relevancy">Relevancy</option>
          <option value="latest">Latest</option>
          <option value="mostReplies">Most Replies</option>
          <option value="unanswered">Unanswered</option>
          <option value="archived">Archived</option>
        </select>

        {/* Views Selection */}
        <select
          className="form-select py-0 discussion-selection"
          onChange={handleViewchange}
          style={{ width: `${(0.5 * viewMode.length) + 5}rem` }}
        >
          <option selected value="compact">Compact</option>
          <option value="card">Card</option>
        </select>

        {/* Search Bar */}
        <input type="text" className="form-control py-0 discussion-search flex-grow-1" placeholder="Search" />

        {/* Add New Thread Button */}
        <button className="btn btn-primary py-0">Create</button>
      </div>
    </div>
  );
};

export default DiscussionActionBar;