import React from 'react';
import {
  Banner,
  // BannerOption,
  BettingOption,
  BottomHeaderOption,
  SmallDesc,
} from '@/components';
const MoreOption = () => {
  return (
    <>
      <SmallDesc />
      <div
        className="w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed px-2"
        style={{ backgroundImage: 'url("/images/more-option-bg.jpg")' }}
      >
        <BottomHeaderOption />
        <div className="grid grid-cols-3 ">
          <div className="col-span-2">
            <BettingOption />
          </div>
          <div className="col-span-1">
            <Banner />
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreOption;
