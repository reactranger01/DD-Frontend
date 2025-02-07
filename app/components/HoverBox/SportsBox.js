import { isLoggedIn } from '@/utils/apiHandlers';
import { PropTypes } from 'prop-types';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SportsBox = ({ isHovered }) => {
  const isLogin = isLoggedIn();
  const [isInside, setIsInside] = useState(false);
  const navigate = useNavigate();
  const playerList = [
    {
      id: 1,
      image: '/images/dhoni.png',
      name: 'CRICKET',
      path: '/cricket',
    },
    {
      id: 1,
      image: '/images/ronaldo.png',
      name: 'FOOTBALL',
      path: '/football',
    },
    {
      id: 1,
      image: '/images/mirza.png',
      name: 'TENNIS',
      path: '/tennis',
    },
  ];
  return (
    <div
      className={`${
        isHovered || isInside ? 'block' : 'hidden'
      } absolute z-[999] top-[45px] left-0 right-0`}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <div
        className={`backdrop-blur-md bg-white/30  shadow-lg min-h-[378px] max-h-[378px] overflow-hidden ${
          isLogin ? 'mt-6' : 'mt-3'
        }`}
      >
        <div className="flex items-center w-full min-h-[378px] max-h-[378px]">
          <div
            className="w-[25%] h-[378px] p-7 flex items-center"
            style={{ backgroundImage: 'url("/images/subMenuLeftBg.png")' }}
          >
            <ul className="flex flex-col gap-8 text-white text-22 w-full">
              {playerList.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    navigate(item.path), setIsInside(false);
                  }}
                >
                  <Link className="block border-b border-white border-dashed pb-8 cursor-pointer">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[75%] p-3">
            <div className="grid grid-cols-3 gap-4 text-white relative">
              {playerList.map((item, index) => (
                <div key={index} className="text-center">
                  <img
                    src={item.image}
                    alt="img"
                    onClick={() => {
                      navigate(item.path), setIsInside(false);
                    }}
                    className={`w-[180px] mx-auto mb-4 ${
                      item.name === 'FOOTBALL' ? 'w-[250px]' : 'w-[180px]'
                    } ${item.name === 'TENNIS' ? 'w-[170px]' : 'w-[180px]'}`}
                  />
                  <h1 className="text-26 text-white mb-3 font-bold">
                    {item.name}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
SportsBox.propTypes = {
  isHovered: PropTypes.bool,
};
export default SportsBox;
