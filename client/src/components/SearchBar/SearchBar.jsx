import React, { useState } from 'react';
import searchIcon from "../../assets/svgs/search-outline.svg";
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder, buttonVisible }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!buttonVisible) {
      onSearch(e.target.value);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar-container input-group">
      <input
        type="text"
        className="form-control py-0 discussion-search flex-grow-1"
        placeholder={placeholder || 'Search'}
        value={query}
        onChange={(e) => {handleInputChange(e)}}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      {buttonVisible && (
        <button className="btn btn-outline-secondary">
          <img className="search-icon" src={searchIcon} onClick={handleSearch} alt="Search Icon" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;