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
        <Accordion className="custom-accordian footer-accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Online Betting in India
          </AccordionSummary>
          <AccordionDetails>
            <p className="text-14 md:text-16">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
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
