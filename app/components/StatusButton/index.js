import { PropTypes } from 'prop-types';
import React from 'react';

const StatusButton = ({ status }) => {
  return (
    <>
      {' '}
      <div className="flex items-center gap-2 relative w-full ">
        <div className="w-[45px] flex flex-col justify-center grow relative z-0 text-center min-h-[42px] cursor-pointer border-2 hover:border-[#d44a58] border-[rgb(255,181,189)]  bg-[rgb(255,181,189)] mx-[0.15em] my-0 px-[0.5em] py-[0.12em]">
          <div className="text-[13px]  text-center leading-[17px] font-semibold mb-[0.1em]"></div>
          <div className="text-[10px] text-center overflow-hidden whitespace-nowrap leading-[17px] text-ellipsis w-full "></div>
        </div>
        <div className="w-[45px] flex flex-col justify-center grow relative z-0 text-center min-h-[42px] cursor-pointer border-2 hover:border-[#469dd3] border-[rgb(130,207,255)]   bg-[rgb(130,207,255)] mx-[0.15em] my-0 px-[0.5em] py-[0.12em]">
          <div className="text-[13px]  text-center leading-[17px] font-semibold mb-[0.1em]"></div>
          <div className="text-[10px] text-center overflow-hidden whitespace-nowrap leading-[17px] text-ellipsis w-full "></div>
        </div>
        <div
          className={`absolute top-0 left-0 w-full h-full z-10 ${
            status === 'WINNER'
              ? 'bg-green-700'
              : status === 'LOSER'
              ? 'bg-red-700'
              : 'bg-[rgba(0,0,0,0.5)]'
          }  grid place-content-center font-semibold text-white text-16`}
        >
          {status}
        </div>
      </div>
    </>
  );
};
StatusButton.propTypes = {
  status: PropTypes.number.isRequired,
};

export default StatusButton;
