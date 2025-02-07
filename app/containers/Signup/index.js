/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { reactIcons } from '@/utils/icons';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, postData } from '@/utils/apiHandlers';
import { toast } from 'react-toastify';
import { isYupError, parseYupError } from '@/utils/Yup';
import {
  forgotPasswordValidation,
  registrationformValidation,
} from '@/utils/validation';
const Signup = () => {
  const [isPassword, setIsPassword] = useState(true);
  const navigate = useNavigate();
  const [otpScreen, setOtpScreen] = useState(false);
  const islogin = isLoggedIn();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    islogin && navigate('/');
  }, [islogin, navigate]);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    dialCode: '+91',
    phoneNumber: '',
    otp: '',
  });

  const [formError, setFormError] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    dialCode: '+91',
    phoneNumber: '',
    otp: '',
  });
  const handleChange = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({
      ...formError,
      [name]: '',
    });
  };

  const handleOtpSent = async (e) => {
    e.preventDefault();
    try {
      setFormError({});
      await forgotPasswordValidation.validate(form, {
        abortEarly: false,
      });
      const response = await postData('/user/send-verificationshiv-code', {
        mobile: form.phoneNumber,
      });
      if (response?.status === 200 || response?.status === 201) {
        toast.success('Otp sent successfully');
        setOtpScreen(true);
        setMinutes(1);
        setSeconds(59);
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

  const handleRegistrationSubmit = async () => {
    try {
      setFormError({});
      await registrationformValidation.validate(form, {
        abortEarly: false,
      });
      const response = await postData('/user/register-shiv-user', form);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setForm({
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          password: '',
          phoneNumber: '',
          otp: '',
        });
        navigate('/login');
      } else {
        toast.error(response?.data?.error || 'Something went wrong');
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
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);
  return (
    <div className="fixed left-0 top-0 bottom-0 right-0 bg-[#0B1215] px-3 md:px-40 sm:py-12 py-8">
      <div
        className="bg-white border border-gray-700 rounded-xl h-full bg-no-repeat bg-cover py-10 p-3 md:p-10 relative max-w-[1280px] w-full mx-auto"
        style={{ backgroundImage: 'url(/images/login/card-bg.png)' }}
      >
        <div className="w-full h-full bg-transparent overflow-y-auto">
          <button
            type="button"
            className="absolute right-[-10px] top-[-10px] w-6 h-6 flex items-center justify-center rounded bg-[#FF4646]"
            onClick={() => navigate(-1)}
          >
            {reactIcons.close}
          </button>
          <div className="bg-[#101720] max-w-lg overflow-hidden rounded-lg mx-auto md:mx-0">
            <Accordion className="form-accordian" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="flex w-full items-center justify-between">
                  <div>
                    <img src="/images/logo.png" className="w-10" alt="logo" />
                  </div>
                  <div>
                    <p className="mr-3 font-semibold text-white">
                      Click here to{' '}
                      <button
                        onClick={() => navigate('/login')}
                        className="text-[#FFDD2D] underline"
                      >
                        LOGIN
                      </button>
                    </p>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex items-center justify-between flex-col lg:flex-row lg:py-5">
                  <div className="h-[100px] md:h-[135px] lg:h-auto md:-mt-[50px] -mt-[38px] lg:mt-0">
                    <img
                      src="/images/login/signup.png"
                      alt="password"
                      className="rotate-90 lg:rotate-0 w-[55px] md:w-[75px] mx-auto"
                    />
                  </div>
                  <div className="w-full lg:w-[80%] sm:p-5 p-3 md:p-7">
                    <div className="mt-1">
                      <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        value={form.username}
                        className="bg-gray-50 border border-gray-300 text-black text-md rounded-lg outline-none block w-full p-2 font-semibold"
                        placeholder="Username"
                      />
                    </div>
                    {formError.username && (
                      <div className="form-eror lg:text-16 text-14">
                        {formError.username}
                      </div>
                    )}
                    <div className="mt-3 relative">
                      <input
                        name="password"
                        onChange={handleChange}
                        value={form.password}
                        type={isPassword ? 'password' : 'text'}
                        className="bg-gray-50 border border-gray-300 text-black text-md rounded-lg outline-none block w-full p-2 font-semibold"
                        placeholder="Password"
                      />

                      <span
                        className="absolute cursor-pointer top-[10px] right-[10px] text-22 text-black"
                        onClick={() => setIsPassword(!isPassword)}
                      >
                        {isPassword ? reactIcons.eye : reactIcons.eyeSlash}
                      </span>
                    </div>
                    {formError.password && (
                      <div className="form-eror lg:text-16 text-14">
                        {formError.password}
                      </div>
                    )}
                    <div className="mt-3">
                      <div className="relative">
                        <input
                          type="number"
                          name="phoneNumber"
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-black text-md rounded-lg outline-none block w-full p-2 font-semibold pl-10"
                          placeholder="Enter mobile number"
                        />
                        <span className="absolute top-0 bottom-0 flex items-center justify-center left-0 text-15 text-black bg-[#DBDBDB] p-2 rounded-l-md">
                          +91
                        </span>
                        {!otpScreen && (
                          <span
                            onClick={handleOtpSent}
                            className="absolute cursor-pointer top-0 bottom-0 flex items-center w-[74px] gap-3 justify-center right-0 text-15 text-black bg-[#DBDBDB] p-2 rounded-tr-md rounded-br-md  ease-in duration-300"
                          >
                            OTP {reactIcons.arrowRight}
                          </span>
                        )}
                        {otpScreen && (
                          <span className="absolute top-0 bottom-0 flex items-center w-[74px] gap-3 justify-center right-0 text-15 text-white bg-[#00B507] p-2 rounded-tr-md rounded-br-md">
                            SENT{' '}
                            <img
                              src="/images/login/message-sent.png"
                              alt="message-sent"
                            />
                          </span>
                        )}
                      </div>
                      {otpScreen && (
                        <>
                          <p className="text-right text-14 text-red-500 leading-auto mb-2">
                            Not received OTP?{' '}
                            {seconds > 0 || minutes > 0 ? (
                              <span className="text-right text-14 text-white font-semibold leading-auto">
                                {' '}
                                {minutes < 10 ? `0${minutes}` : minutes}:
                                {seconds < 10 ? `0${seconds}` : seconds} Sec
                              </span>
                            ) : (
                              <span
                                onClick={handleOtpSent}
                                className="underline text-14 font-semibold text-white cursor-pointer"
                              >
                                Resend
                              </span>
                            )}
                          </p>
                        </>
                      )}
                    </div>
                    {formError.phoneNumber && (
                      <div className="form-eror lg:text-16 text-14">
                        {formError.phoneNumber ===
                        'phoneNumber must be a `number` type, but the final value was: `NaN` (cast from the value `""`).'
                          ? 'Please enter mobile number'
                          : formError.phoneNumber}
                      </div>
                    )}
                    {otpScreen && (
                      <>
                        <div className="mt-3">
                          <input
                            name="otp"
                            onChange={handleChange}
                            value={form.otp}
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-black text-md rounded-lg outline-none block w-full p-2 font-semibold"
                            placeholder="Enter OTP"
                          />
                        </div>
                        {formError.otp && (
                          <div className="form-eror lg:text-16 text-14">
                            {formError.otp}
                          </div>
                        )}
                        <div className="mt-3">
                          <input
                            name="firstname"
                            onChange={handleChange}
                            value={form.firstname}
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-black text-md rounded-lg outline-none block w-full p-2 font-semibold"
                            placeholder="First name"
                          />
                        </div>
                        {formError.firstname && (
                          <div className="form-eror lg:text-16 text-14">
                            {formError.firstname}
                          </div>
                        )}
                        <div className="mt-3">
                          <input
                            name="lastname"
                            onChange={handleChange}
                            value={form.lastname}
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-black text-md rounded-lg outline-none block w-full p-2 font-semibold"
                            placeholder="Last name"
                          />
                        </div>
                        {formError.lastname && (
                          <div className="form-eror lg:text-16 text-14">
                            {formError.lastname}
                          </div>
                        )}
                        <div className="mt-3">
                          <input
                            name="email"
                            onChange={handleChange}
                            value={form.email}
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-black text-md rounded-lg outline-none block w-full p-2 font-semibold"
                            placeholder="Email"
                          />
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="w-full bg-[#1C77FF] rounded-md py-2 font-semibold  mt-1 text-white"
                            onClick={handleRegistrationSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </>
                    )}

                    <div>
                      <p className="text-center text-white font-semibold">
                        Already a member?{' '}
                        <button
                          className="text-[#FFDD2D] underline"
                          onClick={() => navigate('/login')}
                        >
                          CLICK HERE
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
