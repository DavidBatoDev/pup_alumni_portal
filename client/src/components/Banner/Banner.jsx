// src/components/Banner/Banner.jsx
import React from 'react';
import './Banner.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Banner = () => {
  const { user } = useSelector((state) => state.user);


  return (
    <div className="banner">
        <div className="banner-content">
            <div className="d-flex flex-row gap-4">
              <h1 className='banner-hero-title'>
                <span className='key'>P</span>
                <span className='key'>U</span>
                <span className='key'>P</span>
              </h1>
              <h1 className='banner-hero-title'>
                <span className='key'>R</span>
                <span className='key'>e</span>
                <span className='key'>C</span>
                <span className='key'>o</span>
                <span className='key'>n</span>
                <span className='key'>n</span>
                <span className='key'>e</span>
                <span className='key'>c</span>
                <span className='key'>t</span>
              </h1>
            </div>
              {user?.user ? (
                <>
                  <p className="banner-hero-motto">Welcome back,  {user?.user.first_name}!</p>
                </>
              )
              : (
                <>
                  <p className="banner-hero-motto">Building a Lifelong Community of PUP Graduate School Alumnis</p>
                  <br />
                </>
              )}

            <div className="banner-buttons raleway">
              {user ? (
                <>
                  <Link to="/events" className="btn btn-register">EVENTS</Link>
                  <Link to="/surveys" className="btn btn-signin">SURVEYS</Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="flip-animation">
                    <div className='first'><div className='cta-text btn-register'>Register Now</div></div>
                    <div className='second'><div className='cta-text'>Stay Connected</div></div>
                    <div className='third'><div className='cta-text'>Lead Forward</div></div>
                    <div className='fourth'><div className='cta-text'>Give Back</div></div>
                  </Link>
                  <Link to="/login" className="btn btn-signin">Sign In</Link>
                </>
                )}
            </div>
        </div>
    </div>
  );
};

export default Banner;
