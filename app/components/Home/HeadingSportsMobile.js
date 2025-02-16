import { sportsMobile } from '@/utils/contants';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeadingSportsMobile = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <div className="flex items-center justify-between -ml-2 -mr-2 border-t-2 border-[#3431BB]">
      {sportsMobile &&
        sportsMobile.map((items, index) => {
          return (
            <button
              key={index}
              onClick={() => navigate(items?.path)}
              className={`md:mt-1 text-14 border-x border-white ${
                currentPath === items?.path ? 'bg-gradient-2' : 'bg-black'
              } text-white bh-btn-skew-new  w-full`}
            >
              <span className="font-medium !flex items-center mt-1 w-full flex-col md:flex-row md:gap-[6px]">
                <img src={items?.icon} alt="in-play" className=" w-4 inline" />{' '}
                <span className="text-12">{items?.name}</span>
              </span>
            </button>
          );
        })}
    </div>
  );
};

export default HeadingSportsMobile;
