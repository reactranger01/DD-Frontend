import React from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import 'swiper/css/scrollbar';

import { heroSectionImages } from '@/utils/contants';
// import { herSlider } from '@/utils/contants';
import { useNavigate } from 'react-router-dom';
const HeroSectionSlider = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };
  return (
    <div className="swiper-main">
      <Swiper
        breakpoints={{
          400: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          500: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          700: {
            slidesPerView: 4.2,
            spaceBetween: 20,
          },
          1536: {
            slidesPerView: 4.3,
            spaceBetween: 20,
          },
        }}
        modules={[Autoplay]}
        slidesPerView={2}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        scrollbar={{ draggable: true }}
      >
        {heroSectionImages.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.url}
              alt={item.url}
              onClick={() => handleNavigate(item.path)}
              className="w-[180px] h-[106px] border rounded-md border-white"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSectionSlider;
