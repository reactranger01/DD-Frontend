import React from 'react';
// import DateFormatter from '../DateFormatter';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DateFormatter from '../DateFormatter';

const MobileMatchHeading = ({ data, sport }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/singlebet/${sport}/${data?.event_id}`, {
          state: { data: data },
        });
      }}
      className="flex items-center gap-1  bg-white shadow-md"
    >
      <div className="">
        <img
          src={`/images/home/${sport == 'soccer' ? 'football' : sport}.png`}
          alt="ball"
          className="w-6 object-cover"
        />
      </div>
      <div
        style={{ clipPath: 'polygon(0px 0px, 100% 0%, 100% 100%, 3% 100%)' }}
        className="w-full bg-[#D4D3F9] pl-3 grid grid-cols-3 py-2"
      >
        <div className="text-14 text-[#002150] font-bold truncate">
          {data?.runners?.[0]?.runnerName}
        </div>
        <div className="text-[#797979] font-medium flex-col flex items-center">
          <DateFormatter dateTime={data?.matchDateTime} />
        </div>
        <div className="text-14 text-[#6778E3] font-bold truncate text-center">
          {data?.runners?.[1]?.runnerName}
        </div>
      </div>
    </div>
  );
};
MobileMatchHeading.propTypes = {
  data: PropTypes.object,
  sport: PropTypes.string,
};
export default MobileMatchHeading;
