import { Footer, Header } from '@/components';
import MobileTab from '@/components/Home/MobileTab';
import React from 'react';
import { Outlet } from 'react-router-dom';
const Main = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <MobileTab />
      <Footer />
    </div>
  );
};

export default Main;
