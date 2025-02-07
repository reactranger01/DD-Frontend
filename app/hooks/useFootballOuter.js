import { fetchBetDetailsAction } from '@/redux/actions';
import { setActiveBetSlipIndex } from '@/redux/Slices/newBetSlice';
import { isLoggedIn } from '@/utils/apiHandlers';
import { getFixtureData } from '@/utils/helper';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const useFootballOuter = () => {
  const isLogin = isLoggedIn();
  const [isLoading, setisLoading] = useState(false);
  const [loaderOneTime, setLoaderOneTime] = useState(false);
  const betData = useSelector((state) => state.bet.selectedBet);
  const isMobile = useMediaQuery('(max-width:1024px)');
  const activeBetSlip = useSelector((state) => state.activeNewBet.activeIndex);
  const [openModal, setOpenModal] = useState(false);
  const [bets, setBets] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inplayTrue, setInplayTrue] = useState([]);
  const [inplayFalse, setInplayFalse] = useState([]);

  const getFootballData = () => {
    getFixtureData(
      'soccer',
      setInplayTrue,
      setInplayFalse,
      setisLoading,
      setLoaderOneTime,
    );
  };
  useEffect(() => {
    const fetchInterval = isLogin ? 5000 : 10000;
    getFootballData();
    const intervalId = setInterval(() => {
      getFootballData();
    }, fetchInterval);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  };

  useEffect(() => {
    if (bets?.length > 0) {
      dispatch(fetchBetDetailsAction(bets));
      if (isMobile) {
        dispatch(setActiveBetSlipIndex(bets[0]?.eventId));
      }
    }
  }, [bets, dispatch, isMobile]);

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

export default useFootballOuter;
