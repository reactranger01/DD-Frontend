import React, { useState } from 'react';
import { HeroSectionSlider } from '@/components';
import { buttonData, socialImageList } from '@/utils/contants';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [activeButton, setActiveButton] = useState('casinoButton');
  const [imagesList, setImageList] = useState([
    { imageUrl: '/images/casino-slide1.jpg', path: '/casino-table/all/0' },
    { imageUrl: '/images/casino-slide2.jpg', path: '/casino-table/all/0' },
    { imageUrl: '/images/casino-slide3.jpg', path: '/casino-table/all/0' },
  ]);
  const navigate = useNavigate();

  // Function to handle button click
  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setImageList(
      buttonId === 'sportsButton'
        ? [
            { imageUrl: '/images/sports-slide1.jpg', path: '/cricket' },
            { imageUrl: '/images/sports-slide3.jpg', path: '/football' },
            { imageUrl: '/images/sports-slide2.png', path: '/tennis' },
          ]
        : buttonId === 'casinoButton'
        ? [
            {
              imageUrl: '/images/casino-slide1.jpg',
              path: '/casino-table/all/0',
            },
            {
              imageUrl: '/images/casino-slide2.jpg',
              path: '/casino-table/all/0',
            },
            {
              imageUrl: '/images/casino-slide3.jpg',
              path: '/casino-table/all/0',
            },
          ]
        : buttonId === 'aviatorButton'
        ? [
            { imageUrl: '/images/aviator-slide1.jpg', path: '/aviator' },
            { imageUrl: '/images/aviator-slide2.png', path: '/aviator' },
            { imageUrl: '/images/aviator-slide3.jpg', path: '/aviator' },
          ]
        : buttonId === 'bonusButton'
        ? [
            { imageUrl: '/images/aviator-slide1.jpg', path: '/aviator' },
            { imageUrl: '/images/aviator-slide2.png', path: '/aviator' },
            { imageUrl: '/images/aviator-slide3.jpg', path: '/aviator' },
          ]
        : [
            {
              imageUrl: '/images/casino-slide1.jpg',
              path: '/casino-table/all/0',
            },
            {
              imageUrl: '/images/casino-slide2.jpg',
              path: '/casino-table/all/0',
            },
            {
              imageUrl: '/images/casino-slide3.jpg',
              path: '/casino-table/all/0',
            },
          ],
    );
  };

  return (
    <div className="herosection-image h-[560px] w-full flex flex-col">
      <div className="flex w-full gap-4 justify-around items-center pt-7 mb-4">
        <div className="flex flex-col gap-1 text-white bg-black rounded-r-20">
          {buttonData &&
            buttonData.map((button) => (
              <button
                key={button.id}
                className={`flex flex-col justify-center items-center w-[66px] h-[76px] rounded-r-md leading-4 relative ${
                  activeButton === button.id
                    ? 'bg-gradient-1'
                    : 'bg-primary-1400'
                }`}
                onClick={() => handleButtonClick(button.id)}
              >
                <img
                  src={button.imageUrl}
                  className="!max-w-[35px]"
                  alt="line"
                />
                {button.label}
                {activeButton === button.id && (
                  <img
                    className="absolute top-1/2 transform -translate-y-1/2 right-[-10px] z-10"
                    src="/images/polygon.png"
                    alt="polygon"
                  />
                )}
              </button>
            ))}
        </div>

        <div className="flex flex-col w-full flex-1 gap-2">
          {imagesList &&
            imagesList.map((image, index) => (
              <div
                key={index}
                className="h-[122px] w-full border rounded-bl-none rounded-2xl overflow-hidden border-white"
              >
                <img
                  src={image.imageUrl}
                  onClick={() => navigate(image.path)}
                  className="center-img"
                  alt={`Image ${index + 1}`}
                />
              </div>
            ))}
        </div>
        <div className="w-[40px] h-[280px] flex flex-col gap-3 items-center justify-center pl-2 rounded-l-[15px] border border-r-0 bg-[#292929]  border-white">
          {/* Social icons */}
          {socialImageList.map((icon, index) => (
            <div key={index}>
              {icon.path ? (
                <Link to={icon.path}>
                  <img
                    src={icon.url}
                    alt=""
                    className="w-8 md:w-7 object-contain rounded-r-[6px]"
                  />
                </Link>
              ) : (
                <img
                  src={icon.url}
                  alt=""
                  className="w-8 md:w-7 object-contain rounded-r-[6px]"
                />
              )}
            </div>
          ))}
          <div className="w-[80%] border-t border-white"></div>
          <div className="flex flex-col justify-center items-center -mt-2">
            <img src="/images/home/download.png" />
            <p className="font-semibold text-white text-[11px]">APP</p>
          </div>
        </div>
      </div>

      <div className="">
        <HeroSectionSlider />
      </div>
    </div>
  );
};

export default HeroSection;
