import React from 'react';

const BannerOption = () => {
  return (
    <div className="p-5">
      <div className="relative">
        <div className="z-10 h-full overflow-auto custom-scroll">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="w-full flex justify-between items-center">
                <ul
                  className="flex mb-0 list-none w-full flex-wrap flex-row justify-end border-b border-[#ffffff] gradient-bg h-[62px]"
                  role="tablist"
                >
                  <li className="-mb-px mr-2 last:mr-0 flex-auto text-center max-w-[120px] font-inter flex items-center justify-center">
                    <a className="text-sm font-bold px-4 py-2 pr-0 shadow-lg leading-normal flex items-center justify-center text-white ">
                      Bet Slip
                    </a>
                  </li>
                </ul>
              </div>
              <div className="relative flex flex-col min-w-0 break-words w-full mt-4 font-inter">
                <div className="w-full flex flex-col pb-8">
                  <div className="w-full flex flex-row items-center h-[470px] border border-white rounded-md overflow-hidden">
                    <img src="/images/home/ball.jpg" alt="ball" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerOption;
