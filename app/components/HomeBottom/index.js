import { reactIcons } from '@/utils/icons';
import React from 'react';

const HomeBottom = () => {
  const data = [
    {
      img: '/images/bottomSection/11.webp',
      head: 'Turnover NA',
      list: [
        '2% bonus on every redeposit',
        '2% cashback bonus on weekly loses',
        'No min turnover amount required to be in blue tier',
        'No Turnover Conditions, Direct Bonus In Your Wallet And No Maximum Limit',
      ],
      bgColor: '#002733',
      textColor: '#ffffff',
    },
    {
      img: '/images/bottomSection/22.webp',
      head: 'Turnover 25L INR',
      list: [
        '2% bonus on every redeposit',
        '2% cashback bonus on weekly loses',
        'No min turnover amount required to be in blue tier',
        'No Turnover Conditions, Direct Bonus In Your Wallet And No Maximum Limit',
      ],
      bgColor: '#ffffff',
      textColor: '#000000',
    },
    {
      img: '/images/bottomSection/33.webp',
      head: 'Turnover 40L INR',
      list: [
        '2% bonus on every redeposit',
        '2% cashback bonus on weekly loses',
        'No min turnover amount required to be in blue tier',
        'No Turnover Conditions, Direct Bonus In Your Wallet And No Maximum Limit',
      ],
      bgColor: '#2b2522',
      textColor: '#ffffff',
    },
    {
      img: '/images/bottomSection/44.webp',
      head: 'Turnover 1CR',
      list: [
        '2% bonus on every redeposit',
        '2% cashback bonus on weekly loses',
        'No min turnover amount required to be in blue tier',
        'No Turnover Conditions, Direct Bonus In Your Wallet And No Maximum Limit',
      ],
      bgColor: '#545251',
      textColor: '#ffffff',
    },
    {
      img: '/images/bottomSection/55.webp',
      head: 'By invitation only',
      list: [
        '2% bonus on every redeposit',
        '2% cashback bonus on weekly loses',
        'No min turnover amount required to be in blue tier',
        'No Turnover Conditions, Direct Bonus In Your Wallet And No Maximum Limit',
      ],
      bgColor: '#fefefe',
      textColor: '#000000',
    },
  ];
  return (
    <div className="w-full">
      <div className="">
        <div className="hb-heading text-[30px] font-inter text-white px-10">
          <h1 className="my-auto font-semibold">A LITTLE EXTRA NEVER HURTS</h1>
        </div>
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
          <div className="relative">
            <img src="/images/bottomSection/1.webp" alt="" />
            <div className="hb-clip">
              <p className="text-12 font-inter text-white">Welcome Bonus</p>
            </div>
          </div>
          <div className="relative">
            <img src="/images/bottomSection/2.webp" alt="" />
            <div className="hb-clip">
              <p className="text-12 font-inter text-white">Refill Bonus</p>
            </div>
          </div>
          <div className="relative">
            <img src="/images/bottomSection/3.webp" alt="" />
            <div className="hb-clip">
              <p className="text-12 font-inter text-white">Cashback Bonus</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-10">
        <div className="hb-heading text-[30px] font-inter text-white px-10">
          <h1 className="my-auto font-semibold">
            YOU ONLY LIVE ONCE. PLAY MORE, EARN MORE !
          </h1>
        </div>
        <div className="grid  md:grid-cols-3 lg:grid-cols-5  gap-2 px-5 text-white ">
          {data?.map((item, index) => (
            <div key={index} className="relative">
              <img src={item.img} alt="" />
              <div
                className={`text-[${item.textColor}] p-5 ${
                  index == 0
                    ? 'bg-[#002733]'
                    : index == 1
                    ? 'bg-[#ffffff]'
                    : index == 2
                    ? 'bg-[#2b2522]'
                    : index == 3
                    ? 'bg-[#545251]'
                    : index == 4
                    ? 'bg-[#fefefe]'
                    : 'bg-[#002733]'
                } `}
              >
                <h1 className="clip-head mb-2 font-semibold">{item.head}</h1>
                <ul>
                  {item.list.map((it, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-12 font-inter"
                    >
                      <span className="text-green-500">{reactIcons.check}</span>{' '}
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBottom;
