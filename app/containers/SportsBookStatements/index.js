import { DateRangePicker } from '@/components';
import { reactIcons } from '@/utils/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SportsBookStatements = () => {
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
                Sportsbook Statement
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Bet Details <span> &gt; </span>{' '}
              <span className="text-white">Sportsbook Statement</span>
            </p>
          </div>
          <div className="bg-[#ECECEC] h-[52px] rounded-[4px] hidden md:flex justify-around 3xl:w-[415px] 2xl:w-[365px] w-[460px]">
            <DateRangePicker />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5  rounded-md w-full min-h-[450px]">
          <div className="tbl-wrapper">
            <table className="common-tbl 2xl:!min-w-[975px] !min-w-[920px]">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Ref ID</th>
                  <th>Stake</th>
                  <th>Win/Loss</th>
                  <th>Commission</th>
                  <th>Game</th>
                  <th>Status</th>
                  <th>Placed Time</th>
                  <th>Settled Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* <td>Provider</td>
                  <td>Ref ID</td>
                  <td>Stake</td>
                  <td>Win/Loss</td>
                  <td>Commission</td>
                  <td>Game</td>
                  <td>Status</td>
                  <td>Placed Time</td>
                  <td>Settled Time</td> */}
                </tr>
                <tr>
                  <td colSpan={9}>
                    <p className="text-center py-5 text-14"> No Match Found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsBookStatements;
