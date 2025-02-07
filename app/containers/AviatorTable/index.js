import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import { CasinoPlay, Header, SmallDesc } from '@/components';
import { getData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { Drawer, List } from '@mui/material';
import MobileTab from '@/components/Home/MobileTab';
const AviatorTable = () => {
  const isLogin = isLoggedIn();
  const [url, setUrl] = useState('');
  const [deviceType, setDeviceType] = useState(null);
  const userId = localStorage.getItem('shiv11_userID');
  const [allAviatorGame, setAllAviatorGame] = useState([]);

  useEffect(() => {
    getCasinoGame();
    setDeviceType(isMobile ? 'mobile' : 'desktop');
  }, []);

  const getCasinoGame = async () => {
    try {
      const response = await getData('/user/live-aviator-games');
      if (response?.status === 201 || response?.status === 200) {
        setAllAviatorGame(response?.data);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleAviatorGame = async (id) => {
    if (!isLogin) {
      const response = await postAuthData('/user/create-session', {
        platform: deviceType,
        id: 12,
        gameid: String(id),
      });
      if (response?.status === 200 || response?.status === 201) {
        if (response.data?.url) {
          setUrl(response.data?.url);
        } else {
          toast.error('Game not live now');
        }
      } else {
        toast.error(response?.data || 'Something went wrong');
      }
    } else {
      try {
        const response = await postAuthData('/user/create-session', {
          platform: deviceType,
          id: userId,
          gameid: String(id),
        });
        if (response?.status === 200 || response?.status === 201) {
          if (response.data?.url) {
            setUrl(response.data?.url);
          } else {
            toast.error('Game not live now');
          }
        } else {
          toast.error(response?.data || 'Something went wrong');
        }
      } catch (error) {
        toast.error(error || 'Something went wrong');
      }
    }
  };

  return (
    <>
      <div>
        <Header />
        <SmallDesc />
        {url ? (
          <CasinoPlay url={url} />
        ) : (
          <div
            className="bg-cover bg-no-repeat fixed left-0 top-[112px] md:top-[120px]  right-0 bottom-0 z-[-1] h-[calc(100vh-112px)] md:h-[calc(100vh-120px)] overflow-y-auto"
            style={{ backgroundImage: 'url("/images/aviator-bg-image.jpg")' }}
          >
            <div className=" min-h-full flex md:justify-between justify-center xl:gap-[20px] gap-[7px] w-full ">
              <div className="hidden md:flex w-100%">
                <div className="side-bar ">
                  <div className="flex w-full h-full sidebar-inner">
                    <Drawer
                      variant="permanent"
                      anchor="left"
                      className="relative pb-[60px]"
                    >
                      <List>
                        <div className="px-3 pb-2">
                          <div>
                            <h1 className="text-white font-inter">
                              POPULAR GAMES
                            </h1>
                          </div>
                        </div>
                      </List>
                      <List>
                        <div className="px-3">
                          <div>
                            <span className="absolute text-[25px] text-white top-[18px] left-[16px]">
                              {reactIcons.search}
                            </span>
                            <input
                              type="text"
                              name={'search'}
                              // value={search}
                              // onChange={(event) => setSearch(event.target.value)}
                              placeholder="Search Games"
                              className="bg-black border-white border-[1px]  text-white casino-input"
                            />
                          </div>
                        </div>
                      </List>
                      {/* <List>
                      <div className="p-3">
                        <div>
                          <button className="bg-blue-gradient rounded w-full p-2 text-white font-inter">
                            Provider
                          </button>
                        </div>
                      </div>
                    </List> */}
                      {/* <List>
                      <div className="p-3">
                        <div>
                          <button className="text-white font-inter">
                            ALL GAMES
                          </button>
                        </div>
                      </div>
                    </List> */}
                      {/* <List>
                      <div className="p-3">
                        <div>
                          <button className="text-white font-inter">
                            POPULAR GAMES
                          </button>
                        </div>
                      </div>
                    </List> */}
                    </Drawer>
                  </div>
                </div>
              </div>
              <div className="w-full p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 text-white relative">
                  {allAviatorGame.length === 0 ? (
                    <div className="flex w-full justify-center items-center absolute h-24 backdrop-blur-sm bg-white/20 rounded-md">
                      <h1 className="text-white font-bold  text-16 lg:text-2xl">
                        No Live Game Available
                      </h1>
                    </div>
                  ) : (
                    <>
                      {' '}
                      {allAviatorGame &&
                        allAviatorGame.map((item, index) => (
                          <div
                            // onClick={() => handleAviatorGame(item?.id)}
                            key={index}
                            className="bg-yellow casino-btn relative"
                          >
                            <img
                              src={item?.game_images}
                              alt="img"
                              className="w-full h-full object-cover"
                            />
                            <div
                              className="absolute left-0 top-0 bottom-0 right-0 flex items-center justify-center bg-[#2f32369c] play-btn"
                              onClick={() => handleAviatorGame(item?.id)}
                            >
                              <button
                                onClick={() => handleAviatorGame(item?.id)}
                                className=" text-white btn-skew border border-[#CB9640] bg-[#2f3236b3] font-bold py-2 px-6 hidden md:inline"
                              >
                                {isLogin ? (
                                  <span>Play</span>
                                ) : (
                                  <span>Demo</span>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}{' '}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <MobileTab />
    </>
  );
};

export default AviatorTable;
