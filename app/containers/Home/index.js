import React from 'react';
import {
  // Banner,
  BetSlip,
  BottomHeader,
  HeroSection,
  HeroSectionWebSlider,
  HeroSlider,
  HomeBottom,
  InplayAll,
  PopularAll,
  SmallDesc,
} from '@/components';
import { useLocation } from 'react-router-dom';
import useInplayOuter from '@/hooks/useInplayOuter';
import AllMobileHome from '@/components/Home/AllMobileHome';
import { useMediaQuery } from '@mui/material';

const Home = () => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:768px)');

  const {
    inplayTrueCricket,
    inplayTrueSoccer,
    inplayTrueTennis,
    inplayFalseCricket,
    inplayFalseSoccer,
    inplayFalseTennis,
  } = useInplayOuter();

  return (
    <div className="relative">
      <SmallDesc />
      {location?.pathname === '/in-play' ? ' ' : <HeroSlider />}
      <div className="hidden md:flex bg-white">
        <HeroSectionWebSlider />
      </div>
      <BottomHeader />
      <div className="md:hidden">
        <HeroSection />
      </div>

      <div
        className="flex justify-between w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3 xl:gap-5 flex-col xl:flex-row"
        style={{ backgroundImage: 'url("/images/newBanners/allBg.webp")' }}
      >
        {isMobile ? (
          <div className="flex-1 bg-transparent">
            <AllMobileHome />
          </div>
        ) : (
          <div className="flex-1 bg-transparent">
            <InplayAll
              inplayTrueCricket={inplayTrueCricket}
              inplayTrueSoccer={inplayTrueSoccer}
              inplayTrueTennis={inplayTrueTennis}
            />
            <PopularAll
              inplayFalseCricket={inplayFalseCricket}
              inplayFalseSoccer={inplayFalseSoccer}
              inplayFalseTennis={inplayFalseTennis}
            />
          </div>
        )}

        <div className="xl:max-w-[390px] w-full hidden xl:block">
          <BetSlip
          // name={'search'}
          // value={search}
          // onChangeHandler={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <div className="hidden md:flex w-full">
        <HomeBottom />
      </div>
    </div>
  );
};

export default Home;
