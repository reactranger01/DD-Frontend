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
            className="w-[480px] h-[90px] p-1"
          />
        ))}
      </div>
      <button
        className="absolute h-[91px] w-[64px] top-1/2 transform -translate-y-1/2 left-0 bg-blue-700 text-white py-2 px-4 "
        onClick={() => scroll('left')}
      >
        <img src="/images/leftarrow.png" />
      </button>
      <button
        className="absolute h-[91px] w-[64px] top-1/2 transform -translate-y-1/2 right-0 bg-blue-700 text-white py-2 px-4"
        onClick={() => scroll('right')}
      >
        <img src="/images/rightarrow.png" />
      </button>
    </div>
  );
};

export default HeroSectionWebSlider;
