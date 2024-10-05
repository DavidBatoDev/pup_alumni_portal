import React from 'react';
import { useSelector } from 'react-redux';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import HomePageNavbar from './HomepageNavbar';

const Navbar = () => {
  const {user} = useSelector((state) => state.user);

  console.log(user);

  return (
    <div>
      {user ? <AuthenticatedNavbar /> : <HomePageNavbar />}
    </div>
    );
  
};

export default Navbar;
