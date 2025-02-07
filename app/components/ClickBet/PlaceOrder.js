import { stakeList } from '@/utils/contants';
import { reactIcons } from '@/utils/icons';
import React, { useState } from 'react';

const PlaceOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="py-5">
      <div className="flex items-center max-w-sm ml-auto pr-5">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none text-22 text-white">
            {reactIcons.search}
          </div>
          <input
            type="text"
            id="search"
            className="bg-[#1C77FF] border border-gray-300 font-semibold text-white outline-none text-md rounded-lg block w-full pl-10 p-2 h-[44px] mt-[5px] font-inter"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            required
          />
        </div>
      </div>
      <div className="relative">
        <div className="z-10 p-5 h-full overflow-auto custom-scroll">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="w-full flex justify-between items-center">
                <ul
                  className="flex mb-0 list-none w-full flex-wrap flex-row justify-end border-b border-[#ffffff]"
                  role="tablist"
                >
                  <li className="-mb-px mr-2 last:mr-0 flex-auto text-center max-w-[120px] font-inter">
                    <a className="text-sm font-bold px-4 py-2 shadow-lg leading-normal flex items-center justify-center text-white ">
                      Bet Slip
                    </a>
                  </li>
                </ul>
              </div>
              <div className="relative flex flex-col min-w-0 break-words w-full mt-4 font-inter">
                <div className="w-full flex flex-col bg-white p-3 rounded">
                  <div className="border border-[#78BBFD] border-t-4 text-12 rounded mb-3">
                    <div className="flex items-center justify-between bg-[#A7D8FD] py-1 px-2 ">
                      <div>
                        <h3 className="text-[#203974] font-semibold">
                          Durdanto Dhaka
                        </h3>
                        <p className="text-[#35495E]">
                          Khulna Tigers v Durdanto Dha…
                        </p>
                      </div>
                      <div>
                        <p className="text-[#576471]">
                          MAX BET{' '}
                          <span className="text-[#203974]">:200,004</span>
                        </p>
                        <p className="text-[#576471]">
                          MAX MKT{' '}
                          <span className="text-[#203974]">:200,004</span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-white relative p-2">
                      <div className="flex items-center gap-5">
                        <div>
                          <label className="text-[#35495E] block">Odds</label>
                          <input
                            type="number"
                            className="bg-[#EDF0F7] max-w-[100px] h-8 p-2 outline-none rounded text-black"
                            placeholder="Odds"
                          />
                        </div>
                        <div>
                          <label className="text-[#35495E] block">Stake</label>
                          <input
                            type="number"
                            className="bg-[#EDF0F7] max-w-[100px] h-8 p-2 outline-none rounded text-black"
                            placeholder="Min:50.00"
                          />
                        </div>
                      </div>
                      <div className="absolute right-0 top-2 bg-[#DAEDFF] rounded-tl-md rounded-bl-md px-3 py-1 leading-[15px]">
                        <p className="text-[#35495E]">Profit</p>
                        <span className="text-[#219642]">0.00</span>
                      </div>
                      <ul className="flex items-center justify-center gap-1 px-7 py-5 flex-wrap">
                        {stakeList.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[100px] rounded h-8 cursor-pointer"
                          >
                            +{item.number}
                          </li>
                        ))}
                        <li className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[100px] rounded h-8 cursor-pointer">
                          Clear
                        </li>
                        <li className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[100px] rounded h-8 cursor-pointer">
                          Edit Stake
                        </li>
                      </ul>
                      <div className="bg-[#EDF0F7] p-2 flex items-center justify-between gap-4">
                        <button className="flex items-center justify-center border border-[#646468] text-[#687488] rounded gap-3 py-2 w-2/4">
                          <img
                            src="/images/place-order/trash.png"
                            alt="trash"
                            className="mr-1"
                          />
                          Cancel Order
                        </button>
                        <button className="flex items-center justify-center border border-[##bec5d0] text-white bg-[#bec5d0] rounded gap-3 py-2 w-2/4">
                          <img
                            src="/images/place-order/check.png"
                            alt="check"
                            className="mr-1"
                          />
                          Place Bet
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border border-[#FA7290] border-t-4 text-12 rounded mb-3">
                    <div className="flex items-center justify-between bg-[#FFD6D6] py-1 px-2 ">
                      <div>
                        <h3 className="text-[#203974] font-semibold">
                          Durdanto Dhaka
                        </h3>
                        <p className="text-[#35495E]">
                          Khulna Tigers v Durdanto Dha…
                        </p>
                      </div>
                      <div>
                        <p className="text-[#576471]">
                          MAX BET{' '}
                          <span className="text-[#203974]">:200,004</span>
                        </p>
                        <p className="text-[#576471]">
                          MAX MKT{' '}
                          <span className="text-[#203974]">:200,004</span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-white relative p-2">
                      <div className="flex items-center gap-5">
                        <div>
                          <label className="text-[#35495E] block">Odds</label>
                          <input
                            type="number"
                            className="bg-[#EDF0F7] max-w-[100px] h-8 p-2 outline-none rounded text-black"
                            placeholder="Odds"
                          />
                        </div>
                        <div>
                          <label className="text-[#35495E] block">Stake</label>
                          <input
                            type="number"
                            className="bg-[#EDF0F7] max-w-[100px] h-8 p-2 outline-none rounded text-black"
                            placeholder="Min:50.00"
                          />
                        </div>
                      </div>
                      <div className="absolute right-0 top-2 bg-[#FFDFE1] rounded-tl-md rounded-bl-md px-3 py-1 leading-[15px]">
                        <p className="text-[#35495E]">Liability</p>
                        <span className="text-[#219642]">0.00</span>
                      </div>
                      <ul className="flex items-center justify-center gap-1 px-7 py-5 flex-wrap">
                        {stakeList.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[100px] rounded h-8 cursor-pointer"
                          >
                            +{item.number}
                          </li>
                        ))}
                        <li className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[100px] rounded h-8 cursor-pointer">
                          Clear
                        </li>
                        <li className="flex items-center justify-center p-2 text-12 border border-[#8A9EC5] bg-[#D5D5D5] text-[#000000] w-[100px] rounded h-8 cursor-pointer">
                          Edit Stake
                        </li>
                      </ul>
                      <div className="bg-[#EDF0F7] p-2 flex items-center justify-between gap-4">
                        <button className="flex items-center justify-center border border-[#646468] text-[#687488] rounded gap-3 py-2 w-2/4">
                          <img
                            src="/images/place-order/trash.png"
                            alt="trash"
                            className="mr-1"
                          />
                          Cancel Order
                        </button>
                        <button className="flex items-center justify-center border border-[##bec5d0] text-white bg-[#bec5d0] rounded gap-3 py-2 w-2/4">
                          <img
                            src="/images/place-order/check.png"
                            alt="check"
                            className="mr-1"
                          />
                          Place Bet
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#EDF0F7] p-2 flex items-center justify-between gap-4 rounded">
                    <button className="flex items-center justify-center border border-[#7A818D] bg-[#7A818D] text-[#FFFFFF] rounded gap-3 py-2 w-2/4">
                      <img
                        src="/images/place-order/trash.png"
                        alt="trash"
                        className="mr-1"
                      />
                      Cancel All
                    </button>
                    <button className="flex items-center justify-center border border-[##bec5d0] text-white bg-[#bec5d0] rounded gap-3 py-2 w-2/4">
                      <img
                        src="/images/place-order/check.png"
                        alt="check"
                        className="mr-1"
                      />
                      Place All
                    </button>
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

export default PlaceOrder;
