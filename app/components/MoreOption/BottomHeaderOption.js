import { BottomHeaderOption } from '@/utils/contants';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="p-5 font-inter overflow-x-auto">
      <div className="flex justify-between pl-2 items-center overflow-hidden min-w-[695px] md:min-w-[720px]">
        <div>
          {BottomHeaderOption.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item?.path)}
              className="bg-black text-white bh-btn-skew py-2 px-8 rounded mr-2 border border-white"
            >
              <span className="font-medium">
                <img src={item.icon} alt={item.icon} className=" w-5 inline" />{' '}
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;
