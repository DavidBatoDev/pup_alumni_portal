import React from 'react';
import { useSelector } from 'react-redux';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import HomePageNavbar from './HomepageNavbar';

const Navbar = () => {
  const {user} = useSelector((state) => state.user);

  const condition = window.location.pathname == '/' || !user?.user ? <HomePageNavbar /> : <AuthenticatedNavbar />;

  return (
    <div>
      {condition}
    </div>
    );

};

export default Navbar;
