import React from 'react';
import {
  BetSlip,
  // Banner,
  BottomHeaderOption,
  MatchoddsFootball,
  OtherMarketFootball,
  SmallDesc,
} from '@/components';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import useFootballInner from '@/hooks/useFootballInner';
import { useMediaQuery } from '@mui/material';

const SingleBetFootball = () => {
  const navigate = useNavigate();
  const {
    isLogin,
    matchData,
    fixtureEventName,
    placedBetWinLossDatas,
    allMarketData,
  } = useFootballInner();
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <>
      <SmallDesc />
      <div
        className="w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 px-0 "
        style={{ backgroundImage: 'url("/images/more-option-bg.jpg")' }}
      >
        {!isMobile && <BottomHeaderOption />}

        <div className="flex justify-between w-full bg-cover h-auto bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3 xl:gap-5 flex-col xl:flex-row">
          <div className="flex-1">
            <div className="scroll-smooth">
              <div className="flex items-center justify-center">
                <div className="gradient-bg flex flex-col md:flex-row items-center justify-between  w-full border-b-2 border-[#6462D5]">
                  <div className="md:w-16 px-4 hidden  w-full bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 md:flex items-center justify-between md:justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="text-white font-arial font-semibold"
                    >
                      Back
                    </button>
                    <button
                    //  onClick={handleOpenTv}
                    >
                      <img
                        src="/images/more-option/live-tv.png"
                        alt="live-tv"
                        className="w-5 "
                      />
                    </button>
                    <div className="md:w-16 px-4  w-full bg-white  md:bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 hidden items-center justify-between md:justify-center">
                      <button
                        className="text-black font-arial font-semibold flex items-center justify-between w-full"
                        // onClick={handleLiveScoreMobile}
                      >
                        <div>Live Score</div>{' '}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center md:items-start flex-row md:py-5 py-1  bg-blue-500 md:bg-transparent w-full md:w-max">
                    <div className="min-w-[35px] sm:w-[70px] grid place-content-center md:hidden">
                      <img
                        src="/images/home/football.png"
                        alt="ball"
                        className="w-4 h-4 md:w-6 md:h-6"
                      />
                    </div>
                    <div
                      className="w-5 h-6 md:flex hidden bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage: 'url("/images/more-option/india.png")',
                      }}
                    ></div>
                    <div className="text-white capitalize font-inter text-12 md:text-16">
                      {matchData?.name}
                    </div>
                    <div
                      className="w-5 h-6 md:flex hidden bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage:
                          'url("/images/more-option/england.png")',
                      }}
                    ></div>
                  </div>
                  <div className="flex">
                    {!matchData?.inplay ? (
                      <div className="w-auto lg:flex md:flex hidden flex-col items-center text-white capitalize justify-center text-14 pr-2">
                        {moment(matchData?.matchDateTime).format(
                          'MMMM Do YYYY, h:mm a',
                        )}
                      </div>
                    ) : (
                      <>
                        <div
                          // onClick={handleLiveScore}
                          className="w-[70px] lg:flex md:flex cursor-pointer hidden flex-col items-center text-white capitalize justify-center text-10 pr-4"
                        >
                          <img
                            src="/images/more-option/live-match.png"
                            alt="live-tv"
                            className="w-5 "
                          />
                          <span className="">Live Score</span>
                        </div>
                        {isLogin && (
                          <div
                            // onClick={handleLiveTv}
                            className="w-11 cursor-pointer hidden flex-col items-center text-white capitalize justify-center text-10 pr-4"
                          >
                            <img
                              src="/images/more-option/live-tv.png"
                              alt="live-tv"
                              className="w-5 "
                            />
                            <span className="">Live TV</span>
                          </div>
                        )}{' '}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full md:p-1 p-0 flex flex-col items-center md:mt-2 mt-0 bg-white shadow-md">
                {allMarketData?.map((market, index) =>
                  market?.market_name == 'Match Odds' ? (
                    <MatchoddsFootball
                      key={index}
                      heading="Match Odds "
                      data={market}
                      fixtureEventName={fixtureEventName}
                      placedBetWinLossDatas={placedBetWinLossDatas}
                      competition_name={matchData?.competition_name}
                    />
                  ) : (
                    <OtherMarketFootball
                      key={index}
                      heading={market?.market_name?.toUpperCase()}
                      data={market}
                      fixtureEventName={fixtureEventName}
                      type="under15"
                      placedBetWinLossDatas={placedBetWinLossDatas}
                      competition_name={matchData?.competition_name}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="xl:max-w-[390px] w-full hidden xl:block">
            <BetSlip wrapperClassName="hidden" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBetFootball;
