import React, { useRef } from 'react';
import { heroSectionWebImages } from '@/utils/contants';
import { useNavigate } from 'react-router-dom';

const HeroSectionWebSlider = () => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    const scrollDistance = 500;
    const slider = sliderRef.current;

    if (slider) {
      if (direction === 'left') {
        slider.scrollLeft -= scrollDistance;
      } else if (direction === 'right') {
        slider.scrollLeft += scrollDistance;
      }
    }
  };
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden relative bg-white">
      <div
        className="flex space-x-1 pl-14"
        ref={sliderRef}
        style={{ overflowX: 'scroll' }}
      >
        {heroSectionWebImages.map((item, index) => (
          <img
            key={index}
            src={item.url}
            alt={item.url}
            onClick={() => navigate(item.path)}
            className="w-[281px] h-[82px] py-1"
          />
        ))}
      </div>
      <button
        className="flex-center ay-center left-0  text-white  slick-prev "
        onClick={() => scroll('left')}
      >
        <img src="/images/leftarrow.png" />
      </button>
      <button
        className="flex-center ay-center right-0 text-white slick-next"
        onClick={() => scroll('right')}
      >
        <img src="/images/rightarrow.png" />
      </button>
    </div>
  );
};

export default HeroSectionWebSlider;
