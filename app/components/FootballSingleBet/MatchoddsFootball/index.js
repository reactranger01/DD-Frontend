import BlueButton from '@/components/BlueButton';
import BettingOption from '@/components/MoreOption/BettingOption';
import PinkButton from '@/components/PinkButton';
import { isLoggedIn } from '@/utils/apiHandlers';
import { updatePlacedBetCalculation } from '@/utils/helper';
import { reactIcons } from '@/utils/icons';
import { useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MatchoddsFootball = ({
  heading,
  data,
  fixtureEventName,
  placedBetWinLossDatas,
  competition_name,
}) => {
  const navigate = useNavigate();
  const isLogin = isLoggedIn();
  const [bets, setBets] = useState([]);
  const inplay = data?.inplay;
  // const betData = useSelector((state) => state.bet.selectedBet);
  const isMobile = useMediaQuery('(max-width:1024px)');
  // const activeBetSlip = useSelector((state) => state.activeNewBet.activeIndex);
  const calculation = useSelector((state) => state?.calculation?.currentValue);
  const updatedCalculation = calculation
    ? updatePlacedBetCalculation(calculation, heading, placedBetWinLossDatas)
    : placedBetWinLossDatas;
  const dispatch = useDispatch();
  useEffect(() => {
    if (bets?.length > 0) {
      // dispatch(fetchBetDetailsAction(bets));
      if (isMobile) {
        // dispatch(setActiveBetSlipIndex(bets[0]?.selectionId));
      }
    }
  }, [bets, dispatch, isMobile]);

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
        marketId: String(_marketData?.market_id),
        eventId: Number(eventId),
        gameId: 1,
        selectionId: String(selectionId),
        betOn: selectType,
        price: parseFloat(OddsPrice),
        stake: '',
        eventType: game,
        competition: competition_name,
        event: data?.name,
        market: _marketData?.market_name,
        gameType: _marketData?.market_name,
        nation: betDetails,
        type: selectType,
        calcFact: 0,
        bettingOn: betType,
        runners: 2,
        row: 1,
        matchName: data?.name,
        percent: 100,
        selection: betDetails,
        minimumBet: minimumBet || '',
        maximumBet: maximumBet || '',
        _marketData,
      },
    ]);
  };
  let minLimitOdds, maxLimitOdds;
  if (inplay) {
    minLimitOdds = fixtureEventName?.events?.[0]?.inPlayMinLimit;
    maxLimitOdds = fixtureEventName?.events?.[0]?.inPlayMaxLimit;
  } else {
    minLimitOdds = fixtureEventName?.events?.[0]?.offPlayMinLimit;
    maxLimitOdds = fixtureEventName?.events?.[0]?.offPlayMaxLimit;
  }
  return (
    <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
      <div className="w-full flex flex-col">
        <BettingOption
          title={'MATCH ODDS'}
          heading1={isMobile ? '' : 'Back'}
          heading2={isMobile ? '' : 'Lay'}
          // handleClick={handleOddsShow}
          // showIcon={oddsShow}
        />
        {/* Back&lay */}
        <div className="md:hidden flex justify-around items-center font-inter font-semibold text-[13px] p-2 bg-[#DDE1E7]">
          <div className="text-[rgb(3,117,204)]">Back</div>
          <div className="text-[rgb(224,60,60)]">Lay</div>
        </div>
        {data &&
          data?.runners &&
          data?.runners?.map((items, index) => {
            const matchOddsExposer =
              updatedCalculation?.type == 'odds' &&
              updatedCalculation?.exposer != ''
                ? updatedCalculation?.exposer?.find(
                    (odd) =>
                      odd?.id == items?.selectionId &&
                      odd?.marketName == data?.market_name,
                  )
                : '';
            return (
              <div
                key={index}
                className="mb-5 md:mb-0.5 w-full flex md:flex-row flex-col text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter"
              >
                <div className="basis-[40%] text-sm font-[normal] p-2 md:p-0 flex md:justify-start justify-center items-center pl-[2em] border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                  <div>
                    <div
                      // onClick={() =>
                      //   handleOpenModal(
                      //     items?.selectionId,
                      //     runnerName,
                      //     'MATCH_ODDS',
                      //   )
                      // }
                      className="flex cursor-pointer flex-col justify-center text-xs"
                    >
                      <h1 className="flex items-center justify-between w-full  px-2 capitalize text-sm font-medium m-0 font-inter">
                        {items?.runnerName}
                        {matchOddsExposer ? (
                          <>
                            <div>
                              <div
                                className={`flex gap-1 font-semibold text-14 items-center ${
                                  matchOddsExposer?.type == 'profit'
                                    ? 'text-[#04a928]'
                                    : 'text-[#CE2C16]'
                                }`}
                              >
                                <span className=" ">
                                  {reactIcons?.doubleArrowR}{' '}
                                </span>
                                <span className=" ">
                                  {Number(matchOddsExposer?.data || 0).toFixed(
                                    2,
                                  )}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                      </h1>
                    </div>
                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                  </div>
                </div>

                <div className="flex basis-[60%] justify-center relative min-w-0 p-0">
                  <div className="flex w-full">
                    <BlueButton
                      backPrize={items?.backPrice3 || '0'}
                      backSize={
                        items?.backsize3 && items?.backPrice3
                          ? items?.backsize3 || 0
                          : '0'
                      }
                      onClick={async () => {
                        if (isLogin) {
                          await addToBetPlace(
                            data?.eventid || data?.matchId,
                            items?.selectionId,
                            items?.runnerName,
                            'Soccer',
                            items?.backPrice3,
                            data?.market_name,
                            'BACK',
                            data,
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
                      backPrize={items?.backPrice2 || '0'}
                      backSize={
                        items?.backsize2 && items?.backPrice2
                          ? items?.backsize2 || 0
                          : '0'
                      }
                      onClick={async () => {
                        if (isLogin) {
                          await addToBetPlace(
                            data?.eventid || data?.matchId,
                            items?.selectionId,
                            items?.runnerName,
                            'Soccer',
                            items?.backPrice2,
                            data?.market_name,
                            'BACK',
                            data,
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
                      backPrize={items?.backPrice1 || '0'}
                      backSize={
                        items?.backsize1 && items?.backPrice1
                          ? items?.backsize1 || 0
                          : '0'
                      }
                      onClick={async () => {
                        if (isLogin) {
                          await addToBetPlace(
                            data?.eventid || data?.matchId,
                            items?.selectionId,
                            items?.runnerName,
                            'Soccer',
                            items?.backPrice1,
                            data?.market_name,
                            'BACK',
                            data,
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
                      layPrize={items?.layPrice1 || '0'}
                      laySize={
                        items?.laysize1 && items?.layPrice1
                          ? items?.laysize1 || 0
                          : '0'
                      }
                      onClick={async () => {
                        if (isLogin) {
                          await addToBetPlace(
                            data?.eventid || data?.matchId,
                            items?.selectionId,
                            items?.runnerName,
                            'Soccer',
                            items?.layPrice1,
                            data?.market_name,
                            'LAY',
                            data,
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
                      layPrize={items?.layPrice2 || '0'}
                      laySize={
                        items?.laysize2 && items?.layPrice2
                          ? items?.laysize2 || 0
                          : '0'
                      }
                      onClick={async () => {
                        if (isLogin) {
                          await addToBetPlace(
                            data?.eventid || data?.matchId,
                            items?.selectionId,
                            items?.runnerName,
                            'Soccer',
                            items?.layPrice2,
                            data?.market_name,
                            'LAY',
                            data,
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
                      layPrize={items?.layPrice3 || '0'}
                      laySize={
                        items?.laysize3 && items?.layPrice3
                          ? items?.laysize3 || 0
                          : '0'
                      }
                      onClick={async () => {
                        if (isLogin) {
                          await addToBetPlace(
                            data?.eventid || data?.matchId,
                            items?.selectionId,
                            items?.runnerName,
                            'Soccer',
                            items?.layPrice3,
                            data?.market_name,
                            'LAY',
                            data,
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
      </div>
    </div>
  );
};

MatchoddsFootball.propTypes = {
  heading: PropTypes.string,
  data: PropTypes.array,
  fixtureEventName: PropTypes.array,
  placedBetWinLossDatas: PropTypes.object,
  competition_name: PropTypes.string,
};

export default MatchoddsFootball;
