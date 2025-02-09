// import {
//   DateRangePicker,
//   SelectBox,
// } from '@/components';
import Pagination from '@/components/Pagination';
import DatePicker from 'react-datepicker';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
// import { numberWithCommas } from '@/utils/numberWithCommas';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { numberWithDigit } from '@/utils/numberWithDigit';
import { Empty } from 'antd';
import { numberWithCommas } from '@/utils/numberWithCommas';
import RunPosition from '@/components/Modal/RunPosition';

const MyBets = () => {
  const yolo_userID = localStorage.getItem('yolo_userID');
  const [activeTab, setActiveTab] = useState('current');
  const [betsData, setBetsData] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [triggerStart, setTriggerStart] = useState(true);
  const [triggerEnd, setTriggerEnd] = useState(true);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedRunner, setSelectedRunner] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const take = 10;
  const [pagination, setPagination] = useState({
    totalCount: 0,
  });
  const handleStartDateCal = () => {
    if (triggerStart) startDatePickerRef.current.setFocus(triggerStart);
    setTriggerStart(!triggerStart);
  };
  const handleEndDateCal = () => {
    if (triggerEnd) endDatePickerRef.current.setFocus(triggerEnd);
    setTriggerEnd(!triggerEnd);
  };
  const tabberMenu = [
    {
      id: 'current',
      title: 'Current',
    },
    {
      id: 'past',
      title: 'Past',
    },
  ];
  useEffect(() => {
    getAllBets(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, take, startDate, endDate]);

  const getAllBets = async (page) => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(
          `/bet/get-past-currentbets?status=${activeTab}&limit=${take}&offset=${
            (page - 1) * take
          }&startdate=${moment(startDate).format(
            'YYYY-MM-DD',
          )}&enddate=${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}`,
        );
        if (response?.status === 200) {
          setBetsData(response.data);
          setPagination({
            totalCount: response.data.total_bets,
          });
          // Return the data instead of logging it
        }
        return null;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };
  // const selectOptions = [
  //   { value: 'matched', label: 'Matched' },
  //   { value: 'Unmatched', label: 'Unmatched' },
  //   { value: 'Both', label: 'Both' },
  // ];
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = (selectionID, Runnername, marketname, eventID) => {
    setSelectedID(selectionID);
    setSelectedRunner(Runnername);
    setSelectedMarket(marketname);
    setSelectedEventID(eventID);
    setIsOpenModal(true);
  };
  return (
    <>
      <div className="h-full py-[10px]">
        <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full">
          <div className="flex   2xl:flex-row gap-2 2xl:gap-0 flex-col 2xl:items-center border-b border-b-[#E1E1E1] pb-4 mb-5">
            <div className="flex justify-between w-full flex-col md:flex-row gap-2 md:gap-0">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => navigate('/')}
                    className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#757FC7] to-[#98A2F8] grid place-content-center text-12 cursor-pointer shadow-[0_0_25px_0_#150E4BB2]"
                  >
                    {reactIcons.leftChev}
                  </span>
                  <span className="font-inter font-bold text-primary-1300">
                    My Bets
                  </span>
                </div>
                <p className="text-12 text-[#8B9BCA]">
                  Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
                  Bet Details <span> &gt; </span>{' '}
                  <span className="text-white">My Bets</span>
                </p>
              </div>
              <div className="bg-[#ECECEC] px-3 h-[52px] rounded-[4px] flex justify-around w-full md:w-[350px] lg:w-[400px] xl:w-[412px]  ">
                <div className="flex items-center gap-3">
                  <div className="grid place-content-center text-black">
                    {reactIcons.calender}
                  </div>
                  <div className="relative flex-1 3xl:w-[175px] w-[150px]">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="02/02/2024"
                      ref={startDatePickerRef}
                    />
                    <div
                      className="w-[35px] h-full bg-gradient-1 flex justify-center items-center absolute top-0 right-0 rounded-tr-[4px] rounded-br-[4px] cursor-pointer"
                      onClick={handleStartDateCal}
                    >
                      {reactIcons.triangleDown}
                    </div>
                  </div>
                  <div className="relative flex-1 3xl:w-[175px] 2xl:w-[150px] w-full">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="02/02/2024"
                      ref={endDatePickerRef}
                    />
                    <div
                      className="w-[35px] h-full bg-gradient-1 flex justify-center items-center absolute top-0 right-0 rounded-tr-[4px] rounded-br-[4px] cursor-pointer"
                      onClick={handleEndDateCal}
                    >
                      {reactIcons.triangleDown}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5  rounded-md w-full min-h-[450px]">
            <div className="tabber">
              <div className="tabber-menu flex items-center justify-between mb-5 flex-col-reverse md:flex-row">
                <ul className="flex items-center justify-start w-full md:w-auto 2xl:gap-3 gap-2">
                  {tabberMenu.map((item) => (
                    <li
                      key={item.id}
                      className={`font-inter text-14  border rounded-[4px] min-w-[70px] font-medium max-w-[130px] text-center px-3 py-2 cursor-pointer ${
                        item.id == activeTab
                          ? 'bg-gradient-1 border-white text-white'
                          : 'bg-white border-primary-1200 text-black'
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
                {/* <div className="flex items-end gap-2 justify-between md:justify-end mb-2 md:mb-0 w-full md:w-auto">
                <p className="text-14">
                  Total Bets:{' '}
                  <span className="font-semibold">
                    {activeTab == 'Casino' ? 0 : betsData?.total_bets}
                  </span>
                </p>
                <p className="text-14">
                  {' '}
                  Total Amount:{' '}
                  <span className="font-semibold ">
                    {activeTab == 'Casino'
                      ? 0
                      : numberWithCommas(betsData?.total_amount || 0) || 0}
                  </span>
                </p>
              </div> */}
              </div>
              <div className="tabber-content ">
                <div className="tbl-wrapper ">
                  {activeTab === 'current' && (
                    <table className="common-tbl 2xl:!min-w-[865px] !min-w-[820px] ">
                      <thead>
                        <tr>
                          <th className="w-[50px]">Sr. No.</th>
                          <th>Event </th>
                          <th>Placed</th>
                          <th>Market</th>
                          <th>Selection</th>
                          <th>Type</th>
                          <th>Odds</th>
                          <th>Stake</th>
                          <th>Liability</th>
                          <th>Potential Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {betsData?.bets === null ||
                        betsData?.bets?.length === 0 ? (
                          <tr className="h-[42px] w-full">
                            <td colSpan={8}>
                              <div className="text-center flex-center h-[170px]">
                                <Empty />
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <>
                            {' '}
                            {betsData &&
                              betsData?.bets?.map((items, index) => {
                                return (
                                  // bg-[#24A3FF]
                                  <tr key={index}>
                                    <td
                                      className={`truncate relative after:absolute after:top-1/2 after:-translate-y-1/2 after:left-0 w-[50px] after:w-2 2xl:after:w-[10px] after:h-[35px] 2xl:after:h-[45px] !pl-4 ${
                                        items?.bet_on === 'BACK'
                                          ? 'after:bg-[#24A3FF]'
                                          : 'after:bg-[#FF81B0]'
                                      } `}
                                    >
                                      {index + 1}
                                    </td>
                                    <td className="leading-5">
                                      {items?.event}
                                    </td>
                                    <td className="">
                                      {moment(items?.created_at).format(
                                        'L, LT',
                                      )}
                                    </td>
                                    <td className=" ">{items?.market}</td>
                                    <td
                                      onClick={() =>
                                        handleOpenModal(
                                          items?.selection_id,
                                          items?.selection,
                                          items?.market === 'Match Odds'
                                            ? 'matchodds'
                                            : items?.market,
                                          items?.event_id,
                                        )
                                      }
                                      className={`${'!text-blue-700 cursor-pointer'}`}
                                    >
                                      {items?.selection}
                                    </td>
                                    <td>
                                      <span
                                        className={`text-white px-3 py-1 w-14 inline-block ${
                                          items?.bet_on === 'BACK'
                                            ? 'bg-[#24A3FF]'
                                            : 'bg-[#FF81B0]'
                                        }`}
                                      >
                                        {items?.bet_on === 'BACK'
                                          ? 'Back'
                                          : 'Lay'}
                                      </span>
                                    </td>
                                    <td className=" "> {items?.price}</td>
                                    <td className=" ">
                                      {' '}
                                      {numberWithCommas(items?.stake)}
                                    </td>
                                    <td className="!text-red-700 ">
                                      {items?.bet_on === 'BACK'
                                        ? items?.stake
                                        : items.game_type === 'session'
                                        ? numberWithDigit(
                                            (items?.percent / 100) *
                                              items?.stake,
                                          ) || 0
                                        : numberWithDigit(
                                            (items?.price - 1) * items?.stake,
                                          ) || 0}{' '}
                                    </td>
                                    <td className="!text-green-700">
                                      {items?.bet_on === 'LAY'
                                        ? items?.stake
                                        : items.game_type === 'session'
                                        ? numberWithDigit(
                                            (items?.percent / 100) *
                                              items?.stake,
                                          ) || 0
                                        : numberWithDigit(
                                            (items?.price - 1) * items?.stake,
                                          ) || 0}
                                    </td>
                                  </tr>
                                );
                              })}{' '}
                          </>
                        )}
                      </tbody>
                    </table>
                  )}
                  {activeTab === 'past' && (
                    <table className="common-tbl 2xl:!min-w-[865px] !min-w-[820px] ">
                      <thead>
                        <tr>
                          <th className="w-[50px]">Sr. No.</th>
                          <th>Event </th>
                          <th>Settled</th>
                          <th>Market</th>
                          <th>Selection</th>
                          <th>Type</th>
                          <th>Odds</th>
                          <th>Stake</th>
                          <th>Profit/Loss</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {betsData?.bets === null ||
                        betsData?.bets?.length === 0 ? (
                          <tr className="h-[42px] w-full">
                            <td colSpan={8}>
                              <div className="text-center flex-center h-[170px]">
                                <Empty />
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <>
                            {' '}
                            {betsData &&
                              betsData?.bets?.map((items, index) => {
                                return (
                                  <tr key={index}>
                                    <td
                                      className={`truncate relative after:absolute after:top-1/2 after:-translate-y-1/2 after:left-0 w-[50px] after:w-2 2xl:after:w-[10px] after:h-[35px] 2xl:after:h-[45px] !pl-4 ${
                                        items?.bet_on === 'BACK'
                                          ? 'after:bg-[#24A3FF]'
                                          : 'after:bg-[#FF81B0]'
                                      } `}
                                    >
                                      {index + 1}
                                    </td>
                                    <td className="leading-5">
                                      {items?.event}
                                    </td>
                                    <td className="">
                                      {moment(items?.updated_at).format(
                                        'L, LT',
                                      )}
                                    </td>
                                    <td className=" ">{items?.market}</td>
                                    <td
                                      onClick={() =>
                                        handleOpenModal(
                                          items?.selection_id,
                                          items?.selection,
                                          items?.market === 'Match Odds'
                                            ? 'matchodds'
                                            : items?.market,
                                          items?.event_id,
                                        )
                                      }
                                      className={`${'!text-blue-700 cursor-pointer'}`}
                                    >
                                      {items?.selection}
                                    </td>
                                    <td>
                                      <span
                                        className={`text-white px-3 py-1 w-14 inline-block ${
                                          items?.bet_on === 'BACK'
                                            ? 'bg-[#24A3FF]'
                                            : 'bg-[#FF81B0]'
                                        }`}
                                      >
                                        {items?.bet_on === 'BACK'
                                          ? 'Back'
                                          : 'Lay'}
                                      </span>
                                    </td>
                                    <td className=" "> {items?.price}</td>
                                    <td className=" ">
                                      {' '}
                                      {numberWithCommas(items?.stake)}
                                    </td>

                                    {items?.bet_on === 'BACK' ? (
                                      <td
                                        className={
                                          items?.status === 1
                                            ? '!text-green-700'
                                            : items?.status === 10
                                            ? '!text-red-700'
                                            : ''
                                        }
                                      >
                                        {items?.status === 1
                                          ? items.game_type === 'session'
                                            ? numberWithDigit(
                                                (items?.percent / 100) *
                                                  items?.stake,
                                              ) || 0
                                            : numberWithDigit(
                                                (items?.price - 1) *
                                                  items?.stake,
                                              ) || 0
                                          : items?.status === 10
                                          ? items.stake
                                          : ''}{' '}
                                      </td>
                                    ) : (
                                      <td
                                        className={
                                          items?.status === 1
                                            ? '!text-green-700'
                                            : items?.status === 10
                                            ? '!text-red-700'
                                            : ''
                                        }
                                      >
                                        {items?.status === 1
                                          ? items.stake
                                          : items?.status === 10
                                          ? items.game_type === 'session'
                                            ? numberWithDigit(
                                                (items?.percent / 100) *
                                                  items?.stake,
                                              ) || 0
                                            : numberWithDigit(
                                                (items?.price - 1) *
                                                  items?.stake,
                                              ) || 0
                                          : ''}
                                      </td>
                                    )}

                                    <td
                                      className={
                                        items?.status === 1
                                          ? '!text-green-700'
                                          : items?.status === 10
                                          ? '!text-red-700'
                                          : ''
                                      }
                                    >
                                      {items?.status === 1
                                        ? 'WON'
                                        : items?.status === 10
                                        ? 'LOST'
                                        : ''}
                                    </td>
                                  </tr>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <div>
                <Pagination
                  pageCount={pagination.totalCount}
                  setPageNumber={setPage}
                  take={take}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <RunPosition
        isOpen={isOpenModal}
        handleClose={handleCloseModal}
        data={{
          userId: yolo_userID,
          eventId: selectedEventID,
          selectionId: selectedID,
          runner: selectedRunner,
          market: selectedMarket,
        }}
      />
    </>
  );
};

export default MyBets;
