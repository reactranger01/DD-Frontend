import { popularList } from '@/utils/contants';
import React, { useState } from 'react';
import PopularFixture from './PopularFixture';
import PopularFixtureFootball from './PopularFixtureFootball';
import PopularFixtureTennis from './PopularFixtureTennis';
import { filterAndSortMatches } from '@/utils/helper';
import useInplayOuter from '@/hooks/useInplayOuter';
import { useLocation } from 'react-router-dom';
import HeadingSportsMobile from './HeadingSportsMobile';

const AllMobileHome = () => {
  const { allDataCricket, allDataFootball, allDataTennis } = useInplayOuter();
  const [openTab, setOpenTab] = useState('Today');
  const location = useLocation();

  const todayCricket = filterAndSortMatches(allDataCricket, 'Today');
  const tomorrowCricket = filterAndSortMatches(allDataCricket, 'Tomorrow');
  const upcomingCricket = filterAndSortMatches(allDataCricket, 'Upcoming');

  const todaySoccer = filterAndSortMatches(allDataFootball, 'Today');
  const tomorrowSoccer = filterAndSortMatches(allDataFootball, 'Tomorrow');
  const upcomingSoccer = filterAndSortMatches(allDataFootball, 'Upcoming');

  const todayTennis = filterAndSortMatches(allDataTennis, 'Today');
  const tomorrowTennis = filterAndSortMatches(allDataTennis, 'Tomorrow');
  const upcomingTennis = filterAndSortMatches(allDataTennis, 'Upcoming');
  const tennisData =
    openTab == 'Today'
      ? todayTennis
      : openTab == 'Tomorrow'
      ? tomorrowTennis
      : upcomingTennis;
  const soccerData =
    openTab == 'Today'
      ? todaySoccer
      : openTab == 'Tomorrow'
      ? tomorrowSoccer
      : upcomingSoccer;
  const cricketData =
    openTab == 'Today'
      ? todayCricket
      : openTab == 'Tomorrow'
      ? tomorrowCricket
      : upcomingCricket;

  return (
    <div
      className="flex justify-between w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3 xl:gap-5 flex-col xl:flex-row"
      style={{ backgroundImage: 'url("/images/newBanners/allBg.webp")' }}
    >
      {location.pathname == '/all' && <HeadingSportsMobile />}

      <div className="md:py-5">
        <div className="relative">
          {/* only mobile */}
          <div className="grid grid-cols-3 -ml-3 md:hidden w-full shadow-xl shadow-gray-900">
            <div className="mobile-skew">
              <p className="skew-x-[20deg]">IN-PLAY</p>
            </div>
            <div className="mobile-skew-active">
              <p className="skew-x-[20deg]">Boost Your Bets</p>
            </div>
            <div className="mobile-skew -mr-4">
              <p className="skew-x-[20deg]">Click on Odds to BET</p>
            </div>
          </div>
          <div className="md:hidden font-semibold pl-3 popular-div font-mont mr-2 text-[11px] mt-3 text-white bg-black w-fit">
            POPULAR
          </div>
          <div className="w-full flex md:hidden justify-between items-center">
            <ul
              className="flex mb-0 -ml-3 my-2 list-none w-full flex-wrap flex-row"
              role="tablist"
            >
              {popularList.map((item, index) => (
                <div
                  key={index}
                  className={
                    openTab === item.name
                      ? 'today-filter'
                      : 'today-filter-active'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(item.name);
                  }}
                >
                  <p className="skew-x-[20deg]">{item.name.toUpperCase()}</p>
                </div>
              ))}
            </ul>
          </div>

          <div className="h-full overflow-auto custom-scroll">
            <div className="flex flex-wrap">
              <div className="w-full">
                <div className="relative flex flex-col min-w-0 break-words w-full mt-4 font-inter">
                  <div className="flex-auto">
                    <div className="tab-content tab-space">
                      <div id="link1">
                        <div className="w-full flex flex-col pb-3 md:pb-8">
                          {cricketData && cricketData?.length > 0 && (
                            <PopularFixture data={cricketData} />
                          )}
                          {soccerData && soccerData?.length > 0 && (
                            <PopularFixtureFootball data={soccerData} />
                          )}
                          {tennisData && tennisData?.length > 0 && (
                            <PopularFixtureTennis data={tennisData} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMobileHome;
