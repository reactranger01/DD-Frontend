/* eslint-disable react-hooks/exhaustive-deps */
import Pagination from '@/components/Pagination';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { Empty } from 'antd';
import { numberWithCommas } from '@/utils/numberWithCommas';

const AccountStatement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [startDate, setStartDate] = useState(new Date());
  const id = localStorage.getItem('yolo_userID');
  const [endDate, setEndDate] = useState(new Date());
  const [statementData, setStatementData] = useState([]);
  const [triggerStart, setTriggerStart] = useState(true);
  const [triggerEnd, setTriggerEnd] = useState(true);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const [page, setPage] = useState(1);
  const take = 15;
  const [pagination, setPagination] = useState({
    totalCount: 0,
  });

  const tabberMenu = [
    {
      id: 'all',
      title: 'All',
    },
    {
      id: 'batting',
      title: 'Betting P/L Exchange',
    },
    {
      id: 'settling',
      title: 'Settling Statement',
    },
  ];

  const handleStartDateCal = () => {
    if (triggerStart) startDatePickerRef.current.setFocus(triggerStart);
    setTriggerStart(!triggerStart);
  };
  const handleEndDateCal = () => {
    if (triggerEnd) endDatePickerRef.current.setFocus(triggerEnd);
    setTriggerEnd(!triggerEnd);
  };

  useEffect(() => {
    getTransactionList();
  }, [id, page, take, activeTab]);

  const getTransactionList = async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(
          `/user/get-transactions?filterTransaction=${
            activeTab === 'all' ? '' : activeTab
          }&filterUserId=${id}&limit=${take}&offset=${
            (page - 1) * take
          }&fromDate=${moment(startDate).format('YYYY-MM-DD')}&toDate=${moment(
            endDate,
          )
            .add(1, 'day')
            .format('YYYY-MM-DD')}`,
          // '/user/deposits',
        );
        if (response?.status === 201 || response?.status === 200) {
          setStatementData(response?.data?.statements);
          setPagination({
            totalCount: response?.data.count,
          });
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };

  const navigate = useNavigate();
  return (
    <div className="h-full py-[10px]">
      <div className="text-white  bg-[#35353591] rounded-10 font-inter p-3 md:p-5 h-full md:mx-0 mx-[10px]">
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
                Account Statement
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Bet Details <span> &gt; </span>{' '}
              <span className="text-white">Account Statement</span>
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="bg-[#ECECEC] h-[52px] rounded-[4px] flex justify-around 3xl:w-[415px] 2xl:w-[365px] w-[460px]">
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
            <div>
              <button
                className={`mt-1 font-inter text-14  border rounded-[4px] font-medium min-w-[70px] max-w-[170px] text-center px-3 py-2 cursor-pointer ${'bg-white border-primary-1200 text-black'}`}
                onClick={getTransactionList}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5  rounded-md w-full min-h-[450px]">
          <div className="tabber">
            <div className="tabber-menu flex items-center justify-between mb-5">
              <ul className="grid grid-cols-2 md:flex items-center 2xl:gap-3 gap-2 flex-wrap justify-between md:justify-start w-full">
                {tabberMenu.map((item) => (
                  <li
                    key={item.id}
                    className={`font-inter text-[11px] md:text-14 border rounded-[4px] font-medium min-w-2/4 md:min-w-[70px] text-center px-1 md:px-3 py-2 cursor-pointer ${
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
            </div>
            <div className="tabber-content">
              {(activeTab == tabberMenu[0].id ||
                activeTab == tabberMenu[1].id ||
                activeTab == tabberMenu[2].id) && (
                <div className="tbl-wrapper">
                  <table className="common-tbl !min-w-[700px]">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Description</th>
                        <th>Credit</th>
                        <th>Debit</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementData?.length === 0 ? (
                        <tr className="h-[42px] w-full">
                          <td colSpan={5}>
                            <div className="text-center flex-center h-[170px]">
                              <Empty />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {statementData &&
                            statementData.map((_item, index) => (
                              <tr key={index} className="text-center">
                                <td className="px-2 py-2">
                                  {moment(_item?.createdAt).format(
                                    'MMMM Do YYYY, h:mm:ss a',
                                  )}
                                </td>
                                <td className="px-2 py-2">
                                  {_item?.remark ? _item?.remark : 'N/A'}
                                </td>
                                <td className="px-2 py-2 !text-green-700">
                                  {_item.type == 'CREDIT' ||
                                  (_item.type == 'BALANCE' &&
                                    !_item.amount?.includes('-'))
                                    ? numberWithCommas(_item?.amount)
                                    : 0}
                                </td>
                                <td className="px-2 !text-red-700 py-2">
                                  {_item.type == 'WITHDRAW' ||
                                  (_item.type == 'BALANCE' &&
                                    _item.amount?.includes('-'))
                                    ? numberWithCommas(_item?.amount)
                                    : 0}
                                </td>
                                <td className="px-2 py-2">
                                  {_item.type == 'WITHDRAW'
                                    ? numberWithCommas(_item?.senderBalance)
                                    : numberWithCommas(_item?.receiverBalance)}
                                </td>
                              </tr>
                            ))}{' '}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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

export default AccountStatement;
