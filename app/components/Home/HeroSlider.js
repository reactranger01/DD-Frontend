import React from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import 'swiper/css/scrollbar';
import { herSlider } from '@/utils/contants';
import { useNavigate } from 'react-router-dom';
const HeroSlider = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };
  return (
    <div className="swiper-main">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
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
        {herSlider.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.url}
              alt={item.url}
              onClick={() => handleNavigate(item.path)}
              className="w-full max-h-[217px] sm:max-h-[300px] lg:max-h-[600px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
