import { isLoggedIn } from '@/utils/apiHandlers';
import {
  calcPlacedBetOddsFootballOrTenisCalculation,
  fetchEventData,
  getUserBets,
  handleLogout,
} from '@/utils/helper';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const useTennisInner = () => {
  const isLogin = isLoggedIn();
  const { eventId } = useParams();
  const [allMarketData, setAllMarketData] = useState([]);
  const [fixtureEventName, setFixtureEventName] = useState([]);
  const betData = useSelector((state) => state.bet.selectedBet);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //eslint-disable-next-line
  const [odds, setOdds] = useState([]);
  const matchData = location.state?.data;
  const userIdBalance = useSelector((state) => state?.user?.balance);
  const userType = useSelector((state) => state?.user?.userType);
  const [isLiveMobile, setIsLiveMobile] = useState(false);
  const [isLiveTv, setIsLiveTV] = useState(false);
  const [usersBets, setusersBets] = useState({});
  const [loaderOneTime, setLoaderOneTime] = useState(false);
  const [placedBetWinLossDatas, setPlacedBetWinLossData] = useState({});
  const stateUpdate = useSelector(
    (state) => state?.updatestate?.betPlacementSuccess,
  );
  const timeoutRef = useRef(null);
  const getTennisEventData = () => {
    fetchEventData('tennis', eventId, {
      setLoading,
      setLoaderOneTime,
      setFixtureEventName,
      setAllMarketData,
    });
  };

  useEffect(() => {
    const fetchDataWithDynamicDelay = async () => {
      getTennisEventData();
      const inplay = matchData?.inplay;
      const delay = isLogin ? (inplay ? 400 : 5000) : 5000;

      timeoutRef.current = setTimeout(() => {
        fetchDataWithDynamicDelay();
      }, delay);
    };
    fetchDataWithDynamicDelay();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line
  }, [eventId, isLogin]);

  const handleLiveScoreMobile = () => {
    setIsLiveMobile(!isLiveMobile);
    setIsLiveTV(false);
  };
  const handleLiveTV = () => {
    setIsLiveTV(!isLiveTv);
    setIsLiveMobile(false);
  };

  useEffect(() => {
    if (usersBets?.bets && allMarketData && eventId) {
      const placedBetCalcData = calcPlacedBetOddsFootballOrTenisCalculation(
        usersBets?.bets,
        allMarketData,
        eventId,
      );
      setPlacedBetWinLossData(placedBetCalcData);
    }
    if (odds?.runners?.[0]?.status == 'CLOSED') {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [usersBets?.bets, odds, allMarketData, eventId, navigate]);

  useEffect(() => {
    const fetchUserBets = async () => {
      const islogin = isLoggedIn();
      if (islogin && eventId) {
        try {
          const allUserBets = await getUserBets(eventId);
          setusersBets(allUserBets);
        } catch (error) {
          console.error('Error fetching user bets:', error);
        }
      }
    };
    fetchUserBets();
  }, [eventId, stateUpdate]);

  useEffect(() => {
    if (isLiveTv) {
      const disableRightClick = (e) => e.preventDefault();
      document.addEventListener('contextmenu', disableRightClick);

      const checkDevTools = () => {
        const threshold = 160;
        if (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
        ) {
          window.location.replace('https://www.google.com');
          handleLogout();
        }
      };
      const devToolsInterval = setInterval(checkDevTools, 1000);
      return () => {
        document.removeEventListener('contextmenu', disableRightClick);
        clearInterval(devToolsInterval);
      };
    }
  }, [isLiveTv]);

  return {
    isLiveMobile,
    isLiveTv,
    isLogin,
    betData,
    allMarketData,
    matchData,
    placedBetWinLossDatas,
    fixtureEventName,
    eventId,
    userIdBalance,
    loading,
    loaderOneTime,
    userType,
    handleLiveScoreMobile,
    handleLiveTV,
  };
};

export default useTennisInner;
