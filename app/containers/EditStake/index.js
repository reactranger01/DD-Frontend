import React from 'react';
import {
  Banner,
  BottomHeader,
  HeroSlider,
  // InPlay,
  // Popular,
  SmallDesc,
} from '@/components';
const EditStake = () => {
  return (
    <>
      <SmallDesc />
      <HeroSlider />
      <BottomHeader />
      <div
        className="grid grid-cols-6 gap-5 w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed px-2"
        style={{ backgroundImage: 'url("/images/stake-bg.jpg")' }}
      >
        <div className="col-span-5">
          {/* <InPlay /> */}
          {/* <Popular /> */}
        </div>
        <div className="col-span-1">
          <Banner />
        </div>
      </div>
    </>
  );
};

export default EditStake;
