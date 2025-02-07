/* eslint-disable react-hooks/exhaustive-deps */
import { getAuthData, isLoggedIn, putAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AccountInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const islogin = isLoggedIn();
  const [form, setForm] = useState({
    DOB: '',
    email: '',
    telegramId: '',
    instagramId: '',
    whatsappNumber: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
        setForm({
          ...form,
          DOB: response?.data?.DOB,
          email: response?.data?.email,
          telegramId: response?.data?.telegramId,
          instagramId: response?.data?.instagramId,
          whatsappNumber: response?.data?.whatsappNumber,
          userId: response?.data?.id,
        });
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await putAuthData('/user/update-account-info', form);
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Profile Update Successfully');
        setIsEdit(false);

        getUserInfo();
      } else {
        toast.error(response?.data || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const EditHandler = () => {
    setIsEdit(true);
  };

  return (
    <div className="h-full py-[10px] min-w-[351px]">
      <div className="text-white  bg-[#35353591]  rounded-10 font-inter p-5 h-full md:mx-0 mx-[10px]">
        <div className="flex justify-between items-center border-b border-b-[#E1E1E1] pb-4">
          <div>
            <div
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <span className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#757FC7] to-[#98A2F8] grid place-content-center text-12 cursor-pointer shadow-[0_0_25px_0_#150E4BB2]">
                {reactIcons.leftChev}
              </span>
              <span className="font-inter font-bold text-primary-1300">
                Account Info
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Profile <span> &gt; </span>{' '}
              <span className="text-white">Account Info</span>
            </p>
          </div>
          {isEdit ? (
            <div>
              <button
                className="bg-[#6778E3] text-14 py-2 px-5 rounded-md font-arial"
                onClick={handleProfileUpdate}
              >
                Update
              </button>
            </div>
          ) : (
            <div>
              <button
                className="bg-[#6778E3] text-14 py-2 px-5 rounded-md font-arial"
                onClick={EditHandler}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div className=" mb-5">
          <div className="md:mt-7 mt-2 xl:w-[500px] xl:h-[300px] lg:w-[400px] lg:h-[250px] md:w-[400px] md:h-[250px] w-full mx-auto rounded-20 bg-gradient-to-br to-[#4857B4] from-[#5969CD]">
            <div className="flex items-end justify-between px-3 md:px-5 pt-4">
              <div className="flex-2">
                <label className="text-12">Name</label>
                <p className="capitalize text-14">{userInfo?.fullname}</p>
              </div>
              <div className="flex">
                <img
                  src="/images/logo-shiv11.png"
                  className="md:w-[137px] w-[90px] ml-auto"
                />
              </div>
            </div>
            <div className="flex md:gap-10 gap-5  px-3 md:px-5  py-2">
              <div>
                <label className="text-12">Contact Number</label>
                <p className="capitalize text-14">{userInfo?.phoneNumber}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-12">Email</label>
                <p className="text-14 break-all">{userInfo?.email}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#9f721d] via-[#f4d07a] via-70% to-[#ad822a] px-3 md:px-5  flex items-center justify-between">
              <p className="text-16 text-semibold py-3 font-inter">
                Learn about your loyalty benefits
              </p>
              <span>{reactIcons.rightChevDouble}</span>
            </div>
          </div>
          <p className="text-12 text-center text-[#FFFFFFC4]">
            Your turnover for this month is{' '}
            <span className="font-bold text-14 text-white">0.00</span>
          </p>
        </div>
        <div className="flex  flex-wrap  items-start justify-between gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#0000004D] to-[#00000026] rounded-md w-full xl:w-[241px]">
            <div className="border-b border-b-[#5f5f5f] p-4">
              <h6 className="text-primary-1300 mb-1 text-14 font-medium">
                General
              </h6>
              <div className="flex items-start gap-2">
                <div>
                  <div className="flex gap-2 justify-start items-center">
                    <span>{reactIcons.user2}</span>
                    <p className="font-medium text-12 mb-0 leading-5">
                      {userInfo?.fullname}
                    </p>
                  </div>
                  {isEdit ? (
                    <div className="flex gap-2 justify-start items-center">
                      <span className="text-10">DOB :</span>
                      <p className="font-medium text-12 mb-0 leading-5">
                        <input
                          type="date"
                          onChange={handleChange}
                          value={form?.DOB}
                          name="DOB"
                          placeholder=""
                          className="text-14 border-white border-[1px] rounded text-white mt-[2px]  bg-transparent w-[160px]  "
                        />
                      </p>
                    </div>
                  ) : (
                    <>
                      {userInfo?.DOB ? (
                        <div className="flex gap-2 justify-start items-center">
                          <span className="text-10">DOB :</span>
                          <p className="font-medium text-12 mb-0 leading-5">
                            {userInfo?.DOB}
                          </p>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                  {/* <p className="font-medium text-12 leading-4">DD-MM-YYYY</p> */}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h6 className="text-primary-1300 mb-1 text-14 font-medium">
                User Name
              </h6>
              <div className="flex items-center gap-2">
                <span>{reactIcons.addressBook}</span>
                <div>
                  <p className="font-medium text-12 mb-0 leading-5">
                    {userInfo?.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0000004D] to-[#0000008a] rounded-md flex-1">
            <div className="border-b border-b-[#5f5f5f] p-4">
              <h6 className="text-primary-1300 mb-2 text-14 font-medium">
                Contact Details
              </h6>
              <div className="flex items-center gap-2">
                <span>{reactIcons.mobile}</span>
                <div>
                  <p className="font-medium text-12 mb-0 leading-5 flex gap-2">
                    <img
                      src="/images/icons/india-flag.svg"
                      className="w-[10px]"
                    />
                    <span className="flex-1">{userInfo?.phoneNumber}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h6 className="text-primary-1300 mb-2 text-14 font-medium">
                Email (Optional)
              </h6>
              <div className="flex items-center gap-2">
                <span className="text-10">{reactIcons.mail}</span>
                <div>
                  {isEdit ? (
                    <input
                      type="text"
                      onChange={handleChange}
                      value={form?.email}
                      name="email"
                      placeholder="example@mail.com"
                      className="text-14 border-white border-[1px] rounded text-white mt-[2px]  bg-transparent max-w-[200px]  "
                    />
                  ) : (
                    <p className="font-medium text-12 mb-0 leading-5">
                      {userInfo?.email}
                    </p>
                  )}

                  {/* <p className="font-medium text-12 mb-0 leading-5"></p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0000004D] to-[#00000026] rounded-md xl:w-[241px] w-full">
            <div className="border-b border-b-[#5f5f5f] p-4">
              <h6 className="text-primary-1300 mb-1 text-14 font-medium">
                Apps
              </h6>
              <div className="flex items-start gap-2">
                <span>{reactIcons.telegram}</span>
                <div>
                  <p className="font-medium text-12 mb-0 leading-5">
                    Telegram Username
                  </p>
                  {isEdit ? (
                    <input
                      type="text"
                      onChange={handleChange}
                      value={form?.telegramId}
                      name="telegramId"
                      placeholder="xyz"
                      className="text-14 border-white border-[1px] rounded text-white mt-[2px]  bg-transparent w-[160px]  "
                    />
                  ) : (
                    <p className="font-medium text-12 mb-0 leading-5">
                      {userInfo?.telegramId}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 border-b border-b-[#5f5f5f] px-4 py-3">
              <span>{reactIcons.insta}</span>
              <div>
                <p className="font-medium text-12 mb-0 leading-5">Instagram</p>
                {isEdit ? (
                  <input
                    type="text"
                    onChange={handleChange}
                    value={form?.instagramId}
                    name="instagramId"
                    placeholder="xyz"
                    className="text-14 border-white border-[1px] rounded text-white mt-[2px]  bg-transparent w-[160px]  "
                  />
                ) : (
                  <p className="font-medium text-12 mb-0 leading-5">
                    {userInfo?.instagramId}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2 px-4 py-3">
              <span>{reactIcons.whatsapp}</span>
              <div>
                <p className="font-medium text-12 mb-0 leading-5">WhatsApp</p>
                {isEdit ? (
                  <input
                    type="text"
                    onChange={handleChange}
                    value={form?.whatsappNumber}
                    name="whatsappNumber"
                    placeholder="xyz"
                    className="text-14 border-white border-[1px] rounded text-white mt-[2px]  bg-transparent w-[160px]  "
                  />
                ) : (
                  <p className="font-medium text-12 mb-0 leading-5">
                    {userInfo?.whatsappNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0000004D] to-[#00000026] rounded-md flex md:flex-row flex-col  md:justify-between justify-start gap-3 3xl:w-[72%]">
          <div className="flex-1">
            <div className="border-b border-b-[#5f5f5f] p-4">
              <h6 className="text-primary-1300 mb-1 text-14 font-medium">
                Referral
              </h6>
              <div className="flex items-center  gap-2">
                <span>{reactIcons.link}</span>
                <div>
                  <p className="font-medium text-12 mb-0 leading-5 text-primary-1300">
                    Code
                  </p>
                  <p className="font-medium text-12 leading-4 flex items-end gap-2">
                    <span>0Jaa7LYO8</span>
                    <img src="/images/icons/copy.svg" className="w-[20px]" />
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 py-3 px-4">
              <span>{reactIcons.glob}</span>
              <div>
                <p className="font-medium text-12 mb-0 leading-5 text-primary-1300">
                  Link
                </p>
                <p className="font-medium text-12 leading-4 flex items-end gap-2 break-all">
                  <span>https://www.shiv11.com/login</span>
                  <img src="/images/icons/copy.svg" className="w-[20px]" />
                </p>
              </div>
            </div>
          </div>
          <div className="w-[268px] mx-auto my-auto">
            <div className="3xl:w-[118px] w-[85px] mx-auto bg-white p-1">
              <img src="/images/icons/qrcode.png" />
              <p className="text-[11px] text-center md:pb-0 pb-11">
                Scan QR Code
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
