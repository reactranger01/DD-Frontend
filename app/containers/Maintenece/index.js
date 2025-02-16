import { Header } from '@/components';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Maintenence = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="h-[calc(100dvh-90px)] w-full flex-center flex-col gap-5">
        <img
          src="/images/yoloLogo.webp"
          alt="logo"
          className="cursor-pointer md:w-[120px] w-[80px] mt-2 md:mt-0"
        />
        <p className="text-white text-20">Under Maintenence</p>
        <button onClick={() => navigate(-1)} className="mobile-skew-active">
          <p className="skew-x-12"> Go Back</p>
        </button>
      </div>
    </>
  );
};

export default Maintenence;
