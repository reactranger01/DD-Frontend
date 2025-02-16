/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Banner,
  BottomHeaderOption,
  MatchOddsTennis,
  OtherMarketTennis,
  SmallDesc,
} from '@/components';
import { useNavigate } from 'react-router-dom';

import moment from 'moment';

import { reactIcons } from '@/utils/icons';
import useTennisInner from '@/hooks/useTennisInner';
import { useMediaQuery } from '@mui/material';

const SingleBetTennis = () => {
  const navigate = useNavigate();
  const {
    isLiveMobile,
    allMarketData,
    matchData,
    placedBetWinLossDatas,
    fixtureEventName,
  } = useTennisInner();
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <>
      <SmallDesc />
      <div
        className="w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 px-0 "
        style={{ backgroundImage: 'url("/images/more-option-bg.jpg")' }}
      >
        {!isMobile && <BottomHeaderOption />}
        <div className="flex justify-between w-full bg-cover h-auto bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3  xl:gap-5 flex-col xl:flex-row">
          {/* flex justify-between w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3 xl:gap-5 flex-col xl:flex-row" */}
          <div className="flex-1">
            <div className="scroll-smooth">
              <div className="flex items-center justify-center">
                <div className="gradient-bg flex flex-col md:flex-row items-center justify-between  w-full border-b-2 border-[#6462D5]">
                  <button
                    type="button"
                    className="absolute right-[2px] top-[2px] w-6 h-6 flex items-center justify-center rounded-full bg-[#FF4646]"
                  >
                    {reactIcons.close}
                  </button>
                  <div className="md:w-16 px-4 hidden  w-full bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 md:flex items-center justify-between md:justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="text-white font-arial font-semibold"
                    >
                      Back
                    </button>
                  </div>

                  <div className="flex items-start flex-row md:py-5 py-1  bg-blue-500 md:bg-transparent w-full md:w-max">
                    <div className="min-w-[35px] sm:w-[70px] grid place-content-center md:hidden">
                      <img
                        src="/images/home/tennis.png"
                        alt="ball"
                        className="w-4 h-4 md:w-6 md:h-6"
                      />
                    </div>
                    <div
                      className="w-5 md:flex hidden h-6 bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage: 'url("/images/more-option/india.png")',
                      }}
                    ></div>
                    <div className="text-white capitalize font-inter text-12 md:text-16">
                      {matchData?.name}
                    </div>
                    <div
                      className="w-5 h-6 md:flex hidden pl-3 bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage:
                          'url("/images/more-option/england.png")',
                      }}
                    ></div>
                  </div>

                  {!matchData?.inplay ? (
                    <div className="w-auto lg:flex md:flex hidden flex-col items-center text-white capitalize justify-center text-14 pr-2">
                      {moment(matchData?.matchDateTime).format(
                        'MMMM Do YYYY, h:mm a',
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-[70px] lg:flex md:flex cursor-pointer hidden flex-col items-center text-white capitalize justify-center text-10 pr-4">
                        <img
                          src="/images/more-option/live-match.png"
                          alt="live-tv"
                          className="w-5 "
                        />
                        <span className="">Live Score</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="w-full md:p-1 p-0 flex flex-col items-center md:mt-2 mt-0 bg-white shadow-md">
                {allMarketData?.map((market, index) =>
                  market?.market_name == 'Match Odds' ? (
                    <MatchOddsTennis
                      key={index}
                      heading="Match Odds "
                      data={market}
                      fixtureEventName={fixtureEventName}
                      placedBetWinLossDatas={placedBetWinLossDatas}
                      competition_name={matchData?.competition_name}
                      allMarketData={allMarketData[0]}
                    />
                  ) : (
                    <OtherMarketTennis
                      key={index}
                      heading={market?.market_name?.toUpperCase()}
                      data={market}
                      fixtureEventName={fixtureEventName}
                      type="under15"
                      placedBetWinLossDatas={placedBetWinLossDatas}
                      competition_name={matchData?.competition_name}
                      allMarketData={allMarketData[0]}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="xl:max-w-[390px] w-full hidden md:block">
            <Banner wrapperClassName="hidden" />
          </div>
        </div>
      </div>
      {/* <RunPosition
        isOpen={isOpenModal}
        handleClose={handleCloseModal}
        data={{
          userId: yolo_userID,
          eventId: eventId,
          selectionId: selectedID,
          runner: selectedRunner,
          market: selectedMarket,
        }}
      /> */}
    </>
  );
};

export default SingleBetTennis;
