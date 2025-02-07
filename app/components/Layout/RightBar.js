import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Link } from 'react-router-dom';
import { Bonus, quickLinks } from '@/utils/contants';
import PropTypes from 'prop-types';
const RightBar = ({ className, card }) => {
  return (
    <div
      className={`${className} right-bar lg:flex-col flex-row flex w-full xl:ml-[10px] `}
    >
      <Box sx={{ display: 'flex' }}>
        <Drawer variant="permanent" anchor="right">
          <div
            className={`border border-white rounded-[13px] font-inter font-semibold mb-3 mx-4 md:mx-0 ${card}`}
          >
            <div className="not-italic font-semibold text-[13px] flex items-center tracking-[0.03em] bg-[#353535] capitalize text-white backdrop-contrast-50 px-[15px] py-4 rounded-[13px_13px_0px_0px]">
              <h4>Quick Links</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 justify-around w-full flex-wrap pt-[19px] pb-2 px-2">
              {quickLinks.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center"
                >
                  <Link to={item.link} className="bg-white p-3 rounded-xl mb-1">
                    <img src={item.icon} alt={item.name} />
                  </Link>
                  <label className="text-white text-12">{item.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div
            className={`border border-white rounded-[13px] font-inter font-semibold mx-4 md:mx-0 ${card}`}
          >
            <div className="not-italic font-semibold text-[13px] flex items-center tracking-[0.03em] bg-[#353535] capitalize text-white backdrop-contrast-50 px-[15px] py-4 rounded-[13px_13px_0px_0px]">
              <h4>Bonus</h4>
            </div>
            <ul>
              {Bonus.map((item, index) => (
                <li key={index}>
                  <div className="hover:bg-[#f2f2f257] flex gap-1 items-center cursor-pointer py-2">
                    <div>
                      <img src={item.icon} alt={item.icon} />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-white font-medium text-12 leading-4">
                        {item.name}
                      </p>
                      <span className="text-white text-12 leading-4">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="not-italic justify-center text-[13px] flex items-center tracking-[0.03em] progress-btn capitalize text-white backdrop-contrast-50 px-[15px] py-4 rounded-[0px_0px_13px_13px]">
              <h4>Check Your Bonus Progress</h4>
            </div>
          </div>
        </Drawer>
      </Box>
    </div>
  );
};
RightBar.propTypes = {
  className: PropTypes.string.isRequired, // Define PropTypes
  card: PropTypes.string.isRequired, // Define PropTypes
};
export default RightBar;
