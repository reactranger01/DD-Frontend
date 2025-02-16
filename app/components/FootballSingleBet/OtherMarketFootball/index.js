import { BetSlip } from '@/components';
import BlueButton from '@/components/BlueButton';
import BettingOption from '@/components/MoreOption/BettingOption';
import PinkButton from '@/components/PinkButton';
import StatusButton from '@/components/StatusButton';
import { fetchBetDetailsAction } from '@/redux/actions';
import { setActiveBetSlipIndex } from '@/redux/Slices/newBetSlice';
import { isLoggedIn } from '@/utils/apiHandlers';
import { updatePlacedBetCalculation } from '@/utils/helper';
import { reactIcons } from '@/utils/icons';
import { useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OtherMarketFootball = ({
  heading,
  data,
  type,
  placedBetWinLossDatas,
  competition_name,
}) => {
  const navigate = useNavigate();
  const isLogin = isLoggedIn();
  const inplay = data.inplay;
  // const betData = useSelector((state) => state.bet.selectedBet);
  const isMobile = useMediaQuery('(max-width:1024px)');
  // const activeBetSlip = useSelector((state) => state.activeNewBet.activeIndex);
  const calculation = useSelector((state) => state?.calculation?.currentValue);
  const updatedCalculation = calculation
    ? updatePlacedBetCalculation(calculation, heading, placedBetWinLossDatas)
    : placedBetWinLossDatas;

  const dispatch = useDispatch();
  const activeBetSlip = useSelector((state) => state.activeNewBet.activeIndex);
  const betData = useSelector((state) => state.bet.selectedBet);
  const isSmallScreen = useMediaQuery('(max-width:1279px)');
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
    const bet = {
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
    };

    dispatch(fetchBetDetailsAction([bet]));
    dispatch(setActiveBetSlipIndex(selectionId));

    if (!isMobile) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };
  let minLimitOdds, maxLimitOdds;
  if (inplay) {
    minLimitOdds = data.inPlayMinLimit;
    maxLimitOdds = data.inPlayMaxLimit;
  } else {
    minLimitOdds = data.offPlayMinLimit;
    maxLimitOdds = data.offPlayMaxLimit;
  }

  return (
    <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
      <div className="w-full flex flex-col">
        <BettingOption
          title={heading}
          heading1={'Back'}
          heading2={'Lay'}
          // handleClick={handleBookmakerShow}
          // showIcon={bookmakerShow}
        />
        {data &&
          data?.runners &&
          data?.runners?.map((items, index) => {
            const underMarketExposer =
              updatedCalculation?.type == 'odds' &&
              updatedCalculation?.exposer != ''
                ? updatedCalculation?.exposer?.find(
                    (odd) =>
                      odd?.id == items?.selectionId &&
                      odd?.marketName == data?.market_name,
                  )
                : '';

            return (
              <>
                <div
                  key={index}
                  className="mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1"
                >
                  <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                    <div>
                      <div
                        // onClick={() =>
                        //   handleOpenModal(
                        //     items?.selectionId,
                        //     runnerName,
                        //     'bookmaker',
                        //   )
                        // }
                        className="flex cursor-pointer flex-col justify-center"
                      >
                        <h1 className="capitalize text-sm font-medium m-0 font-inter">
                          {/* {items?.runnerName} */}
                          {items?.runnerName}
                          {underMarketExposer ? (
                            <>
                              <div>
                                <div
                                  className={`flex gap-1 font-semibold text-14 items-center ${
                                    underMarketExposer?.type == 'profit'
                                      ? 'text-[#04a928]'
                                      : 'text-[#CE2C16]'
                                  }`}
                                >
                                  <span className=" ">
                                    {reactIcons?.doubleArrowR}{' '}
                                  </span>
                                  <span className=" ">
                                    {Number(
                                      underMarketExposer?.data || 0,
                                    ).toFixed(2)}
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
                                items?.backPrice1 && items?.backsize1
                                  ? items?.backsize1
                                  : '0'
                              }
                              onClick={async () => {
                                if (isLogin) {
                                  await addToBetPlace(
                                    data?.eventid || data?.matchId,
                                    items?.selectionId,
                                    items?.runnerName,
                                    'Soccer',
                                    items?.backPrice1 ||
                                      items?.back?.[0]?.price,
                                    data?.market_name,
                                    'BACK',
                                    data,
                                    type,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
                                } else {
                                  navigate('/login');
                                }
                              }}
                            />
                            <PinkButton
                              layPrize={items?.layPrice1 || '0'}
                              laySize={
                                items?.layPrice1 && items?.laysize1
                                  ? items?.laysize1
                                  : ''
                              }
                              onClick={async () => {
                                if (isLogin) {
                                  await addToBetPlace(
                                    data?.eventid || data?.matchId,
                                    items?.selectionId,
                                    items?.runnerName,
                                    'Soccer',
                                    items?.layPrice1 || items?.lay?.[0]?.price,
                                    data?.market_name,
                                    'LAY',
                                    data,
                                    type,
                                    minLimitOdds,
                                    maxLimitOdds,
                                  );
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
                {isLoggedIn() &&
                  betData?.length > 0 &&
                  isSmallScreen &&
                  activeBetSlip == Number(items?.selectionId) && <BetSlip />}
              </>
            );
          })}
      </div>
    </div>
  );
};

OtherMarketFootball.propTypes = {
  heading: PropTypes.string,
  data: PropTypes.array,
  fixtureEventName: PropTypes.array,
  type: PropTypes.string,
  placedBetWinLossDatas: PropTypes.object,
  competition_name: PropTypes.string,
};

export default OtherMarketFootball;
