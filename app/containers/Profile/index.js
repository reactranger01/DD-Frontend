import { Header, Sidebar, SmallDesc } from '@/components';
import MobileTab from '@/components/Home/MobileTab';
import RightBar from '@/components/Layout/RightBar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Profile = () => {
  return (
    <div>
      <Header />
      <SmallDesc />
      <div
        className="bg-cover bg-no-repeat fixed left-0 top-[120px] right-0 bottom-0 z-[-1] h-[calc(100vh-120px)] overflow-y-auto pb-28 md:pb-0"
        style={{ backgroundImage: 'url("/images/user-dashboard-bg.png")' }}
      >
        <div className=" min-h-full flex md:justify-between justify-center xl:gap-[20px] gap-[7px] w-full ">
          <div className="hidden md:flex w-100%">
            <Sidebar />
          </div>
          <div className="flex gap-2 lg:flex-row flex-col xl:min-w-[960px] lg:min-w-[715px] xl:w-auto mx-auto xl:mx-[unset] w-full">
            <div className="lg:w-[calc(100vw-565px)] flex-1">
              <Outlet />
            </div>
            <div className="hidden md:flex mx-4">
              <RightBar />
            </div>
          </div>
        </div>
      </div>
      <MobileTab />
    </div>
  );
};

export default Profile;
