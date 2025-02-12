import { popularListHead } from '@/utils/contants';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopularFixture from './PopularFixture';
import PopularFixtureFootball from './PopularFixtureFootball';
import PopularFixtureTennis from './PopularFixtureTennis';
import { filterAndSortMatches } from '@/utils/helper';

const PopularAll = ({
  inplayFalseCricket,
  inplayFalseSoccer,
  inplayFalseTennis,
}) => {
  const [openTab, setOpenTab] = useState('Today');

  const todayCricket = filterAndSortMatches(inplayFalseCricket, 'Today');
  const tomorrowCricket = filterAndSortMatches(inplayFalseCricket, 'Tomorrow');
  const upcomingCricket = filterAndSortMatches(inplayFalseCricket, 'Upcoming');

  const todaySoccer = filterAndSortMatches(inplayFalseSoccer, 'Today');
  const tomorrowSoccer = filterAndSortMatches(inplayFalseSoccer, 'Tomorrow');
  const upcomingSoccer = filterAndSortMatches(inplayFalseSoccer, 'Upcoming');

  const todayTennis = filterAndSortMatches(inplayFalseTennis, 'Today');
  const tomorrowTennis = filterAndSortMatches(inplayFalseTennis, 'Tomorrow');
  const upcomingTennis = filterAndSortMatches(inplayFalseTennis, 'Upcoming');

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
    <div className="py-5">
      <div className="relative">
        <div className="shape-rect h-[35px] flex">
          <div className="bg-secondary-100 h-full w-[120px] md:w-[250px] flex items-center p-[10px] font-medium text-white text-20">
            POPULAR
          </div>
          <div className="curve-part bg-secondary-100 w-[50px] h-full skew-x-[33deg] rounded-10 -ml-[27px] border-none"></div>
        </div>

        <div className="h-full overflow-auto custom-scroll">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="w-full flex justify-between items-center">
                <ul
                  className="flex mb-0 list-none w-full flex-wrap flex-row border-b border-[#ffffff]"
                  role="tablist"
                >
                  {popularListHead.map((item, index) => (
                    <li
                      className="-mb-px mr-2 last:mr-0 flex-auto text-center max-w-[120px] font-inter"
                      key={index}
                    >
                      <a
                        className={
                          'text-sm font-bold px-4 py-2 shadow-lg leading-normal flex items-center justify-center ' +
                          (openTab === item.name
                            ? 'text-primary-1300 border-b-[3px] border-primary-1300'
                            : 'text-white border-0')
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenTab(item.name);
                        }}
                        data-toggle="tab"
                        href="#link1"
                        role="tablist"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative flex flex-col min-w-0 break-words w-full mt-4 font-inter">
                <div className="flex-auto">
                  <div className="tab-content tab-space">
                    <div id="link1">
                      <div className="w-full flex flex-col pb-3 md:pb-8">
                        <div className="w-full md:flex flex-row items-center hidden">
                          <ul className="bg-[#201c67] w-full grid grid-cols-5 items-center m-0 pl-3 rounded-md">
                            <li className="col-span-2">
                              <div className="grid items-center grid-cols-2">
                                <span className="col-span-1 text-[13px] uppercase font-semibold text-white">
                                  Match
                                </span>
                                <span className="col-span-1 flex justify-center text-[13px] uppercase font-semibold text-white">
                                  Status
                                </span>
                              </div>
                            </li>
                            <li className="col-span-2 text-[13px] uppercase font-semibold text-center text-white">
                              Click on Odds to BET
                            </li>
                            <li className="col-span-1 bg-[#6778E3] flex justify-center flex-col items-center rounded-br-md rounded-tr-md py-1 leading-none">
                              <span className="uppercase text-[13px] font-semibold text-white">
                                Boost your BET
                              </span>
                              <p className="text-xs text-[#281960] !text-10 !xl:text-12 font-semibold">
                                Use Bookmaker And Fancy
                              </p>
                            </li>
                          </ul>
                        </div>
                        <div className="hidden md:grid grid-cols-5 items-center w-full relative text-[13px] text-[#ced8ea] bg-[#323232] pl-3">
                          <div className="col-span-2 py-2">
                            <span>Teams</span>
                          </div>
                          <div className="col-span-2 flex items-center justify-around py-2">
                            <span>1</span>
                            <span>X</span>
                            <span>2</span>
                          </div>
                          <div className="col-span-1 bg-[#454545] h-full"></div>
                        </div>
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
  );
};
PopularAll.propTypes = {
  inplayFalseCricket: PropTypes.array.isRequired,
  inplayFalseSoccer: PropTypes.array.isRequired,
  inplayFalseTennis: PropTypes.array.isRequired,
};

export default PopularAll;
