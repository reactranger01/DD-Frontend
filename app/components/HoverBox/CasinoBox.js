import { isLoggedIn } from '@/utils/apiHandlers';
import { PropTypes } from 'prop-types';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CasinoBox = ({ isHovered }) => {
  const isLogin = isLoggedIn();
  const [isInside, setIsInside] = useState(false);
  const navigate = useNavigate();
  const playerList = [
    {
      id: 1,
      image: '/images/game/baccarat.jpg',
      path: '/casino-table/baccarat/1',
    },
    {
      id: 2,
      image: '/images/game/lucky7.jpg',
      path: '/casino-table/lucky/2',
    },
    // {
    //   id: 3,
    //   image: '/images/game/teenpatti.jpg',
    //   path: '/casino-table/teen/3',
    // },
    // {
    //   id: 4,
    //   image: '/images/game/anderbahar.jpg',
    //   path: '/casino-table/andarr/4',
    // },
    // {
    //   id: 5,
    //   image: '/images/game/openteenpatti.jpg',
    //   path: '/casino-table/teen/5',
    // },
    {
      id: 6,
      image: '/images/game/20poker.jpg',
      path: '/casino-table/poker/6',
    },
    // {
    //   id: 7,
    //   image: '/images/game/32cards.jpg',
    //   path: '/casino-table/cards/7',
    // },
    // {
    //   id: 8,
    //   image: '/images/game/rullet.jpg',
    //   path: '/casino-table/rulet/8',
    // },
    // {
    //   id: 9,
    //   image: '/images/game/amarakbar.jpg',
    //   path: '/casino-table/akbar/9',
    // },
    {
      id: 10,
      image: '/images/game/20dragon.jpg',
      path: '/casino-table/dragon/10',
    },
    {
      id: 11,
      image: '/images/game/dragontiger.jpg',
      path: '/casino-table/dragon/11',
    },
    {
      id: 12,
      image: '/images/game/bollywood.jpg',
      path: '/casino-table/blackjack/12',
    },
    {
      id: 13,
      image: '/images/game/aviator.jpg',
      path: '/casino-table/aviator/13',
    },
    // {
    //   id: 14,
    //   image: '/images/game/matka.jpg',
    //   path: '/casino-table/worli/14',
    // },
    {
      id: 15,
      image: '/images/game/casinomerer.jpg',
      path: '/casino-table/casino/15',
    },
    // {
    //   id: 16,
    //   image: '/images/game/20teenpatti.jpg',
    //   path: '/casino-table/teen/16',
    // },
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
        className={`backdrop-blur-md bg-white/30 p-4 shadow-lg min-h-[400px] max-h-[400px] overflow-y-auto px-20 ${
          isLogin ? 'mt-6' : 'mt-3'
        }`}
      >
        <div className="w-full p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 text-white relative">
            {playerList.map((item, index) => (
              <div
                onClick={() => {
                  navigate(item?.path), setIsInside(false);
                }}
                key={index}
                className="bg-yellow casino-btn relative"
              >
                <img src={item?.image} alt="img" />
                <div className="absolute left-0 top-0 bottom-0 right-0 flex items-center justify-center bg-[#2f32369c] play-btn">
                  {/* <button className=" text-white btn-skew border border-[#CB9640] bg-[#2f3236b3] font-bold py-2 px-6 hidden md:inline">
                  <span>Play</span>
                </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
CasinoBox.propTypes = {
  isHovered: PropTypes.bool,
  content: PropTypes.string,
};
export default CasinoBox;
