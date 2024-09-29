import React from 'react';
import BannerSmall from '../../components/Banner/BannerSmall';
import Banner from '../../components/Banner/Banner';

import bannerImage from '../../assets/images/eventbanner.png';

const Events = () => {
  return (
    <div>
      <BannerSmall
        bannerTitle={"Events Page"}
        bannerImage={bannerImage}
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'Events', link: '/event' },
        ]}
        />
    </div>
  )
}

export default Events
