import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { sidebarTabs } from '@/utils/contants';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [openTab, setOpenTab] = React.useState(null);
  const [currentPath, setCurrentPath] = React.useState('');
  const currenData = location.state;
  const navigate = useNavigate();
  const handleMainTabClick = (index) => {
    if (openTab === index) {
      setOpenTab(null);
    } else {
      setOpenTab(index);
    }
  };

  React.useEffect(() => {
    setOpenTab(
      currenData === '/profile/my-bets'
        ? 2
        : currenData === '/profile/account-info'
        ? 0
        : currenData === '/profile/deposit' ||
          currenData === '/profile/withdraw' ||
          currentPath === '/profile/history'
        ? 1
        : null,
    );
  }, [currenData, currentPath]);

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [currentPath, location]);

  return (
    <div className="side-bar ">
      <div className="flex w-full h-full sidebar-inner">
        <Drawer
          variant="permanent"
          anchor="left"
          className="relative pb-[60px]"
        >
          <List>
            <div className="flex items-center gap-2 text-white p-3 font-inter">
              <div>
                <img src="/images/icons/dashboard.svg" alt="dashboard" />
              </div>
              <div>
                <p>My Dashboard</p>
              </div>
            </div>
            {sidebarTabs.map((item, index) => (
              <div key={index} className="mt-3">
                <ListItemButton
                  onClick={() => handleMainTabClick(index)}
                  className={`list-button transition-colors ease duration-300 ${
                    openTab == index && 'bg-gradient-1'
                  }`}
                >
                  <div className="flex gap-2.5 items-center w-full text-white text-sm font-inter">
                    <div>
                      <div className="border border-white bg-[radial-gradient(#FFFFFF4D, #FFFFFF80)] icon-bg rounded-md p-2 shadow-[0_0_8px_3px_#6369AD66]">
                        <img src={item.icon} alt="dashboard" />
                      </div>
                    </div>
                    <div>{item.name}</div>
                  </div>
                  {openTab === index ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openTab === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subTab.map((subTab, subIndex) => (
                      <>
                        <ListItemButton
                          key={subIndex}
                          onClick={() => navigate(subTab.link)}
                          className={`innerMenu ${
                            subTab.link == currentPath && 'bg-gradient-1'
                          }`}
                        >
                          <ListItemText primary={subTab.name} />
                        </ListItemButton>
                      </>
                    ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>

          <div className="absolute bottom-3 z-10 w-full">
            <button className="flex-center w-[127px] mx-auto gap-1 px-5 py-2 rounded-md border border-white bg-[radial-gradient(#FFFFFF4D, #FFFFFF80)] icon-bg shadow-[0_0_15px_2px_#989ED566]">
              <img src="/images/icons/query-chat.svg" className="w-[20px]" />
              <p className="font-inter font-light text-white 2xl:text-16 text-14">
                FAQ
              </p>
            </button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Sidebar;
