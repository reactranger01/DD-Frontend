/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { reactIcons } from '@/utils/icons';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { getAuthData, isLoggedIn, removeAuthCookie } from '@/utils/apiHandlers';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import moment from 'moment';
// import { numberWithCommas } from '@/utils/numberWithCommas';
import { useSelector } from 'react-redux';
import { sidebarTabs } from '@/utils/contants';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import RightBar from './RightBar';
import { numberWithCommas } from '@/utils/numberWithCommas';
import CasinoBox from '../HoverBox/CasinoBox';
import SportsBox from '../HoverBox/SportsBox';
// import AviatorBox from '../HoverBox/AviatorBox';

function Header() {
  const isMobileView = useMediaQuery('(max-width:600px)');
  const [isSportsHovered, setIsSportsHovered] = useState(false);
  const [isCasinoHovered, setIsCasinoHovered] = useState(false);
  // const [isAviatorHovered, setIsAviatorHovered] = useState(false);
  const userDetails = useSelector((state) => state?.userDetails.data);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdown, setDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const login = isLoggedIn();
  const [openTab, setOpenTab] = React.useState(null);
  const [currentPath, setCurrentPath] = React.useState('');
  const [userInfo, setUserInfo] = useState({});
  const location = useLocation();
  const handleMainTabClick = (index) => {
    if (openTab === index) {
      setOpenTab(null);
    } else {
      setOpenTab(index);
    }
  };

  // const toggleMenu = () => {
  //   setIsOpen(!isOpen);
  // };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    let intervalId;
    const getUserInfo = async () => {
      try {
        const response = await getAuthData('/user/get-user-details');
        if (response?.status === 201 || response?.status === 200) {
          setUserInfo(response.data);
          localStorage.setItem('shiv11_userID', response.data.id); // Return the data instead of logging it
          localStorage.setItem('shiv11_userName', response.data.username); // Return the data instead of logging it
        }
        if (response?.status === 403 || response.data.isDeleted === true) {
          navigate('/');
          Cookies.remove('__user__isLoggedIn');
          Cookies.remove('test__user__isLoggedIn');
          Cookies.remove('development__user__isLoggedIn');
          localStorage.removeItem('shiv11_userID');
          localStorage.removeItem('shiv11_userName');
          removeAuthCookie();
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    };

    if (login) {
      getUserInfo();
      intervalId = setInterval(getUserInfo, 10000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [login]);

  const handleClose = () => {
    setIsOpen(null);
    setDropdown(false);
  };

  const handleLogout = async () => {
    navigate('/');
    Cookies.remove('__user__isLoggedIn');
    Cookies.remove('test__user__isLoggedIn');
    Cookies.remove('development__user__isLoggedIn');
    localStorage.removeItem('shiv11_userID');
    localStorage.removeItem('shiv11_userName');
    removeAuthCookie();
    toast.success('Logged Out Successfully...');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [currentPath, location]);

  // const mobileMenuHandler = (link) => {
  //   navigate(link);
  //   setIsOpen(false);
  // };
  return (
    <>
      <nav className="flex items-center justify-between flex-wrap  px-3 md:pr-0 md:pl-4  relative font-inter py-3 md:py-0">
        <div
          className="flex items-center flex-shrink-0 text-white mr-6"
          onClick={() => navigate('/')}
        >
          <img
            src="/images/yoloLogo.webp"
            alt="logo"
            className="cursor-pointer w-[120px]"
          />
        </div>
        <div className="flex-1 flex-grow flex items-center justify-between">
          <div className="text-sm flex items-center">
            <button
              onMouseEnter={() => setIsCasinoHovered(true)}
              onMouseLeave={() => setIsCasinoHovered(false)}
              className=" top-buttons  btn-skew font-bold py-2 px-2  rounded mr-2 hidden md:flex justify-center min-w-[70px] lg:min-w-[unset]"
            >
              <span>CASINO</span>
            </button>
            <CasinoBox isHovered={isCasinoHovered} />
            <button
              onMouseEnter={() => setIsSportsHovered(true)}
              onMouseLeave={() => setIsSportsHovered(false)}
              className=" top-buttons  btn-skew font-bold py-2 px-2  rounded mr-2 hidden md:flex justify-center min-w-[70px] lg:min-w-[unset]"
            >
              <span>INSTANT GAMES</span>
            </button>
            <button
              onMouseEnter={() => setIsSportsHovered(true)}
              onMouseLeave={() => setIsSportsHovered(false)}
              className=" top-buttons  btn-skew font-bold py-2 px-2  rounded mr-2 hidden md:flex justify-center min-w-[70px] lg:min-w-[unset]"
            >
              <span>HOT GAMES</span>
            </button>
            <button
              onMouseEnter={() => setIsSportsHovered(true)}
              onMouseLeave={() => setIsSportsHovered(false)}
              className=" top-buttons  btn-skew font-bold py-2 px-2  rounded mr-2 hidden md:flex justify-center min-w-[70px] lg:min-w-[unset]"
            >
              <span>SPORTS</span>
            </button>
            <SportsBox isHovered={isSportsHovered} />
            <button
              onMouseEnter={() => setIsSportsHovered(true)}
              onMouseLeave={() => setIsSportsHovered(false)}
              className=" top-buttons  btn-skew font-bold py-2 px-2  rounded mr-2 hidden md:flex justify-center min-w-[70px] lg:min-w-[unset]"
            >
              <span>BONUS</span>
            </button>
            {/* <button
              onMouseEnter={() => setIsAviatorHovered(true)}
              onMouseLeave={() => setIsAviatorHovered(false)}
              className=" top-buttons  btn-skew font-bold py-2 px-2  rounded mr-2 hidden md:flex justify-center min-w-[70px] lg:min-w-[unset]"
            >
              <span>AVAITOR</span>
            </button>
            <AviatorBox isHovered={isAviatorHovered} /> */}
          </div>
        </div>
      </nav>

      <div className="mobile-menu">
        <Menu
          className="md:hidden w-full"
          id="basic-menu"
          anchorEl={dropdown}
          open={Boolean(dropdown)}
          onClose={() => {
            setDropdown(null);
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiPaper-root': {
              minWidth: isMobileView ? 'auto' : 350,
              backgroundColor: 'black',
              padding: 0,
              width: '100%',
              marginTop: '30px',
            },
          }}
        >
          <div className="bg-[#383838] border-[1px] border-[#525252] rounded-md mx-4">
            <MenuItem onClick={handleClose} disableRipple={true}>
              <div className="rounded-md 2xl:p-3 p-2 bg-white flex items-center justify-between w-full">
                <p className="2xl:text-16 text-14 font-semibold text-black flex-1">
                  Balance
                </p>
                <div>
                  <p className="2xl:text-16 text-14 font-medium text-[#45BF75] flex-1">
                    {numberWithCommas(userDetails?.balance || userInfo.balance)}
                  </p>
                </div>
              </div>
            </MenuItem>
            {/* <MenuItem onClick={handleClose} disableRipple={true}>
              <div className="rounded-md 2xl:p-3 p-2 bg-white flex items-center justify-between w-full">
                <p className="2xl:text-16 text-14 font-semibold text-black flex-1">
                  Bonus Won
                </p>
                <div>
                  <p className="2xl:text-16 text-14 font-medium text-[#45BF75] flex-1">
                    {userDetails?.creditAmount || userInfo.creditAmount}
                  </p>
                </div>
              </div>
            </MenuItem> */}
            <MenuItem onClick={handleClose} disableRipple={true}>
              <div className="rounded-md 2xl:p-3 p-2 bg-white flex items-center justify-between w-full">
                <p className="2xl:text-16 text-14 font-semibold text-black flex-1">
                  Net Exposure
                </p>
                <div>
                  <p className="2xl:text-16 text-14 font-medium text-[#BA202D] flex-1">
                    {numberWithCommas(
                      userDetails?.exposureAmount || userInfo.exposureAmount,
                    )}
                  </p>
                </div>
              </div>
            </MenuItem>

            <MenuItem
              onClick={() => {
                setDropdown(false);
                handleLogout();
              }}
              disableRipple={true}
            >
              <div className="flex items-center gap-2 w-full gradient-btn py-2 rounded-b-[4px]">
                <p className="2xl:text-16 text-14 text-center font-semibold text-white flex-1">
                  Log Out
                </p>
              </div>
            </MenuItem>
          </div>
          <MenuItem>
            <div className="side-bar-mobile flex items-center justify-between w-full !min-w-full md:min-w-auto">
              <div className="flex sidebar-mobile-inner ">
                <List className="w-full">
                  {sidebarTabs.map((item, index) => (
                    <>
                      <div
                        key={index}
                        className={`mb-3 w-full  md:w-80 bg-[#383838] border-[1px] border-[#525252] rounded-md  ${
                          item.name === 'Finances' && 'hidden'
                        }`}
                      >
                        <ListItemButton
                          onClick={() => handleMainTabClick(index)}
                          className={`list-button transition-colors ease duration-300 bg-[#383838] ${
                            openTab == index && 'bg-gradient-1'
                          }`}
                        >
                          <div className="flex gap-2.5 items-center text-white text-sm font-inter w-full">
                            <div>
                              <div className="border border-white bg-[radial-gradient(#FFFFFF4D, #FFFFFF80)] icon-bg rounded-md p-2 shadow-[0_0_8px_3px_#6369AD66]">
                                <img src={item.icon} alt="dashboard" />
                              </div>
                            </div>
                            <div>{item.name}</div>
                          </div>
                          {openTab === index ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse
                          in={openTab === index}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {item.subTab.map((subTab, subIndex) => (
                              <ListItemButton
                                key={subIndex}
                                onClick={() => {
                                  navigate(subTab.link);
                                  setDropdown(false);
                                }}
                                className={`innerMenu ${
                                  subTab.link == currentPath && 'bg-gradient-1'
                                }`}
                              >
                                <ListItemText primary={subTab.name} />
                              </ListItemButton>
                            ))}
                          </List>
                        </Collapse>
                      </div>
                      {item.subTab.map((subTab, subIndex) => (
                        <div
                          key={subIndex}
                          onClick={() => setDropdown(false)}
                          className={`mb-3 w-full  md:w-80 bg-[#383838] border-[1px] border-[#525252] rounded-md  ${
                            item.name !== 'Finances' && 'hidden'
                          }`}
                        >
                          <ListItemButton
                            onClick={() => navigate(subTab?.link)}
                            className="list-button transition-colors ease duration-300 bg-[#383838]"
                          >
                            <div className="flex gap-2.5 items-center text-white text-sm font-inter w-full">
                              <div>
                                <div className="border border-white bg-[radial-gradient(#FFFFFF4D, #FFFFFF80)] icon-bg rounded-md p-2 shadow-[0_0_8px_3px_#6369AD66]">
                                  <img
                                    src="/images/icons/finances.svg"
                                    alt="dashboard"
                                  />
                                </div>
                              </div>
                              <div>
                                {subTab?.name === 'History'
                                  ? 'D/W History'
                                  : subTab?.name}
                              </div>
                            </div>
                          </ListItemButton>
                        </div>
                      ))}
                    </>
                  ))}
                </List>
              </div>
            </div>
          </MenuItem>
          <MenuItem className="my-[-57px]">
            <RightBar className="right-bar-mobile" card="!mx-0" />
          </MenuItem>
        </Menu>
      </div>
      <div className="bg-black pt-[26px]  text-center  relative">
        <marquee direction="left">
          <p className="flex items-center font-inter text-white text-12 font-normal ">
            Yolo247 - Beyond Games Your Bonuses, Auto activated - Explore your
            entertainment partner now !!Check out our bonus page for exciting
            rewards.
          </p>
        </marquee>
        <div className="absolute z-50 top-2 left-2">
          <div className="relative flex">
            {/* {/ Before login content /} */}
            {!login && (
              <>
                <div className="text-sm flex items-center mr-2">
                  <Link
                    // https://api.whatsapp.com/send/?phone=919828417564&text&type=phone_number&app_absent=0
                    to="#"
                    target="_blank"
                  >
                    <button className="mr-4 hidden md:block">
                      <img
                        src="/images/whatsapp.gif"
                        alt="whatsapp"
                        className="w-[140px]"
                      />
                    </button>
                  </Link>
                  <button
                    className="bg-[#6778e3] text-white font-semibold btn-skew py-[6px] sm:py-2 sm:px-4 px-[8px] text-12 md:text-14 sm:text-16 rounded"
                    type="button"
                    onClick={() => navigate('/login')}
                  >
                    <span className="btn-skew-reverse">Login</span>
                  </button>
                  <button
                    className="bg-[#f4a322] text-white font-semibold btn-skew py-[6px] sm:py-2 sm:px-4 px-[8px] text-12 md:text-14 sm:text-16 rounded ml-2"
                    type="button"
                    onClick={() => navigate('/signup')}
                  >
                    <span className="btn-skew-reverse">SIGNUP</span>
                  </button>
                </div>
                {/* {isOpen && (
                  <div className="absolute top-[45px] right-0 z-50 w-[250px] bg-white rounded-lg p-3">
                    <button
                      onClick={mobileMenuHandler('/casino-table')}
                      className={`${
                        location.pathname === '/casino-table'
                          ? 'gradient-btn text-white'
                          : 'gradient-btn-2 text-black'
                      }  btn-skew font-bold py-2 px-9  mr-2 mb-2 w-full border border-[#939BAB]`}
                    >
                      <span>Casino</span>
                    </button>
                    <button
                      onClick={mobileMenuHandler('/')}
                      className={`${
                        location.pathname === '/'
                          ? 'gradient-btn text-white'
                          : 'gradient-btn-2 text-black'
                      }  btn-skew font-bold py-2 px-9  mr-2 mb-2 w-full border border-[#939BAB]`}
                    >
                      <span>Sports</span>
                    </button>
                    <button
                      // onClick={() => {
                      //   navigate('/aviator');
                      //   setIsOpen(false);
                      // }}
                      onClick={mobileMenuHandler('/aviator')}
                      className={`${
                        location.pathname === '/aviator'
                          ? 'gradient-btn text-white'
                          : 'gradient-btn-2 text-black'
                      }  btn-skew font-bold py-2 px-9  mr-2 mb-2 w-full border border-[#939BAB]`}
                    >
                      <span>Aviator</span>
                    </button>
                  </div>
                )} */}
              </>
            )}
            {/* {/ After login content /} */}
            {login && (
              <>
                <div className="flex items-center">
                  <div className="notification-icon mr-3 ">
                    <Link
                      // https://api.whatsapp.com/send/?phone=919828417564&text&type=phone_number&app_absent=0
                      to="#"
                      target="_blank"
                    >
                      {' '}
                      <button className="mr-4 hidden md:block">
                        <img
                          src="/images/whatsapp.gif"
                          alt="whatsapp"
                          className="w-[180px]"
                        />
                      </button>
                    </Link>
                  </div>
                  {/* <button className="block bg-blue-700 p-1 rounded-[5px] md:hidden mr-2">
                    <img
                      src="/images/more-option/live-tv.png"
                      alt="live-tv"
                      className="w-5"
                    />
                  </button> */}
                  <button
                    className="block bg-green-700 p-1 rounded-[5px] md:hidden mr-2"
                    onClick={() =>
                      navigate('/profile/deposit', {
                        state: '/profile/deposit',
                      })
                    }
                  >
                    <img
                      src="/images/icons/account_balance_wallet.svg"
                      className="w-5 h-5"
                    />
                  </button>
                  <div className="btn-skew-login remove-skew md:bg-transparent bg-[#383838] rounded-md md:rounded-none md:border-r md:border-l font-bold py-1 px-2 relative  border-white flex items-center justify-center -mr-[5px] w-[135px] sm:w-[180px] md:w-auto h-[45px] md:h-auto">
                    <div className="relative">
                      <button
                        onClick={(event) => {
                          setDropdown(event.currentTarget);
                        }}
                        type="button"
                        className="text-white  font-medium rounded-lg text-sm text-center inline-flex items-center capitalize"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left min-w-[100px] sm:min-w-[130px] text-12 md:text-14 lg:text-16">
                            <h4 className="font-semibold">
                              {userDetails?.username || userInfo.username}
                            </h4>
                            <span className="font-semibold text-[#0EAD69] ml-[3px]">
                              Bal :{' '}
                              {numberWithCommas(
                                Math.floor(userDetails?.balance) -
                                  Math.floor(
                                    Math.abs(userDetails?.exposureAmount),
                                  ) ||
                                  Math.floor(userInfo?.balance) -
                                    Math.floor(
                                      Math.abs(userInfo?.exposureAmount),
                                    ),
                              )}
                              {/* {numberWithCommas(
                                Math.abs(
                                  Math.floor(userDetails?.balance) +
                                    Math.floor(userDetails?.exposureAmount) ||
                                    Math.floor(userInfo?.balance) +
                                      Math.floor(userInfo?.exposureAmount),
                                ),
                              )} */}
                            </span>
                            <div className="md:flex hidden items-center justify-between text-10 ml-[6px]">
                              <span>
                                {moment(currentTime).format('L, h:mm:ss a')}
                              </span>
                              {/* {/ <span>3:26:05 PM</span> /} */}
                            </div>
                          </div>
                          {/* <div className="w-4 h-4">
                        <svg
                          className="w-2.5 h-2.5 ms-3 md:bg-transparent bg-[#D9D9D9] text-black md:text-[#8A9EC5F7] rounded-full"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </div> */}
                          <div className="text-22 bg-white rounded-full md:skew-x-[8deg] text-[#8A9EC5F7]">
                            {reactIcons.arrowDown}
                          </div>
                        </div>
                      </button>

                      <Menu
                        className="hidden md:flex"
                        id="basic-menu"
                        anchorEl={dropdown}
                        open={Boolean(dropdown)}
                        onClose={() => {
                          setDropdown(null);
                        }}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        sx={{
                          '& .MuiPaper-root': {
                            minWidth: 270,
                            backgroundColor: 'black',
                            padding: 0,
                          },
                        }}
                      >
                        <MenuItem onClick={handleClose} disableRipple={true}>
                          <div className="rounded-md 2xl:p-3 p-2 bg-white flex items-center justify-between w-full">
                            <p className="2xl:text-16 text-14 font-semibold text-black flex-1">
                              Balance
                            </p>
                            <div>
                              <p className="2xl:text-16 text-14 font-medium text-[#45BF75] flex-1">
                                {numberWithCommas(
                                  Math.abs(
                                    userDetails?.balance || userInfo?.balance,
                                  ),
                                )}
                              </p>
                            </div>
                          </div>
                        </MenuItem>
                        {/* <MenuItem onClick={handleClose} disableRipple={true}>
                          <div className="rounded-md 2xl:p-3 p-2 bg-white flex items-center justify-between w-full">
                            <p className="2xl:text-16 text-14 font-semibold text-black flex-1">
                              Bonus Won
                            </p>
                            <div>
                              <p className="2xl:text-16 text-14 font-medium text-[#45BF75] flex-1">
                                {userDetails?.creditAmount ||
                                  userInfo?.creditAmount}
                              </p>
                            </div>
                          </div>
                        </MenuItem> */}
                        <MenuItem onClick={handleClose} disableRipple={true}>
                          <div className="rounded-md 2xl:p-3 p-2 bg-white flex items-center justify-between w-full">
                            <p className="2xl:text-16 text-14 font-semibold text-black flex-1">
                              Net Exposure
                            </p>
                            <div>
                              <p className="2xl:text-16 text-14 font-medium text-[#BA202D] flex-1">
                                {numberWithCommas(
                                  userDetails?.exposureAmount ||
                                    userInfo?.exposureAmount,
                                )}
                              </p>
                            </div>
                          </div>
                        </MenuItem>
                        <MenuItem onClick={handleClose} disableRipple={true}>
                          <div
                            className="flex items-center gap-2 border-b border-dashed w-full"
                            onClick={() =>
                              navigate('/profile/account-info', {
                                state: '/profile/account-info',
                              })
                            }
                          >
                            <span className="text-white">
                              {reactIcons.user2}
                            </span>
                            <p className="2xl:text-16 text-14 font-semibold text-white flex-1 pb-[6px]">
                              Profile
                            </p>
                          </div>
                        </MenuItem>
                        <MenuItem onClick={handleClose} disableRipple={true}>
                          <div
                            className="flex items-center gap-2 border-b border-dashed w-full"
                            onClick={() =>
                              navigate('/profile/deposit', {
                                state: '/profile/deposit',
                              })
                            }
                          >
                            {/* {/ <span className="text-white">{reactIcons.user2}</span> /} */}
                            <img
                              src="/images/icons/rupees.svg"
                              className="w-[18px]"
                            />
                            <p className="2xl:text-16 text-14 font-semibold text-white flex-1 pb-[6px]">
                              Deposit
                            </p>
                          </div>
                        </MenuItem>
                        <MenuItem onClick={handleClose} disableRipple={true}>
                          <div
                            className="flex items-center gap-2 border-b border-dashed w-full"
                            onClick={() =>
                              navigate('/profile/withdraw', {
                                state: '/profile/withdraw',
                              })
                            }
                          >
                            {/* {/ <span className="text-white">{reactIcons.user2}</span> /} */}
                            <img
                              src="/images/icons/rupees.svg"
                              className="w-[18px]"
                            />
                            <p className="2xl:text-16 text-14 font-semibold text-white flex-1 pb-[6px]">
                              Withdraw
                            </p>
                          </div>
                        </MenuItem>
                        <MenuItem onClick={handleClose} disableRipple={true}>
                          <div
                            className="flex items-center gap-2 w-full"
                            onClick={() =>
                              navigate('/profile/my-bets', {
                                state: '/profile/my-bets',
                              })
                            }
                          >
                            <img
                              src="/images/icons/circle.svg"
                              className="w-[18px]"
                            />
                            <p className="2xl:text-16 text-14 font-semibold text-white flex-1">
                              Bet Details
                            </p>
                          </div>
                        </MenuItem>

                        <MenuItem onClick={handleLogout} disableRipple={true}>
                          <div className="flex items-center gap-2 w-full gradient-btn py-2 rounded-b-[4px]">
                            <p className="2xl:text-16 text-14 text-center font-semibold text-white flex-1">
                              Log Out
                            </p>
                          </div>
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="absolute top-10 right-0 z-50 w-[250px] bg-white rounded-lg p-3">
                    {/* <div className="relative mb-2">
                      <input
                        type="text"
                        className="w-full p-2 bg-[#DEDEDE] text-black text-14 border border-[#939BAB] rounded-lg"
                        placeholder="Search Events"
                      />
                      <span className="absolute top-[11px] right-2 text-18">
                        {reactIcons.search}
                      </span>
                    </div> */}
                    <button
                      onClick={() => {
                        navigate('/casino-table');
                        setIsOpen(false);
                      }}
                      // className="gradient-btn text-white btn-skew font-bold py-2 px-8 rounded mr-2 w-full border border-[#939BAB] mb-2"
                      className={`${
                        location.pathname === '/casino-table'
                          ? 'gradient-btn text-white'
                          : 'gradient-btn-2 text-black'
                      }  btn-skew font-bold py-2 px-9  mr-2 mb-2 w-full border border-[#939BAB]`}
                    >
                      <span>Casino</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/');
                        setIsOpen(false);
                      }}
                      // className="gradient-btn-2 text-black btn-skew font-bold py-2 px-8 mb-2 rounded mr-2 w-full border border-[#939BAB]"
                      className={`${
                        location.pathname === '/'
                          ? 'gradient-btn text-white'
                          : 'gradient-btn-2 text-black'
                      }  btn-skew font-bold py-2 px-9  mr-2 mb-2 w-full border border-[#939BAB]`}
                    >
                      <span>Sports</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/aviator');
                        setIsOpen(false);
                      }}
                      // className="gradient-btn-2 text-black btn-skew font-bold py-2 px-8 rounded mr-2 w-full border border-[#939BAB]"
                      className={`${
                        location.pathname === '/aviator'
                          ? 'gradient-btn text-white'
                          : 'gradient-btn-2 text-black'
                      }  btn-skew font-bold py-2 px-9  mr-2 mb-2 w-full border border-[#939BAB]`}
                    >
                      <span>Aviator</span>
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="download-now flex bg-[#202D3E] border-l border-white text-teal-800  font-bold py-2 font-inter items-center justify-center [clip-path:polygon(20%_0,100%_0%,100%_100%,0%_100%)] w-[135px]">
              <button>
                <img
                  className="w-[90px]"
                  src="/images/downloadImg.webp"
                  alt="app-download"
                />
              </button>
            </div>

            {/* <button className="block md:hidden ml-2" onClick={toggleMenu}>
              <span className="text-white text-24">{reactIcons.menuIcon}</span>
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
