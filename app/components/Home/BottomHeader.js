import { BottomHeaderOption, socialImageList } from '@/utils/contants';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BottomHeader = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  return (
    <div className="bg-[#CFCFCF] py-2 font-inter overflow-x-auto">
      <div className="flex justify-between items-center overflow-hidden min-w-[957px] md:min-w-[1208px]">
        <div>
          <button className="bg-[#3E3E3E] text-white text-16 bh-btn-skew font-bold p-[14px] md:py-[10px] md:px-8 rounded mr-2 relative left-[-6px] md:-top-1 top-2">
            <span>TOP GAMES</span>
          </button>
          {BottomHeaderOption &&
            BottomHeaderOption.map((items, index) => {
              return (
                <button
                  key={index}
                  onClick={() => navigate(items?.path)}
                  className={`md:mt-1 text-14 ${
                    currentPath === items?.path
                      ? //  ||
                        // (items?.path === '/in-play' ? currentPath === '/' : '')
                        'bg-[#1c77ff]'
                      : 'bg-black'
                  } text-white bh-btn-skew md:py-[10px] md:px-8 p-[5px_15px] rounded mr-2`}
                >
                  <span className="font-medium !flex items-center flex-col md:flex-row md:gap-[6px]">
                    <img
                      src={items?.icon}
                      alt="in-play"
                      className=" w-5 inline"
                    />{' '}
                    <span>{items?.name}</span>
                  </span>
                </button>
              );
            })}
        </div>
        <div className="bg-[#3E3E3E] px-3 pl-6 bh-right mt-1 md:mt-0">
          <div className="flex items-center justify-center gap-3 bh-right-child">
            <ul className="flex items-center justify-center gap-3 py-[11px] md:py-2">
              {socialImageList &&
                socialImageList.map((item, index) => (
                  <li key={index}>
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
                  </li>
                ))}
            </ul>
            <button className="border-l border-white flex items-center justify-center gap-3 text-white">
              <img
                src="/images/home/download.png"
                alt="download"
                className="ml-3 "
              />
              APP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;
