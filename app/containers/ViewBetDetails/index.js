/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import { isLoggedIn } from '@/utils/apiHandlers';
import {
  fetchBetDetailsAction,
  fetchCurrentCalculationAction,
  fetchUserDetailsAction,
} from '@/redux/actions';
import { getAuthData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { stakeList } from '@/utils/contants';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiLoader4Line } from 'react-icons/ri';
import { betValidationSchema } from '@/utils/validation';
import { isYupError, parseYupError } from '@/utils/Yup';
const ViewBetDetails = () => {
  const bets = useSelector((state) => state.bet.selectedBet);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [betData, setBetData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [currentBetWinLossDatas, setCurrentBetWinLossData] = useState(null);
  const [profit, setProfit] = useState(null);
  const [betLoader, setBetLoader] = useState(false);
  const islogin = isLoggedIn();
  const navigate = useNavigate();
  const [usersBets, setusersBets] = useState({});
  const [placedBetWinLossDatas, setPlacedBetWinLossData] = useState(null);
  const [isPlacedBetStatsCalc, setPlacedBetStatsCalc] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [odds, setOdds] = useState(null);
  const [selectionId, setSelectionId] = useState({});
  const [formError, setFormError] = useState({
    stake: '',
  });
  useEffect(() => {
    setBetData(bets?.[0]);
  }, [bets]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      localStorage.removeItem('reduxState');
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    calcCurrentBetStats({ ...betData });
  }, [betData, bets]);

  const handleChange = (e) => {
    let inputValue = e.target.value;
    if (
      (betData?.market === 'Match Odds' || 'MATCH_ODDS') &&
      betData?._marketData?.inplay === false &&
      inputValue > 1
    ) {
      inputValue = e.target.value > 1 ? 1 : e.target.value;
      setBetData({ ...betData, stake: inputValue });
    } else {
      setBetData({ ...betData, stake: inputValue });
    }
    setFormError({
      ...formError,
      [name]: '',
    });
    dispatch(fetchCurrentCalculationAction(currentBetWinLossDatas));
  };

  const calcCurrentBetStats = (betData) => {
    if (betData._marketData) {
      const currentBetWinLossData = {};
      if (betData.market === 'session') {
        betData.percent = betData.percent / 100;
        betData.percent += 1;
        betData.percent = Number(Number(betData.percent));
      }

      let win = 0;
      let loss = 0;
      if (
        betData.market === 'Match Odds' ||
        betData.market === 'MATCH_ODDS' ||
        betData.market === 'bookmaker'
      ) {
        if (betData.betOn === 'BACK') {
          win = betData.stake * (betData.price - 1);
          loss = betData.stake * -1;
        } else {
          win = betData.stake * (betData.price - 1) * 1;
          loss = betData.stake * -1;
        }

        for (let j = 0; j < betData._marketData?.runners?.length; j++) {
          if (!currentBetWinLossData[betData.gameType]) {
            currentBetWinLossData[betData.gameType] = {};
          }

          if (
            !currentBetWinLossData[betData.gameType][
              betData._marketData['runners'][j].selectionId
            ]
          ) {
            currentBetWinLossData[betData.gameType][
              betData._marketData['runners'][j].selectionId
            ] = 0;
          }

          if (
            Number(betData._marketData['runners'][j].selectionId) ===
            Number(betData.selectionId)
          ) {
            if (betData.betOn === 'BACK') {
              currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].selectionId
              ] += Number(Number(win).toFixed(2));
            } else {
              currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].selectionId
              ] += Number(Number(loss).toFixed(2));
            }
          } else {
            if (betData.betOn === 'BACK') {
              currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].selectionId
              ] += Number(Number(loss).toFixed(2));
            } else {
              currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].selectionId
              ] += Number(Number(win).toFixed(2));
            }
          }
          const matchOddsallData = Object.entries(
            currentBetWinLossData[betData?.gameType],
          ).map(([id, data]) => ({
            id: parseInt(id),
            data: data,
            type: data >= 0 ? 'profit' : 'loss',
          }));
          setCurrentBetWinLossData({
            type:
              betData?.gameType === 'Match Odds' ? 'odds' : betData?.gameType,
            calculation: matchOddsallData,
          });

          const matchOddsName = currentBetWinLossData[betData?.gameType];
          const positiveMatchOdds = Object.fromEntries(
            Object.entries(matchOddsName)
              .filter(([key, value]) => value > 0)
              .map(([key, value]) => ['getprofit', value]),
          );
          setProfit(positiveMatchOdds);
        }
      } else {
        if (betData.market === 'session') {
          if (betData.betOn === 'BACK') {
            win = betData.stake * (betData.percent - 1);
            loss = betData.stake * -1;
          } else {
            loss = betData.stake * -1;
            win = betData.stake * (betData.percent - 1) * 1;
          }

          for (let j = 0; j < betData._marketData.runners?.length; j++) {
            if (!currentBetWinLossData[betData.gameType]) {
              currentBetWinLossData[betData.gameType] = {};
            }

            if (
              !currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].SelectionId
              ]
            ) {
              currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].SelectionId
              ] = 0;
            }

            if (
              Number(betData._marketData['runners'][j].SelectionId) ===
              Number(betData.selectionId)
            ) {
              if (betData.betOn === 'BACK') {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(win).toFixed(2));
              } else {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(loss).toFixed(2));
              }
            } else {
              if (betData.betOn === 'BACK') {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(loss).toFixed(2));
              } else {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(win).toFixed(2));
              }
            }
            const matchOdds = currentBetWinLossData[betData?.gameType];
            const positiveMatchOdds = Object.fromEntries(
              Object.entries(matchOdds)
                .filter(([key, value]) => value > 0)
                .map(([key, value]) => ['getprofit', value]),
            );
            const NegativeMatchOdds = Object.fromEntries(
              Object.entries(matchOdds)
                .filter(([key, value]) => value < 0)
                .map(([key, value]) => ['getloss', value]),
            );

            setProfit(positiveMatchOdds);
            setCurrentBetWinLossData({
              type:
                betData?.gameType === 'Match Odds' ? 'odds' : betData?.gameType,
              profit: positiveMatchOdds?.getprofit,
              selectionId: betData?.selectionId,
              loss: NegativeMatchOdds?.getloss,
            });
          }
        } else {
          if (betData.betOn === 'BACK') {
            win = betData.stake * (betData.price - 1);
            loss = betData.stake * -1;
          } else {
            win = betData.stake * (betData.price - 1) * 1;
            loss = betData.stake * -1;
          }

          for (let j = 0; j < betData._marketData?.runners?.length; j++) {
            if (!currentBetWinLossData[betData.gameType]) {
              currentBetWinLossData[betData.gameType] = {};
            }

            if (
              !currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].SelectionId
              ]
            ) {
              currentBetWinLossData[betData.gameType][
                betData._marketData['runners'][j].SelectionId
              ] = 0;
            }

            if (
              Number(betData._marketData['runners'][j].SelectionId) ===
              Number(betData.selectionId)
            ) {
              if (betData.betOn === 'BACK') {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(win).toFixed(2));
              } else {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(loss).toFixed(2));
              }
            } else {
              if (betData.betOn === 'BACK') {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(loss).toFixed(2));
              } else {
                currentBetWinLossData[betData.gameType][
                  betData._marketData['runners'][j].SelectionId
                ] += Number(Number(win).toFixed(2));
              }
            }
          }

          const matchOdds = currentBetWinLossData[betData?.gameType];
          const positiveMatchOdds = Object.fromEntries(
            Object.entries(matchOdds || {}) // Using logical OR to provide an empty object if matchOdds is undefined or null
              .filter(([key, value]) => value > 0)
              .map(([key, value]) => ['getprofit', value]),
          );
          const NegativeMatchOdds = Object.fromEntries(
            Object.entries(matchOdds || {})
              .filter(([key, value]) => value < 0)
              .map(([key, value]) => ['getloss', value]),
          );

          setProfit(positiveMatchOdds);
          setCurrentBetWinLossData({
            type:
              betData?.gameType === 'Match Odds' ? 'odds' : betData?.gameType,
            profit: positiveMatchOdds?.getprofit,
            selectionId: betData?.selectionId,
            loss: NegativeMatchOdds?.getloss,
          });
        }
      }
    } else {
      setCurrentBetWinLossData(null);
    }
  };

  const handleRemoveBet = (selectionId) => {
    const updatedBets = bets?.filter(
      (item) => item.selectionId !== selectionId,
    );
    setFormError({});
    dispatch(fetchBetDetailsAction(updatedBets));
    handleProfitzero();
  };

  useEffect(() => {
    bets?.length === 0 && navigate(-1);
  }, []);

  useEffect(() => {
    dispatch(fetchCurrentCalculationAction(currentBetWinLossDatas));
  }, [currentBetWinLossDatas]);

  const handleProfitzero = () => {
    dispatch(fetchCurrentCalculationAction(null));
  };

  useEffect(() => {
    if (islogin) {
      getUserInfo();
    }
  }, [islogin]);

  const getUserInfo = async () => {
    try {
      const response = await getAuthData('/user/get-user-details');
      if (response?.status === 201 || response?.status === 200) {
        setUserInfo(response.data);
        dispatch(fetchUserDetailsAction({}));
        localStorage.setItem('yolo_userID', response.data.id); // Return the data instead of logging it
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  const placeBet = async (e) => {
    e.preventDefault();
    setBetLoader(true);
    setFormError({});
    let data = { ...betData, stake: Number(betData?.stake) };
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // if (betData?._marketData?.totalMatched > 25000) {

    if (data.stake !== 0 && data?.price >= 1) {
      try {
        // Introduce a delay of 2 seconds before making the API call
        await betValidationSchema.validate(
          {
            ...data,
            minimumBet: betData?.minimumBet || 0,
            maximumBet: betData?.maximumBet || Infinity,
          },
          {
            abortEarly: false,
          },
        );
        await delay(betData.market === 'session' ? 2000 : 3000);
        const response = await postAuthData('/bet/place', data);
        if (response.status === 200) {
          toast.success('Bet Placed Successfully');
          handleRemoveBet(data.selectionId);
          setProfit({});
          dispatch(fetchCurrentCalculationAction(null));
          dispatch(fetchBetDetailsAction([]));
          handleProfitzero();
          getUserInfo();
          navigate(-1);
        } else {
          toast.error(response?.data || 'Something went wrong');
        }
      } catch (error) {
        if (isYupError(error)) {
          setFormError(parseYupError(error));
        } else {
          toast.error('An error occurred while placing the bet');
        }
      } finally {
        setBetLoader(false);
      }
    } else {
      toast.error('Please Enter Amount');
      setShow(true);
      setBetLoader(false);
    }

    // if (
    //   betData?._marketData?.market === 'fancy' ||
    //   betData?._marketData?.market === 'session' ||
    //   betData?._marketData?.marketName === 'Bookmaker' ||
    //   betData?._marketData?.marketName === 'bookmaker'
    // ) {
    //   if (data.stake !== 0 && data?.price >= 1) {
    //     try {
    //       // Introduce a delay of 2 seconds before making the API call
    //       await delay(betData.market === 'session' ? 2000 : 3000);
    //       const response = await postAuthData('/bet/place', data);
    //       if (response.status === 200) {
    //         toast.success('Bet Placed Successfully');
    //         handleRemoveBet(data.selectionId);
    //         setProfit({});
    //         dispatch(fetchCurrentCalculationAction(null));
    //         dispatch(fetchBetDetailsAction([]));
    //         handleProfitzero();
    //         getUserInfo();
    //         // navigate('/profile/my-bets');
    //       } else {
    //         toast.error(response?.data || 'Something went wrong');
    //       }
    //     } catch (error) {
    //       console.error(error);
    //       toast.error('An error occurred while placing the bet');
    //     } finally {
    //       setBetLoader(false);
    //     }
    //   } else {
    //     toast.error('Please Enter Amount');
    //     setShow(true);
    //     setBetLoader(false);
    //   }
    // } else {
    //   setBetLoader(false);
    // }
    setBetLoader(false);
    // } else {
    //   toast.error('Bet is  not allowed due to min and max bet range not valid');
    //   setBetLoader(false);
    // }
  };

  useEffect(() => {
    let source;
    if (betData?.eventId) {
      if (source) {
        source.close();
        setOdds(null);
      }
      source = new EventSource(
        `${process.env.API_URL}/catalogue/cricket/get-catalogue-stream?eventId=${betData?.eventId}`,
      );
      source.onmessage = function (e) {
        let tempdata = JSON.parse(e.data);
        const { session, fancy, bookmaker, MatchOdds } = tempdata;
        setSelectionId(tempdata?.sidMap);
        MatchOdds?.catalogue?.map((item) => {
          if (item?.market === 'Match Odds' || item?.market === 'Winner') {
            setOdds(item);
          }
        });
        setMarketData(tempdata);
      };
    }

    // Cleanup
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [betData?.eventId]);

  const isMatchOddsAndNotInPlay =
    betData?.market === 'Match Odds' && betData?._marketData?.inplay === false;

  useEffect(() => {
    if (marketData && usersBets?.bets && !isPlacedBetStatsCalc) {
      calcPlacedBetStats(usersBets?.bets);
      setPlacedBetStatsCalc(true);
    }
  }, [usersBets?.bets, isPlacedBetStatsCalc, marketData]);

  useEffect(() => {
    const islogin = isLoggedIn();
    if (islogin && betData?.eventId) {
      getUserBets();
    }
  }, [betData?.eventId]);

  const getUserBets = async () => {
    const response = await getAuthData(
      `/bet/current-list?eventId=${betData?.eventId}&offset=0&limit=100`,
    );
    if (response?.status === 200) {
      setusersBets(response?.data);
      setPlacedBetStatsCalc(false);
    } else {
      setusersBets({});
    }
  };

  const nameAlias = {
    match2: 'Bookmaker 2',
    match1: 'Bookmaker 1',
    bookmaker: 'Bookmaker',
  };

  const calcPlacedBetStats = (bets) => {
    const betGroups = {};
    const sessionExposure = {};
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

        if (element.event_id === Number(betData?.eventId)) {
          eventBets.push(element);
        }
      });
    }

    if (_marketData) {
      eventBets.forEach((bet) => {
        if (bet.market === 'bookmaker') {
          bet.price /= 100;
          bet.price += 1;
          bet.price = Number(Number(bet.price));
        }

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
        )
          if (
            _marketData &&
            _marketData.MatchOdds?.catalogue &&
            _marketData.MatchOdds?.catalogue.length
          ) {
            for (let i = 0; i < _marketData.MatchOdds?.catalogue.length; i++) {
              if (
                _marketData?.MatchOdds?.catalogue[i]?.market === bet.game_type
              ) {
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
                      _marketData?.MatchOdds?.catalogue[i].market
                    ][
                      [
                        _marketData?.MatchOdds?.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ]
                  ) {
                    placedBetWinLossData[
                      _marketData?.MatchOdds?.catalogue[i]?.market
                    ][
                      [
                        _marketData?.MatchOdds?.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ] = 0;
                  }

                  if (
                    Number([
                      [
                        _marketData?.MatchOdds?.catalogue[i]['runners'][j]
                          .selectionId,
                      ],
                    ]) === bet.selection_id
                  ) {
                    if (bet.bet_on === 'BACK') {
                      placedBetWinLossData[
                        _marketData?.MatchOdds?.catalogue[i].market
                      ][
                        [
                          _marketData?.MatchOdds?.catalogue[i]['runners'][j]
                            .selectionId,
                        ]
                      ] += Number(Number(win).toFixed(2));
                    } else {
                      placedBetWinLossData[
                        _marketData?.MatchOdds?.catalogue[i]?.market
                      ][
                        [
                          _marketData?.MatchOdds?.catalogue[i]['runners'][j]
                            .selectionId,
                        ]
                      ] += Number(Number(loss).toFixed(2));
                    }
                  } else {
                    if (bet.bet_on === 'BACK') {
                      placedBetWinLossData[
                        _marketData?.MatchOdds?.catalogue[i]?.market
                      ][
                        [
                          _marketData?.MatchOdds?.catalogue[i]['runners'][j]
                            .selectionId,
                        ]
                      ] += Number(Number(loss).toFixed(2));
                    } else {
                      placedBetWinLossData[
                        _marketData?.MatchOdds?.catalogue[i]?.market
                      ][
                        [
                          _marketData?.MatchOdds?.catalogue[i]['runners'][j]
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
          if (
            _marketData &&
            _marketData?.bookmaker?.catalogue &&
            _marketData?.bookmaker?.catalogue?.length
          ) {
            for (let i = 0; i < _marketData.bookmaker.catalogue.length; i++) {
              if (
                _marketData?.bookmaker?.catalogue[i]?.market === bet.game_type
              ) {
                for (
                  let j = 0;
                  j < _marketData?.bookmaker?.catalogue[i]['runners'].length;
                  j++
                ) {
                  if (
                    !placedBetWinLossData[
                      _marketData?.bookmaker?.catalogue[i].market
                    ]
                  ) {
                    placedBetWinLossData[
                      _marketData?.bookmaker?.catalogue[i].market
                    ] = {};
                  }

                  if (
                    !placedBetWinLossData[
                      _marketData?.bookmaker?.catalogue[i].market
                    ][
                      [
                        _marketData?.bookmaker?.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ]
                  ) {
                    placedBetWinLossData[
                      _marketData?.bookmaker?.catalogue[i].market
                    ][
                      [
                        _marketData?.bookmaker?.catalogue[i]['runners'][j]
                          .selectionId,
                      ]
                    ] = 0;
                  }

                  if (
                    Number([
                      [
                        _marketData?.bookmaker?.catalogue[i]['runners'][j]
                          .selectionId,
                      ],
                    ]) === bet.selection_id
                  ) {
                    if (bet.bet_on === 'BACK') {
                      placedBetWinLossData[
                        _marketData?.bookmaker?.catalogue[i].market
                      ][
                        [
                          _marketData?.bookmaker?.catalogue[i]['runners'][j]
                            .selectionId,
                        ]
                      ] += Number(Number(win).toFixed(2));
                    } else {
                      placedBetWinLossData[
                        _marketData?.bookmaker?.catalogue[i].market
                      ][
                        [
                          _marketData?.bookmaker?.catalogue[i]['runners'][j]
                            .selectionId,
                        ]
                      ] += Number(Number(loss).toFixed(2));
                    }
                  } else {
                    if (bet.bet_on === 'BACK') {
                      placedBetWinLossData[
                        _marketData?.bookmaker?.catalogue[i].market
                      ][
                        [
                          _marketData?.bookmaker?.catalogue[i]['runners'][j]
                            .selectionId,
                        ]
                      ] += Number(Number(loss).toFixed(2));
                    } else {
                      placedBetWinLossData[
                        _marketData?.bookmaker?.catalogue[i].market
                      ][
                        [
                          _marketData?.bookmaker?.catalogue[i]['runners'][j]
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

        if (bet.game_type === 'fancy') fancyBets.push(bet);
      });
    }

    if (betGroups['Normal'] || betGroups['fancy']) {
      const groups = {};
      fancyBets.forEach((bet) => {
        if (groups[bet.selection_id]) {
          groups[bet.selection_id].push(bet);
        } else {
          groups[bet.selection_id] = [bet];
        }
      });

      for (const [sid, value] of Object.entries(groups)) {
        let exposure = 0;
        const betContainer = {
          BACK: {},
          LAY: {},
        };

        value.forEach((bet) => {
          if (bet.bet_on === 'BACK') {
            let win = (bet.stake * bet.percent) / 100;
            let loss = bet.stake;
            let isGroupAvailable = false;

            const keys = Object.keys(betContainer.BACK)
              .map((i) => Number(i))
              .sort();

            for (let i = 0; i < keys.length; i++) {
              if (bet.price <= keys[i]) {
                isGroupAvailable = true;
                if (betContainer.BACK[keys[i]].length < 2) {
                  betContainer.BACK[keys[i]].push({
                    betOn: bet.bet_on,
                    win,
                    loss,
                  });
                } else {
                  betContainer.BACK[keys[i]][1].win += win;
                  betContainer.BACK[keys[i]][1].loss += loss;
                }
                break;
              }
            }

            if (!isGroupAvailable) {
              if (betContainer.LAY[bet.price]) {
                betContainer.LAY[bet.price][0].win += win;
                betContainer.LAY[bet.price][0].loss += loss;
              } else {
                betContainer.LAY[bet.price] = [
                  { betOn: bet.bet_on, win, loss },
                ];
              }
            }
          } else {
            let win = bet.stake;
            let loss = (bet.stake * bet.percent) / 100;
            let isGroupAvailable = false;

            const keys = Object.keys(betContainer.LAY)
              .map((i) => Number(i))
              .sort((i, j) => j - i);

            for (let i = 0; i < keys.length; i++) {
              if (bet.price >= keys[i]) {
                isGroupAvailable = true;
                if (betContainer.LAY[keys[i]].length < 2) {
                  betContainer.LAY[keys[i]].push({
                    betOn: bet.bet_on,
                    win,
                    loss,
                  });
                } else {
                  betContainer.LAY[keys[i]][1].win += win;
                  betContainer.LAY[keys[i]][1].loss += loss;
                }
                break;
              }
            }

            if (!isGroupAvailable) {
              if (betContainer.BACK[bet.price]) {
                betContainer.BACK[bet.price][0].win += win;
                betContainer.BACK[bet.price][0].loss += loss;
              } else {
                betContainer.BACK[bet.price] = [
                  { betOn: bet.bet_on, win, loss },
                ];
              }
            }
          }
        });

        for (const [betOn, bets] of Object.entries(betContainer)) {
          const keys = Object.keys(bets).map((i) => Number(i));

          if (betOn === 'BACK') {
            keys.sort((i, j) => j - i);
          } else {
            keys.sort();
          }

          let forwardWin = 0;
          let forwardLoss = 0;

          keys.forEach((key, index) => {
            if (bets[key].length === 1 && keys.length !== index + 1) {
              forwardWin += bets[key][0].win;
              forwardLoss += bets[key][0].loss;
              delete bets[key];
            } else {
              bets[key][0].win += forwardWin;
              bets[key][0].loss += forwardLoss;

              forwardWin = 0;
              forwardLoss = 0;
            }
          });
        }

        for (const [betOn, bets] of Object.entries(betContainer)) {
          const keys = Object.keys(bets).map((i) => Number(i));

          if (betOn === 'BACK') {
            keys.sort((i, j) => j - i);
          } else {
            keys.sort();
          }

          keys.forEach((key, index) => {
            if (bets[key].length > 1) {
              let maxLossBetIndex = 0;
              let minWinBetIndex = 0;

              let maxLoss = bets[key][maxLossBetIndex].loss;
              if (bets[key][1].loss > maxLoss) {
                maxLossBetIndex = 1;
                maxLoss = bets[key][maxLossBetIndex].loss;
              }

              let minWin = bets[key][minWinBetIndex].win;
              if (bets[key][1].win < minWin) {
                minWinBetIndex = 1;
                minWin = bets[key][minWinBetIndex].win;
              }

              if (
                maxLossBetIndex == 1 &&
                minWinBetIndex == 0 &&
                maxLoss > minWin
              ) {
                let win = 0;
                for (let k = index; k < keys.length; k++) {
                  let settlementBet = bets[keys[k]];
                  let ratio = settlementBet[0].loss / settlementBet[0].win;

                  if (maxLoss - win > settlementBet[0].win) {
                    win += settlementBet[0].win;
                    settlementBet[0].win = 0;
                    settlementBet[0].loss = settlementBet[0].win * ratio;
                    continue;
                  } else {
                    settlementBet[0].win -= maxLoss - win;
                    settlementBet[0].loss -= (maxLoss - win) * ratio;
                    win += maxLoss - win;
                    break;
                  }
                }
                exposure += maxLoss - win;
              } else {
                exposure += maxLoss - minWin;
              }
            } else {
              exposure += bets[key][0].loss;
            }
          });
        }
        sessionExposure[selectionId] = exposure;
      }
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
    // setPlacedBetWinLossData(placedBetWinLossData);
  };

  useEffect(() => {
    if (userInfo) dispatch(fetchUserDetailsAction({}));
  }, [userInfo]);
  //filter betslip list for tennis
  const filteredStakeList =
    bets?.[0]?.eventType == 'Tennis'
      ? stakeList.filter((item) => item.id !== 7)
      : stakeList;

  return (
    <div className="py-5 container">
      {bets.length > 0 && islogin && (
        <div className="relative flex flex-col min-w-0 break-words w-full mt-4 font-inter">
          <div className="w-full flex flex-col bg-white p-3 rounded mb-3">
            <div
              className={`${
                bets?.[0].betOn === 'BACK'
                  ? 'border-[#78BBFD] bg-[#A7D8FD]'
                  : 'border-[#FA7290] bg-[#FFD6D6]'
              } border  border-t-4 text-12 rounded mb-3`}
            >
              <div className="flex items-center justify-between  py-1 px-2 ">
                <div>
                  <h3 className="text-[#203974] font-semibold">
                    {bets?.[0]?.selection}
                  </h3>
                  <p className="text-[#35495E]">{bets?.[0]?.event}</p>
                </div>
              </div>
              <div className="bg-white relative p-2">
                <div className="flex items-center gap-5">
                  <div>
                    <label className="text-[#35495E] block">
                      {bets?.[0]?.bettingOn || 'Match Odds'}
                    </label>
                    <input
                      type="number"
                      value={
                        bets?.[0]?.market === 'session'
                          ? bets?.[0]?.price
                          : bets?.[0]?.price || ''
                      }
                      className="bg-[#EDF0F7] max-w-[100px] h-8 p-2 outline-none rounded text-black"
                      placeholder={bets?.[0]?.bettingOn}
                    />
                  </div>
                  <div>
                    <label className="text-[#35495E] block">Stake</label>
                    <input
                      onChange={handleChange}
                      value={betData?.stake}
                      type="number"
                      min="0"
                      max={
                        isMatchOddsAndNotInPlay
                          ? 1 // set the maximum value to 1
                          : 10000000000000 // set the maximum value to 10000000000
                      }
                      className="bg-[#EDF0F7] max-w-[100px] h-8 p-2 outline-none rounded text-black"
                      placeholder={
                        isMatchOddsAndNotInPlay ? 'Max: 1' : 'Min: 100'
                      }
                    />
                  </div>
                </div>
                <div
                  className={`absolute ${
                    bets?.[0].betOn === 'BACK'
                      ? ' bg-[#DAEDFF]'
                      : ' bg-[#FFD6D6]'
                  } right-0 top-2 bg-[#DAEDFF] rounded-tl-md rounded-bl-md px-3 py-1 leading-[15px]`}
                >
                  <p className="text-[#35495E]">
                    {bets?.[0].betOn === 'BACK' ? 'Profit' : 'Liability'}
                  </p>
                  <span
                    className={
                      bets?.[0].betOn === 'BACK'
                        ? 'text-[#219642]'
                        : 'text-[#FA7290]'
                    }
                  >
                    {bets?.[0].betOn === 'BACK'
                      ? +profit?.getprofit || 0.0
                      : -profit?.getprofit || 0.0}
                  </span>
                </div>
                {formError.stake && (
                  <div className="form-eror flex text-start text-14">
                    {formError.stake}
                  </div>
                )}
                {betData?._marketData?.inplay === false &&
                (betData?.market !== 'Match Odds' || 'MATCH_ODDS') ? (
                  <div className="my-2 text-red-700">
                    Bet should not exceed 1 rupees.
                  </div>
                ) : (
                  ''
                )}
                {(betData?.market !== 'Match Odds' || 'MATCH_ODDS') &&
                betData?._marketData?.inplay !== false ? (
                  <>
                    <ul className="flex items-center justify-center gap-1 px-7 py-5 flex-wrap">
                      {filteredStakeList &&
                        filteredStakeList.map((item, index) => (
                          <li
                            onClick={() => {
                              setBetData({
                                ...betData,
                                stake: item.number,
                              });
                            }}
                            key={index}
                            className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[70px] rounded h-8 cursor-pointer"
                          >
                            {item.number}
                          </li>
                        ))}
                      <li
                        onClick={() => {
                          setBetData({ ...betData, stake: '' });
                          setProfit({});
                          // setLiability({});
                          handleProfitzero();
                        }}
                        className={`flex items-center justify-center p-2 text-12 border text-[#000000] w-[70px] rounded h-8 cursor-pointer ${
                          bets?.[0].betOn === 'BACK'
                            ? 'border-[#78BBFD] bg-[#A7D8FD]'
                            : 'border-[#FA7290] bg-[#FFD6D6]'
                        }`}
                      >
                        Clear
                      </li>
                      {/* <li className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[80px] rounded h-8 cursor-pointer">
                            Edit Stake
                          </li> */}
                    </ul>{' '}
                  </>
                ) : (
                  ''
                )}
                <div className="bg-[#EDF0F7] p-2 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      handleRemoveBet(bets?.[0]?.selectionId);
                      navigate(-1);
                    }}
                    className="flex items-center justify-center border border-[#646468] text-[#687488] rounded gap-3 py-2 w-2/4"
                  >
                    <img
                      src="/images/place-order/trash.png"
                      alt="trash"
                      className="mr-1"
                    />
                    Cancel Order
                  </button>
                  {betLoader ? (
                    <button
                      className={`flex ${'bg-[#bec5d0] border-[#bec5d0] '} items-center justify-center border  text-white  rounded gap-3 py-2 w-2/4`}
                    >
                      <RiLoader4Line />
                    </button>
                  ) : (
                    <button
                      disabled={
                        betData?.stake === '' || betData?.stake === 0
                          ? true
                          : false
                      }
                      onClick={(e) => placeBet(e)}
                      className={`flex ${
                        betData?.stake === '' || betData?.stake === 0
                          ? 'bg-[#bec5d0] border-[#bec5d0] '
                          : 'bg-[#0EAD69] border-[#0EAD69]'
                      } items-center justify-center border  text-white  rounded gap-3 py-2 w-2/4`}
                    >
                      <img
                        src="/images/place-order/check.png"
                        alt="check"
                        className="mr-1"
                      />
                      Place Bet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full hidden  flex-col bg-[#A7D8FD] p-3 rounded">
            <h2 className="border-b border-black mb-3 font-medium">
              Bookset Calculation
            </h2>
            {(placedBetWinLossDatas || placedBetWinLossDatas !== null) && (
              <>
                {' '}
                {odds &&
                  odds.runners.map((items, index) => {
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
                        className="border-b border-dashed border-black mb-2 pb-2"
                      >
                        <h1 className="capitalize text-sm font-medium m-0 font-inter">
                          {items?.runner}
                        </h1>
                        {matchOddsExposer ? (
                          <>
                            <div>
                              {matchOddsExposer?.type === 'profit' ? (
                                <div className="">
                                  {' '}
                                  <span className="text-14 text-[#04a928]">
                                    Profit: {matchOddsExposer?.data || 0}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex ">
                                  {' '}
                                  <span className="text-14 text-[#CE2C16]">
                                    Loss: {matchOddsExposer?.data || 0}
                                  </span>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    );
                  })}
              </>
            )}
            {/* <div>
              <h1 className="capitalize text-sm font-medium m-0 font-inter">
                Rajasthan Royals
              </h1>
              <span className="text-14 text-[#CE2C16]">Loss: -200</span>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBetDetails;
