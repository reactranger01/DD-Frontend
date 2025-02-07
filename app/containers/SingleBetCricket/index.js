/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Banner,
  BettingOption,
  BottomHeaderOption,
  SmallDesc,
} from '@/components';
import { json, useLocation, useNavigate, useParams } from 'react-router-dom';
import BlueButton from '@/components/BlueButton';
import PinkButton from '@/components/PinkButton';
import moment from 'moment';
import StatusButton from '@/components/StatusButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBetDetailsAction, fetchLiveTvAction } from '@/redux/actions';
import { getAuthData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { isMobile } from 'react-device-detect';
import RunPosition from '@/components/Modal/RunPosition';
import { reactIcons } from '@/utils/icons';
import { toast } from 'react-toastify';
import { getRunnerName } from '@/utils/mergeData';

const SingleBetCricket = () => {
  const navigate = useNavigate();
  const shiv11_userID = localStorage.getItem('shiv11_userID');
  const liveTV = useSelector((state) => state.tv.liveTv);
  const [isLive, setIsLive] = useState(false);
  const [isLiveMobile, setIsLiveMobile] = useState(false);
  const [openTv, setOpenTv] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [oddsShow, setOddsShow] = useState(true);
  const [bookmakerShow, setBookmakerShow] = useState(true);
  const [fancyShow, setFancyShow] = useState(true);
  const [sessionsShow, setSessionsShow] = useState(true);
  const { eventId } = useParams();
  const [marketId, setMarketId] = useState();
  const [marketData, setMarketData] = useState(null);
  const [matchOds, setMatchOds] = useState(null);
  const [timelineData, setTimeLineData] = useState({});
  const [selectionId, setSelectionId] = useState({});
  const [selectedID, setSelectedID] = useState(null);
  const [selectedRunner, setSelectedRunner] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [fancy, setFancy] = useState(null);
  const [bm, setBm] = useState(null);
  const [odds, setOdds] = useState(null);
  const location = useLocation();
  const matchData = location.state?.data;
  const [bets, setBets] = useState([]);
  const [fixtureEventName, setFixtureEventName] = useState([]);
  const eventIdApidata =
    fixtureEventName[0]?.event_id || Number(fixtureEventName[0]?.matchId);
  const dispatch = useDispatch();
  const isLogin = isLoggedIn();
  const inplay = odds?.inplay;
  const handleOddsShow = () => {
    setOddsShow(!oddsShow);
  };
  const handleBookmakerShow = () => {
    setBookmakerShow(!bookmakerShow);
  };
  const handleFancyShow = () => {
    setFancyShow(!fancyShow);
  };
  const handleSessionsShow = () => {
    setSessionsShow(!sessionsShow);
  };
  const [usersBets, setusersBets] = useState({});
  const [placedBetWinLossDatas, setPlacedBetWinLossData] = useState(null);
  const [placedBetWinLossFancy, setPlacedBetWinLossFancy] = useState(null);
  const [placedBetWinLossSession, setPlacedBetWinLossSession] = useState(null);
  const [placedBetWinLossBookmaker, setPlacedBetWinLossBookmaker] =
    useState(null);
  const [isPlacedBetStatsCalc, setPlacedBetStatsCalc] = useState(true);

  useEffect(() => {
    if (marketData && usersBets?.bets && !isPlacedBetStatsCalc) {
      calcPlacedBetOdds(usersBets?.bets);
      calcPlacedBetFancy(usersBets?.bets);
      calcPlacedBetSession(usersBets?.bets);
      calcPlacedBetBookmaker(usersBets?.bets);
      setPlacedBetStatsCalc(true);
    }

    if (odds?.runners?.[0]?.status === 'CLOSED') {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000); // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer);
    }
  }, [usersBets?.bets, isPlacedBetStatsCalc, marketData]);

  useEffect(() => {
    const islogin = isLoggedIn();
    if (islogin && eventId) {
      getUserBets();
    }
  }, [eventId]);

  const getUserBets = async () => {
    const response = await getAuthData(
      `/bet/current-list?eventId=${eventId}&offset=0&limit=100`,
    );
    if (response?.status === 200) {
      setusersBets(response?.data);
      setPlacedBetStatsCalc(false);
    } else {
      setusersBets({});
    }
  };
  useEffect(() => {
    let source;
    if (eventId) {
      if (source) {
        source.close();
        setOdds(null);
        setMatchOds(null);
        setBm(null);
        setFancy(null);
      }
      source = new EventSource(
        `${process.env.API_URL}/catalogue/cricket/get-catalogue-stream?eventId=${eventId}`,
      );
      source.onmessage = function (e) {
        let tempdata = JSON.parse(e.data);

        const { session, fancy, bookmaker, MatchOdds } = tempdata;

        setSelectionId(tempdata?.sidMap);
        setMarketId(
          MatchOdds?.marketId || tempdata?.MatchOdds?.catalogue?.[0]?.marketId,
        );

        session?.catalogue?.map((item) => {
          if (item.market === 'session') {
            setSessions(item);
          }
        });
        fancy?.catalogue?.map((item) => {
          if (item.market === 'Normal' || item.market === 'fancy') {
            setFancy(item);
          }
        });
        MatchOdds?.catalogue?.map((item) => {
          if (
            item?.marketName === 'Match Odds' ||
            MatchOdds?.market === 'Match Odds'
          ) {
            const parsedRunners = JSON.parse(item.runners);
            const updatedItem = {
              ...item,
              runners: parsedRunners,
            };
            setOdds(updatedItem);
          }
        });
        bookmaker?.catalogue?.map((item) => {
          if (bookmaker.market === 'bookmaker') {
            const parsedRunners = JSON.parse(item.runners);
            const updatedItem = {
              ...item,
              runners: parsedRunners,
            };
            setBm(updatedItem);
          }
        });
        setMarketData(tempdata);
        setTimeLineData(tempdata.timeline);
        setMatchOds(tempdata?.MatchOdds);
      };
    }
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [eventId]);
  const getEventData = async () => {
    try {
      const response = await getAuthData(
        `/catalogue/cricket/get-matchodds?eventId=${eventId}`,
      );

      if (response?.status === 201 || response?.status === 200) {
        if (response?.data) {
          const convertedData = response?.data;
          setFixtureEventName(convertedData);
        }
        // setFixtureEventName(response?.data?.fixtures);
        // setFixtureData(response?.data?.fixtures);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  useEffect(() => {
    getEventData();
  }, []);
  const parseRunners = (runners) => {
    try {
      return JSON.parse(runners);
    } catch (e) {
      return [];
    }
  };

  const nameAlias = {
    match2: 'Bookmaker 2',
    match1: 'Bookmaker 1',
    bookmaker: 'Bookmaker',
  };

  const calcPlacedBetOdds = (bets) => {
    const betGroups = {};
    const eventBets = [];
    const fancyBets = [];
    const _marketData = marketData ? { ...marketData } : null;
    const placedBetWinLossData = {};
    if (bets) {
      bets.forEach((element) => {
        let isBookmaker = false;
        if (element.market === 'bookmaker') {
          isBookmaker = true;
        }
        if (
          betGroups[isBookmaker ? nameAlias[element.game_type] : element.market]
        ) {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ].push(element);
        } else {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ] = [element];
        }

        if (element.event_id === Number(eventId)) {
          eventBets.push(element);
        }
      });
    }

    if (_marketData) {
      eventBets.forEach((bet) => {
        let win = 0;
        let loss = 0;
        if (bet.bet_on === 'BACK') {
          win = bet.stake * (bet.price - 1);
          loss = bet.stake * -1;
        } else {
          win = bet.stake;
          loss = bet.stake * (bet.price - 1) * -1;
        }

        if (
          bet.market !== 'session' &&
          bet.market !== 'bookmaker' &&
          bet.market !== 'Normal' &&
          bet.market !== 'fancy'
        );
        if (
          _marketData &&
          _marketData.MatchOdds?.catalogue &&
          _marketData.MatchOdds?.catalogue.length
        ) {
          for (let i = 0; i < _marketData.MatchOdds?.catalogue?.length; i++) {
            if (_marketData.MatchOdds?.catalogue[i].market === bet.game_type) {
              for (
                let j = 0;
                j < _marketData.MatchOdds?.catalogue[i]['runners'].length;
                j++
              ) {
                if (
                  !placedBetWinLossData[
                    _marketData.MatchOdds?.catalogue[i].market
                  ]
                ) {
                  placedBetWinLossData[
                    _marketData.MatchOdds?.catalogue[i].market
                  ] = {};
                }

                if (
                  !placedBetWinLossData[
                    _marketData.MatchOdds?.catalogue[i].market
                  ][
                    [
                      _marketData.MatchOdds?.catalogue[i]['runners'][j]
                        .selectionId,
                    ]
                  ]
                ) {
                  placedBetWinLossData[
                    _marketData.MatchOdds?.catalogue[i].market
                  ][
                    [
                      _marketData.MatchOdds?.catalogue[i]['runners'][j]
                        .selectionId,
                    ]
                  ] = 0;
                }

                if (
                  Number([
                    [
                      _marketData.MatchOdds?.catalogue[i]['runners'][j]
                        .selectionId,
                    ],
                  ]) === Number(bet.selection_id)
                ) {
                  if (bet.bet_on === 'BACK') {
                    placedBetWinLossData[
                      _marketData.MatchOdds.catalogue[i].market
                    ][
                      [
                        _marketData.MatchOdds.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ] += Number(Number(win).toFixed(2));
                  } else {
                    placedBetWinLossData[
                      _marketData.MatchOdds.catalogue[i].market
                    ][
                      [
                        _marketData.MatchOdds.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ] += Number(Number(loss).toFixed(2));
                  }
                } else {
                  if (bet.bet_on === 'BACK') {
                    placedBetWinLossData[
                      _marketData.MatchOdds.catalogue[i].market
                    ][
                      [
                        _marketData.MatchOdds.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ] += Number(Number(loss).toFixed(2));
                  } else {
                    placedBetWinLossData[
                      _marketData.MatchOdds.catalogue[i].market
                    ][
                      [
                        _marketData.MatchOdds.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ] += Number(Number(win).toFixed(2));
                  }
                }
              }
              break;
            }
          }
        }
        if (bet.market === 'bookmaker')
          if (bet.game_type === 'fancy') fancyBets.push(bet);
      });
    }
    const matchOddsallData = placedBetWinLossData['Match Odds']
      ? Object.entries(placedBetWinLossData['Match Odds']).map(
          ([id, data]) => ({
            id: parseInt(id),
            data: data,
            type: data >= 0 ? 'profit' : 'loss',
          }),
        )
      : [];
    setPlacedBetWinLossData({
      type: 'odds',
      exposer: matchOddsallData,
    });
  };
  const calcPlacedBetBookmaker = (bets) => {
    const betGroups = {};
    const eventBets = [];
    const fancyBets = [];
    const _marketData = marketData ? { ...marketData } : null;
    const placedBetWinLossData = {};
    if (bets) {
      bets.forEach((element) => {
        let isBookmaker = false;
        if (element.market === 'bookmaker') {
          isBookmaker = true;
        }
        if (
          betGroups[isBookmaker ? nameAlias[element.game_type] : element.market]
        ) {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ].push(element);
        } else {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ] = [element];
        }

        if (element.event_id === Number(eventId)) {
          eventBets.push(element);
        }
      });
    }

    if (_marketData) {
      eventBets.forEach((bet) => {
        let win = 0;
        let loss = 0;
        if (bet.bet_on === 'BACK') {
          win = bet.stake * (bet.price - 1);
          loss = bet.stake * -1;
        } else {
          win = bet.stake;
          loss = bet.stake * (bet.price - 1) * -1;
        }

        if (
          bet.market !== 'session' &&
          bet.market !== 'Match Odds' &&
          bet.market !== 'Normal' &&
          bet.market !== 'fancy'
        );
        if (
          _marketData &&
          _marketData.bookmaker?.catalogue &&
          _marketData.bookmaker?.catalogue.length
        ) {
          for (let i = 0; i < _marketData.bookmaker?.catalogue?.length; i++) {
            if (_marketData.bookmaker?.catalogue[i].market === bet.game_type) {
              for (
                let j = 0;
                j <
                _marketData.bookmaker?.catalogue[i]['runners'][0]['runners']
                  .length;
                j++
              ) {
                if (
                  !placedBetWinLossData[
                    _marketData.bookmaker?.catalogue[i].market
                  ]
                ) {
                  placedBetWinLossData[
                    _marketData.bookmaker?.catalogue[i].market
                  ] = {};
                }

                if (
                  !placedBetWinLossData[
                    _marketData.bookmaker?.catalogue[i].market
                  ][
                    [
                      _marketData.bookmaker?.catalogue[i]['runners'][0][
                        'runners'
                      ][j].selectionId,
                    ]
                  ]
                ) {
                  placedBetWinLossData[
                    _marketData.bookmaker?.catalogue[i].market
                  ][
                    [
                      _marketData.bookmaker?.catalogue[i]['runners'][0][
                        'runners'
                      ][j].selectionId,
                    ]
                  ] = 0;
                }

                if (
                  Number([
                    [
                      _marketData.bookmaker?.catalogue[i]['runners'][0][
                        'runners'
                      ][j].selectionId,
                    ],
                  ]) === Number(bet.selection_id)
                ) {
                  if (bet.bet_on === 'BACK') {
                    placedBetWinLossData[
                      _marketData.bookmaker.catalogue[i].market
                    ][
                      [
                        _marketData.bookmaker.catalogue[i]['runners'][0][
                          'runners'
                        ][j].selectionId,
                      ]
                    ] += Number(Number(win).toFixed(2));
                  } else {
                    placedBetWinLossData[
                      _marketData.bookmaker.catalogue[i].market
                    ][
                      [
                        _marketData.bookmaker.catalogue[i]['runners'][0][
                          'runners'
                        ][j].selectionId,
                      ]
                    ] += Number(Number(loss).toFixed(2));
                  }
                } else {
                  if (bet.bet_on === 'BACK') {
                    placedBetWinLossData[
                      _marketData.bookmaker.catalogue[i].market
                    ][
                      [
                        _marketData.bookmaker.catalogue[i]['runners'][0][
                          'runners'
                        ][j].selectionId,
                      ]
                    ] += Number(Number(loss).toFixed(2));
                  } else {
                    placedBetWinLossData[
                      _marketData.bookmaker.catalogue[i].market
                    ][
                      [
                        _marketData.bookmaker.catalogue[i]['runners'][0][
                          'runners'
                        ][j].selectionId,
                      ]
                    ] += Number(Number(win).toFixed(2));
                  }
                }
              }
              break;
            }
          }
        }
        if (bet.market === 'bookmaker')
          if (bet.game_type === 'fancy') fancyBets.push(bet);
      });
    }
    const bookmakerAllData = placedBetWinLossData['bookmaker']
      ? Object.entries(placedBetWinLossData['bookmaker']).map(([id, data]) => ({
          id: parseInt(id),
          data: data,
          type: data >= 0 ? 'profit' : 'loss',
        }))
      : [];
    setPlacedBetWinLossBookmaker({
      type: 'bookmaker',
      exposer: bookmakerAllData,
    });
  };
  const calcPlacedBetFancy = (bets) => {
    const betGroups = {};
    const eventBets = [];
    const fancyBets = [];
    const _marketData = marketData ? { ...marketData } : null;
    const placedBetWinLossData = {};
    if (bets) {
      bets.forEach((element) => {
        let isBookmaker = false;
        if (element.market === 'fancy') {
          isBookmaker = true;
        }
        if (
          betGroups[isBookmaker ? nameAlias[element.game_type] : element.market]
        ) {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ].push(element);
        } else {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ] = [element];
        }

        if (element.event_id === Number(eventId)) {
          eventBets.push(element);
        }
      });
    }

    if (_marketData) {
      eventBets.forEach((bet) => {
        let win = 0;
        let loss = 0;
        if (bet.bet_on === 'BACK') {
          win = bet.stake * (bet.price - 1);
          loss = bet.stake;
        } else {
          win = bet.stake;
          loss = bet.stake * (bet.price - 1);
        }

        if (
          bet.market !== 'session' &&
          bet.market !== 'bookmaker' &&
          bet.market !== 'Normal' &&
          bet.market !== 'bookmaker'
        );
        if (
          _marketData &&
          _marketData.fancy?.catalogue &&
          _marketData.fancy?.catalogue.length
        ) {
          for (let i = 0; i < _marketData.fancy?.catalogue?.length; i++) {
            if (_marketData.fancy?.catalogue[i].market === bet.game_type) {
              for (
                let j = 0;
                j < _marketData.fancy?.catalogue[i]['runners'].length;
                j++
              ) {
                if (
                  !placedBetWinLossData[_marketData.fancy?.catalogue[i].market]
                ) {
                  placedBetWinLossData[_marketData.fancy?.catalogue[i].market] =
                    {};
                }

                if (
                  !placedBetWinLossData[_marketData.fancy?.catalogue[i].market][
                    [_marketData.fancy?.catalogue[i]['runners'][j].SelectionId]
                  ]
                ) {
                  placedBetWinLossData[_marketData.fancy?.catalogue[i].market][
                    [_marketData.fancy?.catalogue[i]['runners'][j].SelectionId]
                  ] = 0;
                }

                if (
                  Number([
                    [_marketData.fancy?.catalogue[i]['runners'][j].SelectionId],
                  ]) === Number(bet.selection_id)
                ) {
                  if (bet.bet_on === 'BACK') {
                    placedBetWinLossData[_marketData.fancy.catalogue[i].market][
                      [_marketData.fancy.catalogue[i]['runners'][j].SelectionId]
                    ] += Number(Number(win).toFixed(2));
                  } else {
                    placedBetWinLossData[_marketData.fancy.catalogue[i].market][
                      [_marketData.fancy.catalogue[i]['runners'][j].SelectionId]
                    ] += Number(Number(loss).toFixed(2));
                  }
                }
              }
              break;
            }
          }
        }
        if (bet.market === 'fancy')
          if (bet.game_type === 'fancy') fancyBets.push(bet);
      });
    }
    const matchFancyallData = placedBetWinLossData['fancy']
      ? Object.entries(placedBetWinLossData['fancy']).map(([id, data]) => ({
          id: parseInt(id),
          data: data,
          type: data >= 0 ? 'profit' : 'loss',
        }))
      : [];
    setPlacedBetWinLossFancy({
      type: 'fancy',
      exposer: matchFancyallData,
    });
  };
  const calcPlacedBetSession = (bets) => {
    const betGroups = {};
    const eventBets = [];
    const fancyBets = [];
    const _marketData = marketData ? { ...marketData } : null;
    const placedBetWinLossData = {};
    if (bets) {
      bets.forEach((element) => {
        let isBookmaker = false;
        if (element.market === 'session') {
          isBookmaker = true;
        }
        if (
          betGroups[isBookmaker ? nameAlias[element.game_type] : element.market]
        ) {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ].push(element);
        } else {
          betGroups[
            isBookmaker ? nameAlias[element.game_type] : element.market
          ] = [element];
        }

        if (element.event_id === Number(eventId)) {
          eventBets.push(element);
        }
      });
    }

    if (_marketData) {
      eventBets.forEach((bet) => {
        let win = 0;
        let loss = 0;
        if (bet.bet_on === 'BACK') {
          win = bet.stake * (bet.percent / 100);
          loss = bet.stake;
        } else {
          win = bet.stake;
          loss = bet.stake * (bet.percent / 100);
        }

        if (
          bet.market !== 'fancy' &&
          bet.market !== 'bookmaker' &&
          bet.market !== 'Normal' &&
          bet.market !== 'bookmaker'
        );
        if (
          _marketData &&
          _marketData.session?.catalogue &&
          _marketData.session?.catalogue.length
        ) {
          for (let i = 0; i < _marketData.session?.catalogue?.length; i++) {
            if (_marketData.session?.catalogue[i].market === bet.game_type) {
              for (
                let j = 0;
                j < _marketData.session?.catalogue[i]['runners'].length;
                j++
              ) {
                if (
                  !placedBetWinLossData[
                    _marketData.session?.catalogue[i].market
                  ]
                ) {
                  placedBetWinLossData[
                    _marketData.session?.catalogue[i].market
                  ] = {};
                }

                if (
                  !placedBetWinLossData[
                    _marketData.session?.catalogue[i].market
                  ][
                    [
                      _marketData.session?.catalogue[i]['runners'][j]
                        .SelectionId,
                    ]
                  ]
                ) {
                  placedBetWinLossData[
                    _marketData.session?.catalogue[i].market
                  ][
                    [
                      _marketData.session?.catalogue[i]['runners'][j]
                        .SelectionId,
                    ]
                  ] = 0;
                }
                if (
                  Number([
                    [
                      _marketData.session?.catalogue[i]['runners'][j]
                        .SelectionId,
                    ],
                  ]) === Number(bet.selection_id)
                ) {
                  if (bet.bet_on === 'BACK') {
                    placedBetWinLossData[
                      _marketData.session.catalogue[i].market
                    ][
                      [
                        _marketData.session.catalogue[i]['runners'][j]
                          .SelectionId,
                      ]
                    ] += Number(Number(win).toFixed(2));
                  } else {
                    placedBetWinLossData[
                      _marketData.session.catalogue[i].market
                    ][
                      [
                        _marketData.session.catalogue[i]['runners'][j]
                          .SelectionId,
                      ]
                    ] += Number(Number(win).toFixed(2));
                  }
                }
              }
              break;
            }
          }
        }
        if (bet.market === 'session')
          if (bet.game_type === 'session') fancyBets.push(bet);
      });
    }
    const sessionallData = placedBetWinLossData['session']
      ? Object.entries(placedBetWinLossData['session']).map(([id, data]) => ({
          id: parseInt(id),
          data: data,
          type: data >= 0 ? 'profit' : 'loss',
        }))
      : [];
    setPlacedBetWinLossSession({
      type: 'session',
      exposer: sessionallData,
    });
  };

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
    if (OddsPrice > 1) {
      setBets([
        {
          marketId: String(marketId || odds?.marketId),
          eventId: Number(eventId || eventIdApidata),
          gameId: 4,
          selectionId: String(selectionId),
          betOn: selectType,
          price: parseFloat(OddsPrice),
          stake: '',
          eventType: game,
          competition: 'N/A',
          event: `${fixtureEventName?.[0]?.['runners']?.[0]?.runnerName} v ${fixtureEventName?.[0]?.['runners']?.[1]?.runnerName}`,
          market:
            marketType === 'ODDS'
              ? _marketData.marketName
              : marketType === 'BOOKMAKERS'
              ? bm?.marketName.toLowerCase()
              : '',
          gameType:
            marketType === 'ODDS'
              ? _marketData.marketName
              : marketType === 'BOOKMAKERS'
              ? bm?.marketName.toLowerCase()
              : '',
          nation: betDetails,
          type: selectType,
          calcFact: 0,
          bettingOn: betType,
          runners: 2,
          row: 1,
          matchName: `${fixtureEventName?.[0]?.['runners']?.[0]?.runnerName} v ${fixtureEventName?.[0]?.['runners']?.[1]?.runnerName}`,
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
    if (!isMobile) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };
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
    // await postAuthData('/result/cricket/check-market', {
    //   gameType: fancy.market,
    //   eventId: Number(eventId),
    //   selectionId: String(item.SelectionId),
    // })
    //   .then((response) => {})
    //   .catch((e) => {
    //     console.error(e);
    //   });
    dispatch(
      fetchBetDetailsAction([
        {
          marketId: String(marketId || odds?.marketId),
          eventId: Number(eventId),
          gameId: 4,
          selectionId: String(item.SelectionId),
          betOn: betType,
          price: parseFloat(price),
          stake: '',
          eventType: 'Cricket',
          competition: 'N/A',
          event: `${fixtureEventName?.[0]?.['runners']?.[0]?.runnerName} v ${fixtureEventName?.[0]?.['runners']?.[1]?.runnerName}`,
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
        },
      ]),
    );
    if (isMobile) {
      navigate('/bet-details');
    }
    if (!isMobile) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (bets.length > 0) dispatch(fetchBetDetailsAction(bets));
  }, [bets, dispatch]);

  const handleLiveTv = () => {
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'cricket' }),
    );
  };
  const handleLiveScore = () => {
    setIsLive(!isLive);
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'cricket' }),
    );
  };
  const handleLiveScoreMobile = () => {
    setIsLiveMobile(!isLiveMobile);
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'cricket' }),
    );
  };
  const handleOpenTv = () => {
    setOpenTv(!openTv);
    dispatch(
      fetchLiveTvAction({ eventid: eventId, tvshow: true, game: 'cricket' }),
    );
  };

  const handleTvClose = () => {
    setOpenTv(!openTv);
    dispatch(fetchLiveTvAction({ eventid: '', tvshow: false, game: '' }));
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = (selectionID, Runnername, marketname) => {
    setSelectedID(selectionID);
    setSelectedRunner(Runnername);
    setSelectedMarket(marketname);
    setIsOpenModal(true);
  };
  let minLimit, maxLimit;

  // Check the inPlay variable to set the appropriate limits
  if (inplay) {
    minLimit = fixtureEventName?.[0]?.inPlayFancyMinLimit;
    maxLimit = fixtureEventName?.[0]?.inPlayFancyMaxLimit;
  } else {
    minLimit = fixtureEventName?.[0]?.offPlayFancyMinLimit;
    maxLimit = fixtureEventName?.[0]?.offPlayFancyMaxLimit;
  }

  let minLimitBookmaker, maxLimitBookmaker;
  if (inplay) {
    minLimitBookmaker = fixtureEventName?.[0]?.inPlayBookMinLimit;
    maxLimitBookmaker = fixtureEventName?.[0]?.inPlayBookMaxLimit;
  } else {
    minLimitBookmaker = fixtureEventName?.[0]?.offPlayBookMinLimit;
    maxLimitBookmaker = fixtureEventName?.[0]?.offPlayBookMaxLimit;
  }
  let minLimitOdds, maxLimitOdds;
  if (inplay) {
    minLimitOdds = fixtureEventName?.[0]?.inPlayMinLimit;
    maxLimitOdds = fixtureEventName?.[0]?.inPlayMaxLimit;
  } else {
    minLimitOdds = fixtureEventName?.[0]?.offPlayMinLimit;
    maxLimitOdds = fixtureEventName?.[0]?.offPlayMaxLimit;
  }
  return (
    <>
      <SmallDesc />
      <div
        className="w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 px-0 "
        style={{ backgroundImage: 'url("/images/more-option-bg.jpg")' }}
      >
        <BottomHeaderOption />
        <div className="flex justify-between w-full bg-cover h-auto bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3 xl:gap-5 flex-col xl:flex-row">
          <div className="flex-1">
            <div className="scroll-smooth ">
              <div className="flex items-center justify-center">
                <div className="gradient-bg flex flex-col md:flex-row items-center justify-between  w-full border-b-2 border-[#6462D5]">
                  <div
                    className={`relative bg-black w-full h-52  ${
                      openTv ? '' : 'hidden'
                    }`}
                  >
                    {' '}
                    <button
                      type="button"
                      onClick={handleTvClose}
                      className="absolute right-[2px] top-[2px] w-6 h-6 flex items-center justify-center rounded-full bg-[#FF4646]"
                    >
                      {reactIcons.close}
                    </button>
                    {liveTV.tvshow && liveTV.eventId !== '' && (
                      <>
                        {' '}
                        <iframe
                          src={`https://hr08bets.in/sports-stream-live/index.html?eventid=${liveTV.eventid}`}
                          title="description"
                          style={{ width: '100%', height: '100%' }}
                        ></iframe>
                      </>
                    )}
                  </div>
                  <div className="md:w-16 px-4  w-full bg-black md:bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0 flex items-center justify-between md:justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="text-white font-arial font-semibold"
                    >
                      Back
                    </button>
                    {odds?.inplay && !openTv && isLogin && (
                      <button onClick={handleOpenTv}>
                        <img
                          src="/images/more-option/live-tv.png"
                          alt="live-tv"
                          className="w-5 "
                        />
                      </button>
                    )}
                  </div>
                  <div className="md:w-16 hidden px-4  w-full bg-white  md:bg-transparent md:h-10 h-9 md:rounded-md  top-[10px] left-0  items-center justify-between md:justify-center">
                    <button
                      className="text-black font-arial font-semibold flex items-center justify-between w-full"
                      onClick={handleLiveScoreMobile}
                    >
                      <div>Live Score</div>{' '}
                      <div className="text-24">
                        {isLive ? reactIcons.arrowDown : reactIcons.arrowUp}
                      </div>
                    </button>
                  </div>
                  <div
                    className={`w-full md:p-1 p-0 md:mt-2 mt-0 shadow-md  hidden
                    `}
                  >
                    <iframe
                      src={`https://diamondapi.uk/dcasino/sr.php?eventid=${liveTV.eventid}&sportid=4`}
                      title="description"
                      style={{ width: '100%', height: '400px' }}
                    ></iframe>
                  </div>
                  <div className="flex items-start flex-row md:py-5 py-1  bg-blue-500 md:bg-transparent w-full md:w-max">
                    <div className="min-w-[35px] sm:w-[70px] grid place-content-center md:hidden">
                      <img
                        src="/images/home/cricket.png"
                        alt="ball"
                        className="w-6 h-6"
                      />
                    </div>
                    <div
                      className="w-5 md:flex hidden h-6 bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage: 'url("/images/more-option/india.png")',
                      }}
                    ></div>
                    <div className="text-white capitalize font-inter">
                      {matchData?.name}
                    </div>
                    <div
                      className="w-5 h-6 md:flex hidden pl-3 bg-no-repeat bg-contain bg-center mx-2"
                      style={{
                        backgroundImage:
                          'url("/images/more-option/england.png")',
                      }}
                    ></div>
                  </div>
                  <div className="flex">
                    {!odds?.inplay ? (
                      <div className="w-auto lg:flex md:flex hidden flex-col items-center text-white capitalize justify-center text-14 pr-2">
                        {moment(matchData?.matchDateTime).format(
                          'MMMM Do YYYY, h:mm a',
                        )}
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={handleLiveScore}
                          className="w-[70px] lg:flex md:flex cursor-pointer hidden flex-col items-center text-white capitalize justify-center text-10 pr-4"
                        >
                          <img
                            src="/images/more-option/live-match.png"
                            alt="live-tv"
                            className="w-5 "
                          />
                          <span className="">Live Score</span>
                        </div>
                        {isLogin && (
                          <div
                            onClick={handleLiveTv}
                            className="w-11 cursor-pointer hidden flex-col items-center text-white capitalize justify-center text-10 pr-4"
                          >
                            <img
                              src="/images/more-option/live-tv.png"
                              alt="live-tv"
                              className="w-5 "
                            />
                            <span className="">Live TV</span>
                          </div>
                        )}{' '}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`w-full md:p-1 p-0 md:mt-2 mt-0 shadow-md ${
                  isLive ? '' : 'hidden'
                }`}
              >
                <iframe
                  src={`https://diamondapi.uk/dcasino/sr.php?eventid=${liveTV.eventid}&sportid=4`}
                  title="description"
                  style={{ width: '100%', height: '400px' }}
                ></iframe>
              </div>
              <div className="w-full md:p-1 p-0 flex flex-col items-center md:mt-2 mt-0 bg-white shadow-md">
                <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
                  <div className="w-full flex flex-col">
                    <BettingOption
                      title={'MATCH ODDS'}
                      heading1={isMobile ? '' : 'Back'}
                      heading2={isMobile ? '' : 'Lay'}
                      handleClick={handleOddsShow}
                      showIcon={oddsShow}
                    />
                    {/* Back&lay */}
                    <div className="md:hidden flex justify-around items-center font-inter font-semibold text-[13px] p-2 bg-[#DDE1E7]">
                      <div className="text-[rgb(3,117,204)]">Back</div>
                      <div className="text-[rgb(224,60,60)]">Lay</div>
                    </div>
                    {oddsShow && (
                      <>
                        {odds &&
                          odds?.runners.map((items, index) => {
                            const correspondingFixture = fixtureEventName.find(
                              (fixture) =>
                                fixture.runners.some(
                                  (fixtureRunner) =>
                                    fixtureRunner.selectionId.toString() ===
                                    items.selectionId,
                                ),
                            );

                            // Find the specific runner from the corresponding fixture
                            const fixtureRunner = correspondingFixture
                              ? correspondingFixture.runners.find(
                                  (fixtureRunner) =>
                                    fixtureRunner.selectionId.toString() ===
                                    items.selectionId,
                                )
                              : null;

                            const runnerName = fixtureRunner
                              ? fixtureRunner.runnerName
                              : '';
                            const matchOddsExposer =
                              placedBetWinLossDatas?.type === 'odds' &&
                              placedBetWinLossDatas?.exposer !== ''
                                ? placedBetWinLossDatas?.exposer?.find(
                                    (odd) => odd?.id === items?.selectionId,
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
                                      onClick={() =>
                                        handleOpenModal(
                                          items?.selectionId,
                                          items?.runnerName,
                                          'matchodds',
                                        )
                                      }
                                      className="flex cursor-pointer flex-col justify-center text-xs"
                                    >
                                      <h1 className="capitalize text-sm font-medium m-0 font-inter">
                                        {/* {items?.runnerName} */}
                                        {runnerName}
                                      </h1>
                                    </div>
                                    {matchOddsExposer ? (
                                      <>
                                        <div>
                                          {matchOddsExposer?.type ===
                                          'profit' ? (
                                            <div className="">
                                              {' '}
                                              <span className="text-14 text-[#04a928]">
                                                Profit:{' '}
                                                {(
                                                  matchOddsExposer?.data || 0
                                                ).toFixed(2) || 0}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex ">
                                              {' '}
                                              <span className="text-14 text-[#CE2C16]">
                                                Loss:{' '}
                                                {(
                                                  matchOddsExposer?.data || 0
                                                ).toFixed(2) || 0}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      ''
                                    )}
                                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                                  </div>
                                </div>

                                <div className="flex basis-[60%] md:justify-center justify-around relative min-w-0 p-0">
                                  <div className="flex w-full">
                                    <BlueButton
                                      backPrize={
                                        items?.ex?.availableToBack?.[2]?.price
                                      }
                                      backSize={
                                        items?.ex?.availableToBack?.[2]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            odds?.eventid || odds?.matchId,
                                            items?.selectionId,
                                            runnerName,
                                            'Cricket',
                                            items?.ex?.availableToBack?.[2]
                                              ?.price,
                                            odds?.marketName,
                                            'BACK',
                                            odds,
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
                                      backPrize={
                                        items?.ex?.availableToBack?.[1]?.price
                                      }
                                      backSize={
                                        items?.ex?.availableToBack?.[1]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            odds?.eventid || odds?.matchId,
                                            items?.selectionId,
                                            runnerName,
                                            'Cricket',
                                            items?.ex?.availableToBack?.[1]
                                              ?.price,
                                            odds?.marketName,
                                            'BACK',
                                            odds,
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
                                      backPrize={
                                        items?.ex?.availableToBack?.[0]?.price
                                      }
                                      backSize={
                                        items?.ex?.availableToBack?.[0]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            odds?.eventid || odds?.matchId,
                                            items?.selectionId,
                                            runnerName,
                                            'Cricket',
                                            items?.ex?.availableToBack?.[0]
                                              ?.price,
                                            odds?.marketName,
                                            'BACK',
                                            odds,
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
                                      layPrize={
                                        items?.ex?.availableToLay?.[0]?.price
                                      }
                                      laySize={
                                        items?.ex?.availableToLay?.[0]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            odds?.eventid || odds?.matchId,
                                            items?.selectionId,
                                            runnerName,
                                            'Cricket',
                                            items?.ex?.availableToLay?.[0]
                                              ?.price,
                                            odds?.marketName,
                                            'LAY',
                                            odds,
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
                                      layPrize={
                                        items?.ex?.availableToLay?.[1]?.price
                                      }
                                      laySize={
                                        items?.ex?.availableToLay?.[1]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            odds?.eventid || odds?.matchId,
                                            items?.selectionId,
                                            runnerName,
                                            'Cricket',
                                            items?.ex?.availableToLay?.[1]
                                              ?.price,
                                            odds?.marketName,
                                            'LAY',
                                            odds,
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
                                      layPrize={
                                        items?.ex?.availableToLay?.[2]?.price
                                      }
                                      laySize={
                                        items?.ex?.availableToLay?.[2]?.size
                                      }
                                      onClick={async () => {
                                        if (isLogin) {
                                          await addToBetPlace(
                                            odds?.eventid || odds?.matchId,
                                            items?.selectionId,
                                            runnerName,
                                            'Cricket',
                                            items?.ex?.availableToLay?.[2]
                                              ?.price,
                                            odds?.marketName,
                                            'LAY',
                                            odds,
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
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
                  <div className="w-full flex flex-col">
                    <BettingOption
                      title={'BOOKMAKER'}
                      heading1={'Back'}
                      heading2={'Lay'}
                      handleClick={handleBookmakerShow}
                      showIcon={bookmakerShow}
                    />
                    {bookmakerShow && (
                      <>
                        {bm &&
                          bm?.runners &&
                          bm?.runners?.map((items, index) => {
                            const bookmakerExposer =
                              placedBetWinLossBookmaker?.type === 'bookmaker' &&
                              placedBetWinLossBookmaker?.exposer !== ''
                                ? placedBetWinLossBookmaker?.exposer?.find(
                                    (odd) => odd?.id === items?.selectionId,
                                  )
                                : '';
                            const runnerName = getRunnerName(
                              items,
                              fixtureEventName,
                            );
                            return (
                              <div
                                key={index}
                                className="mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1 "
                              >
                                <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                                  <div>
                                    <div
                                      onClick={() =>
                                        handleOpenModal(
                                          items?.selectionId,
                                          items?.runnerName,
                                          'bookmaker',
                                        )
                                      }
                                      className="flex cursor-pointer flex-col justify-center"
                                    >
                                      <h1 className="capitalize text-sm font-medium m-0 font-inter">
                                        {items?.runnerName}
                                      </h1>
                                    </div>
                                    {bookmakerExposer ? (
                                      <>
                                        <div>
                                          {bookmakerExposer?.type ===
                                          'profit' ? (
                                            <div className="">
                                              {' '}
                                              <span className="text-14 text-[#04a928]">
                                                Profit:{' '}
                                                {(
                                                  bookmakerExposer?.data || 0
                                                ).toFixed(2) || 0}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex ">
                                              {' '}
                                              <span className="text-14 text-[#CE2C16]">
                                                Loss:{' '}
                                                {(
                                                  bookmakerExposer?.data || 0
                                                ).toFixed(2) || 0}
                                              </span>
                                            </div>
                                          )}
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
                                      {items?.status === '' ||
                                      items?.status === 'ACTIVE' ? (
                                        <div className="flex flex-1">
                                          <BlueButton
                                            backPrize={
                                              items['ex']['availableToBack'][0]
                                                .price1
                                            }
                                            backSize={
                                              items['ex']['availableToBack'][0]
                                                .size
                                            }
                                            onClick={async () => {
                                              if (isLogin) {
                                                await addToBetPlace(
                                                  eventIdApidata || bm?.matchId,
                                                  items?.selectionId,
                                                  items?.runnerName,
                                                  'Cricket',
                                                  items['ex'][
                                                    'availableToBack'
                                                  ][0].price,
                                                  bm?.marketName,
                                                  'BACK',
                                                  bm,
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
                                            layPrize={
                                              items['ex']['availableToLay'][0]
                                                .price1
                                            }
                                            laySize={
                                              items['ex']['availableToLay'][0]
                                                .size
                                            }
                                            onClick={async () => {
                                              if (isLogin) {
                                                await addToBetPlace(
                                                  eventIdApidata || bm?.matchId,
                                                  items?.selectionId,
                                                  items?.runnerName,
                                                  'Cricket',
                                                  items['ex'][
                                                    'availableToLay'
                                                  ][0].price,
                                                  bm?.marketName,
                                                  'LAY',
                                                  bm,
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
                                          <StatusButton
                                            status={items?.status}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div className=" hidden md:w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]"></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
                  <div className="w-full flex flex-col">
                    <BettingOption
                      title={'FANCY'}
                      heading1={'Back'}
                      heading2={'Lay'}
                      handleClick={handleFancyShow}
                      showIcon={fancyShow}
                    />
                    {fancyShow && (
                      <>
                        {' '}
                        {fancy &&
                          fancy?.runners &&
                          fancy?.runners?.map((items, index) => {
                            const fancyExposer =
                              placedBetWinLossFancy?.type === 'fancy' &&
                              placedBetWinLossFancy?.exposer !== ''
                                ? placedBetWinLossFancy?.exposer?.find(
                                    (fancy) =>
                                      fancy?.id === Number(items?.SelectionId),
                                  )
                                : '';
                            return (
                              <div
                                key={index}
                                className={`mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1 ${
                                  items.RunnerName.toLowerCase().includes(
                                    'win the toss',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'lunch fav',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'hatrick',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'maiden',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    '1st wkt caught out',
                                  )
                                    ? ''
                                    : 'hidden'
                                }`}
                              >
                                <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                                  <div>
                                    <div
                                      onClick={() =>
                                        handleOpenModal(
                                          items?.SelectionId,
                                          items?.RunnerName,
                                          'fancy',
                                        )
                                      }
                                      className="flex cursor-pointer flex-col justify-center"
                                    >
                                      <span className="capitalize text-14 leading-5 font-medium m-0 font-inter">
                                        {items?.RunnerName}
                                      </span>
                                    </div>
                                    {fancyExposer ? (
                                      <>
                                        <div>
                                          {fancyExposer?.type === 'profit' ? (
                                            <div className="">
                                              {' '}
                                              <span
                                                className={`text-14 ${
                                                  fancyExposer?.data > 0
                                                    ? 'text-[#04a928]'
                                                    : 'text-black'
                                                }`}
                                              >
                                                {(
                                                  fancyExposer?.data || 0
                                                ).toFixed(2) || 0}
                                              </span>
                                            </div>
                                          ) : (
                                            0
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      ''
                                    )}
                                    <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                                  </div>
                                </div>

                                <div className="flex basis-[60%] md:justify-center justify-end relative  min-w-0 p-0">
                                  <div className="flex w-full justify-center md:flex-none flex-1">
                                    <div className="md:flex hidden w-1/3 "></div>
                                    <div className="flex md:w-1/3 w-full justify-center md:p-0 p-1">
                                      {items?.GameStatus === '' ||
                                      items?.GameStatus === 'ACTIVE' ? (
                                        <div className="flex flex-1">
                                          <BlueButton
                                            backPrize={items?.BackPrice1}
                                            backSize={items?.BackSize1}
                                            onClick={async () => {
                                              if (isLogin) {
                                                await addToNormalBetPlace(
                                                  items,
                                                  'BACK',
                                                  index,
                                                  items.BackPrice1,
                                                  fancy.market,
                                                  matchData?.name,
                                                  items.BackSize1,
                                                  items.RunnerName,
                                                  fancy,
                                                  fixtureEventName?.[0]
                                                    ?.inPlayFancyMinLimit,
                                                  fixtureEventName?.[0]
                                                    ?.inPlayFancyMaxLimit,
                                                );
                                              } else {
                                                navigate('/login');
                                              }
                                            }}
                                          />
                                          <PinkButton
                                            layPrize={items?.LayPrice1}
                                            laySize={items?.LaySize1}
                                            onClick={async () => {
                                              if (isLogin) {
                                                await addToNormalBetPlace(
                                                  items,
                                                  'LAY',
                                                  index,
                                                  items.LayPrice1,
                                                  fancy.market,
                                                  matchData?.name,
                                                  items.LaySize1,
                                                  items.RunnerName,
                                                  fancy,
                                                  fixtureEventName?.[0]
                                                    ?.inPlayFancyMinLimit,
                                                  fixtureEventName?.[0]
                                                    ?.inPlayFancyMaxLimit,
                                                );
                                              } else {
                                                navigate('/login');
                                              }
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex justify-center md:w-1/3 flex-1">
                                          <StatusButton
                                            status={items?.GameStatus}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    <div className=" hidden w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]">
                                      <p className="leading-[17px] text-black text-12">
                                        Min Bet:
                                        {
                                          fixtureEventName?.[0]
                                            ?.inPlayFancyMinLimit
                                        }
                                      </p>
                                      <p className="leading-[17px] text-black text-12">
                                        Max Bet:
                                        {
                                          fixtureEventName?.[0]
                                            ?.inPlayFancyMaxLimit
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
                  <div className="w-full flex flex-col">
                    <BettingOption
                      title={'SESSIONS'}
                      heading1={'No'}
                      heading2={'Yes'}
                      handleClick={handleSessionsShow}
                      showIcon={sessionsShow}
                    />
                    {sessionsShow && (
                      <>
                        {' '}
                        {sessions &&
                          sessions?.runners &&
                          sessions?.runners?.map((items, index) => {
                            const sessionExposer =
                              placedBetWinLossSession?.type === 'session' &&
                              placedBetWinLossSession?.exposer !== ''
                                ? placedBetWinLossSession?.exposer?.find(
                                    (fancy) =>
                                      fancy?.id === Number(items?.SelectionId),
                                  )
                                : '';
                            return (
                              <div
                                key={index}
                                className={`mb-5 md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1 ${
                                  items.RunnerName.toLowerCase().includes(
                                    'win the toss',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'lunch fav',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'hatrick',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'maiden',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'run',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    '1st wkt caught out',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'wkt runs',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'fall of 1st wkt',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    '1st Wkt lost to',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'total match',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'How many balls face',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    '1st inn 0',
                                  )
                                    ? ''
                                    : 'hidden'
                                } ${
                                  items.RunnerName.includes('.') ||
                                  items.RunnerName.includes(
                                    '1st Inn 0 to 20 overs Total 2 runs',
                                  ) ||
                                  items.RunnerName.includes(
                                    '1st Inn 0 to 20 overs Total 1 runs',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'run bhav',
                                  ) ||
                                  items.RunnerName.toLowerCase().includes(
                                    'over 1',
                                  )
                                    ? 'hidden'
                                    : ''
                                }`}
                              >
                                <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                                  <div>
                                    <div
                                      onClick={() =>
                                        handleOpenModal(
                                          items?.SelectionId,
                                          items?.RunnerName,
                                          'session',
                                        )
                                      }
                                      className="flex flex-col cursor-pointer justify-center"
                                    >
                                      <span className="capitalize text-14 leading-5 font-medium m-0 font-inter">
                                        {items?.RunnerName}
                                      </span>
                                    </div>
                                    {sessionExposer ? (
                                      <>
                                        <div>
                                          {sessionExposer?.type === 'profit' ? (
                                            <div className="">
                                              {' '}
                                              <span
                                                className={`text-14 ${
                                                  sessionExposer?.data > 0
                                                    ? 'text-[#04a928]'
                                                    : 'text-black'
                                                }`}
                                              >
                                                {(
                                                  sessionExposer?.data || 0
                                                ).toFixed(2) || 0}
                                              </span>
                                            </div>
                                          ) : (
                                            0
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      ''
                                    )}
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
                                            layPrize={items?.LayPrice1}
                                            laySize={items?.LaySize1}
                                            onClick={async () => {
                                              if (isLogin) {
                                                await addToNormalBetPlace(
                                                  items,
                                                  'LAY',
                                                  index,
                                                  items.LayPrice1,
                                                  sessions.market,
                                                  matchData?.name,
                                                  items.LaySize1,
                                                  items.RunnerName,
                                                  sessions,
                                                  minLimit,
                                                  maxLimit,
                                                );
                                              } else {
                                                navigate('/login');
                                              }
                                            }}
                                          />
                                          <BlueButton
                                            backPrize={items?.BackPrice1}
                                            backSize={items?.BackSize1}
                                            onClick={async () => {
                                              if (isLogin) {
                                                await addToNormalBetPlace(
                                                  items,
                                                  'BACK',
                                                  index,
                                                  items.BackPrice1,
                                                  sessions.market,
                                                  matchData?.name,
                                                  items.BackSize1,
                                                  items.RunnerName,
                                                  sessions,
                                                  minLimit,
                                                  maxLimit,
                                                );
                                              } else {
                                                navigate('/login');
                                              }
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex justify-center md:w-1/3 flex-1">
                                          <StatusButton
                                            status={items?.GameStatus}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    <div className="hidden w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]">
                                      <p className="leading-[17px] text-black text-12">
                                        Min Bet: {minLimit}
                                      </p>
                                      <p className="leading-[17px] text-black text-12">
                                        Max Bet: {maxLimit}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:max-w-[390px] w-full hidden md:block">
            <Banner wrapperClassName="hidden" />
          </div>
        </div>
      </div>
      <RunPosition
        isOpen={isOpenModal}
        handleClose={handleCloseModal}
        data={{
          userId: shiv11_userID,
          eventId: eventId,
          selectionId: selectedID,
          runner: selectedRunner,
          market: selectedMarket,
        }}
      />
    </>
  );
};

export default SingleBetCricket;
