import { DateRangePicker } from '@/components';
import { reactIcons } from '@/utils/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WalletTransaction = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full py-[10px]">
      <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full">
        <div className="flex justify-between 2xl:flex-row gap-2 2xl:gap-0 flex-col 2xl:items-center border-b border-b-[#E1E1E1] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => navigate(-1)}
                className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#757FC7] to-[#98A2F8] grid place-content-center text-12 cursor-pointer shadow-[0_0_25px_0_#150E4BB2]"
              >
                {reactIcons.leftChev}
              </span>
              <span className="font-inter font-bold text-primary-1300">
                Wallet Transfer
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Finances <span> &gt; </span>{' '}
              <span className="text-white">Wallet Transfer</span>
            </p>
          </div>
          <div className="bg-[#ECECEC] h-[52px] rounded-[4px] hidden md:flex justify-around 3xl:w-[415px] 2xl:w-[365px] w-[460px]">
            <DateRangePicker />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5  rounded-md w-full min-h-[450px]">
          <h5 className="font-medium text-18 mb-5">Platform Balance</h5>
          <div className="border-b border-gray-400 2xl:pb-2 mb-4">
            <div className="rounded-md p-3 bg-white flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img src="/images/icons/main_wallet.svg" className="w-[30px]" />
                <p className="text-16 font-medium text-black flex-1">
                  Main Wallet
                </p>
              </div>
              <div>
                <p className="text-16 font-medium text-[#45BF75] flex-1">
                  0.00
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10">
              <div className="rounded-md p-3 bg-white flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src="/images/icons/WacsIcon.svg" className="w-[30px]" />
                  <p className="text-16 font-medium text-black flex-1">
                    Casinos
                  </p>
                </div>
                <div>
                  <p className="text-16 font-medium text-[#45BF75] flex-1">
                    0.00
                  </p>
                </div>
              </div>
              <div className="rounded-md p-3 bg-white flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src="/images/icons/BtiIcon.svg" className="w-[30px]" />
                  <p className="text-16 font-medium text-black flex-1">
                    Sportsbook
                  </p>
                </div>
                <div>
                  <p className="text-16 font-medium text-[#45BF75] flex-1">
                    0.00
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="border bg-gradient-1 text-12 font-medium px-5 py-2 rounded-[4px]">
              Transfer All To main Wallet
            </button>
            <button className="w-[42px] h-[42px] rounded-[4px] border bg-gradient-to-b from-[#62696B] to-[#62696B00] grid place-content-center">
              {reactIcons.update}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTransaction;
