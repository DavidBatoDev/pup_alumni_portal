import React from 'react';
import { useSelector } from 'react-redux';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import HomepageNavbar from './HomepageNavbar';

const Navbar = () => {
  const { user } = useSelector((state) => state.user);

  const condition = window.location.pathname === '/' || !user
    ? <HomepageNavbar />
    : <AuthenticatedNavbar />;

  return (
    <div>
      {condition}
    </div>
  );

};

export default Navbar;
