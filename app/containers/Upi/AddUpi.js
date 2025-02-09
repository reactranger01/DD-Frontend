import { InputField } from '@/components';
import { isYupError, parseYupError } from '@/utils/Yup';
import { postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { addUPIValidation } from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddUpi = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem('shiv11_userID');
  const userName = localStorage.getItem('shiv11_userName');

  useEffect(() => {
    if (userId) {
      setForm({ ...form, userId: userId, upiName: userName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  0;
  const [form, setForm] = useState({
    upiId: '',
    phonenumber: '',
    acountholdername: '',
  });

  const [formError, setFormError] = useState({
    upiId: '',
    phonenumber: '',
    acountholdername: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({
      ...formError,
      [name]: '',
    });
  };

  const handleAddUPISubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError({});
      await addUPIValidation.validate(form, {
        abortEarly: false,
      });
      const response = await postAuthData('/user/add-userupi', form);
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Account Added Successfully');
        setFormError({
          upiId: '',
          phonenumber: '',
          acountholdername: '',
        });
        navigate('/profile/upi-details');
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
      upiId: '',
      phonenumber: '',
      acountholdername: '',
    });
  };

  return (
    <div className="h-full py-[10px]">
      <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full md:mx-0 mx-[10px]">
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
                UPI Details
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Profile <span> &gt; </span>{' '}
              <span className="text-white">UPI Details</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5 rounded-md 3xl:w-[636px] 2xl:w-[500px]">
          <div className="input-group mb-3">
            <InputField
              onChangeHandler={handleChange}
              placeholder="UPI address"
              name={'upiId'}
              value={form?.upiId || ''}
            />
            {formError.upiId && (
              <div className="form-eror flex text-start text-14">
                {formError.upiId}
              </div>
            )}
          </div>

          <div className="input-group mb-3">
            <InputField
              onChangeHandler={handleChange}
              placeholder="Registered Phone pay name"
              name={'acountholdername'}
              value={form?.acountholdername || ''}
            />
            {formError.acountholdername && (
              <div className="form-eror flex text-start text-14">
                {formError.acountholdername}
              </div>
            )}
          </div>
          <div className="input-group mb-3">
            <InputField
              type="number"
              onChangeHandler={handleChange}
              placeholder="mobile number"
              name={'phonenumber'}
              value={form?.phonenumber || ''}
            />
            {formError.phonenumber && (
              <div className="form-eror flex text-start text-14">
                {formError.phonenumber}
              </div>
            )}
          </div>
          {/* <div className="grid lg:grid-cols-2 gap-3 mb-3">
            <div className="input-group">
              <InputField
                placeholder="Account Number"
                type="number"
                onChangeHandler={handleChange}
                name={'accountNumber'}
                value={form?.accountNumber}
              />
              {formError.accountNumber && (
                <div className="form-eror flex text-start text-14">
                  {formError.accountNumber}
                </div>
              )}
            </div>
            <div className="input-group">
              <InputField
                className="pr-10"
                placeholder="IFSC Code"
                onChangeHandler={handleChange}
                name={'ifscCode'}
                value={form?.ifscCode}
                addonRight={
                  <div className="absolute top-0 right-0 w-[35px] h-full rounded-tr-lg rounded-br-lg bg-secondary-100 text-20 text-white grid place-content-center">
                    {reactIcons.search}
                  </div>
                }
              />
              {formError.ifscCode && (
                <div className="form-eror flex text-start text-14">
                  {formError.ifscCode}
                </div>
              )}
            </div>
          </div> */}
          {/* <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="input-group">
              <InputField placeholder="Bank Branch" />
            </div>
            <div className="input-group">
              <InputField placeholder="Bank Address" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="input-group">
              <InputField placeholder="Remarks" />
            </div>
            <div className="input-group">
              <InputField
                className="pl-6"
                placeholder="Set Default Account"
                addonLeft={
                  <div className="w-[10px] h-[10px] bg-secondary-100 rounded-full absolute top-[15px] left-[10px]"></div>
                }
              />
            </div>
          </div> */}
          <p className="text-14 font-rajdhani font-medium leading-5 mb-5">
            For Security Reasons, Withdrawal Is Only Allowed Account Owner. If
            You Have Any Issues, Do Not Hesitate To Contact Our{' '}
            <span className="text-[#FF4646]">Customer Service</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="bg-black text-white font-rajdhani font-medium text-18 p-2 w-[128px] rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={handleAddUPISubmit}
              className="bg-[#1C77FF] text-white font-rajdhani font-medium text-18 p-2 flex-1 rounded-lg"
            >
              Add UPI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUpi;
