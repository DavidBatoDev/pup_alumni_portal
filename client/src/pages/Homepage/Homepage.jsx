// src/pages/Homepage/Homepage.jsx
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className='homepage'>
      <Navbar />
      <Banner />
    </div>
  );
};

export default Homepage;
