import { reactIcons } from '@/utils/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import moment from 'moment';
import Pagination from '@/components/Pagination';
import { Empty } from 'antd';
import { numberWithCommas } from '@/utils/numberWithCommas';
const ProfitAndLoss = () => {
  const [activeTab, setActiveTab] = useState('Cricket');
  const [startDate, setStartDate] = useState(new Date());
  const userName = localStorage.getItem('yolo_userName');
  const [endDate, setEndDate] = useState(new Date());
  const [profitLoss, setProfitLossData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [triggerStart, setTriggerStart] = useState(true);
  const [triggerEnd, setTriggerEnd] = useState(true);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const [page, setPage] = useState(1);
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
      id: 'Cricket',
      title: 'Cricket',
      earning: '0.00',
    },
    {
      id: 'Soccer',
      title: 'Football',
      earning: '0.00',
    },
    {
      id: 'Tennis',
      title: 'Tennis',
      earning: '0.00',
    },
    {
      id: 'casino',
      title: 'Casino',
      earning: '0.00',
    },
  ];
  useEffect(() => {
    getProfitLoss(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, take, startDate, endDate, userName]);
  const getProfitLoss = async (page) => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(
          `/user/user-profitandloss?limit=${take}&offset=${
            (page - 1) * take
          }&startDate=${moment(startDate).format(
            'YYYY-MM-DD',
          )}&endDate=${moment(endDate)
            .add(1, 'day')
            .format('YYYY-MM-DD')}&userId=${userName}&gameId=${
            activeTab === 'Cricket'
              ? 4
              : activeTab === 'Soccer'
              ? 1
              : activeTab === 'Tennis'
              ? 2
              : activeTab === 'casino'
              ? 3
              : 4
          }`,
        );
        if (response?.status === 200) {
          const formattedData = response.data.data.map((entry) => {
            const profit =
              entry.total_winning_amount - entry.total_lossing_amount;
            const amount = Math.abs(profit);
            const type = profit >= 0 ? 'profit' : 'loss';
            return {
              ...entry,
              type: type,
              amount: amount,
            };
          });
          setProfitLossData(formattedData);
          setPagination({
            totalCount: response.data.totalCount,
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
  const getProfitsData = useCallback(async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(
          `/user/user-allgames-profitandloss?startDate=${moment(
            startDate,
          ).format('YYYY-MM-DD')}&endDate=${moment(endDate)
            .add(1, 'day')
            .format('YYYY-MM-DD')}&userId=${userName}`,
        );
        if (response?.status === 200) {
          const formattedData = response.data.data.map((entry) => {
            const profit =
              entry.total_winning_amount - entry.total_lossing_amount;
            const amount = Math.abs(profit);
            const type = profit >= 0 ? 'profit' : 'loss';
            return {
              ...entry,
              type: type,
              amount: amount,
            };
          });
          setProfitData(formattedData);
        }
        return null;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }, [startDate, endDate, userName]);

  useEffect(() => {
    getProfitsData();
  }, [getProfitsData]);

  if (profitData) {
    profitData.forEach((item) => {
      const eventType = item.event_type;
      const amount = parseFloat(item.amount);
      const foundEvent = tabberMenu.find((event) => event.id === eventType);
      if (foundEvent) {
        if (item.type === 'profit') {
          foundEvent.earning = (
            parseFloat(foundEvent.earning) + amount
          ).toFixed(2);
        } else if (item.type === 'loss') {
          foundEvent.earning = (
            parseFloat(foundEvent.earning) - amount
          ).toFixed(2);
        }
      }
    });
  }

  let totalProfitLoss = 0;
  tabberMenu.forEach((event) => {
    totalProfitLoss += parseFloat(event.earning);
  });
  const navigate = useNavigate();

  return (
    <div className="h-full py-[10px]">
      <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full">
        <div className="flex justify-between 2xl:flex-row gap-2 2xl:gap-0 flex-col 2xl:items-center border-b border-b-[#E1E1E1] pb-4 mb-5">
          <div className="flex justify-between w-full flex-col md:flex-row gap-2 md:gap-0">
            <div>
              <div className="flex items-center gap-2">
                <span
                  onClick={() => navigate(-1)}
                  className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#757FC7] to-[#98A2F8] grid place-content-center text-12 cursor-pointer shadow-[0_0_25px_0_#150E4BB2]"
                >
                  {reactIcons.leftChev}
                </span>
                <span className="font-inter font-bold text-primary-1300">
                  Profit And Loss
                </span>
              </div>
              <p className="text-12 text-[#8B9BCA]">
                Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
                Bet Details <span> &gt; </span>{' '}
                <span className="text-white">Profit And Loss</span>
              </p>
            </div>
            <div className="bg-[#ECECEC] px-3 h-[52px] rounded-[4px] flex justify-around w-full md:w-[350px] lg:w-[400px] xl:w-[412px]">
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
          <div className="tabber min-h-[350px] flex justify-between bg-white overflow-hidden rounded-lg flex-col md:flex-row">
            <div className="tabber-menu min-w-[147px] md:min-w-[221px]">
              <div className="rounded-tl-lg w-full text-center 2xl:text-16 text-[15px] text-black font-medium 2xl:p-[10px_5px] p-[7px_5px] shadow-[0_0_15px_2px_#00000050]">
                Games
              </div>
              <div className="rounded-md w-[calc(100%-20px)] mx-auto my-3 text-center text-14 text-black font-medium p-[7px_5px] shadow-[0px_4px_8px_1px_#00000025]">
                Total P&L{' '}
                <span
                  className={
                    totalProfitLoss.toFixed(2) > 0
                      ? '!text-green-700'
                      : totalProfitLoss.toFixed(2) < 0
                      ? '!text-red-700'
                      : 'text-black'
                  }
                >
                  {totalProfitLoss.toFixed(2)}
                </span>
              </div>

              <ul className="flex overflow-auto md:block">
                {tabberMenu.map((item) => (
                  <li
                    key={item.id}
                    className={`text-14 font-medium flex items-center justify-between flex-col md:flex-row gap-1 border-b border-b-[#D8D8D8] p-[5px_10px_7px_20px] cursor-pointer ${
                      activeTab == item.id ? 'text-[#004774]' : 'text-black'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span>{item.title}</span>
                    <span
                      className={
                        item.earning > 0
                          ? '!text-green-700'
                          : item.earning < 0
                          ? '!text-red-700'
                          : 'text-black'
                      }
                    >
                      {item.earning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tabber-content w-full md:w-[calc(100%-235px)]">
              {(activeTab == 'Cricket' ||
                activeTab == 'Soccer' ||
                activeTab == 'Tennis') && (
                <div className="tbl-wrapper">
                  <table className="common-tbl 2xl:!min-w-[700px] !min-w-[700px]">
                    <thead>
                      <tr>
                        <th>Game</th>
                        <th>Market</th>
                        <th>Event</th>
                        <th>settle Time</th>
                        {/* <th>Commission</th> */}
                        <th>Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitLoss?.length === 0 ? (
                        <tr>
                          <td colSpan={4}>
                            <div className="text-center flex-center h-[190px]">
                              <Empty />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {profitLoss &&
                            profitLoss.map((items, index) => {
                              return (
                                <tr key={index}>
                                  <td>{items?.event_type}</td>
                                  <td>{items?.market}</td>
                                  <td>{items?.event}</td>
                                  <td>
                                    {' '}
                                    {moment(items?.settlement_time).format(
                                      'L, LT',
                                    )}
                                  </td>
                                  {/* <td>0</td> */}
                                  <td
                                    className={
                                      items.type === 'profit'
                                        ? '!text-green-700'
                                        : '!text-red-700'
                                    }
                                  >
                                    {numberWithCommas(items?.amount) || 0}
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab == 'casino' && (
                <div className="tbl-wrapper scroller">
                  <table className="common-tbl 2xl:!min-w-[700px] !min-w-[600px]">
                    <thead>
                      <tr className="!bg-gradient-1">
                        <th className="!text-white !rounded-tl-none">Game</th>
                        <th className="!text-white">Event Type</th>
                        <th className="!text-white">Event</th>
                        <th className="!text-white">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitLoss?.length === 0 ? (
                        <tr>
                          <td colSpan={4}>
                            <div className="text-center flex-center h-[190px]">
                              <Empty />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {profitLoss &&
                            profitLoss.map((items, index) => {
                              return (
                                <tr key={index}>
                                  <td>{items?.game_code}</td>
                                  <td>{items?.event_type}</td>
                                  <td>{items?.event}</td>
                                  <td
                                    className={
                                      items.type === 'profit'
                                        ? '!text-green-700'
                                        : '!text-red-700'
                                    }
                                  >
                                    {numberWithCommas(items?.amount) || 0}
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          <div>
            {' '}
            <Pagination
              pageCount={pagination.totalCount}
              setPageNumber={setPage}
              take={take}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
