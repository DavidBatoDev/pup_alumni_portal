import React from 'react';
import { useSelector } from 'react-redux';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import HomepageNavbar from './HomepageNavbar';

import NavbarBGAutumn from '../../assets/images/navbar-bg-autumn.jpg';
import NavbarBGSpring from '../../assets/images/navbar-bg-spring.jpg';
import NavbarBGSummer from '../../assets/images/navbar-bg-summer.jpg';
import NavbarBGWinter from '../../assets/images/navbar-bg-winter.jpg';

const getSeasonalBackground = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) {
    return NavbarBGSpring;
  } else if (month >= 5 && month <= 7) {
    return NavbarBGSummer;
  } else if (month >= 8 && month <= 10) {
    return NavbarBGAutumn;
  } else {
    return NavbarBGWinter;
  }
};

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const seasonalBackground = getSeasonalBackground();
  const condition = window.location.pathname === '/' || !user
    ? <HomepageNavbar backgroundImage={seasonalBackground} />
    : <AuthenticatedNavbar backgroundImage={seasonalBackground} />;

  return (
    <div>
      {condition}
    </div>
  );

};

export default Navbar;
