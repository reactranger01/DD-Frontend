import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  calcPlacedBetBookmakerCricketalculation,
  calcPlacedBetOddsCriketCalculation,
  fetchEventData,
  getUserBets,
  handleLogout,
  transformBookmakerData,
} from '@/utils/helper';

const useCricketInner = () => {
  const isLogin = isLoggedIn();
  const location = useLocation();
  const { eventId } = useParams();
  const matchData = location.state?.data;
  // eslint-disable-next-line
  // eslint-disable-next-line
  const betData = useSelector((state) => state.bet.selectedBet);
  const userIdBalance = useSelector((state) => state?.user?.balance);
  const userType = useSelector((state) => state?.user?.userType);
  const [isLiveMobile, setIsLiveMobile] = useState(false);
  const [isLiveTv, setIsLiveTV] = useState(false);
  const islogin = isLoggedIn();
  const [loading, setLoading] = useState(false);
  const [loaderOneTime, setLoaderOneTime] = useState(false);
  const [isPlacedBetStatsCalc, setPlacedBetStatsCalc] = useState(true);
  const [oddsData, setOddsData] = useState([]);
  const [usersBets, setusersBets] = useState({});
  // eslint-disable-next-line
  const [fancyData, setFancyData] = useState([]);
  const [sessionData, setSessionData] = useState({});
  const [bookmakerData, setBookmakerData] = useState({});
  const [matchOddsMarket, setMatchOddsMarket] = useState();
  const [particularMatchData, setParticularMatchData] = useState({});
  const [placedBetWinLossDatas, setPlacedBetWinLossData] = useState({});
  const [placedBetWinLossBookmakerData, setPlacedBetWinLossBookmakerData] =
    useState({});
  const [sessionBooksetClcuData, setSessionBooksetClcuData] = useState([]);
  const [bookmakerTransformData, setBookmakerTransformData] = useState();
  const navigate = useNavigate();
  const stateUpdate = useSelector(
    (state) => state?.updatestate?.betPlacementSuccess,
  );
  const timeoutRef = useRef(null);

  const getCricketEventData = () => {
    fetchEventData('cricket', eventId, {
      setLoading,
      setLoaderOneTime,
      setOddsData,
      setBookmakerData,
      setFancyData,
      setSessionData,
      setMatchOddsMarket,
      setParticularMatchData,
    });
  };

  useEffect(() => {
    const fetchDataWithDynamicDelay = async () => {
      getCricketEventData();
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
  useEffect(() => {
    const fetchUserBets = async () => {
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
  }, [eventId, stateUpdate, islogin]);

  const handleLiveScoreMobile = () => {
    setIsLiveMobile(!isLiveMobile);
    setIsLiveTV(false);
  };
  const handleLiveTV = () => {
    setIsLiveTV(!isLiveTv);
    setIsLiveMobile(false);
  };

  useEffect(() => {
    if (usersBets?.bets && matchOddsMarket && oddsData && eventId) {
      const calculationODDSData = calcPlacedBetOddsCriketCalculation(
        usersBets?.bets,
        matchOddsMarket,
        oddsData,
        eventId,
      );
      setPlacedBetWinLossData(calculationODDSData);
      setPlacedBetStatsCalc(true);
    }
    if (usersBets?.bets && bookmakerTransformData && eventId) {
      const calculationBookmakerData = calcPlacedBetBookmakerCricketalculation(
        usersBets?.bets,
        bookmakerTransformData[0],
        eventId,
      );
      setPlacedBetWinLossBookmakerData(calculationBookmakerData);
    }
    if (oddsData?.runners?.[0]?.status == 'CLOSED') {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [
    usersBets?.bets,
    isPlacedBetStatsCalc,
    matchOddsMarket,
    oddsData,
    eventId,
  ]);

  const getEventDataSessions = async () => {
    try {
      const response = await getAuthData(
        `/user/getSessionBookSetCalc?eventId=${eventId}&gameType=session&gameId=4`,
      );

      if (response?.status === 201 || response?.status === 200) {
        if (response?.data) {
          const convertedData = response?.data;
          setSessionBooksetClcuData(convertedData);
        }
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    if (islogin) {
      getEventDataSessions();
    }
    //eslint-disable-next-line
  }, [stateUpdate, islogin]);

  useEffect(() => {
    if (bookmakerData) {
      const transformedData = transformBookmakerData(bookmakerData);
      setBookmakerTransformData(transformedData);
    }
    // eslint-disable-next-line
  }, [bookmakerData]);

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
    betData,
    isLogin,
    oddsData,
    matchData,
    particularMatchData,
    sessionBooksetClcuData,
    sessionData,
    placedBetWinLossBookmakerData,
    bookmakerData,
    isLiveMobile,
    isLiveTv,
    userType,
    userIdBalance,
    handleLiveScoreMobile,
    handleLiveTV,
    loading,
    loaderOneTime,
    eventId,
    bookmakerTransformData,
    placedBetWinLossDatas,
  };
};

export default useCricketInner;
