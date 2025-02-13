import {
  othersImageList,
  partnerImageList,
  paymentsImageList,
  socialImageList,
} from '@/utils/contants';
import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

const Footer = () => {
  const menu1 = [
    {
      id: 1,
      title: 'About Us',
    },
    {
      id: 2,
      title: 'FAQ',
    },
    {
      id: 3,
      title: 'Affiliate',
    },
    {
      id: 4,
      title: 'Blog',
    },
  ];

  const menu2 = [
    {
      id: 1,
      title: 'Terms & Conditions',
    },
    {
      id: 2,
      title: 'Responsible Gambling',
    },
    {
      id: 3,
      title: 'KYC Policy',
    },
    {
      id: 4,
      title: 'Self Exclusion Policy',
    },
  ];

  return (
    <>
      <div>
        <Accordion className="custom-accordian footer-accordion origin-center">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="text-center"
          >
            <span className="inline-block break-words">
              Yolo247 - Best Real Money Online Gaming Platform in India
            </span>
          </AccordionSummary>

          <AccordionDetails className="max-h-[300px] overflow-y-auto ml-4">
            <h2 className="text-20 font-bold mb-6 ">
              Yolo247 - Best Real Money Online Gambling Platform in India
            </h2>
            <p className="">
              Betting has never been as fun and rewarding as before, the way you
              are going to experience it on the Yolo247 platform. We, the best
              real money online gambling platform, provide a top-class casino
              and sports betting experience.
            </p>
            <p className=" mt-2">
              Our ever-growing happy users play more than 700 exciting and
              rewarding casino games while also betting on multiple sports. Get
              ready to dive into the world of casino and sports betting with us
              to get amazing experiences and rewards.
            </p>

            <h2 className="text-20 font-bold mt-4 mb-4">
              Yolo247 - Your Ultimate Online Betting Partner
            </h2>
            <p className="">
              Yolo247 is the best real money online gambling platform, offering
              exciting casino games and multiple sports betting options. Among
              all the best Indian betting sites, Yolo247 stands out for its
              online gambling real money features.
            </p>

            <p className="mt-4 ">
              We, the best gambling site in India, offer casino real money games
              in India under the following categories:
              <ul className="list-disc pl-6 mt-2">
                <li>Card games</li>
                <li>Wheel games</li>
                <li>Dice games</li>
                <li>Crash games</li>
                <li>Lot games</li>
              </ul>
            </p>

            <p className="mt-4">
              Under each category, there are multiple games that you can try and
              win real cash. Among all trusted Indian betting sites, Yolo247 has
              an edge, as it offers some of the most popular sports for betting.
            </p>

            <p className="mt-4">
              Yolo247 betting online platform is also quite popular because of
              instant withdrawals and multiple deposit options. With Yolo247
              instant withdrawals, you can get your winnings within half an hour
              in your account.
            </p>

            <button className="underline text-orange-500 cursor-pointer hover:text-white">
              Download Now
            </button>

            <h2 className="text-20 font-bold mt-4">
              Why is Yolo247 Your Best Choice?
            </h2>

            <p className="mt-4">
              Yolo247 is the best real money online gambling site for many
              reasons, and the following are some of the reasons why you should
              pick Yolo247 as your online casino and sports betting partner:
            </p>

            <h3 className="mt-4 font-bold text-16">imple & Easy Login</h3>

            <p className="mt-4">
              he magic of online gaming and sports betting lies in their
              simplicity, and our straightforward navigation makes the gaming
              experience memorable. Our website and app are dedicated to
              understanding players’ needs and providing them with a rewarding
              casino and sports betting experience.
            </p>
            <p className="mt-4">
              The easy and smooth login lets the users play their favourite
              games in no time. All you need to do is enter your credentials and
              click on ‘Login’ to get to your favourite casino games and sports
              betting options.
            </p>
          </AccordionDetails>
        </Accordion>
      </div>
      <footer className="bg-black text-white py-8 font-inter pb-20 md:pb-0">
        <div className="px-2 sm:px-3 md:px-5 mx-auto flex flex-col sm:flex-row justify-between items-center mb-7 md:mb-5">
          <div className="flex items-center justify-center w-full gap-[10px] sm:gap-10 md:gap-20 lg:gap-40">
            <div className="text-center">
              <p className="font-bold text-14 md:text-16">Principal Sponsors</p>
              <div className="flex items-center justify-center">
                <img
                  src="/footer/knight-rider.png"
                  alt="knight-rider"
                  className="w-[80px] mx-auto md:w-[130px]"
                />
                <img
                  src="/footer/dubai-capital.png"
                  alt="dubai-capital"
                  className="w-[78px] mx-auto md:w-[110px]"
                />
              </div>
            </div>
            <div>
              <img src="/footer/line.png" alt="line" />
            </div>
            <div className="text-center self-start">
              <p className="font-bold mb-3 md:mb-5 text-14 md:text-16">
                Awards And Recognition
              </p>
              <div className="">
                <img
                  src="/footer/award.png"
                  alt="award"
                  className="w-[110px] mx-auto md:w-40"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 sm:px-3 md:px-5 mx-auto text-center mb-7 md:mb-5">
          <p className="font-bold text-14 md:text-16">Gaming Partners</p>
          <div className="flex items-center justify-center flex-wrap md:flex-nowrap gap-[0_10px] md:gap-4 -mt-3 md:mt-0">
            {partnerImageList.map((item, index) => (
              <div key={index} className="max-w-[60px] md:w-20">
                <img
                  src={item.url}
                  alt={item.url}
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="px-2 sm:px-3 md:px-5 mx-auto text-center mb-7 md:mb-5">
          <p className="font-bold mb-3 text-14 md:text-16">Payment Methods</p>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {paymentsImageList.map((item, index) => (
              <div key={index} className="sm:w-[55px] w-[65px] md:w-20">
                <img
                  src={item.url}
                  alt={item.url}
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="px-2 sm:px-3 md:px-5 mx-auto text-center mb-7 md:mb-5">
          <p className="font-bold mb-2 md:mb-3 text-14 md:text-16">
            Connect With Us
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {socialImageList.map((item, index) => (
              <div key={index}>
                {item.path ? (
                  <Link to={item.path} target="_blank">
                    <img
                      src={item.url}
                      alt={item.url}
                      className="w-8 md:w-7 object-contain"
                    />
                  </Link>
                ) : (
                  <img
                    src={item.url}
                    alt={item.url}
                    className="w-8 md:w-7 object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="px-2 sm:px-3 md:px-5 mx-auto text-center mb-7 md:mb-5">
          <div className="flex items-center justify-center md:gap-4 flex-col md:flex-row">
            <div className="flex items-center gap-2 md:gap-4">
              {othersImageList.map((item, index) => (
                <div key={index}>
                  <img
                    src={item.url}
                    alt={item.url}
                    className="w-20 h-[45px] md:h-auto object-contain"
                  />
                </div>
              ))}
            </div>
            <p className="text-14 md:text-16 flex-1 md:flex-none">
              Copyright 2021-2024. All rights reserved
            </p>
          </div>
        </div>

        <div className="px-2 sm:px-3 md:px-5 mx-auto text-center flex items-center justify-center mb-7 md:mb-5">
          <img
            src="/footer/gaming.png"
            alt="gaming"
            className="w-[128px] md:w-40"
          />
        </div>
        <div className="px-7 md:px-5 mx-auto mt-8 py-4 text-center">
          <p className="lg:text-md text-sm text-white font-extralight hidden md:block">
            <a href="#">Terms & Conditions</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">Responsible Gambling</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">Privacy Policy</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">KYC Policy</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">Self Exclusion Policy</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">Anti-Money</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">Laundering Program</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">About Us</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">FAQ</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">Affiliate</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="#">Blog</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">News</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">Press</a>
          </p>
          <div className="flex md:hidden justify-between">
            <div className="flex-1">
              {menu1.map((item) => (
                <Link
                  key={item.id}
                  className="text-14 md:text-16 block text-left font-light"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="flex-1">
              {menu2.map((item) => (
                <Link
                  key={item.id}
                  className="text-14 md:text-16 block text-left font-light"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
