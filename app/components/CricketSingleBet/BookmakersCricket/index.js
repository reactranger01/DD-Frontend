import BlueButton from '@/components/BlueButton';
import BettingOption from '@/components/MoreOption/BettingOption';
import PinkButton from '@/components/PinkButton';
import StatusButton from '@/components/StatusButton';
import { isLoggedIn } from '@/utils/apiHandlers';
import { updatePlacedBetCalculation } from '@/utils/helper';
import { reactIcons } from '@/utils/icons';
import { intToString } from '@/utils/mergeData';
import { useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookmakersCricket = ({
  heading,
  data,
  placedBetWinLossBookmakerData,
  competition_name,
  oddsData,
  matchName,
}) => {
  const navigate = useNavigate();
  const isLogin = isLoggedIn();
  const EventId = data['0']?.EventID;
  const [bets, setBets] = useState([]);
  const isMobile = useMediaQuery('(max-width:1024px)');
  const calculation = useSelector((state) => state?.calculation?.currentValue);
  const updatedCalculation = calculation
    ? updatePlacedBetCalculation(
        calculation,
        heading,
        placedBetWinLossBookmakerData,
      )
    : placedBetWinLossBookmakerData;
  const inplay = oddsData?.inplay;
  const dispatch = useDispatch();
  useEffect(() => {
    if (bets?.length > 0) {
      //   dispatch(fetchBetDetailsAction(bets));
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
    console.log(OddsPrice, 'OddsPrice');
    if (OddsPrice > 1) {
      console.log('bookmaker data', eventId);
      setBets([
        {
          marketId: String(data?.market_id),
          eventId: Number(eventId || EventId),
          gameId: 4,
          selectionId: String(selectionId),
          betOn: selectType,
          price: parseFloat(OddsPrice),
          stake: '',
          eventType: game,
          competition: competition_name,
          event: matchName,
          market: 'bookmaker',
          gameType: 'bookmaker',
          nation: betDetails,
          type: selectType,
          calcFact: 0,
          bettingOn: 'bookmaker',
          runners: 2,
          row: 1,
          matchName: matchName,
          percent: 100,
          selection: betDetails,
          minimumBet: minimumBet,
          maximumBet: maximumBet,
          _marketData,
        },
      ]);
    } else {
      toast.error('Market not available');
    }
  };
  return (
    <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
      <div className="w-full flex flex-col">
        <BettingOption
          title={'BOOKMAKER'}
          heading1={'Back'}
          heading2={'Lay'}
          //   handleClick={handleBookmakerShow}
          //   showIcon={bookmakerShow}
        />
        {data['0'] &&
          data['0']?.runners &&
          data['0']?.runners?.map((items, index) => {
            const bookmakerExposer =
              updatedCalculation?.type == 'bookmaker' &&
              updatedCalculation?.exposer != ''
                ? updatedCalculation?.exposer?.find(
                    (odd) => odd?.id == items?.selectionId,
                  )
                : '';
            let minLimitBookmaker, maxLimitBookmaker;
            if (inplay) {
              minLimitBookmaker = oddsData?.inPlayBookMinLimit;
              maxLimitBookmaker = oddsData?.inPlayBookMaxLimit;
            } else {
              minLimitBookmaker = oddsData?.offPlayBookMinLimit;
              maxLimitBookmaker = oddsData?.offPlayBookMaxLimit;
            }
            return (
              <div
                key={index}
                className="mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1 "
              >
                <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                  <div>
                    <div
                      //   onClick={() =>
                      //     handleOpenModal(
                      //       items?.selectionId,
                      //       items?.runnerName,
                      //       'bookmaker',
                      //     )
                      //   }
                      className="flex cursor-pointer flex-col justify-center"
                    >
                      <h1 className="capitalize text-sm font-medium m-0 font-inter">
                        {items?.runnerName}
                      </h1>
                    </div>
                    {bookmakerExposer ? (
                      <>
                        <div>
                          <div
                            className={`flex gap-1 font-semibold text-14 items-center ${
                              bookmakerExposer?.type == 'profit'
                                ? 'text-[#04a928]'
                                : 'text-[#CE2C16]'
                            }`}
                          >
                            <span className=" ">
                              {reactIcons?.doubleArrowR}{' '}
                            </span>
                            <span className=" ">
                              {Number(bookmakerExposer?.data || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                  </div>
                </div>

                <div className="flex basis-[60%] md:justify-center justify-end relative min-w-0 p-0">
                  <div className="flex w-full justify-center md:flex-none flex-1">
                    {/* <div className="w-[172px] flex flex-col justify-center grow relative z-0 text-center min-h-[42px] cursor-not-allowed pointer-events-none opacity-50 mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div> */}
                    <div className=" md:flex w-1/3 hidden"></div>
                    <div className="flex md:w-1/3 w-full justify-center md:p-0 p-1">
                      {items?.status === '' || items?.status === 'ACTIVE' ? (
                        <div className="flex flex-1">
                          <BlueButton
                            backPrize={items?.backPrice1 || '0'}
                            backSize={
                              items?.backsize1 && items?.backPrice1
                                ? intToString(items?.backsize1)``
                                : '0'
                            }
                            onClick={async () => {
                              if (isLogin) {
                                await addToBetPlace(
                                  EventId,
                                  items?.selectionId,
                                  items?.runnerName,
                                  'Cricket',
                                  items?.backPrice1,
                                  data?.marketName,
                                  'BACK',
                                  data,
                                  'BOOKMAKERS',
                                  minLimitBookmaker,
                                  maxLimitBookmaker,
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
                            layPrize={items?.layPrice1 || '0'}
                            laySize={
                              items?.laysize1 && items?.layPrice1
                                ? intToString(items?.laysize1)
                                : '0'
                            }
                            onClick={async () => {
                              if (isLogin) {
                                await addToBetPlace(
                                  EventId,
                                  items?.selectionId,
                                  items?.runnerName,
                                  'Cricket',
                                  items?.layPrice1,
                                  data?.marketName,
                                  'LAY',
                                  data,
                                  'BOOKMAKERS',
                                  minLimitBookmaker,
                                  maxLimitBookmaker,
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
                          <StatusButton status={items?.status} />
                        </div>
                      )}
                    </div>
                    <div className=" hidden md:w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
BookmakersCricket.propTypes = {
  heading: PropTypes.string,
  data: PropTypes.object,
  placedBetWinLossBookmakerData: PropTypes.object,
  competition_name: PropTypes.string,
  matchName: PropTypes.string,
  oddsData: PropTypes.object,
};

export default BookmakersCricket;
