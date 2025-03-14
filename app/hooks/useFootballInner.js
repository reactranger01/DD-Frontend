/* eslint-disable react-hooks/exhaustive-deps */
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import {
  calcPlacedBetOddsFootballOrTenisCalculation,
  fetchEventData,
  handleLogout,
} from '@/utils/helper';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const useFootballInner = () => {
  const isLogin = isLoggedIn();
  const [allMarketData, setAllMarketData] = useState([]);
  const [odds] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loaderOneTime, setLoaderOneTime] = useState(false);
  const [fixtureEventName, setFixtureEventName] = useState([]);
  const userIdBalance = useSelector((state) => state?.user?.balance);
  const userType = useSelector((state) => state?.user?.userType);
  const [placedBetWinLossDatas, setPlacedBetWinLossData] = useState({});
  const [usersBets, setusersBets] = useState({});
  const matchData = location.state?.data;
  const betData = useSelector((state) => state.bet.selectedBet);
  const { eventId } = useParams();
  const [isLiveMobile, setIsLiveMobile] = useState(false);
  const [isLiveTv, setIsLiveTV] = useState(false);
  const stateUpdate = useSelector(
    (state) => state?.updatestate?.betPlacementSuccess,
  );
  const timeoutRef = useRef(null);
  const getSoccerEventData = () => {
    fetchEventData('soccer', eventId, {
      setLoading,
      setLoaderOneTime,
      setFixtureEventName,
      setAllMarketData,
    });
  };
  useEffect(() => {
    const fetchDataWithDynamicDelay = async () => {
      getSoccerEventData();
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
    const islogin = isLoggedIn();
    if (islogin && eventId) {
      getUserBets();
    }
  }, [eventId, stateUpdate]);

  const getUserBets = async () => {
    const response = await getAuthData(
      `/bet/current-list?eventId=${eventId}&offset=0&limit=100`,
    );
    if (response?.status == 200) {
      setusersBets(response?.data);
    } else {
      setusersBets({});
    }
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
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [usersBets?.bets, odds, allMarketData, eventId]);
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
    isLogin,
    loaderOneTime,
    loading,
    matchData,
    userIdBalance,
    userType,
    handleLiveTV,
    handleLiveScoreMobile,
    isLiveMobile,
    isLiveTv,
    fixtureEventName,
    placedBetWinLossDatas,
    betData,
    eventId,
    allMarketData,
  };
};

export default useFootballInner;
