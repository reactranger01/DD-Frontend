import { MobileTabs } from '@/utils/contants';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileTab = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = React.useState('');

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-20 block md:hidden">
      <ul className="grid grid-cols-5 gap-2 p-1">
        {MobileTabs.map((item, index) => (
          <li key={index} className="text-center">
            <Link
              to={item.link}
              className={`flex items-center flex-col gap-1 py-1 rounded-md ${
                currentPath === item.link ? 'bg-gradient-2' : ''
              }`}
            >
              <img src={item.icon} alt={item.name} />
              <span className="leading-[17px]">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileTab;
