/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  fetchBetDetailsAction,
  fetchCurrentCalculationAction,
  init,
  setBetPlacementSuccess,
} from '@/redux/actions';
import { postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { betValidationSchema } from '@/utils/validation';
import { isYupError, parseYupError } from '@/utils/Yup';
import { calcCurrentBetStats } from '@/utils/helper';
import { toast } from 'react-toastify';
import InputField from '../FormElements/InputField';
// ORIGINAL BETSLIP
const BetSlip = () => {
  const [betData, setBetData] = useState({});
  const [currentBetWinLossDatas, setCurrentBetWinLossData] = useState(null);
  const bets = useSelector((state) => state.bet.selectedBet);
  const dispatch = useDispatch();
  const [enent_ID, setEnent_ID] = useState(false);
  const [loading, setIsloading] = useState(false);
  const userInfo = useSelector((state) => state.user);
  const [formError, setFormError] = useState({
    stake: '',
  });
  useEffect(() => {
    setBetData(bets?.[0]);
    setEnent_ID(bets?.[0]?.eventId);
  }, [bets]);

  useEffect(() => {
    if (bets.length == 0) {
      dispatch(fetchCurrentCalculationAction({}));
    }
  }, [bets.length]);

  const increaseStake = () => {
    if (betData.stake > 0) {
      setBetData((prevBet) => ({ ...prevBet, stake: prevBet.stake + 50 }));
    }
  };

  useEffect(() => {
    if (userInfo) {
      const timer = setTimeout(() => {
        setBetData({ ...betData, currency: userInfo?.currency_type });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userInfo, betData]);

  const decreaseStake = () => {
    if (betData.stake > 50) {
      setBetData((prevBet) => ({ ...prevBet, stake: prevBet.stake - 50 }));
    }
  };

  const handleRemoveBet = (selectionId) => {
    const updatedBets = bets?.filter(
      (item) => item.selectionId !== selectionId,
    );
    setFormError({});
    dispatch(fetchBetDetailsAction(updatedBets));
    dispatch(fetchCurrentCalculationAction({}));
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;
    setFormError((prev) => ({
      ...prev,
      stake: null,
    }));
    if (
      (betData?.market === 'Match Odds' || 'MATCH_ODDS') &&
      betData?._marketData?.inplay === false &&
      inputValue > 1
    ) {
      inputValue = e.target.value > 1 ? e.target.value : e.target.value;
      setBetData({ ...betData, stake: inputValue });
    } else {
      setBetData({ ...betData, stake: inputValue });
    }
    setFormError({
      ...formError,
      [name]: '',
    });
  };

  const betStake = [50, 100, 500, 1000, 5000];

  const handleProfitzero = () => {
    dispatch(fetchCurrentCalculationAction(null));
  };
  const handleRestrictedGames = async (gameId) => {
    if (userInfo?.chip_setting?.includes(gameId)) {
      return true;
    } else {
      return false;
    }
  };
  const placeBet = async (e) => {
    e.preventDefault();
    const checkRestriction = await handleRestrictedGames(betData?.gameId);
    if (checkRestriction) {
      toast.error('Betting on this sport is not permitted.');
      setIsloading(false);
      return;
    }
    if (userInfo.betLock) {
      toast.error('Betting is currently locked. You cannot place a bet.');
      return;
    }
    setIsloading(true);
    setFormError({});

    let data =
      betData?.market == 'bookmaker'
        ? {
            ...betData,
            stake: Number(betData?.stake),
            price: betData.price / 100 + 1,
          }
        : { ...betData, stake: Number(betData?.stake) };
    data.stake = Number(data?.stake);
    if (data?.stake !== 0 && data?.price !== 0) {
      try {
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
        setTimeout(async () => {
          await postAuthData('/bet/place', data)
            .then((response) => {
              if (response.status === 200) {
                setIsloading(false);
                toast.success('Bet Placed Successfully');
                handleRemoveBet(data.selectionId);
                dispatch(fetchCurrentCalculationAction({}));
                dispatch(fetchBetDetailsAction([]));
                dispatch(init([]));
                handleProfitzero();
                dispatch(setBetPlacementSuccess());
              } else {
                setIsloading(false);
                if (response.data.length > 0) {
                  toast.dismiss();
                  toast.error(response?.data || 'Something went wrong');
                } else {
                  toast.dismiss();
                  toast.error(response?.data || 'Something went wrong');
                }
              }
            })
            .catch((e) => {
              setIsloading(false);
              console.error(e);
            });
        }, 1000);
      } catch (error) {
        if (isYupError(error)) {
          setFormError(parseYupError(error));
        } else {
          toast.error('An error occurred while placing the bet');
        }
        setIsloading(false);
      }
    } else {
      setIsloading(false);
      toast.dismiss();
      toast.error('can not place bet due to missing odds');
    }
  };

  const handleIncrease = () => {
    if (betData?.price > 1) {
      if (betData?.market == 'Match Odds') {
        setBetData((prevData) => ({
          ...prevData,
          price: parseFloat((prevData.price + 0.01).toFixed(2)),
        }));
      } else {
        return;
      }
    } else {
      toast.dismiss();
      toast.error('Odds should be greater than 1');
    }
  };

  const handleDecrease = () => {
    if (betData?.price > 1) {
      if (betData?.market == 'Match Odds') {
        setBetData((prevData) => ({
          ...prevData,
          price: parseFloat((prevData.price - 0.01).toFixed(2)),
        }));
      } else {
        return;
      }
    } else {
      toast.dismiss();
      toast.error('Odds should be greater than 1');
    }
  };

  useEffect(() => {
    if (betData) {
      const calculationData = calcCurrentBetStats({ ...betData });
      dispatch(fetchCurrentCalculationAction(calculationData));
      setCurrentBetWinLossData(calculationData);
    }
  }, [betData, bets]);

  return (
    <>
      <div className="hidden xl:block w-full pt-5">
        <div className="mb-1">
          <InputField
            placeholder="Search"
            // name={name}
            // onChangeHandler={onChangeHandler}

            // wrapperClassName={`w-[304px] ml-auto ${wrapperClassName}`}
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
      </div>
      {bets?.length > 0 && (
        <div className="bg-[#fefefe] p-2 rounded-md">
          <div className="shadow-2xl bg-white rounded-md text-12 ">
            <div
              className={`relative px-2 rounded-t ${
                bets?.[0]?.betOn === 'BACK'
                  ? 'bg-[#a7d8fd] border-t-4 border-[#78BBFD]'
                  : 'bg-[#f9c9d4] border-t-4 border-[#FA7290]'
              } `}
            >
              <div className="flex items-center justify-between ">
                <p className="font-inter text-[13px] font-bold leading-4">
                  {bets?.[0]?.selection}
                </p>
                <p className="font-inter text-12  leading-4">
                  MIN BET :{bets?.[0]?.minimumBet}
                </p>
              </div>
              <div className="flex items-center justify-between ">
                <p className="font-inter text-12 leading-4 ">
                  {' '}
                  {bets?.[0]?.matchName}
                </p>
                <p className="font-inter text-12  leading-4">
                  MAX BET :{bets?.[0]?.maximumBet}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 p-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <label
                    htmlFor=""
                    className="text-[13px] font-inter leading-4"
                  >
                    Odds
                  </label>

                  <div className="relative rounded-sm overflow-hidden">
                    <input
                      type="text"
                      disabled
                      value={
                        betData?.market == 'bookmaker'
                          ? parseFloat(
                              (betData?.price / 100 + 1 || 0).toFixed(2),
                            )
                          : parseFloat((betData?.price || 0).toFixed(2))
                      }
                      className="outline-none border border-gray-200 bg-[#EDF0F7] text-center  rounded w-full  px-5"
                    />
                    <button
                      type="button"
                      onClick={handleDecrease}
                      className="absolute ay-center cursor-pointer  left-0 bg-[#051316] font-bold  w-4 flex-center text-white"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      className="absolute ay-center cursor-pointer  right-0 bg-[#051316] font-bold  w-4 flex-center text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col ">
                  <label
                    htmlFor=""
                    className="text-[13px] font-inter leading-4"
                  >
                    Stakes
                  </label>
                  <div className="relative rounded-sm overflow-hidden">
                    <input
                      type="number"
                      onChange={handleChange}
                      value={betData?.stake}
                      placeholder="Min:50.00"
                      className="outline-none border border-gray-200 text-center  bg-[#EDF0F7]  rounded-sm w-full "
                    />
                    {/* <button
                    onClick={decreaseStake}
                    className="absolute ay-center  left-0 bg-[#051316] font-bold w-4 flex-center text-white"
                  >
                    -
                  </button>
                  <button
                    onClick={increaseStake}
                    className="absolute ay-center  right-0 bg-[#051316] font-bold w-4 flex-center text-white"
                  >
                    +
                  </button> */}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div
                  className={` ${
                    bets?.[0]?.betOn === 'BACK'
                      ? ' bg-[#DAEDFF]'
                      : ' bg-[#FFD6D6]'
                  }  bg-[#DAEDFF] flex flex-col  p-2 rounded `}
                >
                  <p className="text-[#35495E] leading-4">
                    {bets?.[0]?.betOn === 'BACK' ? 'Profit' : 'Liability'}
                  </p>
                  <p
                    className={
                      bets?.[0]?.betOn === 'BACK'
                        ? 'text-[#219642] leading-4'
                        : 'text-[#fa7272] leading-4'
                    }
                  >
                    {bets?.[0]?.betOn === 'BACK'
                      ? currentBetWinLossDatas?.calculation?.win.toFixed(2) ||
                        0.0
                      : currentBetWinLossDatas?.calculation?.loss.toFixed(2) ||
                        0.0}
                  </p>
                </div>
              </div>
            </div>

            {formError.stake && (
              <div className="form-eror flex text-start text-14">
                {formError.stake}
              </div>
            )}

            <div className="grid grid-cols-5 px-3 gap-2  ">
              {betStake &&
                betStake.map((item) => {
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        setBetData({
                          ...betData,
                          stake: item,
                        });
                      }}
                      className="border border-[#242629] bg-[#D5D5D5] rounded text-12 flex-center"
                    >
                      +{item}
                    </button>
                  );
                })}
            </div>
            <div className="grid grid-cols-4 gap-2 px-5 mx-auto mt-1">
              <button
                onClick={() => {
                  setBetData({
                    ...betData,
                    stake: 10000,
                  });
                }}
                className="border border-[#242629] bg-[#D5D5D5] rounded text-12 flex-center"
              >
                +10000
              </button>
              <button
                onClick={() => {
                  setBetData({
                    ...betData,
                    stake: 25000,
                  });
                }}
                className="border border-[#242629] bg-[#D5D5D5] rounded text-12 flex-center"
              >
                +25000
              </button>
              <button
                onClick={() => {
                  setBetData({ ...betData, stake: '' });
                }}
                className="border border-[#242629] bg-[#D5D5D5] rounded text-12 flex-center"
              >
                Clear
              </button>
              <button
                // onClick={() => setBetData({ ...betData, stake: 25000 })}
                className="border border-[#242629] bg-[#D5D5D5] rounded text-12 flex-center"
              >
                Edit Stake
              </button>
            </div>
            <div className=" bg-[#EDF0F7] py-2 px-3 grid grid-cols-2 gap-5 mt-2">
              <button
                onClick={() => {
                  handleRemoveBet(betData?.selectionId);
                }}
                className="border border-[#687488] bg-[#F4F4F4] text-[#687488] w-full py-1 flex-center gap-2 rounded-lg"
              >
                {reactIcons.newDelete}
                Cancel
              </button>
              <button
                disabled={
                  betData?.stake === '' || betData?.stake === 0 || loading
                    ? true
                    : false
                }
                onClick={(e) => placeBet(e)}
                className={`text-[#687488] w-full flex-center bg-[#BEC5D0]  gap-2  py-1 rounded-lg ${
                  betData?.stake === '' || betData?.stake === 0
                    ? 'bg-[#5c996f] border-[#5c996f] '
                    : 'bg-[#0EAD69] border-[#0EAD69]'
                }`}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-14" />
                ) : (
                  reactIcons.checkMark
                )}
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BetSlip;
