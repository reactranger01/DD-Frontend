import { isLoggedIn } from '@/utils/apiHandlers';
import { PropTypes } from 'prop-types';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AviatorBox = ({ isHovered }) => {
  const isLogin = isLoggedIn();
  const [isInside, setIsInside] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className={`${
        isHovered || isInside ? 'block' : 'hidden'
      } absolute z-[999] top-[45px] left-0 right-0 `}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <div
        className={`backdrop-blur-md bg-cover bg-no-repeat bg-white/30 p-4 shadow-lg min-h-[400px] max-h-[400px] overflow-y-auto px-20 flex flex-col justify-end items-start ${
          isLogin ? 'mt-6' : 'mt-3'
        }`}
        style={{ backgroundImage: 'url("/images/aviator.jpg")' }}
      >
        <h1 className="text-26 text-white mb-3 font-bold">AVIATOR</h1>
        <button
          onClick={() => {
            navigate('/aviator'), setIsInside(false);
          }}
          className="md:mt-1 text-14 bg-black text-white bh-btn-skew md:py-[10px] md:px-8 p-[5px_15px] rounded mr-2"
        >
          <span className="font-medium !flex items-center flex-col md:flex-row md:gap-[6px]">
            Play Now
          </span>
        </button>
      </div>
    </div>
  );
};
AviatorBox.propTypes = {
  isHovered: PropTypes.bool,
  content: PropTypes.string,
};
export default AviatorBox;
