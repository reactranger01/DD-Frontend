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

const SingleBetFootball = () => {
  const navigate = useNavigate();
  const {
    isLogin,
    matchData,
    fixtureEventName,
    placedBetWinLossDatas,
    allMarketData,
  } = useFootballInner();
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
            <div className="scroll-smooth">
              <div className="flex items-center justify-center">
                <div className="gradient-bg flex flex-col md:flex-row items-center justify-between  w-full border-b-2 border-[#6462D5]">
                  <div className="md:w-16 px-4  w-full bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 flex items-center justify-between md:justify-center">
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

                  <div className="flex items-start flex-row md:py-5 py-1  bg-blue-500 md:bg-transparent w-full md:w-max">
                    <div className="min-w-[35px] sm:w-[70px] grid place-content-center md:hidden">
                      <img
                        src="/images/home/football.png"
                        alt="ball"
                        className="w-6 h-6"
                      />
                    </div>
                    <div
                      className="w-5 h-6 md:flex hidden bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage: 'url("/images/more-option/india.png")',
                      }}
                    ></div>
                    <div className="text-white capitalize font-inter">
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
          <div className="xl:max-w-[390px] w-full hidden md:block">
            <BetSlip wrapperClassName="hidden" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBetFootball;

{
  /* <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
<div className="w-full flex flex-col">
  <BettingOption
    title={
      overUnder25Goals?.market?.toUpperCase() ||
      'over/Under 2.5 Goals'
    }
    heading1={'Back'}
    heading2={'Lay'}
    handleClick={handleFancyShow}
    showIcon={fancyShow}
  />
  {fancyShow && (
    <>
      {' '}
      {overUnder25Goals &&
        overUnder25Goals?.runners &&
        overUnder25Goals?.runners?.map((items, index) => {
          const runnerName = getRunnerName(
            items,
            fixtureEventName,
          );

          return (
            <div
              key={index}
              className="mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1"
            >
              <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                <div>
                  <div
                    onClick={() =>
                      handleOpenModal(
                        items?.selectionId,
                        runnerName,
                        'bookmaker',
                      )
                    }
                    className="flex cursor-pointer flex-col justify-center"
                  >
                    <h1 className="capitalize text-sm font-medium m-0 font-inter">
                      {runnerName}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                </div>
              </div>

              <div className="flex basis-[60%] md:justify-center justify-end relative min-w-0 p-0">
                <div className="flex w-full justify-center md:flex-none flex-1">
                  <div className=" md:flex w-1/3 hidden"></div>
                  <div className="flex md:w-1/3 w-full justify-center md:p-0 p-1">
                    {items?.status === '' ||
                    items?.status === 'ACTIVE' ? (
                      <div className="flex flex-1">
                        <BlueButton
                          backPrize={
                            items?.ex?.availableToBack?.[0]
                              ?.price || '-'
                          }
                          backSize={
                            items?.ex?.availableToBack?.[0]
                              ?.price &&
                            items?.ex?.availableToBack?.[0]
                              ?.size
                              ? intToString(
                                  items?.ex
                                    ?.availableToBack?.[0]
                                    ?.size,
                                )
                              : ''
                          }
                          onClick={async () => {
                            if (isLogin) {
                              await addToBetPlace(
                                eventId,
                                items?.selectionId,
                                runnerName,
                                'Soccer',
                                items?.ex
                                  ?.availableToBack?.[0]
                                  ?.price,
                                overUnder25Goals?.marketName,
                                'BACK',
                                overUnder25Goals,
                                'under25',
                              );
                              if (isMobile) {
                                navigate('/bet-details');
                              }
                            } else {
                              navigate('/login');
                            }
                          }}
                        />
                        <PinkButton
                          layPrize={
                            items?.ex?.availableToLay?.[0]
                              ?.price || ''
                          }
                          laySize={
                            items?.ex?.availableToLay?.[0]
                              ?.price &&
                            items?.ex?.availableToLay?.[0]
                              ?.size
                              ? intToString(
                                  items?.ex
                                    ?.availableToLay?.[0]
                                    ?.size,
                                )
                              : ''
                          }
                          onClick={async () => {
                            if (isLogin) {
                              await addToBetPlace(
                                eventId,
                                items?.selectionId,
                                runnerName,
                                'Soccer',
                                items?.ex?.availableToLay?.[0]
                                  ?.price,
                                overUnder25Goals?.marketName,
                                'LAY',
                                overUnder25Goals,
                                'under25',
                              );
                              if (isMobile) {
                                navigate('/bet-details');
                              }
                            } else {
                              navigate('/login');
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center md:w-1/3 flex-1">
                        <StatusButton
                          status={items?.status}
                        />
                      </div>
                    )}
                  </div>
                  <div className=" hidden md:w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  )}
</div>
</div>
<div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
<div className="w-full flex flex-col">
  <BettingOption
    title={
      overUnder35Goals?.market?.toUpperCase() ||
      'over/Under 3.5 Goals'
    }
    heading1={'Back'}
    heading2={'Lay'}
    handleClick={handleSessionsShow}
    showIcon={sessionsShow}
  />
  {sessionsShow && (
    <>
      {' '}
      {overUnder35Goals &&
        overUnder35Goals?.runners &&
        overUnder35Goals?.runners?.map((items, index) => {
          const runnerName = getRunnerName(
            items,
            fixtureEventName,
          );
          return (
            <div
              key={index}
              className="mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1"
            >
              <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                <div>
                  <div
                    onClick={() =>
                      handleOpenModal(
                        items?.selectionId,
                        runnerName,
                        'bookmaker',
                      )
                    }
                    className="flex cursor-pointer flex-col justify-center"
                  >
                    <h1 className="capitalize text-sm font-medium m-0 font-inter">
                      {runnerName}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                </div>
              </div>

              <div className="flex basis-[60%] md:justify-center justify-end relative min-w-0 p-0">
                <div className="flex w-full justify-center md:flex-none flex-1">
                  <div className=" md:flex w-1/3 hidden"></div>
                  <div className="flex md:w-1/3 w-full justify-center md:p-0 p-1">
                    {items?.status === '' ||
                    items?.status === 'ACTIVE' ? (
                      <div className="flex flex-1">
                        <BlueButton
                          backPrize={
                            items?.ex?.availableToBack?.[0]
                              ?.price || '-'
                          }
                          backSize={
                            items?.ex?.availableToBack?.[0]
                              ?.price &&
                            items?.ex?.availableToBack?.[0]
                              ?.size
                              ? intToString(
                                  items?.ex
                                    ?.availableToBack?.[0]
                                    ?.size,
                                )
                              : ''
                          }
                          onClick={async () => {
                            if (isLogin) {
                              await addToBetPlace(
                                eventId,
                                items?.selectionId,
                                runnerName,
                                'Soccer',
                                items?.ex
                                  ?.availableToBack?.[0]
                                  ?.price,
                                overUnder35Goals?.marketName,
                                'BACK',
                                overUnder35Goals,
                                'under25',
                              );
                              if (isMobile) {
                                navigate('/bet-details');
                              }
                            } else {
                              navigate('/login');
                            }
                          }}
                        />
                        <PinkButton
                          layPrize={
                            items?.ex?.availableToLay?.[0]
                              ?.price || ''
                          }
                          laySize={
                            items?.ex?.availableToLay?.[0]
                              ?.price &&
                            items?.ex?.availableToLay?.[0]
                              ?.size
                              ? intToString(
                                  items?.ex
                                    ?.availableToLay?.[0]
                                    ?.size,
                                )
                              : ''
                          }
                          onClick={async () => {
                            if (isLogin) {
                              await addToBetPlace(
                                eventId,
                                items?.selectionId,
                                runnerName,
                                'Soccer',
                                items?.ex?.availableToLay?.[0]
                                  ?.price,
                                overUnder35Goals?.marketName,
                                'LAY',
                                overUnder35Goals,
                                'under25',
                              );
                              if (isMobile) {
                                navigate('/bet-details');
                              }
                            } else {
                              navigate('/login');
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center md:w-1/3 flex-1">
                        <StatusButton
                          status={items?.status}
                        />
                      </div>
                    )}
                  </div>
                  <div className=" hidden md:w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  )}
</div>
</div> */
}
