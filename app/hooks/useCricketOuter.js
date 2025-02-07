import { fetchBetDetailsAction } from '@/redux/actions';
import { setActiveBetSlipIndex } from '@/redux/Slices/newBetSlice';
import { isLoggedIn } from '@/utils/apiHandlers';
import { getFixtureData } from '@/utils/helper';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useCricketOuter = () => {
  const isLogin = isLoggedIn();
  const [isLoading, setisLoading] = useState(false);
  const [loaderOneTime, setLoaderOneTime] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const betData = useSelector((state) => state.bet.selectedBet);
  const [inplayTrue, setInplayTrue] = useState([]);
  const [inplayFalse, setInplayFalse] = useState([]);
  const navigate = useNavigate();
  const [bets, setBets] = useState([]);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:1024px)');
  const activeBetSlip = useSelector((state) => state.activeNewBet.activeIndex);
  useEffect(() => {
    if (bets?.length > 0) {
      dispatch(fetchBetDetailsAction(bets));
      if (isMobile) {
        dispatch(setActiveBetSlipIndex(bets[0]?.eventId));
      }
    }
  }, [bets, dispatch, isMobile]);

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
    minBetLimit,
    maxBetLimit,
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
        _marketData,
        minimumBet: minBetLimit,
        maximumBet: maxBetLimit,
      },
    ]);
  };

  const getCricketData = () => {
    getFixtureData(
      'cricket',
      setInplayTrue,
      setInplayFalse,
      setisLoading,
      setLoaderOneTime,
    );
  };

  useEffect(() => {
    const fetchInterval = isLogin ? 5000 : 10000;
    getCricketData();
    const intervalId = setInterval(() => {
      getCricketData();
    }, fetchInterval);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    setOpenModal,
    openModal,
    betData,
    isLogin,
    isMobile,
    bets,
    activeBetSlip,
    navigate,
    addToBetPlace,
    loaderOneTime,
    inplayFalse,
    inplayTrue,
  };
};

export default useCricketOuter;
