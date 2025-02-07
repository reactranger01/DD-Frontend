import React, { useEffect, useState } from 'react';
import {
  Banner,
  BettingOption,
  BottomHeaderOption,
  SmallDesc,
} from '@/components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BlueButton from '@/components/BlueButton';
import PinkButton from '@/components/PinkButton';
import moment from 'moment';
import StatusButton from '@/components/StatusButton';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBetDetailsAction, fetchLiveTvAction } from '@/redux/actions';
import { isMobile } from 'react-device-detect';
import { reactIcons } from '@/utils/icons';
import RunPosition from '@/components/Modal/RunPosition';
import { getRunnerName, intToString } from '@/utils/mergeData';

const SingleBetFootball = () => {
  const navigate = useNavigate();
  const shiv11_userID = localStorage.getItem('shiv11_userID');
  const liveTV = useSelector((state) => state.tv.liveTv);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [oddsShow, setOddsShow] = useState(true);
  const [openTv, setOpenTv] = useState(false);
  const [bookmakerShow, setBookmakerShow] = useState(true);
  const [fancyShow, setFancyShow] = useState(true);
  const [sessionsShow, setSessionsShow] = useState(true);
  const { eventId } = useParams();
  const [selectedID, setSelectedID] = useState(null);
  const [selectedRunner, setSelectedRunner] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [overUnder15Goals, setOverUnder15Goals] = useState([]);
  const [overUnder35Goals, setOverUnder35Goals] = useState([]);
  const [overUnder25Goals, setOverUnder25Goals] = useState([]);
  const [odds, setOdds] = useState(null);
  const [bets, setBets] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [fixtureEventName, setFixtureEventName] = useState([]);
  const [isLiveMobile, setIsLiveMobile] = useState(false);
  const location = useLocation();
  const inplay = odds?.inplay;
  const matchData = location.state?.data;
  const isLogin = isLoggedIn();
  const dispatch = useDispatch();
  const handleOddsShow = () => {
    setOddsShow(!oddsShow);
  };

  const handleBookmakerShow = () => {
    setBookmakerShow(!bookmakerShow);
  };
  const handleFancyShow = () => {
    setFancyShow(!fancyShow);
  };
  const handleSessionsShow = () => {
    setSessionsShow(!sessionsShow);
  };
  useEffect(() => {
    let source;
    if (eventId) {
      if (source) {
        source.close();
        setOdds(null);
        setOverUnder15Goals(null);
        setOverUnder25Goals(null);
        setOverUnder35Goals(null);
      }
      const source = new EventSource(
        `${process.env.API_URL}/catalogue/soccer/get-catalogue-stream?eventId=${eventId}`,
      );
      source.onmessage = function (e) {
        let tempdata = JSON.parse(e.data);
        // const {
        //   MatchOdds,
        //   OverUnder15Goals,
        //   OverUnder25Goals,
        //   OverUnder35Goals,
        // } = tempdata;

        const MatchOdds = tempdata['Match Odds'] || null;
        const OverUnder15Goals = tempdata['Over/Under 1.5 Goals'];
        const OverUnder25Goals = tempdata['Over/Under 2.5 Goals'];
        const OverUnder35Goals = tempdata['Over/Under 3.5 Goals'];

        MatchOdds?.catalogue?.forEach((item) => {
          if (
            item?.marketName === 'Match Odds' ||
            item?.marketName === 'Winner' ||
            item?.marketName === 'MATCH_ODDS'
          ) {
            const parsedRunners = JSON.parse(item.runners);
            const updatedItem = {
              ...item,
              runners: parsedRunners,
              eventId: item.eventid,
            };
            setOdds(updatedItem);
          }
        });

        OverUnder15Goals?.catalogue?.forEach((item) => {
          if (item.marketName === 'Over/Under 1.5 Goals') {
            const parsedRunners = JSON.parse(item.runners);

            const updatedItem = {
              ...item,
              runners: parsedRunners,
              eventId: item.eventid,
            };

            setOverUnder15Goals(updatedItem);
          }
        });
        OverUnder25Goals?.catalogue?.forEach((item) => {
          if (item.marketName === 'Over/Under 2.5 Goals') {
            const parsedRunners = JSON.parse(item.runners);

            const updatedItem = {
              ...item,
              runners: parsedRunners,
              eventId: item.eventid,
            };

            setOverUnder25Goals(updatedItem);
          }
        });

        OverUnder35Goals?.catalogue?.forEach((item) => {
          if (item?.marketName === 'Over/Under 3.5 Goals') {
            const parsedRunners = JSON.parse(item.runners);
            const updatedItem = {
              ...item,
              runners: parsedRunners,
              eventId: item.eventid,
            };
            setOverUnder35Goals(updatedItem);
          } else {
            setOverUnder35Goals([]);
          }
        });
      };
    }
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [eventId]);
  const getEventData = async () => {
    try {
      const response = await getAuthData(
        `/catalogue/soccer/get-matchodds?eventId=${eventId}`,
      );

      if (response?.status === 201 || response?.status === 200) {
        if (response?.data) {
          const convertedData = response?.data;
          setFixtureEventName(convertedData);
        }
        // setFixtureEventName(response?.data?.fixtures);
        // setFixtureData(response?.data?.fixtures);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  useEffect(() => {
    getEventData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (odds?.runners?.[0]?.status === 'CLOSED') {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [odds]);
  const addToBetPlace = (
    eventId,
    selectionId,
    betDetails,
    game,
    OddsPrice,
    betType,
    selectType,
    _marketData,
    marketType,
    minimumBet,
    maximumBet,
  ) => {
    setBets([
      {
        marketId: String(_marketData?.marketId),
        eventId: Number(eventId),
        gameId: 1,
        selectionId: String(selectionId),
        betOn: selectType,
        price: parseFloat(OddsPrice),
        stake: '',
        eventType: game,
        competition: 'N/A',
        event: `${fixtureEventName?.[0]?.['runners']?.[0]?.runnerName} v ${fixtureEventName?.[0]?.['runners']?.[1]?.runnerName}`,
        market: _marketData?.marketName,
        gameType: _marketData?.marketName,
        nation: betDetails,
        type: selectType,
        calcFact: 0,
        bettingOn: betType,
        runners: 2,
        row: 1,
        matchName: `${fixtureEventName?.[0]?.['runners']?.[0]?.runnerName} v ${fixtureEventName?.[0]?.['runners']?.[1]?.runnerName}`,
        percent: 100,
        selection: betDetails,
        minimumBet: minimumBet || '',
        maximumBet: maximumBet || '',
        _marketData,
      },
    ]);
    if (!isMobile) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (bets.length > 0) dispatch(fetchBetDetailsAction(bets));
  }, [bets, dispatch]);

  const handleLiveTv = () => {
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'soccer' }),
    );
  };

  const handleOpenTv = () => {
    setOpenTv(!openTv);
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'soccer' }),
    );
  };

  const handleTvClose = () => {
    setOpenTv(!openTv);
    dispatch(fetchLiveTvAction({ eventid: '', tvshow: false, game: '' }));
  };
  const handleLiveScore = () => {
    setIsLive(!isLive);
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'soccer' }),
    );
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleLiveScoreMobile = () => {
    setIsLiveMobile(!isLiveMobile);
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'soccer' }),
    );
  };
  const handleOpenModal = (selectionID, Runnername, marketname) => {
    setSelectedID(selectionID);
    setSelectedRunner(Runnername);
    setSelectedMarket(marketname);
    setIsOpenModal(true);
  };
  let minLimitOdds, maxLimitOdds;
  if (inplay) {
    minLimitOdds = fixtureEventName?.[0]?.inPlayMinLimit;
    maxLimitOdds = fixtureEventName?.[0]?.inPlayMaxLimit;
  } else {
    minLimitOdds = fixtureEventName?.[0]?.offPlayMinLimit;
    maxLimitOdds = fixtureEventName?.[0]?.offPlayMaxLimit;
  }
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
                  <div
                    className={`relative bg-black w-full h-52 ${
                      openTv ? '' : 'hidden'
                    }`}
                  >
                    {' '}
                    <button
                      type="button"
                      onClick={handleTvClose}
                      className="absolute right-[2px] top-[2px] w-6 h-6 flex items-center justify-center rounded-full bg-[#FF4646]"
                    >
                      {reactIcons.close}
                    </button>
                    {isLogin && liveTV.tvshow && liveTV.eventId !== '' && (
                      <>
                        {' '}
                        <iframe
                          src={`https://hr08bets.in/sports-stream-live/index.html?eventid=${liveTV.eventid}`}
                          title="description"
                          style={{ width: '100%', height: '100%' }}
                        ></iframe>
                      </>
                    )}
                  </div>
                  <div className="md:w-16 px-4  w-full bg-black md:bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 flex items-center justify-between md:justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="text-white font-arial font-semibold"
                    >
                      Back
                    </button>
                    {odds?.inplay && !openTv && isLogin && (
                      <button onClick={handleOpenTv}>
                        <img
                          src="/images/more-option/live-tv.png"
                          alt="live-tv"
                          className="w-5 "
                        />
                      </button>
                    )}
                    <div className="md:w-16 px-4  w-full bg-white  md:bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 hidden items-center justify-between md:justify-center">
                      <button
                        className="text-black font-arial font-semibold flex items-center justify-between w-full"
                        onClick={handleLiveScoreMobile}
                      >
                        <div>Live Score</div>{' '}
                        <div className="text-24">
                          {isLive ? reactIcons.arrowDown : reactIcons.arrowUp}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div
                    className={`w-full md:p-1 p-0 md:mt-2 mt-0 shadow-md ${
                      isLiveMobile ? 'hidden' : 'hidden'
                    }`}
                  >
                    <iframe
                      src={`https://diamondapi.uk/dcasino/sr.php?eventid=${liveTV.eventid}&sportid=1`}
                      title="description"
                      style={{ width: '100%', height: '400px' }}
                    ></iframe>
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
                    {!odds?.inplay ? (
                      <div className="w-auto lg:flex md:flex hidden flex-col items-center text-white capitalize justify-center text-14 pr-2">
                        {moment(matchData?.matchDateTime).format(
                          'MMMM Do YYYY, h:mm a',
                        )}
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={handleLiveScore}
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
                            onClick={handleLiveTv}
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
              <div
                className={`w-full md:p-1 p-0 md:mt-2 mt-0 shadow-md ${
                  isLive ? '' : 'hidden'
                }`}
              >
                <iframe
                  src={`https://diamondapi.uk/dcasino/sr.php?eventid=${liveTV.eventid}&sportid=1`}
                  title="description"
                  style={{ width: '100%', height: '400px' }}
                ></iframe>
              </div>
              <div className="w-full md:p-1 p-0 flex flex-col items-center md:mt-2 mt-0 bg-white shadow-md">
                <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
                  <div className="w-full flex flex-col">
                    <BettingOption
                      title={odds?.market?.toUpperCase() || 'MATCH ODDS'}
                      heading1={isMobile ? '' : 'Back'}
                      heading2={isMobile ? '' : 'Lay'}
                      handleClick={handleOddsShow}
                      showIcon={oddsShow}
                    />
                    {/* Back&lay */}
                    <div className="md:hidden flex justify-around items-center font-inter font-semibold text-[13px] p-2 bg-[#DDE1E7]">
                      <div className="text-[rgb(3,117,204)]">Back</div>
                      <div className="text-[rgb(224,60,60)]">Lay</div>
                    </div>
                    {oddsShow && (
                      <>
                        {odds &&
                          odds?.runners?.map((items, index) => {
                            const runnerName = getRunnerName(
                              items,
                              fixtureEventName,
                            );
                            return (
                              <div
                                key={index}
                                className="mb-5 md:mb-0.5 w-full flex md:flex-row flex-col text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter"
                              >
                                <div className="basis-[40%] text-sm font-[normal] p-2 md:p-0 flex md:justify-start justify-center items-center pl-[2em] border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                                  <div>
                                    <div
                                      onClick={() =>
                                        handleOpenModal(
                                          items?.selectionId,
                                          runnerName,
                                          'MATCH_ODDS',
                                        )
                                      }
                                      className="flex cursor-pointer flex-col justify-center text-xs"
                                    >
                                      <h1 className="capitalize text-sm font-medium m-0 font-inter">
                                        {/* {items?.runnerName} */}
                                        {runnerName}
                                      </h1>
                                    </div>
                                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                                  </div>
                                </div>

                                <div className="flex basis-[60%] justify-center relative min-w-0 p-0">
                                  <div className="flex w-full">
                                    <BlueButton
                                      backPrize={
                                        items?.ex?.availableToBack?.[0]?.price
                                      }
                                      backSize={
                                        items?.ex?.availableToBack?.[0]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            eventId,
                                            items?.selectionId,
                                            runnerName,
                                            'Soccer',
                                            items?.ex?.availableToBack?.[0]
                                              ?.price,
                                            odds?.marketName,
                                            'BACK',
                                            odds,
                                            'ODDS',
                                            minLimitOdds,
                                            maxLimitOdds,
                                          );
                                          if (isMobile) {
                                            navigate('/bet-details');
                                          }
                                        } else {
                                          navigate('/login');
                                        }
                                      }}
                                    />
                                    <BlueButton
                                      backPrize={
                                        items?.ex?.availableToBack?.[1]?.price
                                      }
                                      backSize={
                                        items?.ex?.availableToBack?.[1]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            eventId,
                                            items?.selectionId,
                                            runnerName,
                                            'Soccer',
                                            items?.ex?.availableToBack?.[1]
                                              ?.price,
                                            odds?.marketName,
                                            'BACK',
                                            odds,
                                            'ODDS',
                                            minLimitOdds,
                                            maxLimitOdds,
                                          );
                                          if (isMobile) {
                                            navigate('/bet-details');
                                          }
                                        } else {
                                          navigate('/login');
                                        }
                                      }}
                                    />
                                    <BlueButton
                                      backPrize={
                                        items?.ex?.availableToBack?.[2]?.price
                                      }
                                      backSize={
                                        items?.ex?.availableToBack?.[2]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            eventId,
                                            items?.selectionId,
                                            runnerName,
                                            'Soccer',
                                            items?.ex?.availableToBack?.[2]
                                              ?.price,
                                            odds?.marketName,
                                            'BACK',
                                            odds,
                                            'ODDS',
                                            minLimitOdds,
                                            maxLimitOdds,
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
                                  <div className="flex w-full">
                                    <PinkButton
                                      layPrize={
                                        items?.ex?.availableToLay?.[0]?.price
                                      }
                                      laySize={
                                        items?.ex?.availableToLay?.[0]?.size
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
                                            odds?.marketName,
                                            'LAY',
                                            odds,
                                            'ODDS',
                                            minLimitOdds,
                                            maxLimitOdds,
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
                                        items?.ex?.availableToLay?.[1]?.price
                                      }
                                      laySize={
                                        items?.ex?.availableToLay?.[1]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            eventId,
                                            items?.selectionId,
                                            runnerName,
                                            'Soccer',
                                            items?.ex?.availableToLay?.[1]
                                              ?.price,
                                            odds?.marketName,
                                            'LAY',
                                            odds,
                                            'ODDS',
                                            minLimitOdds,
                                            maxLimitOdds,
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
                                        items?.ex?.availableToLay?.[2]?.price
                                      }
                                      laySize={
                                        items?.ex?.availableToLay?.[2]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            eventId,
                                            items?.selectionId,
                                            runnerName,
                                            'Soccer',
                                            items?.ex?.availableToLay?.[2]
                                              ?.price,
                                            odds?.marketName,
                                            'LAY',
                                            odds,
                                            'ODDS',
                                            minLimitOdds,
                                            maxLimitOdds,
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
                        overUnder15Goals?.marketName?.toUpperCase() ||
                        'over/Under 1.5 Goals'
                      }
                      heading1={'Back'}
                      heading2={'Lay'}
                      handleClick={handleBookmakerShow}
                      showIcon={bookmakerShow}
                    />
                    {bookmakerShow && (
                      <>
                        {overUnder15Goals &&
                          overUnder15Goals?.runners &&
                          overUnder15Goals?.runners.map((items, index) => {
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
                                        {/* {items?.runnerName} */}
                                        {runnerName}
                                      </h1>
                                    </div>
                                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                                  </div>
                                </div>

                                <div className="flex basis-[60%] md:justify-center justify-end relative min-w-0 p-0">
                                  <div className="flex w-full justify-center md:flex-none flex-1">
                                    {/* <div className="w-[172px] flex flex-col justify-center grow relative z-0 text-center min-h-[42px] cursor-not-allowed pointer-events-none opacity-50 mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div> */}
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
                                                  overUnder15Goals?.marketName,
                                                  'BACK',
                                                  overUnder15Goals,
                                                  'under15',
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
                                                    items?.lay?.[0]?.size,
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
                                                  overUnder15Goals?.marketName,
                                                  'LAY',
                                                  overUnder15Goals,
                                                  'under15',
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
                                        {/* {items?.runnerName} */}
                                        {runnerName}
                                      </h1>
                                    </div>
                                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                                  </div>
                                </div>

                                <div className="flex basis-[60%] md:justify-center justify-end relative min-w-0 p-0">
                                  <div className="flex w-full justify-center md:flex-none flex-1">
                                    {/* <div className="w-[172px] flex flex-col justify-center grow relative z-0 text-center min-h-[42px] cursor-not-allowed pointer-events-none opacity-50 mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div> */}
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
                                        {/* {items?.runnerName} */}
                                        {runnerName}
                                      </h1>
                                    </div>
                                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                                  </div>
                                </div>

                                <div className="flex basis-[60%] md:justify-center justify-end relative min-w-0 p-0">
                                  <div className="flex w-full justify-center md:flex-none flex-1">
                                    {/* <div className="w-[172px] flex flex-col justify-center grow relative z-0 text-center min-h-[42px] cursor-not-allowed pointer-events-none opacity-50 mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div> */}
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
                </div>
              </div>
            </div>
          </div>
          <div className="xl:max-w-[390px] w-full hidden md:block">
            <Banner wrapperClassName="hidden" />
          </div>
        </div>
      </div>
      <RunPosition
        isOpen={isOpenModal}
        handleClose={handleCloseModal}
        data={{
          userId: shiv11_userID,
          eventId: eventId,
          selectionId: selectedID,
          runner: selectedRunner,
          market: selectedMarket,
        }}
      />
    </>
  );
};

export default SingleBetFootball;
