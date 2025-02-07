import { PropTypes } from 'prop-types';
import React from 'react';
import DisableButton from '../DisableButton';

const PinkButton = ({ layPrize, laySize, onClick }) => {
  function intToString(num) {
    if (num < 1000) {
      return num;
    }
    var si = [
      { v: 1e3, s: 'K' },
      { v: 1e6, s: 'M' },
      { v: 1e9, s: 'B' },
      { v: 1e12, s: 'T' },
      { v: 1e15, s: 'P' },
      { v: 1e18, s: 'E' },
    ];
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].v) {
        break;
      }
    }
    return (
      (num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
      si[i].s
    );
  }

  return (
    <>
      {layPrize ? (
        <div
          onClick={onClick}
          className="w-[45px] flex-shrink-0 flex flex-col justify-center grow relative z-0 text-center min-h-[42px] cursor-pointer border-2 hover:border-[#d44a58] border-[rgb(255,181,189)]   bg-[rgb(255,181,189)] mx-[0.15em] my-0 px-[0.5em] py-[0.12em] flex-1"
        >
          <div className="text-[13px] text-[rgb(31,31,31)] text-center leading-[17px] font-semibold mb-[0.1em]">
            {layPrize || '-'}
          </div>
          <div className="text-[10px] text-center overflow-hidden whitespace-nowrap leading-[17px] text-ellipsis w-full text-[rgb(36,38,41)]">
            {laySize && layPrize ? intToString(laySize) : ''}
          </div>
        </div>
      ) : (
        <DisableButton btncolor={'pink'} />
      )}
    </>
  );
};
PinkButton.propTypes = {
  layPrize: PropTypes.number.isRequired,
  laySize: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PinkButton;
