/* eslint-disable react-hooks/exhaustive-deps */
import { SelectBox } from '@/components';
import Pagination from '@/components/Pagination';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { numberWithCommas } from '@/utils/numberWithCommas';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Empty } from 'antd';
import { useRef } from 'react';
import DatePicker from 'react-datepicker';
const History = () => {
  const [depositListData, setDepositListData] = useState([]);
  const [withdrawList, setWithdrawList] = useState([]);
  const [page, setPage] = useState(1);
  const take = 15;
  const [type, setType] = useState('deposit');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const [triggerStart, setTriggerStart] = useState(true);
  const [triggerEnd, setTriggerEnd] = useState(true);
  const [selectedValue, setselectedValue] = useState({
    value: 'All',
    label: 'All',
  });
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
      id: 'deposit',
      title: 'Deposit',
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
    },
  ];
  const [activeTab, setActiveTab] = useState(tabberMenu[0].id);
  useEffect(() => {
    getDepositList(page);
  }, [page, take, type, selectedValue, startDate, endDate]);

  const getDepositList = async (page) => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData(
          `/user/${
            type === 'deposit' ? 'deposits' : 'get-user-widrawreq'
          }?status=${selectedValue.value}&limit=${take}&offset=${
            (page - 1) * take
          }&fromDate=${moment(startDate).format('YYYY-MM-DD')}&toDate=${moment(
            endDate,
          )
            .add(1, 'day')
            .format('YYYY-MM-DD')}`,
        );
        if (
          (response?.status === 201 || response?.status === 200) &&
          type === 'deposit'
        ) {
          setDepositListData(response.data?.deposits);
          setPagination({
            totalCount: response.data.totalCount,
          });
        } else if (
          (response?.status === 201 || response?.status === 200) &&
          type === 'withdraw'
        ) {
          setWithdrawList(response?.data?.deposits);
          setPagination({
            totalCount: response.data.total_bets,
          });
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };
  const selectOptions = [
    { value: 'All', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];
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
                History
              </span>
            </div>
            <p className="text-12 text-[#8B9BCA]">
              Home Page <span> &gt; </span> My Dashboard <span> &gt; </span>
              Finances <span> &gt; </span>{' '}
              <span className="text-white">History</span>
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

        <div className="bg-gradient-to-br from-[#00000080] to-[#00000040] p-5  rounded-md w-full min-h-[450px]">
          <div className="tabber">
            <div className="tabber-menu flex items-center justify-between mb-5 flex-col md:flex-row">
              <ul className="flex items-center justify-between md:justify-start 2xl:gap-3 gap-2 mb-2 md:mb-0 w-full md:w-auto">
                {tabberMenu.map((item) => (
                  <li
                    key={item.id}
                    className={`font-inter text-14 font-medium  border rounded-[4px] w-full md:min-w-[75px] max-w-[130px] text-center px-3 py-2 cursor-pointer ${
                      item.id == activeTab
                        ? 'bg-gradient-1 border-white text-white'
                        : 'bg-white border-primary-1200 text-black'
                    }`}
                    onClick={() => {
                      setActiveTab(item?.id);
                      setType(item?.id);
                      setPage(1);
                    }}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
              <div className="min-w-full md:min-w-[120px]">
                <SelectBox
                  optionArr={selectOptions}
                  placeholder="All"
                  defaultValue={selectedValue}
                  name="transaction"
                  borderRadius="4px"
                  handleChange={setselectedValue}
                />
              </div>
            </div>
            <div className="tabber-content">
              {activeTab == 'deposit' && (
                <>
                  <div className="tbl-wrapper">
                    <table className="common-tbl">
                      <thead>
                        <tr>
                          <th className="rounded-tl-lg w-[60px] pl-4 pr-0">
                            <div className="border-r text-center border-r-black xl:text-16 text-14">
                              SN.
                            </div>
                          </th>{' '}
                          <th className="rounded-tl-lg  pl-4 pr-0">
                            <div className="border-r border-r-black xl:text-14 text-14">
                              User
                            </div>
                          </th>
                          <th className="rounded-tl-lg  pl-4 pr-0">
                            <div className="border-r border-r-black xl:text-14 text-14">
                              Amount
                            </div>
                          </th>
                          <th className="px-0">
                            <div className="border-r border-r-black xl:text-14 text-14">
                              Status
                            </div>
                          </th>
                          <th className="px-0 ">
                            <div className="border-r border-r-black xl:text-14 text-14">
                              Date
                            </div>
                          </th>
                          <th className="px-0 w-[150px]">
                            <div className="border-r border-r-black xl:text-14 text-14">
                              Utr
                            </div>
                          </th>
                          <th className="rounded-tr-lg pl-0">
                            <div className="xl:text-14 text-14">
                              Payment Method
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {depositListData === null ||
                        depositListData.length === 0 ? (
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
                            {depositListData &&
                              depositListData.map((items, index) => (
                                <tr
                                  key={index}
                                  className=" bg-white text-black text-center"
                                >
                                  <td className="px-4 w-[60px] !pl-[25px]  text-12">
                                    {index + 1}
                                  </td>
                                  <td className="px-4   text-12">
                                    {items?.username}
                                  </td>
                                  <td className="px-4   text-12">
                                    {numberWithCommas(items?.amount || 0) || 0}
                                  </td>
                                  <td
                                    className={`  text-12 ${
                                      items?.status === 'pending'
                                        ? 'text-yellow-700'
                                        : 'text-red-700'
                                    }`}
                                  >
                                    <span
                                      className={`p-1 rounded-[5px] ${
                                        items?.status === 'pending'
                                          ? 'bg-yellow-200'
                                          : 'bg-red-100'
                                      }  font-semibold`}
                                    >
                                      {items?.status?.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="  text-12">
                                    {moment(items?.created_at).format('L')}
                                  </td>
                                  <td className="w-[150px] text-12">
                                    {items?.utr}
                                  </td>
                                  <td className="truncate  text-12">
                                    {items?.paymentMethod}
                                  </td>
                                </tr>
                              ))}{' '}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    pageCount={pagination.totalCount}
                    setPageNumber={setPage}
                    take={take}
                  />
                </>
              )}

              {activeTab == 'withdraw' && (
                <div className="tbl-wrapper">
                  <table className="common-tbl">
                    <thead>
                      <tr>
                        <th className="rounded-tl-lg w-[60px] pl-4 pr-0">
                          <div className="border-r border-r-black xl:text-16 text-14">
                            SN.
                          </div>
                        </th>
                        <th className="  pr-0">
                          <div className="border-r border-r-black xl:text-16 text-14">
                            User
                          </div>
                        </th>

                        <th className="  pr-0">
                          <div className="border-r border-r-black xl:text-16 text-14">
                            Amount
                          </div>
                        </th>
                        <th className="px-0">
                          <div className="border-r border-r-black xl:text-16 text-14">
                            Status
                          </div>
                        </th>
                        <th className="px-0">
                          <div className="border-r border-r-black xl:text-16 text-14">
                            Account
                          </div>
                        </th>
                        <th className="rounded-tr-lg pl-0">
                          <div className="xl:text-16 text-14">Date</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawList === null || withdrawList.length === 0 ? (
                        <tr className="h-[42px] w-full">
                          <td colSpan={8}>
                            <div className="text-center flex-center h-[170px]">
                              <Empty />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {withdrawList &&
                            withdrawList.map((items, index) => (
                              <tr
                                key={index}
                                className=" bg-white text-black text-center"
                              >
                                <td className="w-[50px] !pl-[25px] text-center  text-12">
                                  {index + 1}
                                </td>
                                <td className="truncate  text-12">
                                  {items?.userName}
                                </td>

                                <td className="  text-12">
                                  {numberWithCommas(items?.amount || 0) || 0}
                                </td>
                                <td
                                  className={`  text-12 ${
                                    items?.status === 'pending'
                                      ? 'text-yellow-700'
                                      : 'text-red-700'
                                  }`}
                                >
                                  <span
                                    className={`p-1 rounded-[5px] ${
                                      items?.status === 'pending'
                                        ? 'bg-yellow-200'
                                        : 'bg-red-100'
                                    }  font-semibold`}
                                  >
                                    {items?.status?.toUpperCase()}
                                  </span>
                                </td>
                                <td className=" text-12">{items?.accountNo}</td>
                                <td className="  text-12">
                                  {moment(items?.created_at).format('L')}
                                </td>
                              </tr>
                            ))}
                        </>
                      )}
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

export default History;
