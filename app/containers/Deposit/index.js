import { InputField } from '@/components';
import { isYupError, parseYupError } from '@/utils/Yup';
import { getAuthData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { depositValidation } from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
  const [selectedImage, setSelectedImage] = useState({});
  const userId = localStorage.getItem('yolo_userID');
  const [qrData, setQrData] = useState({});
  const [accountData, setAccountData] = useState({});

  const tabMenu = [
    {
      id: 'fast-bank',
      title: 'Fast Bank',
      image: '/images/icons/fast-bank.svg',
      value: 'bankaccount',
    },
    {
      id: 'fast-upi',
      title: 'Fast UPI',
      image: '/images/icons/fast-upi.svg',
      value: 'upi',
    },
  ];

  const [form, setForm] = useState({
    paymentMethod: 'bankaccount',
    utr: '',
    img: '',
    amount: '',
    userId: userId,
  });

  const [formError, setFormError] = useState({
    paymentMethod: '',
    utr: '',
    img: '',
    amount: '',
  });

  useEffect(() => {
    if (userId) {
      handleChange({
        target: { name: 'userId', value: userId },
      });
    }
  }, [userId]);

  useEffect(() => {
    getQrCode();
    getPaymentAccount();
  }, []);

  const getQrCode = async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData('/user/get-qr-true-status');
        if (response?.status === 201 || response?.status === 200) {
          setQrData(response.data); // Return the data instead of logging it
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };

  const getPaymentAccount = async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData('/user/get-account-true-status');
        if (response?.status === 201 || response?.status === 200) {
          setAccountData(response.data); // Return the data instead of logging it
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError({});
      await depositValidation.validate(form, {
        abortEarly: false,
      });
      const response = await postAuthData('/user/create-deposit', form);
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Deposit Request Sent Successfully');
        setForm({
          paymentMethod: '',
          utr: '',
          img: '',
          amount: '',
        });
        setSelectedImage({});
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

  const handleReset = () => {
    setForm({
      paymentMethod: '',
      utr: '',
      img: '',
      amount: '',
      userId: '',
    });
  };

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    setForm((prevCredential) => ({
      ...prevCredential,
      [name]: updatedValue,
    }));
    setFormError((prevFormError) => ({
      ...prevFormError,
      [name]: '',
    }));
  };

  const handleImageChange = async (event) => {
    setSelectedImage(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validImageTypes.includes(file?.type)) {
        const data = new FormData();
        data.append('image', event.target.files[0]);
        const image = await postAuthData('/user/uploads', data);
        if (image?.status) {
          setForm({ ...form, img: image?.data?.imageUrl });
        } else {
          toast.error(image?.data || 'Something went wrong!');
          setSelectedImage({});
        }
      } else {
        toast.error(
          'Invalid file type. Please select a JPEG, PNG, or JPG image.',
        );
        setSelectedImage({});
      }
    }
  };

  const handleCopy = async (data) => {
    toast.success(data + ' Coppied!!');
  };

  const [activeTab, setActiveTab] = useState(tabMenu[0].id);
  const navigate = useNavigate();
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
              <span className="text-white">Deposit</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5 rounded-md w-full">
          <div className="tabber mb-5">
            <ul className="tab-menu flex justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                {tabMenu.map((item) => (
                  <li
                    key={item?.id}
                    className="flex flex-col items-center gap-1 cursor-pointer"
                    onClick={() => {
                      setActiveTab(item.id),
                        setForm({
                          ...form,
                          userId: userId,
                        });
                      handleChange({
                        target: { name: 'paymentMethod', value: item.value },
                      });
                    }}
                  >
                    <div
                      className={`tab-btn flex-center flex-col 3xl:w-[125px] 3xl:h-[125px] w-[85px] h-[85px] 3xl:rounded-20 rounded-10 bg-gradient-to-b from-[#62696B] to-[#62696B00] border-2 ${
                        activeTab == item.id
                          ? 'border-primary-1300'
                          : 'border-white'
                      }`}
                    >
                      <img
                        src={item.image}
                        className="3xl:w-[60px] w-[40px] mx-auto"
                      />
                      <p className="3xl:text-15 text-[13px]">{item.title}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          activeTab == item.id
                            ? 'text-primary-1300'
                            : 'text-white'
                        }
                      >
                        {reactIcons.thumbsUp}
                      </span>
                      <p
                        className={`text-10 font-semibold ${
                          activeTab == item.id
                            ? 'text-primary-1300'
                            : 'text-white'
                        }`}
                      >
                        Top Choice
                      </p>
                    </div>
                  </li>
                ))}
              </div>
              <div className="hidden md:flex flex-center flex-col">
                <p className="text-14 font-semibold">Easy 3 Steps To deposit</p>
                <img
                  src="/images/icons/three-circles.png"
                  className="3xl:w-[352px] w-[275px]"
                />
              </div>
            </ul>
            <div className="tab-content border-0 md:border border-[#CDCDCD] p-0 md:p-3 3xl:p-4 ">
              {activeTab == tabMenu[0].id && (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between items-start flex-col md:flex-row gap-3">
                      <div className="left-side flex-1 w-full md:max-w-[493px]">
                        <div className="border rounded-md mb-5">
                          <div className="bg-[#0EAD69] rounded-t-[4px]">
                            <p className="text-12 text-center leading-4 py-1 px-2">
                              COPY THIS BANK DETAILS AND MAKE PAYMENT
                            </p>
                          </div>
                          <div className="bg-transparent px-[10px] pt-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {/* <p className="text-15 font-bold">1</p> */}
                                <img
                                  src="/images/icons/fast-bank.svg"
                                  className="w-8"
                                />
                              </div>
                              <div>
                                {/* <input
                                  type="checkbox"
                                  className="custom-check"
                                /> */}
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="flex justify-between 3xl:flex-row flex-col 3xl:gap-[70px] gap-1">
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    Account holder name
                                  </label>
                                  {accountData?.acountholdername ? (
                                    <div className="flex gap-2 justify-between items-center">
                                      <p className="font-bold text-[13px] flex-1">
                                        {accountData?.acountholdername}
                                      </p>
                                      <CopyToClipboard
                                        text={accountData?.acountholdername}
                                      >
                                        <img
                                          src="/images/icons/copy2.svg"
                                          className="cursor-pointer w-[36px]"
                                          onClick={() =>
                                            handleCopy(
                                              accountData?.acountholdername,
                                            )
                                          }
                                        />
                                      </CopyToClipboard>
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between 3xl:flex-row flex-col 3xl:gap-[70px] gap-1">
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    Account number
                                  </label>
                                  {accountData?.accountNumber ? (
                                    <div className="flex gap-2 justify-between items-center">
                                      <p className="font-bold text-[13px] flex-1">
                                        {accountData?.accountNumber}
                                      </p>
                                      <CopyToClipboard
                                        text={accountData?.accountNumber}
                                      >
                                        <img
                                          src="/images/icons/copy2.svg"
                                          className="cursor-pointer w-[36px]"
                                          onClick={() =>
                                            handleCopy(
                                              accountData?.accountNumber,
                                            )
                                          }
                                        />
                                      </CopyToClipboard>
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </div>
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    Bank name
                                  </label>
                                  {accountData?.bankName ? (
                                    <div className="flex gap-2 justify-between items-center">
                                      <p className="font-bold text-[13px] flex-1">
                                        {accountData?.bankName}
                                      </p>
                                      <CopyToClipboard
                                        text={accountData?.bankName}
                                      >
                                        <img
                                          src="/images/icons/copy2.svg"
                                          className="cursor-pointer w-[36px]"
                                          onClick={() =>
                                            handleCopy(accountData?.bankName)
                                          }
                                        />
                                      </CopyToClipboard>
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between 3xl:flex-row flex-col 3xl:gap-[70px] gap-1">
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    Account Type
                                  </label>
                                  {accountData?.accountType ? (
                                    <div className="flex gap-2 justify-between items-center">
                                      <p className="font-bold text-[13px] flex-1">
                                        {accountData?.accountType}
                                      </p>
                                      <CopyToClipboard
                                        text={accountData?.accountType}
                                      >
                                        <img
                                          src="/images/icons/copy2.svg"
                                          className="cursor-pointer w-[36px]"
                                          onClick={() =>
                                            handleCopy(accountData?.accountType)
                                          }
                                        />
                                      </CopyToClipboard>
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </div>
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    IFSC Code
                                  </label>
                                  {accountData?.ifscCode ? (
                                    <div className="flex gap-2 justify-between items-center">
                                      <p className="font-bold text-[13px] flex-1">
                                        {accountData?.ifscCode}
                                      </p>
                                      <CopyToClipboard
                                        text={accountData?.ifscCode}
                                      >
                                        <img
                                          src="/images/icons/copy2.svg"
                                          className="cursor-pointer w-[36px]"
                                          onClick={() =>
                                            handleCopy(accountData?.ifscCode)
                                          }
                                        />
                                      </CopyToClipboard>
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="border rounded-md relative mb-5">
                          <div className="absolute top-0 left-0 w-full h-full rounded-md bg-[#000000B5] z-10 grid place-content-center">
                            <h6 className="font-black text-16">
                              Select Option - 02
                            </h6>
                          </div>
                          <div className="bg-[#0EAD69] rounded-t-[4px]">
                            <p className="text-12 text-center leading-4 py-1 px-2">
                              COPY THIS BANK DETAILS AND MAKE PAYMENT
                            </p>
                          </div>
                          <div className="bg-transparent px-[10px] pt-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <p className="text-15 font-bold">2</p>
                                <img
                                  src="/images/icons/upi.svg"
                                  className="w-3"
                                />
                              </div>
                              <div>
                                <input
                                  type="checkbox"
                                  className="custom-check"
                                />
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="flex justify-between 3xl:flex-row flex-col 3xl:gap-[70px] gap-1">
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    Account number
                                  </label>
                                  <div className="flex gap-2 justify-between items-center">
                                    <p className="font-bold text-[13px] flex-1">
                                      409002066825
                                    </p>
                                    <img
                                      src="/images/icons/copy2.svg"
                                      className="cursor-pointer w-[36px]"
                                    />
                                  </div>
                                </div>
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    Bank name
                                  </label>
                                  <div className="flex gap-2 justify-between items-center">
                                    <p className="font-bold text-[13px] flex-1">
                                      BOI BANK
                                    </p>
                                    <img
                                      src="/images/icons/copy2.svg"
                                      className="cursor-pointer w-[36px]"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between 3xl:flex-row flex-col 3xl:gap-[70px] gap-1">
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    Account holder
                                  </label>
                                  <div className="flex gap-2 justify-between items-center">
                                    <p className="font-bold text-[13px] flex-1">
                                      Hari
                                    </p>
                                    <img
                                      src="/images/icons/copy2.svg"
                                      className="cursor-pointer w-[36px]"
                                    />
                                  </div>
                                </div>
                                <div className="group flex-1">
                                  <label className="font-bold text-[11px] text-[#A7A3A3] uppercase">
                                    IFSC Code
                                  </label>
                                  <div className="flex gap-2 justify-between items-center">
                                    <p className="font-bold text-[13px] flex-1">
                                      BKID0004563
                                    </p>
                                    <img
                                      src="/images/icons/copy2.svg"
                                      className="cursor-pointer w-[36px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <div className="right-side flex-1 w-full md:max-w-[513px]">
                        <div className="border rounded-md ">
                          <div className="bg-[#3D4FC1] rounded-t-[4px]">
                            <p className="text-12 text-center leading-4 py-1 px-2">
                              upload payment reciept{' '}
                              <span className="text-[11px]">
                                (Maximum Size Of The Image 5MB)
                              </span>
                            </p>
                          </div>
                          <div className="rounded-md bg-[#00000069] 3xl:py-4 py-1 flex items-center justify-between gap-2  w-full">
                            <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                              <div className="w-[275px] mx-auto">
                                <p className="text-12 text-center font-medium text-[#BFC7D2F7] ">
                                  Upload File (Clear image){' '}
                                  <span className="text-red-500">*</span>
                                </p>
                                {selectedImage && (
                                  <p className="text-white text-center truncate xl:text-12 text-12">
                                    {selectedImage?.name}
                                  </p>
                                )}
                                <div className="3xl:text-[50px] text-[40px] flex justify-center 3xl:my-3 my-1 text-primary-1300">
                                  <div className="relative">
                                    <input
                                      id="file"
                                      type="file"
                                      onChange={handleImageChange}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {reactIcons.uploadDoc}
                                  </div>
                                </div>

                                <p className="text-12 text-center font-medium text-[#8A9EC5F7] mb-1 flex items-center gap-1 justify-center">
                                  Drop your File to UPLOAD Or{' '}
                                  <div className="relative">
                                    <input
                                      id="file"
                                      type="file"
                                      onChange={handleImageChange}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <span className="text-12 text-primary-1300 font-medium border-b border-b-primary-1300">
                                      Browse
                                    </span>
                                  </div>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {formError.img && (
                          <div className="form-eror flex xl:text-16 text-14">
                            {formError.img}
                          </div>
                        )}
                        <div className="mt-3 mb-3">
                          <p className="text-15 font-medium text-center mb-2">
                            VERIFY PAYMENT DETAILS
                          </p>
                          <InputField
                            onChangeHandler={handleChange}
                            name={'amount'}
                            value={form?.amount || ''}
                            placeholder="Enter Deposit Amount"
                            type="number"
                            className="!font-inter !text-12 !text-[#7568A6] !rounded-md"
                          />
                          {formError.amount && (
                            <div className="form-eror xl:text-16 text-14">
                              {formError.amount}
                            </div>
                          )}
                          <p className="text-10 text-[#FFFFFF94]">
                            (Min Deposit:{' '}
                            <span className="font-bold">₹100</span> | Max
                            Deposit:
                            <span className="font-bold">₹500000</span>)
                          </p>

                          <InputField
                            onChangeHandler={handleChange}
                            name={'utr'}
                            value={form?.utr || ''}
                            placeholder="UTR Number"
                            className="!font-inter !text-12 !text-[#7568A6] !rounded-md"
                          />
                          {formError.utr && (
                            <div className="form-eror xl:text-16 text-14">
                              {formError.utr}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleReset}
                            className="bg-black text-white font-rajdhani font-medium text-18 p-2 w-[128px] rounded-lg"
                          >
                            Reset
                          </button>
                          <button
                            onClick={handleDepositSubmit}
                            className="bg-[#1C77FF] text-white font-rajdhani font-medium text-18 p-2 flex-1 rounded-lg"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start gap-3">
                      <div className="left-side flex-1 max-w-[493px]">
                        <div className="my-2 md:my-0">
                          <img
                            src="/images/fastBankSupportsImg.png.png"
                            className="w-[254px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="border rounded-lg py-4 px-3">
                    <li className="mb-2">
                      <p className="text-12 leading-5">
                        <span className="text-red-700">*</span> IT IS PREFERRED
                        TO USE IMPS/RTGS/NEFT FOR FAST BANK TRANSFERS
                      </p>
                    </li>
                    <li className="mb-2">
                      <p className="text-12 leading-5">
                        <span className="text-red-700">*</span> PLEASE VERIFY
                        THE PAYMENT DETAILS BEFORE MAKING A BANK TRANSFER
                        DEPOSIT AS THEY MAY CHANGE FROM TIME TO TIME. YOLO 247
                        WILL NOT BE RESPONSIBLE FOR ANY TRANSACTION MADE TO AN
                        OLD/ INACTIVE ACCOUNT.
                      </p>
                    </li>
                    <li className="mb-2">
                      <p className="text-12 leading-5">
                        <span className="text-red-700">*</span> IF YOUR DEPOSIT
                        AMOUNT DOES NOT MATCH THE REQUESTED AMOUNT, IT IS
                        CONSIDERED CHEATING AND THE FUNDS WILL BE WITHHELD. EG:
                        IF YOU DEPOSIT ₹500 AND WRITE ₹1000 IN THE DEPOSIT
                        REQUEST, THE DEPOSIT AMOUNT WILL NOT BE CREDITED TO YOUR
                        WALLET OR REVERSED TO YOUR ACCOUNT.
                      </p>
                    </li>
                  </ul>
                </>
              )}
              {activeTab == tabMenu[1].id && (
                <ul>
                  <div className="mb-3">
                    <div className="flex justify-between items-start flex-col md:flex-row gap-3">
                      <div className="left-side flex-1 w-full md:max-w-[493px]">
                        <div className="border rounded-md mb-5">
                          <div className="bg-[#0EAD69] rounded-t-[4px]">
                            <p className="text-12 text-center leading-4 py-1 px-2">
                              PAYMENT UPI DETAILS
                            </p>
                          </div>
                          <div className="bg-transparent pb-8 pt-2 px-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {/* <p className="text-15 font-bold">1</p> */}
                                <img
                                  src="/images/icons/fast-upi.svg"
                                  className="w-8"
                                />
                              </div>
                              <div>
                                {/* <input
                                  type="checkbox"
                                  className="custom-check"
                                /> */}
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="flex flex-col justify-center items-center">
                                {qrData?.upi ? (
                                  <div className="flex gap-2 justify-between items-center">
                                    <>
                                      {' '}
                                      <p className="font-bold text-[13px] flex-1">
                                        {qrData?.upi}
                                      </p>{' '}
                                      <CopyToClipboard text={qrData?.upi}>
                                        <img
                                          src="/images/icons/copy2.svg"
                                          className="cursor-pointer w-[36px]"
                                          onClick={() =>
                                            handleCopy(qrData?.upi)
                                          }
                                        />
                                      </CopyToClipboard>
                                    </>
                                  </div>
                                ) : (
                                  <div>-</div>
                                )}
                                <div className="flex gap-2 justify-between items-center">
                                  <p className="flex-1 capitalize text-[15px] text-primary-1300">
                                    Scan here for payment
                                  </p>
                                  <span className="text-26">
                                    {reactIcons.qrScanner}
                                  </span>{' '}
                                </div>
                                {qrData?.image && (
                                  <div className="flex  mt-3 justify-center items-center">
                                    {' '}
                                    <img src={qrData?.image} className="w-32" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="border rounded-md mb-5 relative">
                          <div className="absolute top-0 left-0 w-full h-full rounded-md bg-[#000000B5] z-10 grid place-content-center">
                            <h6 className="font-black text-16">
                              Select Option - 02
                            </h6>
                          </div>

                          <div className="bg-[#0EAD69] rounded-t-[4px]">
                            <p className="text-12 text-center leading-4 py-1 px-2">
                              PAYMENT UPI DETAILS
                            </p>
                          </div>
                          <div className="bg-transparent pb-8 pt-2 px-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <p className="text-15 font-bold">2</p>
                                <img
                                  src="/images/icons/upi.svg"
                                  className="w-3"
                                />
                              </div>
                              <div>
                                <input
                                  type="checkbox"
                                  className="custom-check"
                                />
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="flex flex-col justify-center items-center">
                                <div className="flex gap-2 justify-between items-center">
                                  <p className="font-bold text-[13px] flex-1">
                                    mahesh.t1@paytm
                                  </p>
                                  <img
                                    src="/images/icons/copy2.svg"
                                    className="cursor-pointer w-[36px]"
                                  />
                                </div>
                                <div className="flex gap-2 justify-between items-center">
                                  <p className="flex-1 capitalize text-[15px] text-primary-1300">
                                    Click here for qR code
                                  </p>
                                  <span className="text-26">
                                    {reactIcons.qrScanner}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <div className="right-side flex-1 w-full md:max-w-[513px]">
                        <div className="border rounded-md ">
                          <div className="bg-[#3D4FC1] rounded-t-[4px]">
                            <p className="text-12 text-center leading-4 py-1 px-2">
                              upload payment reciept{' '}
                              <span className="text-[11px]">
                                (Maximum Size Of The Image 5MB)
                              </span>
                            </p>
                          </div>
                          <div className="rounded-md bg-[#00000069] 3xl:py-4 py-1 flex items-center justify-between gap-2  w-full">
                            <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                              <div className="w-[275px] mx-auto">
                                <p className="text-12 text-center font-medium text-[#BFC7D2F7] ">
                                  Upload File (Clear image){' '}
                                  <span className="text-red-500">*</span>
                                </p>
                                {selectedImage && (
                                  <p className="text-white text-center truncate xl:text-12 text-12">
                                    {selectedImage?.name}
                                  </p>
                                )}

                                <div className="3xl:text-[50px] text-[40px] flex justify-center 3xl:my-3 my-1 text-primary-1300">
                                  <div className="relative">
                                    <input
                                      id="file"
                                      type="file"
                                      onChange={handleImageChange}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {reactIcons.uploadDoc}
                                  </div>
                                </div>

                                <p className="text-12 text-center font-medium text-[#8A9EC5F7] mb-1 flex items-center gap-1 justify-center">
                                  Drop your File to UPLOAD Or{' '}
                                  <div className="relative">
                                    <input
                                      id="file"
                                      type="file"
                                      onChange={handleImageChange}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <span className="text-12 text-primary-1300 font-medium border-b border-b-primary-1300">
                                      Browse
                                    </span>
                                  </div>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {formError.img && (
                          <div className="form-eror flex xl:text-16 text-14">
                            {formError.img}
                          </div>
                        )}
                        <div className="mt-3 mb-3">
                          <p className="text-15 font-medium text-center mb-2">
                            VERIFY PAYMENT DETAILS
                          </p>
                          <InputField
                            onChangeHandler={handleChange}
                            name={'amount'}
                            value={form?.amount}
                            placeholder="Enter Deposit Amount"
                            className="!font-inter !text-12 !text-[#7568A6] !rounded-md"
                          />
                          {formError.amount && (
                            <div className="form-eror xl:text-16 text-14">
                              {formError.amount}
                            </div>
                          )}
                          <p className="text-10 text-[#FFFFFF94]">
                            (Min Deposit:{' '}
                            <span className="font-bold">₹100</span> | Max
                            Deposit:
                            <span className="font-bold">₹500000</span>)
                          </p>

                          <InputField
                            onChangeHandler={handleChange}
                            name={'utr'}
                            value={form?.utr}
                            placeholder="UTR Number"
                            className="!font-inter !text-12 !text-[#7568A6] !rounded-md"
                          />
                          {formError.utr && (
                            <div className="form-eror xl:text-16 text-14">
                              {formError.utr}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleReset}
                            className="bg-black text-white font-rajdhani font-medium text-18 p-2 w-[128px] rounded-lg"
                          >
                            Reset
                          </button>
                          <button
                            onClick={handleDepositSubmit}
                            className="bg-[#1C77FF] text-white font-rajdhani font-medium text-18 p-2 flex-1 rounded-lg"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start gap-3">
                      <div className="left-side flex-1 max-w-[493px]">
                        <div className="my-2 md:my-0">
                          <img
                            src="/images/payment-platforms.png"
                            className="w-[254px] mx-auto md:mx-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="border rounded-lg py-4 px-3">
                    <li className="mb-2">
                      <p className="text-12 leading-5">
                        <span className="text-red-700">*</span> PLEASE VERIFY
                        THE PAYMENT DETAILS BEFORE MAKING A BANK TRANSFER
                        DEPOSIT AS THEY MAY CHANGE FROM TIME TO TIME. YOLO 247
                        WILL NOT BE RESPONSIBLE FOR ANY TRANSACTION MADE TO AN
                        OLD/ INACTIVE ACCOUNT.
                      </p>
                    </li>
                    <li className="mb-1">
                      <p className="text-12 leading-5">
                        <span className="text-red-700">*</span> IF YOUR DEPOSIT
                        AMOUNT DOES NOT MATCH THE REQUESTED AMOUNT, IT IS
                        CONSIDERED CHEATING AND THE FUNDS WILL BE WITHHELD. EG:
                        IF YOU DEPOSIT ₹500 AND WRITE ₹1000 IN THE DEPOSIT
                        REQUEST, THE DEPOSIT AMOUNT WILL NOT BE CREDITED TO YOUR
                        WALLET OR REVERSED TO YOUR ACCOUNT.
                      </p>
                    </li>
                  </ul>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
