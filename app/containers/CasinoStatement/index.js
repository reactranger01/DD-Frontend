import DatePicker from 'react-datepicker';
import Pagination from '@/components/Pagination';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { Empty } from 'antd';

const CasinoStatement = () => {
  const navigate = useNavigate();
  const shiv11_userID = localStorage.getItem('shiv11_userID');
  const [page, setPage] = useState(1);
  const [betsData, setBetsData] = useState([]);
  const [activeTab, setActiveTab] = useState('casino');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [triggerStart, setTriggerStart] = useState(true);
  const [triggerEnd, setTriggerEnd] = useState(true);
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
      id: 'casino',
      title: 'Casino',
    },
    {
      id: 'aviator',
      title: 'Aviator',
    },
  ];
  useEffect(() => {
    getStatement(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, take, startDate, endDate]);

  const getStatement = async (page) => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(
          `/user/get-casino-aviator-statement?uid=${shiv11_userID}&search=${activeTab}&limit=${take}&offset=${
            (page - 1) * take
          }&startdate=${moment(startDate).format(
            'YYYY-MM-DD',
          )}&enddate=${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}`,
        );
        if (response?.status === 200) {
          setBetsData(response.data.response.rows);
          setPagination({
            totalCount: response.data.response.count,
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
                Casino Statement
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Bet Details <span> &gt; </span>{' '}
              <span className="text-white">Casino Statement</span>
            </p>
          </div>
          <div className="bg-[#ECECEC] h-[52px] rounded-[4px] hidden md:flex justify-around 3xl:w-[415px] 2xl:w-[365px] w-[460px]">
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
                  className="w-[35px] h-full bg-gradient-1 flex justify-center items-center absolute top-0 right-0 rounded-tr-[4px] rounded-br-[4px] !text-white cursor-pointer"
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
                  className="w-[35px] h-full bg-gradient-1 flex justify-center items-center absolute top-0 right-0 rounded-tr-[4px] rounded-br-[4px] !text-white cursor-pointer"
                  onClick={handleEndDateCal}
                >
                  {reactIcons.triangleDown}
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
            </div>{' '}
            <div className="tabber-content ">
              {' '}
              <div className="tbl-wrapper">
                <table className="common-tbl 2xl:!min-w-[975px] !min-w-[920px]">
                  <thead>
                    <tr>
                      {/* <th>Provider Id</th> */}
                      <th>Game Type</th>
                      {/* <th>Ref Id</th> */}
                      <th>Transaction Id</th>
                      <th>Amount</th>
                      <th>Remark</th>
                      <th className="w-[130px]">Placed Time</th>
                      <th className="w-[130px]">Settled Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betsData?.bets === null || betsData?.bets?.length === 0 ? (
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
                          betsData?.map((items, index) => {
                            return (
                              // bg-[#24A3FF]
                              <tr key={index} className="">
                                {/* <td className="!px-4">{items?.providerCode}</td> */}
                                <td className="!px-4">{items?.gameType}</td>
                                {/* <td className={'truncate'}>
                                  {items.referenceId}
                                </td> */}
                                <td className={'truncate'}>
                                  {items.transactionId}
                                </td>
                                <td
                                  className={`text-semibold ${
                                    items?.remark.includes('bet on')
                                      ? '!text-red-500'
                                      : '!text-green-500'
                                  }`}
                                >
                                  {items?.amount}
                                </td>
                                <td className=" ">{items?.remark}</td>

                                <td className="w-[130px]">
                                  {moment(items?.createdAt).format('L')}
                                  <br />
                                  {moment(items?.createdAt).format('LT')}
                                </td>
                                <td className="w-[130px]">
                                  {moment(items?.updatedAt).format('L')}
                                  <br />
                                  {moment(items?.updatedAt).format('LT')}
                                </td>
                              </tr>
                            );
                          })}{' '}
                      </>
                    )}
                  </tbody>
                </table>
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
  );
};

export default CasinoStatement;
