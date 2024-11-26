import React from 'react';
import './CircularLoader.css';

const CircularLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="custom-loader" />
      </div>
    </div>
  );
};

export default CircularLoader;
