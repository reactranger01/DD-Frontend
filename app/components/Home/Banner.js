/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import { isLoggedIn } from '@/utils/apiHandlers';
import {
  fetchBetDetailsAction,
  fetchCurrentCalculationAction,
  fetchLiveTvAction,
  fetchUserDetailsAction,
} from '@/redux/actions';
import { getAuthData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { stakeList } from '@/utils/contants';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import InputField from '../FormElements/InputField';
import { useNavigate } from 'react-router-dom';
import { RiLoader4Line } from 'react-icons/ri';
import SelectBox from '../FormElements/SelectBox';
import { isYupError, parseYupError } from '@/utils/Yup';
import moment from 'moment';
import { numberWithDigit } from '@/utils/numberWithDigit';
import PropTypes from 'prop-types';
import { betValidationSchema } from '@/utils/validation';
const Banner = ({ value, onChangeHandler, name, wrapperClassName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const bets = useSelector((state) => state.bet.selectedBet);
  const liveTV = useSelector((state) => state.tv.liveTv);
  const [show, setShow] = useState(false);
  const [betLoader, setBetLoader] = useState(false);
  const dispatch = useDispatch();
  const [betData, setBetData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [currentBetWinLossDatas, setCurrentBetWinLossData] = useState(null);
  const [profit, setProfit] = useState(null);
  const [currentBetList, setCurrentBetList] = useState([]);
  const startDate = new Date();
  const endDate = new Date();
  const islogin = isLoggedIn();
  const [formError, setFormError] = useState({
    stake: '',
  });

  useEffect(() => {
    getAllBets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getAllBets = async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(
          `/bet/get-past-currentbets?status=current&limit=1000&offset=0&startdate=${moment(
            startDate,
          ).format('YYYY-MM-DD')}&enddate=${moment(endDate)
            .add(1, 'day')
            .format('YYYY-MM-DD')}`,
        );
        if (response?.status === 200) {
          setCurrentBetList(
            response.data?.bets === null ? [] : response.data?.bets,
          );
          // Return the data instead of logging it
        }
        return null;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };

  useEffect(() => {
    setBetData(bets?.[0]);
  }, [bets]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      localStorage.removeItem('reduxState');
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // const handleSearch = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  useEffect(() => {
    calcCurrentBetStats({ ...betData });
  }, [betData, bets]);

  const handleChangebet = (e) => {
    let inputValue = Number(e.target.value); // Convert input value to a number
    const { minimumBet, maximumBet, _marketData } = betData || {};
    const isInPlay = _marketData?.inplay;

    if (isInPlay === true) {
      // Ensure the input value is within the minimum and maximum bet range
      if (inputValue < minimumBet) {
        inputValue = minimumBet;
      } else if (inputValue > maximumBet) {
        inputValue = maximumBet;
      }
    } else {
      // If not in-play, cap the input value at 1 rupee
      inputValue = 1;
    }

    setBetData({ ...betData, stake: inputValue });
    dispatch(fetchCurrentCalculationAction(currentBetWinLossDatas));
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;
    setFormError((prev) => ({
      ...prev,
      stake: null, // Assuming 'stake' is the field that shows the error
    }));
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
        localStorage.setItem('shiv11_userID', response.data.id); // Return the data instead of logging it
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  useEffect(() => {
    dispatch(fetchUserDetailsAction({}));
  }, [userInfo]);

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
          // navigate(-1);
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
    setBetLoader(false);
  };

  useEffect(() => {
    if (userInfo) dispatch(fetchUserDetailsAction({}));
  }, [userInfo]);

  const handleTvClose = () => {
    dispatch(fetchLiveTvAction({ eventid: '', tvshow: false, game: '' }));
  };
  //filter betslip list for tennis
  const filteredStakeList =
    bets?.[0]?.eventType == 'Tennis'
      ? stakeList.filter((item) => item.id !== 7)
      : stakeList;
  const isMatchOddsAndNotInPlay =
    betData?.market === 'Match Odds' && betData?._marketData?.inplay === false;

  return (
    <div className="py-5">
      {/* <div className="flex items-center max-w-sm ml-auto pr-5">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none text-22 text-white">
            {reactIcons.search}
          </div>
          <input
            type="text"
            id="search"
            className="bg-[#1C77FF] border border-gray-300 font-semibold text-white outline-none text-md rounded-lg block w-full pl-10 p-2 h-[44px] mt-[5px] font-inter"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            required
          />
        </div>
      </div> */}
      <div className="relative">
        <div className="h-full overflow-auto custom-scroll">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="mb-1">
                <InputField
                  placeholder="Search"
                  name={name}
                  onChangeHandler={onChangeHandler}
                  value={value}
                  wrapperClassName={`w-[304px] ml-auto ${wrapperClassName}`}
                  className="bg-secondary-100 text-white border-[#C5CAFF78] h-[35px] pl-8"
                  addonLeft={
                    <span className="absolute top-[9px] left-3 text-white">
                      {reactIcons.search}
                    </span>
                  }
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <ul
                  className="flex mb-0 list-none w-full flex-wrap flex-row justify-end border-b border-[#ffffff]"
                  role="tablist"
                >
                  <li className="-mb-px mr-2 last:mr-0 flex-auto text-center max-w-[120px] font-inter">
                    <a className="text-sm font-bold px-4 py-2 shadow-lg leading-normal flex items-center justify-center text-white ">
                      Bet Slip
                    </a>
                  </li>
                </ul>
              </div>
              {islogin && liveTV.tvshow && liveTV.eventId !== '' && (
                <>
                  <div className="relative flex flex-col min-w-0 break-words w-full mt-2 font-inter">
                    <div className="w-full">
                      <div className="w-full  text-white relative bg-black  h-[250px] p-2">
                        <button
                          type="button"
                          onClick={handleTvClose}
                          className="absolute right-[0px] top-[0px] w-6 h-6 flex items-center justify-center rounded-full bg-[#FF4646]"
                        >
                          {reactIcons.close}
                        </button>
                        <div className="h-full">
                          {liveTV.game === 'cricket' ? (
                            <iframe
                              src={`https://hr08bets.in/sports-stream-live/index.html?eventid=${liveTV.eventid}`}
                              title="description"
                              style={{ width: '100%', height: '100%' }}
                            ></iframe>
                          ) : (
                            <iframe
                              src={`https://hr08bets.in/sports-stream-live/index.html?eventid=${liveTV.eventid}`}
                              title="description"
                              style={{ width: '100%', height: '100%' }}
                            ></iframe>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {bets.length > 0 && islogin && (
                <div className="relative flex flex-col min-w-0 break-words w-full  font-inter my-4">
                  <div className="w-full flex flex-col bg-white p-3 rounded">
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
                        {/* <div>
                          <p className="text-[#576471]">
                            MAX BET{' '}
                            <span className="text-[#203974]">:200,004</span>
                          </p>
                          <p className="text-[#576471]">
                            MAX MKT{' '}
                            <span className="text-[#203974]">:200,004</span>
                          </p>
                        </div> */}
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
                            <label className="text-[#35495E] block">
                              Stake
                            </label>
                            <input
                              onChange={handleChange}
                              name="stake"
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
                            {bets?.[0].betOn === 'BACK'
                              ? 'Profit'
                              : 'Liability'}
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
                            onClick={() =>
                              handleRemoveBet(bets?.[0]?.selectionId)
                            }
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
                </div>
              )}
              {islogin && (
                <div
                  className={`relative  ${
                    currentBetList.length !== 0 ? 'flex' : 'hidden'
                  } flex flex-col min-w-0 break-words w-full  font-inter mb-4`}
                >
                  <div className="w-full">
                    <div className="w-full text-black  bg-white h-auto p-2">
                      {' '}
                      <div className="px-2 py-1 bg-black">
                        <p className="text-14 text-center text-white">
                          Current Bet List
                        </p>
                      </div>
                      <div className="tbl">
                        <table>
                          <thead>
                            <tr className="bg-[#a8a6a6]">
                              <th className="w-[130px] text-start">
                                Selection
                              </th>
                              <th className="w-[70px] text-center">Odds</th>
                              <th className="w-[70px] text-center">Stack</th>
                              <th className="text-right">P&L</th>
                            </tr>
                          </thead>
                          <tbody className="max-h-[150px] overflow-y-auto">
                            {currentBetList &&
                              currentBetList.map((items, index) => {
                                return (
                                  <tr className=" text-12" key={index}>
                                    <td
                                      className={`w-[130px] text-start  ${
                                        items?.bet_on === 'BACK'
                                          ? 'text-[#469dd3]'
                                          : 'text-[#d44a58]'
                                      }`}
                                    >
                                      <p className="truncate text-start">
                                        {items.selection}
                                      </p>
                                    </td>
                                    <td className="w-[70px]  text-center">
                                      {' '}
                                      {items?.game_type === 'session'
                                        ? items?.price
                                        : items.price}
                                    </td>
                                    <td className="w-[70px]  text-center">
                                      {' '}
                                      {items.stake}
                                    </td>
                                    {/* <td
                                      className={`text-right  ${
                                        items?.bet_on === 'BACK'
                                          ? 'text-green-700'
                                          : 'text-[#d44a58]'
                                      }`}
                                    >
                                      {items?.game_type === 'session' ? (
                                        <>
                                          {' '}
                                          {items?.bet_on === 'BACK'
                                            ? numberWithDigit(
                                                (items.percent / 100) *
                                                  items.stake,
                                              )
                                            : numberWithDigit(
                                                (items.percent / 100) *
                                                  items.stake,
                                              )}
                                        </>
                                      ) : (
                                        <>
                                          {' '}
                                          {items?.bet_on === 'BACK'
                                            ? numberWithDigit(
                                                (items.price - 1) * items.stake,
                                              )
                                            : numberWithDigit(
                                                (items.price - 1) * items.stake,
                                              )}
                                        </>
                                      )}
                                    </td> */}
                                    <td className="text-right">
                                      <span className="text-green-700">
                                        {' '}
                                        {items?.game_type === 'session' ? (
                                          <>
                                            {' '}
                                            {items?.bet_on === 'BACK'
                                              ? numberWithDigit(
                                                  (items.percent / 100) *
                                                    items.stake,
                                                )
                                              : numberWithDigit(items.stake)}
                                          </>
                                        ) : (
                                          <>
                                            {' '}
                                            {items?.bet_on === 'BACK'
                                              ? numberWithDigit(
                                                  (items.price - 1) *
                                                    items.stake,
                                                )
                                              : numberWithDigit(items.stake)}
                                          </>
                                        )}{' '}
                                      </span>
                                      /
                                      <span className="text-red-700">
                                        {' '}
                                        {items?.game_type === 'session' ? (
                                          <>
                                            {' '}
                                            {items?.bet_on === 'BACK'
                                              ? numberWithDigit(items.stake)
                                              : numberWithDigit(
                                                  (items.percent / 100) *
                                                    items.stake,
                                                )}
                                          </>
                                        ) : (
                                          <>
                                            {' '}
                                            {items?.bet_on === 'BACK'
                                              ? numberWithDigit(items.stake)
                                              : numberWithDigit(
                                                  (items.price - 1) *
                                                    items.stake,
                                                )}
                                          </>
                                        )}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="relative flex flex-col min-w-0 break-words w-full  font-inter">
                <div className="w-full flex flex-col pb-8">
                  <div className="w-full flex flex-row items-center h-[413px] border border-white rounded-md overflow-hidden">
                    <img
                      src="/images/home/ball.jpg"
                      alt="ball"
                      className="w-full"
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Banner.propTypes = {
  value: PropTypes.string,
  onChangeHandler: PropTypes.func,
  name: PropTypes.string,
  wrapperClassName: PropTypes.string,
};
export default Banner;
