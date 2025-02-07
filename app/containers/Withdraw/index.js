/* eslint-disable react-hooks/exhaustive-deps */
import { InputField } from '@/components';

import { isYupError, parseYupError } from '@/utils/Yup';
import { getAuthData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { numberWithCommas } from '@/utils/numberWithCommas';
import { withdrawValidation, withdrawValidationUPI } from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Withdraw = () => {
  const userId = localStorage.getItem('shiv11_userID');
  const [openDraw, setOpenDraw] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [userWithdrawReq, setUserWithdrawReq] = useState([]);
  const [isAccountClicked, setAccountClicked] = useState(1);
  // const userDetails = useSelector((state) => state);
  const formatString = (accountNumber) => {
    const maskedPart = '**********';
    const visiblePart2 = accountNumber.slice(-3);
    const visiblePart1 = accountNumber.slice(0, 3);
    const formattedString = `${visiblePart1}${maskedPart}${visiblePart2}`;
    return formattedString;
  };
  const [bankAccountList, setBankAccountList] = useState([]);
  const [upiAccountList, setUpiAccountList] = useState([]);
  const [selectWithdrawType, setSelectWithdrawType] = useState('BANK');
  const [form, setForm] = useState({
    amount: '',
    bankAccountId: '',
    upiId: '',
  });

  const [formError, setFormError] = useState({
    amount: '',
    bankAccountId: '',
    upiId: '',
  });
  const getUserInfo = async () => {
    try {
      const response = await getAuthData('/user/get-user-details');
      if (response?.status === 201 || response?.status === 200) {
        setUserInfo(response.data);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  const getWithdrawreq = async () => {
    try {
      const response = await getAuthData('/user/get-user-widrawreq');
      if (response?.status === 201 || response?.status === 200) {
        setUserWithdrawReq(response.data.deposits);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const avaliableWithdrawaAmt =
    Math.floor(userInfo?.balance) -
      Math.floor(Math.abs(userInfo?.exposureAmount)) || 0;

  const totalPendingAmount = userWithdrawReq
    .filter((req) => req.status.toLowerCase() === 'pending')
    .reduce((total, req) => total + parseFloat(req.amount), 0);

  // const avaliableWithdrawaAmt = parseFloat(avaliableWithdrawa); parseFloat(totalPendingAmount);
  // userInfo?.balance  userInfo?.exposureAmount
  const handleChange = (e) => {
    let { name, value } = e.target;
    let error = '';

    if (name === 'amount') {
      const amount = parseFloat(value);
      if (isNaN(amount)) {
        error = 'Amount must be a number';
      } else if (amount < 0) {
        error = 'Amount cannot be negative';
      } else if (amount > avaliableWithdrawaAmt) {
        // eslint-disable-next-line
        error =
          amount < 0
            ? 'Amount cannot be negative'
            : `Amount should not exceed ${avaliableWithdrawaAmt}`;
      }
    }
    setForm({ ...form, [name]: Number(value) });
    setFormError({
      ...formError,
      [name]: '',
    });
  };

  const handleSubmit = async () => {
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount < 0 || amount > avaliableWithdrawaAmt) {
      setFormError({
        ...formError,
        amount:
          amount < 0
            ? 'Amount cannot be negative'
            : `Amount should not exceed ${avaliableWithdrawaAmt}`,
      });
      return;
    }
    try {
      setFormError({});
      if (selectWithdrawType === 'BANK') {
        await withdrawValidation.validate(form, {
          abortEarly: false,
        });
      } else {
        await withdrawValidationUPI.validate(form, {
          abortEarly: false,
        });
      }

      const response = await postAuthData('/user/widraw-req', {
        userId: userId,
        amount: form?.amount,
        bankAccountId: form?.bankAccountId,
        upiId: form.upiId,
      });
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Withdraw Request Sent Successfully');
        setForm({
          amount: '',
          bankAccountId: '',
          upiId: '',
        });
        getUserInfo();
        getWithdrawreq();
      } else {
        toast.error(response?.data || 'Something went wrong');
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        toast.error(error?.message || 'Unauthorised');
      }
    }
  };
  const islogin = isLoggedIn();
  useEffect(() => {
    getBankAccountList();
    getUserInfo();
    getWithdrawreq();
    getUPIAccountList();
  }, []);
  const getBankAccountList = async () => {
    if (islogin) {
      try {
        const response = await getAuthData('/user/get-user-bank-account');
        if (response?.status === 201 || response?.status === 200) {
          setBankAccountList(response.data); // Return the data instead of logging it
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };

  const getUPIAccountList = async () => {
    if (islogin) {
      try {
        const response = await getAuthData('/user/get-userupi');
        if (response?.status === 201 || response?.status === 200) {
          setUpiAccountList(response.data); // Return the data instead of logging it
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };
  const handleReset = (show) => {
    setOpenDraw(show);
    setForm({
      amount: '',
      bankAccountId: '',
      upiId: '',
    });
    setFormError({
      amount: '',
      bankAccountId: '',
      upiId: '',
    });
  };

  const ClickedTable = (buttonId) => {
    setAccountClicked(buttonId);
  };

  return (
    <div className="h-full py-[10px]">
      <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full">
        <div className="flex justify-between items-center border-b border-b-[#E1E1E1] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => navigate(-1)}
                className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#757FC7] to-[#98A2F8] grid place-content-center text-12 cursor-pointer shadow-[0_0_25px_0_#150E4BB2]"
              >
                {reactIcons.leftChev}
              </span>
              <span className="font-inter font-bold text-primary-1300">
                Fast Bank Deposit
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Finances <span> &gt; </span>{' '}
              <span className="text-white">Withdraw</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] py-5 rounded-md w-full">
          <div className="px-5 flex gap-1 mb-7 flex-col md:flex-row">
            <div className="border border-[#C1C1C1] rounded-md bg-gradient-to-b from-[#62696B] to-[#62696B00] flex items-center justify-between gap-3 3xl:p-5 p-3 py-2 flex-1">
              <img
                src="/images/icons/bank.svg"
                className="3xl:w-[100px] 2xl:w-[75px] w-[40px]"
              />
              <div className="flex flex-col items-end justify-center">
                <span className="text-18 text-[#555c5e] mb-1">
                  {reactIcons.alert}
                </span>
                <p className="text-[11px] 2xl:text-14 font-bold text-right leading-4">
                  Available
                  <br /> Withdrawal
                </p>
                <p className="text-12 2xl:text-14 font-bold text-primary-1300">
                  {numberWithCommas(avaliableWithdrawaAmt)}
                </p>
              </div>
            </div>
            <div className="border border-[#C1C1C1] rounded-md bg-gradient-to-b from-[#62696B] to-[#62696B00] flex items-center justify-between gap-3 3xl:p-5 p-3 py-2 flex-1">
              <img
                src="/images/icons/home-money.svg"
                className="3xl:w-[100px] 2xl:w-[75px] w-[40px]"
              />
              <div className="flex flex-col items-end justify-center">
                <span className="text-18 text-red-700 mb-1">
                  {reactIcons.alert}
                </span>
                <p className="text-[11px] 2xl:text-14 font-bold text-right leading-4">
                  Withdrawal blocked due to exposure
                </p>
                <p className="text-12 2xl:text-14 font-bold text-primary-1300">
                  {numberWithCommas(userInfo?.exposureAmount)}
                </p>
              </div>
            </div>
            <div className="border border-[#C1C1C1] rounded-md bg-gradient-to-b from-[#62696B] to-[#62696B00] flex items-center justify-between gap-3 3xl:p-5 p-3 py-2 flex-1">
              <img
                src="/images/icons/money-cycle.svg"
                className="3xl:w-[100px] 2xl:w-[75px] w-[40px]"
              />
              <div className="flex flex-col items-end justify-center">
                <span className="text-18 text-red-700 mb-1">
                  {reactIcons.alert}
                </span>
                <p className="text-[11px] 2xl:text-14 font-bold text-right leading-4">
                  Withdrawal Blocked Due
                  <br /> to Pending request
                </p>
                <p className="text-[11px] 2xl:text-14 font-bold text-primary-1300">
                  {numberWithCommas(totalPendingAmount)}
                </p>
              </div>
            </div>
          </div>
          <div className="middle mb-5 pr-0 md:pr-5 relative overflow-x-hidden">
            <div
              className="hidden md:flex items-center w-full bg-no-repeat h-[300px]"
              // eslint-disable-next-line quotes
              style={{ backgroundImage: "url('/images/drawer.png')" }}
            >
              <div className="w-[180px] h-[300px] relative">
                <div
                  className="w-[100px] mx-auto absolute top-[52px] left-1/2 -translate-x-1/2"
                  onClick={() => ClickedTable(1)}
                >
                  <img
                    src="/images/icons/bank.svg"
                    className="w-[50px] mx-auto"
                  />
                  <h6 className="font-inter my-1 font-bold text-14 text-center leading-[17px]">
                    Bank Withdraw
                  </h6>
                </div>
                <div
                  className="w-[100px] mx-auto absolute bottom-[40px] left-1/2 -translate-x-1/2"
                  onClick={() => ClickedTable(2)}
                >
                  <img
                    src="/images/icons/upi.svg"
                    className="w-[50px] mx-auto"
                  />
                  <h6 className="font-inter my-1 font-bold text-14 text-center leading-[17px]">
                    Phone Pay Withdraw
                    <span className="text-10"></span>
                  </h6>
                </div>
                <button
                  className=" hidden w-[30px] h-[30px] rounded-full bg-black/[0.1] hover:bg-black place-content-center rightSlide absolute top-[45%] right-[5px] translate-y-[-45%] transition-all duration-200"
                  onClick={() => setOpenDraw(true)}
                >
                  <div className="text-22">{reactIcons.arrowright}</div>
                </button>
              </div>
              <div className="flex-1 flex-center 3xl:gap-10 2xl:gap-8 gap-5">
                {isAccountClicked === 1 ? (
                  <>
                    <div className="w-[120px] h-[120px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        onClick={() =>
                          navigate('/profile/bank-details/add-account')
                        }
                        className="flex flex-col gap-1 justify-center items-center"
                      >
                        <img
                          src="/images/icons/add-bank.svg"
                          className="w-[44px]"
                        />
                        <p className="text-14 font-medium">Add Bank</p>
                      </div>
                    </div>
                    <div className="w-[120px] h-[120px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        onClick={() => navigate('/profile/bank-details')}
                        className="flex flex-col gap-1 justify-center items-center"
                      >
                        <img
                          src="/images/icons/view-bank.svg"
                          className="w-[44px]"
                        />
                        <p className="text-14 font-medium">View Bank</p>
                      </div>
                    </div>
                    <div
                      className="w-[120px] h-[120px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer"
                      onClick={() => setOpenDraw(true)}
                    >
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <img
                          src="/images/icons/withdraw11.png"
                          className="w-[44px]"
                        />
                        <p className="text-14 font-medium">W/D Request</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[120px] h-[120px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        onClick={() => navigate('/profile/upi-details/add-upi')}
                        className="flex flex-col justify-center items-center"
                      >
                        <img
                          src="/images/icons/fast-upi1.svg"
                          className="w-[70px]"
                        />
                        <p className="text-14 font-medium">Add UPI</p>
                      </div>
                    </div>
                    <div className="w-[120px] h-[120px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        onClick={() => navigate('/profile/upi-details')}
                        className="flex flex-col justify-center items-center"
                      >
                        <img
                          src="/images/icons/fast-bank1.svg"
                          className="w-[70px]"
                        />
                        <p className="text-14 font-medium">View UPI</p>
                      </div>
                    </div>
                    <div
                      className="w-[120px] h-[120px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer"
                      onClick={() => setOpenDraw(true)}
                    >
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <img
                          src="/images/icons/withdraw11.png"
                          className="w-[44px]"
                        />
                        <p className="text-14 font-medium">W/D Request</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              className="flex md:hidden flex-col items-center w-full bg-no-repeat h-[300px] bg-top"
              // eslint-disable-next-line quotes
              style={{ backgroundImage: "url('/images/drawer-mobile.png')" }}
            >
              <div className=" h-[300px] relative flex justify-center items-center w-[200px] mx-auto">
                <div className="w-[100px" onClick={() => ClickedTable(1)}>
                  <img
                    src="/images/icons/bank.svg"
                    className="w-[50px] mx-auto"
                  />
                  <h6 className="font-inter my-4 font-bold text-14 text-center leading-[17px]">
                    Bank Withdraw
                  </h6>
                </div>
                <div className="w-[100px]" onClick={() => ClickedTable(2)}>
                  <img
                    src="/images/icons/upi.svg"
                    className="w-[50px] mx-auto"
                  />
                  <h6 className="font-inter my-4 font-bold text-14 text-center leading-[17px]">
                    Phone Pay Withdraw <span className="text-10"></span>
                  </h6>
                </div>
                <button
                  className=" hidden w-[30px] h-[30px] rounded-full bg-black/[0.1] hover:bg-black place-content-center topSlide absolute bottom-0 left-[42%] right-[5px] translate-y-[-45%] transition-all duration-200"
                  onClick={() => setOpenDraw(true)}
                >
                  <div className="text-22">{reactIcons.arrowDown}</div>
                </button>
              </div>
              <div className="flex-1 flex-center 3xl:gap-10 2xl:gap-8 gap-5">
                {isAccountClicked === 1 ? (
                  <>
                    <div className="w-[85px] h-[85px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        onClick={() =>
                          navigate('/profile/bank-details/add-account')
                        }
                        className="flex flex-col gap-1 justify-center items-center"
                      >
                        <img
                          src="/images/icons/add-bank.svg"
                          className="w-[30px]"
                        />
                        <p className="text-12 font-medium">Add Bank</p>
                      </div>
                    </div>
                    <div className="w-[85px] h-[85px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        onClick={() => navigate('/profile/bank-details')}
                        className="flex flex-col gap-1 justify-center items-center"
                      >
                        <img
                          src="/images/icons/view-bank.svg"
                          className="w-[30px]"
                        />
                        <p className="text-12 font-medium">View Bank</p>
                      </div>
                    </div>
                    <div
                      className="w-[85px] h-[85px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer"
                      onClick={() => setOpenDraw(true)}
                    >
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <img
                          src="/images/icons/withdraw11.png"
                          className="w-[30px]"
                        />
                        <p className="text-12 font-medium">W/D Req.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[85px] h-[85px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        className="flex flex-col justify-center items-center"
                        onClick={() => navigate('/profile/upi-details/add-upi')}
                      >
                        <img
                          src="/images/icons/fast-upi1.svg"
                          className="w-[40px]"
                        />
                        <p className="text-12 font-medium">Add UPI</p>
                      </div>
                    </div>
                    <div className="w-[85px] h-[85px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer">
                      <div
                        className="flex flex-col  justify-center items-center"
                        onClick={() => navigate('/profile/upi-details')}
                      >
                        <img
                          src="/images/icons/fast-bank1.svg"
                          className="w-[40px]"
                        />
                        <p className="text-12 font-medium">View UPI</p>
                      </div>
                    </div>
                    <div
                      className="w-[85px] h-[85px] rounded-full grid place-content-center bg-[#ECECEC2E] hover:bg-black/[0.5] cursor-pointer"
                      onClick={() => setOpenDraw(true)}
                    >
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <img
                          src="/images/icons/withdraw11.png"
                          className="w-[30px]"
                        />
                        <p className="text-12 font-medium">W/D Req.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              className={`absolute top-0  z-10 w-[95%] transition-all duration-1000 ease-in-out h-[300px] grid place-content-center bg-no-repeat bg-right ${
                openDraw ? 'left-0' : '-left-[100vw]'
              }`}
              // eslint-disable-next-line quotes
              style={{ backgroundImage: "url('/images/full-drawer.png')" }}
            >
              <button
                className="absolute top-3 right-8"
                onClick={() => handleReset(false)}
              >
                {reactIcons.close}
              </button>
              <div className="max-w-[447px] mx-auto p-7 md:p-0">
                <h6 className="font-inter text-16 flex items-center justify-center gap-1 font-bold mb-2">
                  {/* <img src="/images/icons/rupees.svg" /> */}
                  <span>Points Withdrawal</span>
                </h6>
                <div className="mb-3">
                  <InputField
                    name={'amount'}
                    type="number"
                    value={form?.amount}
                    onChangeHandler={handleChange}
                    className="text-14  !text-[#7568A6] !rounded-md"
                    placeholder="Enter Withdrawal Amount"
                  />
                  {formError.amount && (
                    <div className="form-eror flex text-start text-14">
                      {formError.amount}
                    </div>
                  )}
                </div>
                <div>
                  {/* <InputField
                    className="!text-12 !text-[#7568A6] !rounded-md"
                    placeholder="IBKL********528"
                  /> */}
                  <div className="input-group mb-2">
                    <select
                      value={selectWithdrawType}
                      onChange={(event) => {
                        setSelectWithdrawType(event.target.value);
                      }}
                      className="w-full py-2  bg-white font-rajdhani text-[#7568A6]  h-full rounded-md outline-none px-4 text-16 md:text-16"
                    >
                      <option className=" text-gray-800" value="BANK">
                        Bank Account
                      </option>
                      <option className="text-gray-800" value="UPI">
                        UPI Address
                      </option>
                    </select>
                  </div>
                  {selectWithdrawType === 'BANK' ? (
                    <div className="input-group mb-2">
                      <select
                        name="bankAccountId"
                        id="account"
                        value={form?.bankAccountId}
                        onChange={handleChange}
                        className="w-full py-2  bg-white font-rajdhani text-[#7568A6]  h-full rounded-md outline-none px-4 text-16 md:text-16"
                      >
                        <option className="hidden text-[#9DA4B0]" value="">
                          Select Account
                        </option>
                        {bankAccountList &&
                          bankAccountList.map((items, index) => {
                            return (
                              <option key={index} value={items?.id}>
                                {formatString(items?.accountNumber)}
                              </option>
                            );
                          })}
                      </select>
                      {formError.bankAccountId && (
                        <div className="form-eror flex text-start text-14">
                          {formError.bankAccountId ===
                          'bankAccountId must be a `number` type, but the final value was: `NaN` (cast from the value `""`).'
                            ? 'Please select bank account'
                            : formError.phoneNumber}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="input-group mb-1">
                      <select
                        name="upiId"
                        id="upi"
                        value={form?.upiId}
                        onChange={handleChange}
                        className="w-full py-2  bg-white font-rajdhani text-[#7568A6]  h-full rounded-md outline-none px-4 text-16 md:text-16"
                      >
                        <option className="hidden text-[#9DA4B0]" value="">
                          Select UPI Account
                        </option>
                        {upiAccountList &&
                          upiAccountList.map((items, index) => {
                            return (
                              <option key={index} value={items?.id}>
                                {formatString(items?.upiId)}
                              </option>
                            );
                          })}
                      </select>
                      {formError.upiId && (
                        <div className="form-eror flex text-start text-14">
                          {formError.upiId
                            ? 'Please select bank UPI ID'
                            : 'Please select bank UPI ID'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[11px] mb-[6px] leading-4">
                  {/* OTP authentication required to initiate transaction when
                  selecting a new bank account. */}
                  To withdraw funds, choose &apos;Account Number&apos; from the
                  menu and proceed with the transaction for processing.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReset(true)}
                    className="bg-black text-white font-rajdhani font-medium text-18 p-2 w-[128px] rounded-lg"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#1C77FF] text-white font-rajdhani font-medium text-18 p-2 flex-1 rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" px-5 border-t border-t-gray-400 pt-2">
            <p className="text-14 text-bold mb-1">Note:</p>
            <ol className="list-decimal pl-5">
              <li className="mb-1">
                <p className="text-12 font-medium leading-4">
                  To withdraw your remaining balance, turnover of ₹0 has to be
                  completed
                </p>
              </li>
              <li className="mb-1">
                <p className="text-12 font-medium leading-4">
                  Insta Withdrawal Limit: ₹500 - ₹200000
                </p>
              </li>
              <li className="mb-1">
                <p className="text-12 font-medium leading-4">
                  Withdrawal requests submitted between 12:00AM and 6:00AM may
                  take longer to process due to banking server issues that are
                  commonly experienced during the night or non- banking hours.
                </p>
              </li>
              <li className="mb-1">
                <p className="text-12 font-medium leading-4">
                  Withdrawal fees per day: Members are allowed One free
                  withdrawals per day, up to a limit of ₹400,000. A nominal
                  service charge will be applied starting from the Second
                  withdrawal onwards, based on your Tier.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
