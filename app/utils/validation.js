import * as yup from 'yup';
import React from 'react';
// import moment from 'moment';

export const RenderError = (error = false) => {
  if (error) return <div className="text-red-600 mt-1 text-12">{error}</div>;
};

const emailRegx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordRegx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;

export const emailValidation = yup.object({
  email: yup
    .string()
    .required('Please enter email address')
    .matches(emailRegx, 'Please enter valid email.'),
});

export const passwordValidation = yup.object({
  password: yup
    .string()
    .required('Please enter password')
    .matches(
      passwordRegx,
      'password must be eight characters including one uppercase letter, one special character and alphanumeric characters',
    ),
});

export const loginValidation = yup.object().shape({
  username: yup.string().required('Please enter email address'),
  password: yup.string().required('Please enter password'),
});
export const registrationformValidation = yup.object().shape({
  username: yup.string().required('Please enter your username'),
  password: yup
    .string()
    .required('Please enter password')
    .min(6, 'Password must be at least 6 characters'),
  firstname: yup.string().required('Please enter first name'),
  lastname: yup.string().required('Please enter last name'),
  // otp: yup
  //   .string()
  //   .required('Please enter otp')
  //   .matches(/^\d{6}$/, 'Verification code must be have 6 digits'),
  phoneNumber: yup.number().required('Please enter phone number'),
});

export const forgotPasswordValidation = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be a 10-digit number')
    .required('Please enter a phone number'),
});
export const verificationCodeValidation = yup.object().shape({
  mobile: yup.string().required('Please enter phone number'),
  code: yup
    .string()
    .required('Please enter verification code')
    .matches(/^\d{6}$/, 'Verification code must be have 4 digits'),
  password: yup
    .string()
    .required('Please enter password')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please enter confirm password')
    .oneOf([yup.ref('password')], 'Passwords not matched'),
});

export const registerValidation = yup.object().shape({
  phoneNumber: yup.number().required('Please enter phone number'),
  password: yup
    .string()
    .required('Please enter password')
    .matches(
      passwordRegx,
      'password must be eight characters including one uppercase letter, one special character and alphanumeric characters',
    ),
  condition: yup
    .boolean()
    .oneOf([true], 'Please accept the Terms and Conditions'),
});
export const depositValidation = yup.object().shape({
  paymentMethod: yup.string().required('Please select payment method'),
  utr: yup.string().required('Please enter UTR ID'),
  img: yup.string().required('Please select image'),
  amount: yup.string().required('Please enter amount'),
});
// .number()
// .required('Please enter amount')
// .min(100, 'Minimum amount allowed is ₹100')
// .max(500000, 'Maximum amount allowed is ₹500,000'),
export const kycValidation = yup.object().shape({
  documentName: yup.string().required('Please select document'),
  frontImage: yup.string().required('Please select image'),
  documentDetail: yup.string().required('Please enter your document number'),
});

export const withdrawValidation = yup.object().shape({
  amount: yup
    .string()
    .required('Please enter amount')
    .test(
      'is-positive',
      'Amount must be a positive number',
      (value) => value > 0,
    ),
  bankAccountId: yup.number().required('Please select bank'),
});
export const withdrawValidationUPI = yup.object().shape({
  amount: yup
    .string()
    .required('Please enter amount')
    .test(
      'is-positive',
      'Amount must be a positive number',
      (value) => value > 0,
    ),
  upiId: yup.number().required('Please select UPI'),
});
export const addAccountValidation = yup.object().shape({
  bankName: yup.string().required('Please enter bank name'),
  ifscCode: yup.string().required('Please enter IFSC code'),
  accountType: yup.string().required('Please select type'),
  accountNumber: yup.string().required('Please enter account number'),
  acountholdername: yup.string().required('Please enter account holder name'),
});
export const addUPIValidation = yup.object().shape({
  upiId: yup.string().required('Please enter UPI ID'),
  phonenumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be a 10-digit number')
    .required('Please enter a phone number'),
  acountholdername: yup.string().required('Please enter account holder name'),
});
export const betPlaceValidation = yup.object().shape({
  stake: yup
    .number()
    .min(0, 'Amount must be greater than 0')
    .required('Please enter bet amount'),
});

export const updateProfileValidation = yup.object().shape({
  email: yup.string().matches(emailRegx, 'Please enter valid email'),
  firstname: yup.string().required('Please enter first name'),
  lastname: yup.string().required('Please enter last name'),
});

export const changePasswordValidation = yup.object().shape({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .matches(
      passwordRegx,
      'password must be eight characters including one uppercase letter, one special character and alphanumeric characters',
    ),
});

export const updateUserProfileValidation = yup.object().shape({
  email: yup.string().matches(emailRegx, 'Please enter valid email'),
  firstname: yup.string(),
  lastname: yup.string(),
  country: yup.string(),
  dialcode: yup.string(),
  mobile: yup.string(),
  password: yup
    .string()
    .matches(
      passwordRegx,
      'password must be eight characters including one uppercase letter, one special character and alphanumeric characters',
    ),
});

export const createUserValidate = yup.object().shape({
  mobile: yup.string().required('Please enter phone number'),
  password: yup
    .string()
    .required('Please enter password')
    .matches(
      passwordRegx,
      'password must be eight characters including one uppercase letter, one special character and alphanumeric characters',
    ),
  amount: yup.string().required('Please enter credit amount'),
});

export const editUser = yup.object().shape({
  mobile: yup.string().required('Please enter phone number'),
  password: yup
    .string()
    .required('Please enter password')
    .matches(
      passwordRegx,
      'password must be eight characters including one uppercase letter, one special character and alphanumeric characters',
    ),
});

export const addBalance = yup.object().shape({
  balance: yup.string().required('Please enter balance amount'),
});

export const userChangePasswordValidation = yup.object().shape({
  oldPassword: yup.string().required('Please enter old password'),
  newPassword: yup.string().required('Please enter password'),
  confirmPassword: yup
    .string()
    .required('Please enter confirm password')
    .oneOf([yup.ref('newPassword')], 'Passwords not matched'),
});
export const betValidationSchema = yup.object().shape({
  stake: yup
    .number()
    .required('Stake is required')
    .min(
      yup.ref('minimumBet'),
      ({ min }) => `Stake cannot be less than the minimum bet of ${min}`,
    )
    .max(
      yup.ref('maximumBet'),
      ({ max }) => `Stake cannot be more than the maximum bet of ${max}`,
    ),
  minimumBet: yup.number().required(),
  maximumBet: yup.number().required(),
});
