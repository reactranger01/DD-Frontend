/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Banner,
  BettingOption,
  BookmakersCricket,
  BottomHeaderOption,
  MatchOddsCricket,
  SessionCricket,
  SmallDesc,
} from '@/components';
import BlueButton from '@/components/BlueButton';
import PinkButton from '@/components/PinkButton';
import moment from 'moment';
import StatusButton from '@/components/StatusButton';
import { isMobile } from 'react-device-detect';
import RunPosition from '@/components/Modal/RunPosition';
import { reactIcons } from '@/utils/icons';
import { getRunnerName } from '@/utils/mergeData';
import useCricketInner from '@/hooks/useCricketInner';
import { useNavigate } from 'react-router-dom';

const SingleBetCricket = () => {
  const {
    betData,
    isLogin,
    oddsData,
    matchData,
    particularMatchData,
    sessionBooksetClcuData,
    sessionData,
    placedBetWinLossBookmakerData,
    bookmakerData,
    isLiveMobile,
    isLiveTv,
    userType,
    userIdBalance,
    // handleLiveScoreMobile,
    // handleLiveTV,
    loading,
    loaderOneTime,
    eventId,
    bookmakerTransformData,
    placedBetWinLossDatas,
  } = useCricketInner();
  const navigate = useNavigate();
  return (
    <>
      <SmallDesc />
      <div
        className="w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 px-0 "
        style={{ backgroundImage: 'url("/images/more-option-bg.jpg")' }}
      >
        <BottomHeaderOption />
        <div className="flex justify-between w-full bg-cover h-auto bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3 xl:gap-5 flex-col xl:flex-row">
          <div className="flex-1">
            <div className="scroll-smooth ">
              <div className="flex items-center justify-center">
                <div className="gradient-bg flex flex-col md:flex-row items-center justify-between  w-full border-b-2 border-[#6462D5]">
                  <div className="md:w-16 px-4  w-full bg-black md:bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 flex items-center justify-between md:justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="text-white font-arial font-semibold"
                    >
                      Back
                    </button>
                    {/* {odds?.inplay && !openTv && isLogin && ( */}
                    <button
                    // onClick={handleOpenTv}
                    >
                      <img
                        src="/images/more-option/live-tv.png"
                        alt="live-tv"
                        className="w-5 "
                      />
                    </button>
                    {/* )} */}
                  </div>
                  <div className="md:w-16 hidden px-4  w-full bg-white  md:bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0  items-center justify-between md:justify-center">
                    <button
                      className="text-black font-arial font-semibold flex items-center justify-between w-full"
                      // onClick={handleLiveScoreMobile}
                    >
                      <div>Live Score</div>{' '}
                      {/* <div className="text-24">
                        {isLive ? reactIcons.arrowDown : reactIcons.arrowUp}
                      </div> */}
                    </button>
                  </div>
                  {/* <div
                    className={`w-full md:p-1 p-0 md:mt-2 mt-0 shadow-md  hidden
                    `}
                  >
                    <iframe
                      src={`https://diamondapi.uk/dcasino/sr.php?eventid=${liveTV.eventid}&sportid=4`}
                      title="description"
                      style={{ width: '100%', height: '400px' }}
                    ></iframe>
                  </div> */}
                  <div className="flex items-start flex-row md:py-5 py-1  bg-blue-500 md:bg-transparent w-full md:w-max">
                    <div className="min-w-[35px] sm:w-[70px] grid place-content-center md:hidden">
                      <img
                        src="/images/home/cricket.png"
                        alt="ball"
                        className="w-6 h-6"
                      />
                    </div>
                    <div
                      className="w-5 md:flex hidden h-6 bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage: 'url("/images/more-option/india.png")',
                      }}
                    ></div>
                    <div className="text-white capitalize font-inter">
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
                  <div className="flex">
                    {!oddsData?.inplay ? (
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
              {/* <div
                className={`w-full md:p-1 p-0 md:mt-2 mt-0 shadow-md ${
                  isLive ? '' : 'hidden'
                }`}
              >
                <iframe
                  src={`https://diamondapi.uk/dcasino/sr.php?eventid=${liveTV.eventid}&sportid=4`}
                  title="description"
                  style={{ width: '100%', height: '400px' }}
                ></iframe>
              </div> */}
              <div className="w-full md:p-1 p-0 flex flex-col items-center md:mt-2 mt-0 bg-white shadow-md">
                <MatchOddsCricket
                  heading="MATCH ODDS"
                  data={oddsData}
                  competition_name={matchData?.competition_name}
                  placedBetWinLossDatas={placedBetWinLossDatas}
                />
                <BookmakersCricket
                  heading="BOOKMAKERS"
                  data={{
                    ...bookmakerTransformData,
                    market_id: oddsData?.market_id,
                    noData: bookmakerData ? false : true,
                  }}
                  competition_name={matchData?.competition_name}
                  placedBetWinLossBookmakerData={placedBetWinLossBookmakerData}
                  oddsData={oddsData}
                  matchName={matchData?.name}
                />

                <SessionCricket
                  sessionBooksetClcuData={sessionBooksetClcuData}
                  data={sessionData}
                  matchName={matchData?.name}
                  particularMatchData={particularMatchData}
                  competition_name={matchData?.competition_name}
                  oddsData={oddsData}
                />
              </div>
            </div>
          </div>
          {/* <div className="xl:max-w-[390px] w-full hidden md:block">
            <Banner wrapperClassName="hidden" />
          </div> */}
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

export default SingleBetCricket;
