import "./DiscussionActionBar.css";

const DiscussionActionBar = ({ filter, setFilter, viewMode, setViewMode, onCreate }) => {
  // Handles filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Handles view mode change
  const handleViewChange = (event) => {
    setViewMode(event.target.value);
  };

  return (
    <div className="discussion-actionbar mt-2">
      <div className="d-flex gap-2 action-bar-container">
        {/* Dropdowns */}
        <div className="discussion-selection-container">
          <select
            className="form-select py-0 discussion-selection"
            onChange={handleFilterChange}
            style={{ width: `${0.7 * filter.length + 4}rem` }}
          >
            <option selected value="best">
              Best
            </option>
            <option value="relevancy">Relevancy</option>
            <option value="latest">Latest</option>
            <option value="mostReplies">Most Replies</option>
            <option value="unanswered">Unanswered</option>
            <option value="archived">Archived</option>
          </select>

          <select
            className="form-select py-0 discussion-selection"
            onChange={handleViewChange}
            style={{ width: `${0.5 * viewMode.length + 5}rem` }}
          >
            <option selected value="compact">
              Compact
            </option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Search bar and "Create" button */}
        <div className="search-and-button-container">
          <input
            type="text"
            className="form-control py-0 discussion-search flex-grow-1"
            placeholder="Search"
          />
          <button className="btn btn-primary py-0" onClick={onCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionActionBar;
