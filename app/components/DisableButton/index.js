import React from 'react';
import { PropTypes } from 'prop-types';
const DisableButton = ({ btncolor }) => {
  return (
    <div
      className={` ${
        btncolor === 'pink'
          ? 'bg-[#d44a58] border-[#d44a58]'
          : btncolor === 'blue'
          ? 'bg-[#469dd3] border-[#469dd3]'
          : 'bg-neutral-400 mx-[0.15em]'
      } md:min-w-[45px] rounded-[4px] md:rounded-none flex-shrink-0 min-w-[35px] flex flex-col justify-center flex-1 relative z-0 text-center min-h-[44px] cursor-not-allowed pointer-events-none opacity-50 mx-[0.15em] my-0  py-[0.12em] border-2 px-[0.5em] `}
    >
      <span className="text-neutral-950 text-xl font-bold">-</span>
    </div>
  );
};
DisableButton.propTypes = {
  btncolor: PropTypes.any,
};
export default DisableButton;
//  bg-neutral-400
