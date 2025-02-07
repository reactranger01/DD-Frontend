/* eslint-disable react-hooks/exhaustive-deps */
import { InputField } from '@/components';
import { isYupError, parseYupError } from '@/utils/Yup';
import { postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { userChangePasswordValidation } from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Password = () => {
  const navigate = useNavigate();
  const userid = localStorage.getItem('shiv11_userID');
  const userName = localStorage.getItem('shiv11_userName');
  const [formError, setFormError] = useState({});
  const [form, setForm] = useState({});
  const [isPassword, setIsPassword] = useState(false);
  const [isPassword1, setIsPassword1] = useState(false);
  const [isPassword2, setIsPassword2] = useState(false);
  useEffect(() => {
    if (userid) {
      setForm({ ...form, _uid: userid });
    }
  }, [userid]);
  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({ ...formError, [name]: '' });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError({});
      await userChangePasswordValidation.validate(form, {
        abortEarly: false,
      });
      delete form.confirmPassword;
      const response = await postAuthData('/user/change-password', form);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message || 'Password changed successfully',
        );
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response?.data || 'Something went wrong');
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        toast.error(error?.message || 'Unauthorised');
      }
    }
  };

  const handlereset = () => {
    setForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormError({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  return (
    <div className="h-full py-[10px]">
      <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full md:mx-0 mx-2 ">
        <div className="flex justify-between items-center border-b border-b-[#E1E1E1] pb-4 mb-5">
          <div>
            <div
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <span className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#757FC7] to-[#98A2F8] grid place-content-center text-12 cursor-pointer shadow-[0_0_25px_0_#150E4BB2]">
                {reactIcons.leftChev}
              </span>
              <span className="font-inter font-bold text-primary-1300">
                Change Password
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Profile <span> &gt; </span>{' '}
              <span className="text-white">Password</span>
            </p>
          </div>
        </div>
        {userName === 'DemoUser' ? (
          <div className="text-white text-center">
            <span className="text-22">
              {' '}
              &quot; You can&apos;t change the password for a demo user ! &quot;
            </span>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5 rounded-md lg:w-[422px] w-full">
            <p className="font-medium mb-5">Account Password</p>
            <div className="input-group mb-3 relative">
              <InputField
                name="oldPassword"
                onChangeHandler={handleChange}
                value={form.oldPassword}
                type={!isPassword ? 'password' : 'text'}
                placeholder="Current Account password*"
              />
              <span
                className="absolute top-[10px] right-[10px] text-22 text-black cursor-pointer"
                onClick={() => setIsPassword(!isPassword)}
              >
                {isPassword ? reactIcons.eye : reactIcons.eyeSlash}
              </span>
              {formError?.oldPassword && (
                <div className="text-14 mx-2 font-normal  text-red-700">
                  {formError?.oldPassword}
                </div>
              )}
            </div>
            <div className="input-group mb-3 relative">
              <InputField
                name="newPassword"
                onChangeHandler={handleChange}
                value={form.newPassword}
                placeholder="New Account password*"
                type={!isPassword1 ? 'password' : 'text'}
              />
              <span
                className="absolute top-[10px] right-[10px] text-22 text-black cursor-pointer"
                onClick={() => setIsPassword1(!isPassword1)}
              >
                {isPassword1 ? reactIcons.eye : reactIcons.eyeSlash}
              </span>
              {formError?.newPassword && (
                <div className="text-14 mx-2 font-normal  text-red-700">
                  {formError?.newPassword}
                </div>
              )}
            </div>
            <div className="input-group mb-3 relative">
              <InputField
                name="confirmPassword"
                onChangeHandler={handleChange}
                value={form.confirmPassword}
                placeholder="Confirm New Account password*"
                type={!isPassword2 ? 'password' : 'text'}
              />
              <span
                className="absolute top-[10px] right-[10px] text-22 text-black cursor-pointer"
                onClick={() => setIsPassword2(!isPassword2)}
              >
                {isPassword2 ? reactIcons.eye : reactIcons.eyeSlash}
              </span>
              {formError?.confirmPassword && (
                <div className="text-14 mx-2 font-normal  text-red-700">
                  {formError?.confirmPassword}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlereset}
                className="bg-black text-white font-rajdhani font-medium text-18 p-2 w-[128px] rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={handleLoginSubmit}
                className="bg-[#1C77FF] text-white font-rajdhani font-medium text-18 p-2 flex-1 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        )}{' '}
      </div>
    </div>
  );
};

export default Password;
