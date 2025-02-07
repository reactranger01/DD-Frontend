import React from 'react';

const SmallDesc = () => {
  return (
    <div className="bg-black py-2 pt-[5px] md:pt-2 text-center h-[35px] md:h-[41px]">
      <marquee direction="left">
        <p className="flex items-center font-inter text-white text-14 md:text-16">
          Your Bonuses, Auto activated - Explore your entertainment partner now
          !!Check out our bonus page for exciting rewards.
        </p>
      </marquee>
    </div>
  );
};

export default SmallDesc;
