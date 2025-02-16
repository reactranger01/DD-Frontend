import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisableButton from '../DisableButton';
import { isLoggedIn } from '@/utils/apiHandlers';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBetDetailsAction, fetchLiveTvAction } from '@/redux/actions';
import DateFormatter from '../DateFormatter';
import MobileMatchHeading from '../MobileMatchHeading';
import { BetSlip } from '..';
import { useMediaQuery } from '@mui/material';
import { setActiveBetSlipIndex } from '@/redux/Slices/newBetSlice';

const PopularFixtureFootball = ({ data }) => {
  const FixtureData1 = data;
  const activeBetSlip = useSelector((state) => state.activeNewBet.activeIndex);
  const betData = useSelector((state) => state.bet.selectedBet);
  const isSmallScreen = useMediaQuery('(max-width:1279px)');
  const navigate = useNavigate();
  const isLogin = isLoggedIn();
  const [bets, setBets] = useState([]);
  const dispatch = useDispatch();
  const addToBetPlace = (
    competition_name,
    eventId,
    selectionId,
    betDetails,
    game,
    OddsPrice,
    betType,
    selectType,
    name,
    market_id,
    _marketData,
    sportId,
    minimumBet,
    maximumBet,
  ) => {
    setBets([
      {
        marketId: String(market_id),
        eventId: Number(eventId),
        gameId: Number(sportId),
        selectionId: String(selectionId),
        betOn: selectType,
        price: parseFloat(OddsPrice),
        stake: '',
        eventType: game,
        competition: competition_name,
        event: name,
        market: betType,
        gameType: betType,
        nation: betDetails?.runnerName,
        type: selectType,
        calcFact: 0,
        bettingOn: betType,
        runners: 2,
        row: 1,
        matchName: name,
        percent: 100,
        selection: betDetails?.runnerName,
        minimumBet: minimumBet || '',
        maximumBet: maximumBet || '',
        _marketData,
      },
    ]);
    dispatch(setActiveBetSlipIndex(eventId));
  };

  useEffect(() => {
    if (bets.length > 0) dispatch(fetchBetDetailsAction(bets));
  }, [bets, dispatch]);

  const handleLiveTv = (eventId) => {
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'soccer' }),
    );
  };

  const totalMatched = 0;
  const totalMatchedCss = 0;
  // eslint-disable-next-line
  const FixtureData = FixtureData1.sort((a, b) => {
    return new Date(a.matchDateTime) - new Date(b.matchDateTime);
  });

  return (
    <>
      {data?.length === 0 ? (
        <div className=" flex h-[60px] rounded-br-lg mb-[1px] justify-center items-center overflow-hidden cursor-pointer bg-white hover:bg-[#f2f2f2]">
          NO DATA
        </div>
      ) : (
        <>
          {data &&
            data?.map((_items, index) => {
              let minLimitOdds, maxLimitOdds;
              if (_items.inplay) {
                minLimitOdds = _items?.inPlayMinLimit;
                maxLimitOdds = _items?.inPlayMaxLimit;
              } else {
                minLimitOdds = _items?.offPlayMinLimit;
                maxLimitOdds = _items?.offPlayMaxLimit;
              }

              return (
                <>
                  <div
                    key={index}
                    className="hidden md:grid grid-cols-5 rounded-br-lg mb-[1px] overflow-hidden cursor-pointer bg-white hover:bg-[#f2f2f2]"
                  >
                    <div className="col-span-2 px-1 py-2 flex items-center justify-between">
                      <div
                        onClick={() => {
                          if (_items?.total_matched < totalMatchedCss) {
                            return; // Prevent navigation if isDisabled is true
                          }
                          navigate(`/singlebet/soccer/${_items?.event_id}`, {
                            state: { data: _items },
                          });
                        }}
                        className="flex items-center"
                      >
                        <div className="flex flex-col gap-2">
                          <div>
                            <img
                              src="/images/home/football.png"
                              alt="ball"
                              height="15"
                              width="15"
                            />
                          </div>
                          <div>
                            <img
                              src="/images/home/star-yellow.png"
                              height="15"
                              width="15"
                            />
                          </div>
                        </div>
                        {_items?.runners ? (
                          <div className="flex flex-col gap-2 ml-2">
                            <span className="text-[#2C286A] text-[13px] leading-none">
                              1&nbsp;&nbsp;&nbsp;
                              {_items?.runners?.[0]?.runnerName || ''}
                            </span>
                            <span className="text-[#2C286A] text-[13px] leading-none">
                              2&nbsp;&nbsp;{' '}
                              {_items?.runners?.[1]?.runnerName || ''}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 ml-2">
                            <span className="text-[#2C286A] text-[13px] leading-none">
                              {_items?.name || ''}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mx-3">
                        {_items?.inplay && isLogin ? (
                          <>
                            {' '}
                            <div
                              onClick={() => handleLiveTv(_items.id)}
                              className="w-15 mr-10 lg:flex md:flex hidden flex-col items-center text-black capitalize justify-center text-10 pr-4"
                            >
                              <img
                                src="/images/more-option/live-tv.png"
                                alt="live-tv"
                                className="w-5 invert-image "
                              />
                              <span className="">Live TV</span>
                            </div>
                            {/* <DateFormatter dateTime={_items?.openDate} /> */}
                          </>
                        ) : (
                          <DateFormatter dateTime={_items?.matchDateTime} />
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 px-1 py-2">
                      <div className="grid grid-cols-6 gap-2 h-full text-black font-bold text-[13px]">
                        <div className="">
                          {_items?.runners?.[0]?.backPrice1 ? (
                            <button
                              className="col-span-1 h-full w-full flex items-center justify-center cursor-pointer bg-[#82CFFF] hover:border-2 hover:border-[#469dd3]"
                              onClick={() => {
                                if (isLogin) {
                                  addToBetPlace(
                                    _items?.competition_name,
                                    _items?.event_id || _items?.matchId,
                                    _items?.runners?.[0]?.selectionId,
                                    _items?.runners?.[0],
                                    'Soccer',
                                    _items?.runners?.[0]?.backPrice1,
                                    _items?.market_name,
                                    'BACK',
                                    _items?.name,
                                    _items?.market_id,
                                    _items?.runners,
                                    _items?.sportId,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
                                } else {
                                  navigate('/login');
                                }
                              }}
                            >
                              {_items?.runners?.[0]?.backPrice1}
                            </button>
                          ) : (
                            <DisableButton btncolor={'blue'} />
                          )}
                        </div>
                        <div className="">
                          {_items?.runners?.[0]?.layPrice1 ? (
                            <button
                              className="col-span-1 flex items-center justify-center cursor-pointer bg-[#FFB5BD]  hover:border-2 hover:border-[#d44a58] w-full h-full"
                              onClick={() => {
                                if (isLogin) {
                                  addToBetPlace(
                                    _items?.competition_name,
                                    _items?.event_id || _items?.matchId,
                                    _items?.runners?.[0]?.selectionId,
                                    _items?.runners?.[0],
                                    'Soccer',
                                    _items?.runners?.[0]?.layPrice1,
                                    _items?.market_name,
                                    'LAY',
                                    _items?.name,
                                    _items?.market_id,
                                    _items?.runners,
                                    _items?.sportId,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
                                } else {
                                  navigate('/login');
                                }
                              }}
                            >
                              {_items?.runners?.[0]?.layPrice1 || '-'}
                            </button>
                          ) : (
                            <DisableButton btncolor={'pink'} />
                          )}
                        </div>

                        <div className="">
                          {_items?.runners?.[2]?.backPrice1 ? (
                            <button
                              className="col-span-1 h-full w-full flex items-center justify-center cursor-pointer bg-[#82CFFF] hover:border-2 hover:border-[#469dd3]"
                              onClick={() => {
                                if (isLogin) {
                                  addToBetPlace(
                                    _items?.competition_name,
                                    _items?.event_id || _items?.matchId,
                                    _items?.runners?.[2]?.selectionId,
                                    _items?.runners?.[2],
                                    'Soccer',
                                    _items?.runners?.[2]?.backPrice1,
                                    _items?.market_name,
                                    'BACK',
                                    _items?.name,
                                    _items?.market_id,
                                    _items?.runners,
                                    _items?.sportId,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
                                } else {
                                  navigate('/login');
                                }
                              }}
                            >
                              {_items?.runners?.[2]?.backPrice1 || '-'}
                            </button>
                          ) : (
                            <DisableButton btncolor={'blue'} />
                          )}
                        </div>
                        <div className="">
                          {_items?.runners?.[2]?.layPrice1 ? (
                            <button
                              className="col-span-1 flex items-center justify-center cursor-pointer bg-[#FFB5BD]  hover:border-2 hover:border-[#d44a58] w-full h-full"
                              onClick={() => {
                                if (isLogin) {
                                  addToBetPlace(
                                    _items?.competition_name,
                                    _items?.event_id || _items?.matchId,
                                    _items?.runners?.[2]?.selectionId,
                                    _items?.runners?.[2],
                                    'Soccer',
                                    _items?.runners?.[2]?.layPrice1,
                                    _items?.market_name,
                                    'LAY',
                                    _items?.name,
                                    _items?.market_id,
                                    _items?.runners,
                                    _items?.sportId,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
                                } else {
                                  navigate('/login');
                                }
                              }}
                            >
                              {_items?.runners?.[2]?.layPrice1 || '-'}
                            </button>
                          ) : (
                            <DisableButton btncolor={'pink'} />
                          )}
                        </div>
                        <div className="">
                          {_items?.runners?.[1]?.backPrice1 ? (
                            <button
                              className="col-span-1 h-full w-full flex items-center justify-center cursor-pointer bg-[#82CFFF] hover:border-2 hover:border-[#469dd3]"
                              onClick={() => {
                                if (isLogin) {
                                  addToBetPlace(
                                    _items?.competition_name,
                                    _items?.event_id || _items?.matchId,
                                    _items?.runners?.[1]?.selectionId,
                                    _items?.runners?.[1],
                                    'Soccer',
                                    _items?.runners?.[1]?.backPrice1,
                                    _items?.market_name,
                                    'BACK',
                                    _items?.name,
                                    _items?.market_id,
                                    _items?.runners,
                                    _items?.sportId,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
                                } else {
                                  navigate('/login');
                                }
                              }}
                            >
                              {_items?.runners?.[2]?.backPrice1 || '-'}
                            </button>
                          ) : (
                            <DisableButton btncolor={'blue'} />
                          )}
                        </div>
                        <div className="">
                          {_items?.runners?.[1]?.layPrice1 ? (
                            <button
                              className="col-span-1 flex items-center justify-center cursor-pointer bg-[#FFB5BD]  hover:border-2 hover:border-[#d44a58] w-full h-full"
                              onClick={() => {
                                if (isLogin) {
                                  addToBetPlace(
                                    _items?.competition_name,
                                    _items?.competition_name,
                                    _items?.event_id || _items?.matchId,
                                    _items?.runners?.[1]?.selectionId,
                                    _items?.runners?.[1],
                                    'Soccer',
                                    _items?.runners?.[1]?.layPrice1,
                                    _items?.market_name,
                                    'LAY',
                                    _items?.name,
                                    _items?.market_id,
                                    _items?.runners,
                                    _items?.sportId,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
                                } else {
                                  navigate('/login');
                                }
                              }}
                            >
                              {_items?.runners?.[1]?.layPrice1 || '-'}
                            </button>
                          ) : (
                            <DisableButton btncolor={'pink'} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 px-1 py-2 relative border-l border-black">
                      <div className=" text-black font-bold text-[13px]">
                        <div className="flex gap-2 items-center justify-center">
                          <div className="flex flex-col items-center">
                            <div className="grid grid-cols-2 gap-2 h-full justify-center">
                              <div className="min-w-[45px] flex flex-col justify-center grow relative z-0 text-center min-h-[30px] cursor-not-allowed pointer-events-none opacity-50 bg-[#82CFFF] mx-[0.15em] my-0 ">
                                <span>-</span>
                              </div>
                              <div className="min-w-[45px] flex flex-col justify-center grow relative z-0 text-center min-h-[30px] cursor-not-allowed pointer-events-none opacity-50 bg-[#FFB5BD]  mx-[0.15em] my-0 ">
                                <span>-</span>
                              </div>
                            </div>
                            <div className="leading-none">
                              <span className="text-[8px] text-[#8b8b8b]">
                                {/* 20 Over Runs Only illy harris */}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            if (_items?.odds?.totalMatched < totalMatched) {
                              return; // Prevent navigation if isDisabled is true
                            }
                            navigate(`/singlebet/soccer/${_items?.event_id}`, {
                              state: { data: _items },
                            });
                          }}
                          className="absolute flex flex-col right-0 top-0 bottom-0"
                        >
                          <span className="bg-black text-[8px] px-1 py-1 font-medium text-white text-center cursor-pointer leading-[12px]">
                            More +
                          </span>
                          <span className="bg-[#ECEDF0] text-center text-[8px] px-1 py-1 cursor-pointer leading-[12px]">
                            EX
                          </span>
                          <span className="text-[#6778E3] text-[8px] px-1 py-1 cursor-pointer leading-[12px]">
                            FANCY
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ) : (
                    ''
                  )} */}

                  {/* mobile table START */}
                  <div className="block md:hidden bg-white mb-1">
                    {/* <div
                      onClick={() => {
                        if (_items?.odds?.totalMatched < totalMatchedCss) {
                          return; // Prevent navigation if isDisabled is true
                        }
                        navigate(`/singlebet/soccer/${_items?.event_id}`, {
                          state: { data: _items },
                        });
                      }}
                      className="flex h-[30px]"
                    >
                      <div className="min-w-[35px] sm:w-[70px] grid place-content-center">
                        <img
                          src="/images/home/football.png"
                          alt="ball"
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="flex-1 flex items-center bg-[#DBDBDB] rounded-bl-md px-2 gap-3">
                        {_items?.odds?.runners?.[0]?.runnerName ? (
                          <>
                            <div className="flex-1">
                              <span className="text-12 text-black font-semibold truncate w-[100px] sm:w-[150px] block">
                                {_items?.odds?.runners?.[0]?.runnerName}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-[#797979] font-medium flex-col flex items-center">
                                <DateFormatter
                                  dateTime={_items?.matchDateTime}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="text-12 text-black font-semibold truncate w-[100px] sm:w-[150px] block">
                                {_items?.odds?.runners?.[1]?.runnerName}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <span className="text-12 text-black font-semibold truncate w-[215px] sm:w-[150px] block">
                                {_items?.name || ''}
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-12 text-black font-semibold truncate w-[100px] sm:w-[150px] block">
                                <DateFormatter
                                  dateTime={_items?.matchDateTime}
                                />
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div> */}
                    <MobileMatchHeading data={_items} sport="soccer" />

                    <div className="flex my-2 h-[40px]">
                      <div className="min-w-[35px] sm:w-[70px] grid place-content-center">
                        <img
                          src="/images/home/star-yellow.png"
                          className="w-4 md:w-6 object-cover"
                          alt="star"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 h-full w-full text-black font-bold text-[12px] mr-2">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="">
                            {_items?.runners?.[0]?.backPrice1 ? (
                              <button
                                className="col-span-1 h-full w-full flex items-center justify-center cursor-pointer bg-[#82CFFF] hover:border-2 hover:border-[#469dd3]"
                                onClick={() => {
                                  if (isLogin) {
                                    addToBetPlace(
                                      _items?.competition_name,
                                      _items?.event_id || _items?.matchId,
                                      _items?.runners?.[0]?.selectionId,
                                      _items?.runners?.[0],
                                      'Soccer',
                                      _items?.runners?.[0]?.backPrice1,
                                      _items?.market_name,
                                      'BACK',
                                      _items?.name,
                                      _items?.market_id,
                                      _items?.runners,
                                      _items?.sportId,
                                      minLimitOdds,
                                      maxLimitOdds,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              >
                                {_items?.runners?.[0]?.backPrice1}
                              </button>
                            ) : (
                              <DisableButton btncolor={'blue'} />
                            )}
                          </div>
                          <div className="">
                            {_items?.runners?.[0]?.layPrice1 ? (
                              <button
                                className="col-span-1 flex items-center justify-center cursor-pointer bg-[#FFB5BD]  hover:border-2 hover:border-[#d44a58] w-full h-full"
                                onClick={() => {
                                  if (isLogin) {
                                    addToBetPlace(
                                      _items?.competition_name,
                                      _items?.event_id || _items?.matchId,
                                      _items?.runners?.[0]?.selectionId,
                                      _items?.runners?.[0],
                                      'Soccer',
                                      _items?.runners?.[0]?.layPrice1,
                                      _items?.market_name,
                                      'LAY',
                                      _items?.name,
                                      _items?.market_id,
                                      _items?.runners,
                                      _items?.sportId,
                                      minLimitOdds,
                                      maxLimitOdds,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              >
                                {_items?.runners?.[0]?.layPrice1 || '-'}
                              </button>
                            ) : (
                              <DisableButton btncolor={'pink'} />
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="">
                            {_items?.runners?.[2]?.backPrice1 ? (
                              <button
                                className="col-span-1 h-full w-full flex items-center justify-center cursor-pointer bg-[#82CFFF] hover:border-2 hover:border-[#469dd3]"
                                onClick={() => {
                                  if (isLogin) {
                                    addToBetPlace(
                                      _items?.competition_name,
                                      _items?.event_id || _items?.matchId,
                                      _items?.runners?.[2]?.selectionId,
                                      _items?.runners?.[2],
                                      'Soccer',
                                      _items?.runners?.[2]?.backPrice1,
                                      _items?.market_name,
                                      'BACK',
                                      _items?.name,
                                      _items?.market_id,
                                      _items?.runners,
                                      _items?.sportId,
                                      minLimitOdds,
                                      maxLimitOdds,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              >
                                {_items?.runners?.[2]?.backPrice1 || '-'}
                              </button>
                            ) : (
                              <DisableButton btncolor={'blue'} />
                            )}
                          </div>
                          <div className="">
                            {_items?.runners?.[2]?.layPrice1 ? (
                              <button
                                className="col-span-1 flex items-center justify-center cursor-pointer bg-[#FFB5BD]  hover:border-2 hover:border-[#d44a58] w-full h-full"
                                onClick={() => {
                                  if (isLogin) {
                                    addToBetPlace(
                                      _items?.competition_name,
                                      _items?.event_id || _items?.matchId,
                                      _items?.runners?.[2]?.selectionId,
                                      _items?.runners?.[2],
                                      'Soccer',
                                      _items?.runners?.[2]?.layPrice1,
                                      _items?.market_name,
                                      'LAY',
                                      _items?.name,
                                      _items?.market_id,
                                      _items?.runners,
                                      _items?.sportId,
                                      minLimitOdds,
                                      maxLimitOdds,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              >
                                {_items?.runners?.[2]?.layPrice1 || '-'}
                              </button>
                            ) : (
                              <DisableButton btncolor={'pink'} />
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="">
                            {_items?.runners?.[1]?.backPrice1 ? (
                              <button
                                className="col-span-1 h-full w-full flex items-center justify-center cursor-pointer bg-[#82CFFF] hover:border-2 hover:border-[#469dd3]"
                                onClick={() => {
                                  if (isLogin) {
                                    addToBetPlace(
                                      _items?.competition_name,
                                      _items?.event_id || _items?.matchId,
                                      _items?.runners?.[1]?.selectionId,
                                      _items?.runners?.[1],
                                      'Soccer',
                                      _items?.runners?.[1]?.backPrice1,
                                      _items?.market_name,
                                      'BACK',
                                      _items?.name,
                                      _items?.market_id,
                                      _items?.runners,
                                      _items?.sportId,
                                      minLimitOdds,
                                      maxLimitOdds,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              >
                                {_items?.runners?.[2]?.backPrice1 || '-'}
                              </button>
                            ) : (
                              <DisableButton btncolor={'blue'} />
                            )}
                          </div>
                          <div className="">
                            {_items?.runners?.[1]?.layPrice1 ? (
                              <button
                                className="col-span-1 flex items-center justify-center cursor-pointer bg-[#FFB5BD]  hover:border-2 hover:border-[#d44a58] w-full h-full"
                                onClick={() => {
                                  if (isLogin) {
                                    addToBetPlace(
                                      _items?.competition_name,
                                      _items?.competition_name,
                                      _items?.event_id || _items?.matchId,
                                      _items?.runners?.[1]?.selectionId,
                                      _items?.runners?.[1],
                                      'Soccer',
                                      _items?.runners?.[1]?.layPrice1,
                                      _items?.market_name,
                                      'LAY',
                                      _items?.name,
                                      _items?.market_id,
                                      _items?.runners,
                                      _items?.sportId,
                                      minLimitOdds,
                                      maxLimitOdds,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              >
                                {_items?.runners?.[1]?.layPrice1 || '-'}
                              </button>
                            ) : (
                              <DisableButton btncolor={'pink'} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isLoggedIn() &&
                    betData?.length > 0 &&
                    isSmallScreen &&
                    activeBetSlip == Number(_items?.matchId) && <BetSlip />}
                  {/* mobile table END */}
                </>
              );
            })}{' '}
        </>
      )}
    </>
  );
};
PopularFixtureFootball.propTypes = {
  data: PropTypes.array.isRequired,
};
export default PopularFixtureFootball;
