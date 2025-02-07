/* eslint-disable react-hooks/exhaustive-deps */
import { InputField } from '@/components';
import { isYupError, parseYupError } from '@/utils/Yup';
import { getAuthData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { kycValidation } from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const KycVerification = () => {
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedImage1, setSelectedImage1] = useState({});
  const [activeTab, setActiveTab] = useState('aadharCard');
  const [isKyc, setisKyc] = useState(false);
  const [kycData, setkycData] = useState({});
  const userId = localStorage.getItem('shiv11_userID');
  useEffect(() => {
    if (userId) {
      setForm({ ...form, userId: userId });
    }
  }, [userId]);
  const [form, setForm] = useState({
    userId: null,
    documentName: 'aadharCard',
    documentDetail: '',
    frontImage: '',
    backImage: '',
  });

  const [formError, setFormError] = useState({
    documentName: '',
    documentDetail: '',
    frontImage: '',
    backImage: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({
      ...formError,
      [name]: '',
    });
  };

  const docTypeMenu = [
    {
      id: 'aadharCard',
      title: 'Aadhar Card',
    },
    {
      id: 'panCard',
      title: 'Pan Card',
    },
    {
      id: 'drivingLicense',
      title: 'Driving License',
    },
    {
      id: 'passport',
      title: 'Passport',
    },
  ];

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
          setForm({ ...form, frontImage: image?.data?.imageUrl });
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
  const handleImageChange1 = async (event) => {
    setSelectedImage1(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validImageTypes.includes(file?.type)) {
        const data = new FormData();
        data.append('image', event.target.files[0]);
        const image = await postAuthData('/user/uploads', data);
        if (image?.status) {
          setForm({ ...form, backImage: image?.data?.imageUrl });
        } else {
          toast.error(image?.data || 'Something went wrong!');
          setSelectedImage1({});
        }
      } else {
        toast.error(
          'Invalid file type. Please select a JPEG, PNG, or JPG image.',
        );
        setSelectedImage1({});
      }
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError({});
      await kycValidation.validate(form, {
        abortEarly: false,
      });
      const response = await postAuthData('/user/submit-kyc-document', form);
      if (response?.status === 200 || response?.status === 201) {
        toast.success('KYC Request Sent Successfully');
        setForm({
          documentName: '',
          documentDetail: '',
          frontImage: '',
          backImage: '',
        });
        setSelectedImage({});
        setSelectedImage1({});
        getKyc();
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

  useEffect(() => {
    getKyc();
  }, []);

  const getKyc = async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(`/user/kyc/${userId}`);
        if (response?.status === 201 || response?.status === 200) {
          if (response.data?.data?.isApproved !== 'rejected') {
            setisKyc(true);
          }
          setActiveTab(response.data?.data?.documentName);
          setkycData(response.data?.data);
          setForm({
            documentName: response.data?.data?.documentName,
          });
        } else {
          setisKyc(false);
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };
  const handleReset = () => {
    setForm({
      documentName: 'aadharCard',
      documentDetail: '',
      frontImage: '',
      backImage: '',
    });
    setSelectedImage1({});
    setSelectedImage({});
  };
  const navigate = useNavigate();
  return (
    <div className="h-full py-[10px]">
      <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full md:mx-0 mx-[10px]">
        <div className="flex justify-between items-center border-b border-b-[#E1E1E1] pb-4 mb-5">
          <div className="w-full">
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center gap-2">
                <span
                  onClick={() => navigate(-1)}
                  className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#757FC7] to-[#98A2F8] grid place-content-center text-12 cursor-pointer shadow-[0_0_25px_0_#150E4BB2]"
                >
                  {reactIcons.leftChev}
                </span>
                <span className="font-inter font-bold text-primary-1300">
                  KYC Verification
                </span>
              </div>
              {kycData?.isApproved === 'pending' && (
                <div>
                  <button className="bg-[#FFDDA6] text-[12px] lg:text-14 text-[#825925] py-2 px-5 pr-[50px] rounded-md font-arial relative">
                    <span>KYC PENDING</span>
                    <div className="w-10 h-full rounded-lg bg-[#f5cf92] absolute top-0 right-0 text-white grid place-content-center text-20">
                      {reactIcons.alert}
                    </div>
                  </button>
                </div>
              )}
              {(kycData?.isApproved === 'completed' ||
                kycData?.isApproved === 'approved') && (
                <div>
                  <button className="bg-green-400 text-[12px] lg:text-14 text-[#825925] py-2 px-5 pr-[50px] rounded-md font-arial relative">
                    <span>KYC APPROVED</span>
                    <div className="w-10 h-full rounded-lg bg-green-700 absolute top-0 right-0 text-white grid place-content-center text-20">
                      {reactIcons.alert}
                    </div>
                  </button>
                </div>
              )}
              {kycData?.isApproved === 'rejected' && (
                <div>
                  <button className="bg-red-400 text-[12px] lg:text-14 text-[#825925] py-2 px-5 pr-[50px] rounded-md font-arial relative">
                    <span>KYC REJECTED</span>
                    <div className="w-10 h-full rounded-lg bg-red-700 absolute top-0 right-0 text-white grid place-content-center text-20">
                      {reactIcons.alert}
                    </div>
                  </button>
                </div>
              )}
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Profile <span> &gt; </span>{' '}
              <span className="text-white">KYC Verification</span>
            </p>
          </div>
          {/* <button className="bg-[#FFDDA6] text-[12px] lg:text-14 text-[#825925] py-2 px-5 pr-[50px] rounded-md font-arial relative">
            <span>KYC PENDING</span>
            <div className="w-10 h-full rounded-lg bg-[#f5cf92] absolute top-0 right-0 text-white grid place-content-center text-20">
              {reactIcons.alert}
            </div>
          </button> */}
        </div>

        <div className="progress-bar 3xl:w-[720px] 2xl:w-[600px] xl:w-[450px] md:w-[390px] w-[calc(100vw-100px)] mb-7">
          <div className="w-full flex items-center justify-around">
            <div>
              <div className="flex flex-col items-center">
                <p className="text-10 text-primary-300 font-medium">
                  Basic Details
                </p>
                <span className="text-primary-1300">
                  {reactIcons.triangleUp}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <p className="text-10 text-primary-300 font-medium">
                  Document Submission
                </p>
                <span className="text-[#CBCBE8]">
                  {reactIcons.triangleDown}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <p className="text-10 text-primary-300 font-medium">Review</p>
                <span className="text-[#CBCBE8]">
                  {reactIcons.triangleDown}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center">
                <p className="text-10 text-primary-300 font-medium">Approval</p>
                <span className="text-[#CBCBE8]">
                  {reactIcons.triangleDown}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-around h-[10px] rounded-10 bg-white relative">
            {kycData?.kycPercentage === 75 ? (
              <>
                <div className="flex-1 bg-primary-1300 rounded-tl-10 rounded-bl-10"></div>
                <div className="flex-1 bg-primary-1300  "></div>
                <div className="flex-1 bg-primary-1300 "></div>
                <div className="flex-1  rounded-10"></div>
              </>
            ) : kycData?.kycPercentage === 100 ? (
              <>
                <div className="flex-1 bg-primary-1300 rounded-tl-10 rounded-bl-10"></div>
                <div className="flex-1 bg-primary-1300 "></div>
                <div className="flex-1 bg-primary-1300 "></div>
                <div className="flex-1 bg-primary-1300 rounded-tr-10 rounded-br-10"></div>
              </>
            ) : (
              <>
                <div className="flex-1 bg-primary-1300 rounded-10"></div>
                <div className="flex-1  rounded-10"></div>
                <div className="flex-1 rounded-10"></div>
                <div className="flex-1 rounded-10"></div>
              </>
            )}
            <span className="text-primary-1300 absolute -top-2 -right-[42px] text-14 font-bold">
              {kycData?.kycPercentage || 25}%
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5 rounded-md w-full">
          <p className="text-12 font-semibold mb-2">
            Choose any one document to upload{' '}
            <span className="font-normal ml-3">
              (Min one document required)
            </span>
          </p>

          <div className="tabber">
            <div className="overflow-x-auto tab-menu flex items-center gap-3 mb-5">
              {docTypeMenu.map((item) => (
                <button
                  disabled={isKyc}
                  key={item.id}
                  className={`font-inter mb-3 flex-shrink-0 2xl:text-14 text-12  border rounded-[3px] 2xl:w-[130px] w-[110px] text-center 2xl:p-3 p-2 cursor-pointer ${
                    item.id == activeTab
                      ? 'bg-gradient-1 border-white text-white'
                      : 'bg-white border-primary-300 text-[#000000CC]'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div className="mb-3">
              <p className="text-12 font-semibold mb-1">
                Document detail (No special character allowed)
              </p>
              <InputField
                type={activeTab === 'aadharCard' ? 'number' : 'text'}
                onChangeHandler={handleChange}
                name={'documentDetail'}
                value={isKyc ? kycData?.documentDetail : form?.documentDetail}
                placeholder="Enter Document Number"
                required={true}
                className="!text-12 !font-inter !text-[#7568A6]"
              />
              {formError.documentDetail && (
                <div className="form-eror flex text-start text-14">
                  {formError.documentDetail}
                </div>
              )}
            </div>
            {!isKyc ? (
              <p className="text-12 font-semibold mb-1">
                Upload Document
                <span className="font-normal ml-3">
                  (Maximum size of image 6 MB)
                </span>
              </p>
            ) : (
              <p className="text-12 font-semibold mb-1">Uploaded Document</p>
            )}
            <div className="tab-content mb-5">
              {!isKyc ? (
                <>
                  {' '}
                  {(activeTab == 'aadharCard' ||
                    activeTab == 'drivingLicense' ||
                    activeTab == 'passport') && (
                    <>
                      <div className="border border-[#D8CBCB] rounded-md bg-[#00000069] 3xl:py-4 py-2 flex xl:flex-row flex-col  items-center justify-between gap-2 max-w-[817px] xl:w-[43vw] w-full">
                        <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                          <div className="w-[275px] mx-auto">
                            <p className="text-12 text-center font-medium text-[#BFC7D2F7] ">
                              Front side image (Clear image){' '}
                              <span className="text-red-500">*</span>
                            </p>
                            {selectedImage && (
                              <p className="text-white text-center truncate xl:text-12 text-12">
                                {selectedImage?.name}
                              </p>
                            )}
                            <div className="3xl:text-[50px] text-[40px] flex justify-center 3xl:my-3 my-1 text-primary-1300">
                              {reactIcons.uploadDoc}
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
                        <div className="hidden xl:flex w-[10px] border-l border-l-d border-dashed h-[150px]" />
                        <div className="xl:hidden h-[10px] border-t border-t-d border-dashed w-[80%]" />
                        <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                          <div className="w-[275px] mx-auto">
                            <p className="text-12 text-center font-medium text-[#BFC7D2F7] ">
                              Back side image (Clear image){' '}
                              <span className="text-red-500">*</span>
                            </p>
                            {selectedImage1 && (
                              <p className="text-white text-center truncate xl:text-12 text-12">
                                {selectedImage1?.name}
                              </p>
                            )}
                            <div className="3xl:text-[50px] text-[40px] flex justify-center 3xl:my-3 my-1 text-primary-1300">
                              {reactIcons.uploadDoc}
                            </div>

                            <p className="text-12 text-center font-medium text-[#8A9EC5F7] mb-1 flex items-center gap-1 justify-center">
                              Drop your File to UPLOAD Or{' '}
                              <div className="relative">
                                <input
                                  id="file"
                                  type="file"
                                  onChange={handleImageChange1}
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
                      {formError.frontImage && (
                        <div className="form-eror flex text-start text-14">
                          {formError.frontImage}
                        </div>
                      )}
                    </>
                  )}{' '}
                </>
              ) : (
                <>
                  {(activeTab == 'aadharCard' ||
                    activeTab == 'drivingLicense' ||
                    activeTab == 'passport') && (
                    <>
                      <div className="border border-[#D8CBCB] rounded-md bg-[#00000069] 3xl:py-4 py-2 flex xl:flex-row flex-col  items-center justify-between gap-2 max-w-[817px] xl:w-[43vw] w-full">
                        <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                          <div className="w-[275px] mx-auto h-full">
                            <div className="flex h-full">
                              <img
                                src={kycData?.frontImage}
                                className="w-full h-full object-contain mx-auto"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="hidden xl:flex w-[10px] border-l border-l-d border-dashed h-[150px]" />
                        <div className="xl:hidden h-[10px] border-t border-t-d border-dashed w-[80%]" />
                        <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                          <div className="w-[275px] mx-auto h-full">
                            <div className="flex h-full">
                              <img
                                src={kycData?.backImage}
                                className="w-full h-full object-contain mx-auto"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}{' '}
                </>
              )}
              {!isKyc ? (
                <>
                  {' '}
                  {activeTab == 'panCard' && (
                    <>
                      <div className="border border-[#D8CBCB] rounded-md bg-[#00000069] 3xl:py-4 py-2 flex items-center justify-between gap-2 max-w-[817px] w-[45vw]">
                        <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                          <div className="w-[275px] mx-auto">
                            <p className="text-12 text-center font-medium text-[#BFC7D2F7] ">
                              Front side image (Clear image){' '}
                              <span className="text-red-500">*</span>
                            </p>
                            {selectedImage && (
                              <p className="text-white text-center truncate xl:text-12 text-12">
                                {selectedImage?.name}
                              </p>
                            )}
                            <div className="3xl:text-[50px] text-[40px] flex justify-center 3xl:my-3 my-1 text-primary-1300">
                              {reactIcons.uploadDoc}
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
                      {formError.frontImage && (
                        <div className="form-eror flex text-start text-14">
                          {formError.frontImage}
                        </div>
                      )}
                    </>
                  )}{' '}
                </>
              ) : (
                <>
                  {activeTab == 'panCard' && (
                    <>
                      <div className="border border-[#D8CBCB] rounded-md bg-[#00000069] 3xl:py-4 py-2 flex items-center justify-between gap-2 max-w-[817px] w-[45vw]">
                        <div className="3xl:h-[190px] h-[130px] flex-1 flex-center">
                          <div className="w-[275px] mx-auto h-full">
                            <div className="flex h-full">
                              <img
                                src={kycData?.frontImage}
                                className="w-full h-full object-contain mx-auto"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}{' '}
                </>
              )}
            </div>
          </div>

          {!isKyc && (
            <div className="flex items-center gap-2 md:w-[30vw]">
              <button
                onClick={handleReset}
                className="bg-black text-white font-rajdhani font-medium text-18 p-2 w-[128px] rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={handleKycSubmit}
                className="bg-[#1C77FF] text-white font-rajdhani font-medium text-18 p-2 flex-1 rounded-lg"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycVerification;
