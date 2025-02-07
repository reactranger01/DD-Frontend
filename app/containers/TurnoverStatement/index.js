import { DateRangePicker } from '@/components';
import { reactIcons } from '@/utils/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TurnoverStatement = () => {
  const tabMenu = [
    {
      id: 'Exchange',
      title: 'Exchange',
      earning: 0,
    },
    {
      id: 'Casino',
      title: 'Casino',
      earning: 0,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabMenu[0].id);
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
                Turnover Statement
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Bet Details <span> &gt; </span>{' '}
              <span className="text-white">Turnover Statement</span>
            </p>
          </div>
          <div className="bg-[#ECECEC] h-[52px] rounded-[4px] hidden md:flex justify-around 3xl:w-[415px] 2xl:w-[365px] w-[460px]">
            <DateRangePicker />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5  rounded-md w-full min-h-[450px]">
          <div className="w-full min-h-[400px] bg-[#EDEDED] rounded-lg p-3 tabber flex justify-between flex-col md:flex-row">
            <div className="w-full md:w-[211px] tabber-menu">
              <div className="w-full 2xl:text-16 text-[15px] 2xl:p-[10px] p-[7px] font-semibold text-black bg-white text-center rounded-lg shadow-[0_0_6px_0_#1C77FF5E] mb-4">
                Turn Over Details
              </div>
              <div className="w-full 2xl:text-[15px] text-14 2xl:p-[10px] p-[7px] font-semibold text-black gradient-btn text-center rounded-lg shadow-[0_0_6px_0_#1C77FF5E] flex items-center justify-between mb-3">
                <span>Total</span>
                <span className="text-white">0.00</span>
              </div>
              <ul>
                {tabMenu.map((item) => (
                  <li
                    key={item}
                    className={`w-full 2xl:text-[15px] text-14 2xl:p-[10px] p-[7px] font-semibold text-black text-center rounded-lg shadow-[0_0_6px_0_#1C77FF5E] flex items-center justify-between cursor-pointer mb-[2px]  ${
                      item.id == activeTab ? 'bg-primary-1200' : 'bg-white'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span>{item.title}</span>
                    <span className="text-black">{item.earning}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tabber-content mt-3 md:mt-0 w-full md:w-[calc(100%-225px)]">
              {(activeTab == tabMenu[0].id || activeTab == tabMenu[1].id) && (
                <div className="tbl-wrapper">
                  <table className="common-tbl !min-w-[600px]">
                    <thead>
                      <tr className="shadow-[0_0_6px_0_#1C77FF5E]">
                        <th className="!rounded-tl-lg !rounded-bl-lg">
                          Event Name
                        </th>
                        <th>Win / Loss</th>
                        <th>Turnover</th>
                        <th>Date</th>
                        <th className="!rounded-tr-lg !rounded-br-lg">
                          Settle Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                      <td>Event Name</td>
                      <td>Win / Loss</td>
                      <td>Turnover</td>
                      <td>Date</td>
                      <td>Settle Time</td>
                    </tr> */}
                      <tr>
                        <td colSpan={5}>
                          <p className="text-center py-5 text-14">
                            {' '}
                            No Match Found
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnoverStatement;
