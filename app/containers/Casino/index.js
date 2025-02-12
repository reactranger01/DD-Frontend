import {
  // Banner,
  BetSlip,
  BottomHeader,
  HeroSlider,
  // InPlay,
  // Popular,
  SmallDesc,
} from '@/components';
import React from 'react';

const Casino = () => {
  return (
    <>
      <SmallDesc />
      <HeroSlider />
      <BottomHeader />
      <div
        className="grid grid-cols-6 gap-5 w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed px-2"
        style={{ backgroundImage: 'url("/images/newBanners/allBg.webp")' }}
      >
        <div className="col-span-5">
          {/* <InPlay /> */}
          {/* <Popular /> */}
        </div>
        <div className="col-span-1">
          <BetSlip />
        </div>
      </div>
    </>
  );
};

export default Casino;
