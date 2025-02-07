/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import PropTypes from 'prop-types';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { Empty } from 'antd';

const RunPosition = ({ isOpen, handleClose, data }) => {
  const [betList, setBetList] = useState([]);
  const handleCloseModal = () => {
    handleClose();
  };
  useEffect(() => {
    getList();
  }, [data.userId, data.selectionId, data.eventId]);

  const getList = async () => {
    const islogin = isLoggedIn();
    if (islogin && data.userId && data.selectionId && data?.market) {
      try {
        const response = await getAuthData(
          `/bet/user-particulerselectionbets?id=${data.userId}&selectionid=${data.selectionId}&eventid=${data.eventId}&market=${data?.market}`,
        );
        if (response?.status === 201 || response?.status === 200) {
          setBetList(response.data); // Return the data instead of logging it
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };

  return (
    <div
      className={
        isOpen
          ? 'fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto px-4 py-6 sm:px-0 flex flex-col items-center justify-center z-[999]'
          : 'hidden'
      }
    >
      <div className="text-sm text-white font-bold text-center h-4 rounded-t-lg bg-[#071535] relative w-full max-w-lg mx-auto shadow-md px-8 py-4 row flex">
        <h4 className="mt-[-0.5rem] grow text-left">Run Position</h4>
        <button className=" flex-none">
          <RxCross2
            className="h-4 w-4 mt-[-0.5rem]   "
            onClick={handleCloseModal}
          />
        </button>
      </div>

      <div className="relative w-full max-w-lg mx-auto shadow-md rounded-b-lg bg-white px-8 py-4">
        <div className="text-18  font-semibold text-center ">
          {data?.runner}
        </div>
        <form>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-blue-900">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {data.market === 'bookmaker' ||
                    data.market === 'MATCH_ODDS' ||
                    data.market === 'Match Odds'
                      ? 'ODDS'
                      : 'ODDS'}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {betList?.bets === null || betList?.bets?.length === 0 ? (
                  <tr className="h-[42px] w-full">
                    <td colSpan={2}>
                      <div className="text-center flex-center h-[170px]">
                        <Empty />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {betList &&
                      betList?.bets?.map((items, index) => (
                        <tr
                          key={index}
                          className={`border-b ${
                            items?.bet_on === 'BACK'
                              ? 'bg-[rgb(130,207,255)]'
                              : 'bg-[rgb(255,181,189)]'
                          } `}
                        >
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap "
                          >
                            {items?.price}
                          </th>
                          <td className="px-6 py-2 font-medium text-gray-900">
                            {items?.stake}
                          </td>
                        </tr>
                      ))}{' '}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
};
RunPosition.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
export default RunPosition;
