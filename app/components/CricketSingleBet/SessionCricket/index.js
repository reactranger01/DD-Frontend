import BlueButton from '@/components/BlueButton';
import BettingOption from '@/components/MoreOption/BettingOption';
import PinkButton from '@/components/PinkButton';
import StatusButton from '@/components/StatusButton';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { intToString } from '@/utils/mergeData';
import { useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SessionCricket = ({
  sessionBooksetClcuData,
  data,
  matchName,
  //   eslint-disable-next-line
  particularMatchData,
  //   eslint-disable-next-line
  competition_name,
  oddsData,
}) => {
  const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const isLogin = isLoggedIn();
  const inplay = oddsData?.inplay;
  //   eslint-disable-next-line
  const [singleRowData, setSingleRowData] = useState({});
  //   eslint-disable-next-line
  const userIdBalance = useSelector((state) => state?.user);
  //   eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  //   eslint-disable-next-line
  const [riskData, setRiskData] = useState([]);
  const isMobile = useMediaQuery('(max-width:1024px)');
  const stateUpdate = useSelector(
    (state) => state?.updatestate?.betPlacementSuccess,
  );
  //   eslint-disable-next-line
  const [bets, setBets] = useState([]);

  const addToNormalBetPlace = async (
    item,
    betType,
    index,
    price,
    betOn,
    matchName,
    percent,
    nationName,
    fancy,
    minimumBet,
    maximumBet,
  ) => {
    setBets({
      marketId: String(particularMatchData?.marketId),
      eventId: Number(fancy?.eventId),
      gameId: 4,
      selectionId: String(item.SelectionId),
      betOn: betType,
      price: parseFloat(price),
      stake: '',
      eventType: 'Cricket',
      competition: competition_name,
      event: particularMatchData?.eventName,
      market: fancy.market,
      gameType: betOn,
      nation: nationName,
      type: betType,
      runners: 2,
      row: index,
      calcFact: betOn === 'fancy' ? 0 : 1,
      bettingOn: betOn,
      matchName: matchName,
      percent: parseFloat(percent),
      selection: item.RunnerName,
      minimumBet: minimumBet,
      maximumBet: maximumBet,
      _marketData: fancy,
    });

    // dispatch(setActiveBetSlipIndex(Number(item.SelectionId)));
    if (!isMobile) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const getSessionData = async () => {
    setLoading(true);
    try {
      const response = await getAuthData(
        `/user/getsessionPLbyuserid?eventId=${singleRowData?.eventId}&gameId=${singleRowData?.gameId}&selectionId=${singleRowData?.selectionId}&userId=${singleRowData?.userId}&gameType=${singleRowData?.gameType}&commision=${singleRowData?.commision}`,
      );

      if (response?.status === 201 || response?.status === 200) {
        if (response?.data) {
          setRiskData(response?.data);
        }
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      return null;
    }
    setLoading(false);
  };
  useEffect(() => {
    if (
      singleRowData?.eventId &&
      singleRowData?.gameId &&
      singleRowData?.selectionId &&
      singleRowData?.userId
    ) {
      getSessionData();
    }
    // eslint-disable-next-line
  }, [
    singleRowData?.eventId,
    singleRowData?.gameId,
    singleRowData?.selectionId,
    singleRowData?.userId,
    stateUpdate,
  ]);
  return (
    <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
      <div className="w-full flex flex-col">
        <BettingOption
          title={'SESSIONS'}
          heading1={'No'}
          heading2={'Yes'}
          //   handleClick={handleSessionsShow}
          //   showIcon={sessionsShow}
        />
        {data &&
          data?.catalogue &&
          data?.catalogue?.[0]?.runners?.map((items, index) => {
            const profitLoss = Array.isArray(sessionBooksetClcuData)
              ? sessionBooksetClcuData.find(
                  (fancy) =>
                    Number(fancy.selection_id) === Number(items?.SelectionId),
                )
              : null;
            let minLimitsession, maxLimitsession;
            if (inplay) {
              minLimitsession = oddsData?.inPlayFancyMinLimit;
              maxLimitsession = oddsData?.inPlayFancyMaxLimit;
            } else {
              minLimitsession = oddsData?.offPlayFancyMinLimit;
              maxLimitsession = oddsData?.offPlayFancyMaxLimit;
            }
            return (
              <div
                key={index}
                className="mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1 "
              >
                <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                  <div>
                    <div className="flex flex-col cursor-pointer justify-center">
                      <span className="capitalize text-14 leading-5 font-medium m-0 font-inter">
                        {items?.RunnerName}
                      </span>
                    </div>
                    <div className="flex gap-[2px] ">
                      {profitLoss?.max_loss && (
                        <span className="text-12 text-black">
                          Max Exposure:
                        </span>
                      )}
                      <span
                        className={`text-12  font-semibold ${
                          profitLoss?.max_loss > 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {profitLoss?.max_loss.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                  </div>
                </div>

                <div className="flex basis-[60%] md:justify-center justify-end relative  min-w-0 p-0">
                  <div className="flex w-full justify-center md:flex-none flex-1">
                    <div className="w-1/3 md:flex hidden"></div>
                    <div className="flex md:w-1/3 w-full justify-center md:p-0 p-1">
                      {items?.GameStatus === '' ||
                      items?.GameStatus === 'ACTIVE' ? (
                        <div className="flex flex-1 ">
                          <PinkButton
                            layPrize={items?.LayPrice1 || '0'}
                            laySize={
                              items?.LaySize1 && items?.LayPrice1
                                ? intToString(items?.LaySize1)
                                : '0'
                            }
                            onClick={async () => {
                              if (isLogin) {
                                await addToNormalBetPlace(
                                  items,
                                  'LAY',
                                  index,
                                  items.LayPrice1,
                                  data.market,
                                  matchName,
                                  items.LaySize1,
                                  items.RunnerName,
                                  data,
                                  minLimitsession,
                                  maxLimitsession,
                                );
                              } else {
                                navigate('/login');
                              }
                            }}
                          />
                          <BlueButton
                            backPrize={items?.BackPrice1 || '0'}
                            backSize={
                              items?.BackSize1 && items?.BackPrice1
                                ? intToString(items?.BackSize1)
                                : '0'
                            }
                            onClick={async () => {
                              if (isLogin) {
                                await addToNormalBetPlace(
                                  items,
                                  'BACK',
                                  index,
                                  items.BackPrice1,
                                  data.market,
                                  matchName,
                                  items.BackSize1,
                                  items.RunnerName,
                                  data,
                                  minLimitsession,
                                  maxLimitsession,
                                );
                              } else {
                                navigate('/login');
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center md:w-1/3 flex-1">
                          <StatusButton status={items?.GameStatus} />
                        </div>
                      )}
                    </div>

                    <div className="hidden w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]">
                      <p className="leading-[17px] text-black text-12">
                        Min Bet: {minLimitsession}
                      </p>
                      <p className="leading-[17px] text-black text-12">
                        Max Bet: {maxLimitsession}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
SessionCricket.propTypes = {
  matchName: PropTypes.string,
  sessionBooksetClcuData: PropTypes.any,
  data: PropTypes.object,
  particularMatchData: PropTypes.object,
  marketId: PropTypes.any,
  competition_name: PropTypes.string,
  oddsData: PropTypes.object,
};
export default SessionCricket;
