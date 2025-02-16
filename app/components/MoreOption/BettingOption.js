import { useMediaQuery } from '@mui/material';
import { PropTypes } from 'prop-types';
import React from 'react';

const BettingOption = ({
  title,
  heading1,
  heading2,
  handleClick,
  showIcon,
}) => {
  const isMobile = useMediaQuery('(max-width : 768px)');
  return (
    <>
      {isMobile ? (
        <div className=" text-[11px] font-[bold] flex  uppercase tracking-[0.66px] justify-between text-white shadow-[rgba(0,0,0,0.1)_0px_3px_5px] border-b-[none] bg-[#dde1e7]">
          <div className="skew-x-[20deg] -ml-5 flex-center text-white bg-black w-[220px]">
            <p className="skew-x-[-20deg] font-sans">{title}</p>
          </div>
          <div className="z-[99] cursor-pointer px-7 md:hidden flex justify-center items-center">
            <div
              onClick={handleClick}
              className="flex justify-center items-center w-[25px] h-[25px]"
            >
              <span className="text-transparent inline-block h-full w-full">
                <img
                  src={
                    showIcon
                      ? '/images/more-option/minus.webp'
                      : '/images/more-option/plus.webp'
                  }
                  height="100%"
                  width="100%"
                />
              </span>
            </div>
          </div>
          <div className="flex basis-[60%]  justify-center gap-5 md:pl-[25px] pr-[15px] md:pr-0 relative min-w-0 p-0">
            <div
              className={`w-[16.01%] h-10 flex  items-center justify-center tracking-[0.07em] capitalize text-[13px] ${
                heading1 === 'No'
                  ? 'text-[rgb(224,60,60)]'
                  : 'text-[rgb(3,117,204)]'
              } mr-px px-2.5 py-[5px] font-inter font-semibold`}
            >
              {heading1}
            </div>
            <div
              className={`w-[16.01%] h-10 flex items-center justify-center tracking-[0.07em] capitalize text-[13px] ${
                heading2 === 'Yes'
                  ? 'text-[rgb(3,117,204)]'
                  : 'text-[rgb(224,60,60)]'
              } ml-px px-2.5 py-[5px] font-inter font-semibold`}
            >
              {heading2}
            </div>
          </div>
          <div className="z-[99] cursor-pointer justify-center items-center hidden md:flex ">
            <div
              onClick={handleClick}
              className="flex justify-center items-center w-[25px] h-[25px]"
            >
              <span className="text-transparent inline-block h-full w-full">
                <img
                  src={
                    showIcon
                      ? '/images/more-option/minus.webp'
                      : '/images/more-option/plus.webp'
                  }
                  height="100%"
                  width="100%"
                />
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className=" text-[11px] font-[bold] flex  uppercase tracking-[0.66px] justify-between text-white shadow-[rgba(0,0,0,0.1)_0px_3px_5px] border-b-[none] bg-[#dde1e7]">
          <div className="head-button md:basis-[40%] basis-[60%]">
            <div className="flex items-center tracking-[0.07em] uppercase text-white font-medium text-xs pl-5">
              <button className="bg-transparent cursor-pointer shrink-0 text-sm flex items-center justify-center opacity-100 transition-opacity duration-[0.15s] ease-[ease-in] delay-[0s] mx-0 my-[0.2em] p-0 border-0">
                <div
                  name="star-red-inactive"
                  className="flex justify-center items-center w-[1.25em] h-[1.25em] shrink-0"
                >
                  <span className="text-transparent inline-block h-full w-full">
                    <img
                      src="/images/icons/star-yellow.png"
                      height="100%"
                      width="100%"
                    />
                  </span>
                </div>
              </button>
              <div className="ml-[10px] font-inter text-[11px] md:text-[12px] ">
                {title}
              </div>
            </div>
          </div>
          <div className="z-[99] cursor-pointer pl-10 md:hidden flex justify-center items-center">
            <div
              onClick={handleClick}
              className="flex justify-center items-center w-[25px] h-[25px]"
            >
              <span className="text-transparent inline-block h-full w-full">
                <img
                  src={
                    showIcon
                      ? '/images/more-option/minus.webp'
                      : '/images/more-option/plus.webp'
                  }
                  height="100%"
                  width="100%"
                />
              </span>
            </div>
          </div>
          <div className="flex basis-[60%]  justify-center gap-5 md:pl-[25px] pr-[15px] md:pr-0 relative min-w-0 p-0">
            <div
              className={`w-[16.01%] h-10 flex  items-center justify-center tracking-[0.07em] capitalize text-[13px] ${
                heading1 === 'No'
                  ? 'text-[rgb(224,60,60)]'
                  : 'text-[rgb(3,117,204)]'
              } mr-px px-2.5 py-[5px] font-inter font-semibold`}
            >
              {heading1}
            </div>
            <div
              className={`w-[16.01%] h-10 flex items-center justify-center tracking-[0.07em] capitalize text-[13px] ${
                heading2 === 'Yes'
                  ? 'text-[rgb(3,117,204)]'
                  : 'text-[rgb(224,60,60)]'
              } ml-px px-2.5 py-[5px] font-inter font-semibold`}
            >
              {heading2}
            </div>
          </div>
          <div className="z-[99] cursor-pointer justify-center items-center hidden md:flex ">
            <div
              onClick={handleClick}
              className="flex justify-center items-center w-[25px] h-[25px]"
            >
              <span className="text-transparent inline-block h-full w-full">
                <img
                  src={
                    showIcon
                      ? '/images/more-option/minus.webp'
                      : '/images/more-option/plus.webp'
                  }
                  height="100%"
                  width="100%"
                />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
BettingOption.propTypes = {
  title: PropTypes.string.isRequired,
  heading1: PropTypes.string.isRequired,
  heading2: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  showIcon: PropTypes.bool.isRequired,
};
export default BettingOption;
