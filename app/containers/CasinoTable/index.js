/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import { CasinoPlay, Header, Loading, SmallDesc } from '@/components';
import { getData, isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { Drawer, List } from '@mui/material';
import MobileTab from '@/components/Home/MobileTab';
const CasinoTable = () => {
  const { game } = useParams();
  const isLogin = isLoggedIn();
  const [url, setUrl] = useState('');
  const [deviceType, setDeviceType] = useState(null);
  const userId = localStorage.getItem('yolo_userID');
  const [allCasinoGame, setAllCasinoGame] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerSearch, setProviderSearch] = useState('');
  const [gameSearch, setGameSearch] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [ids, setIds] = useState(null);
  const playerList = [
    {
      id: 0,
      name: 'All',
      path: 'all',
    },
    {
      id: 1,
      name: 'Ezugi',
      path: 'ezugi',
    },
    // {
    //   id: 2,
    //   name: 'Vivo Gaming',
    //   path: 'vivogaming',
    // },
    // {
    //   id: 3,
    //   name: '7mojos',
    //   path: '7mojos',
    // },
    // {
    //   id: 4,
    //   name: 'Lucky Streak',
    //   path: 'luckystreak',
    // },
    {
      id: 5,
      name: 'Evolution',
      path: 'Evolution',
    },
    {
      id: 6,
      name: 'Spribe',
      path: 'Spribe',
    },
    {
      id: 7,
      name: 'Net Game',
      path: 'NetGame',
    },
    // {
    //   id: 8,
    //   name: 'Quick Spin',
    //   path: 'quickspin',
    // },
    // {
    //   id: 9,
    //   name: 'TV Bet',
    //   path: 'tvbet',
    // },
    // {
    //   id: 10,
    //   name: 'Goldenrace',
    //   path: 'goldenrace',
    // },
    // {
    //   id: 11,
    //   name: 'Spinomenal',
    //   path: 'spinomenal',
    // },
    // {
    //   id: 9,
    //   name: 'Amar Akbar Anthony',
    //   path: 'akbar',
    // },
    // {
    //   id: 10,
    //   name: '20 Dragon',
    //   path: 'dragon',
    // },
    {
      id: 11,
      name: 'Espresso Games',
      path: 'Espressogames',
    },
    {
      id: 12,
      name: 'Concept Gaming',
      path: 'ConceptGaming',
    },
    {
      id: 13,
      name: 'Bet Games',
      path: 'Betgames',
    },
    {
      id: 14,
      name: 'BGaming',
      path: 'BGaming',
    },
    {
      id: 15,
      name: 'Turbo Games',
      path: 'Turbogames',
    },
    {
      id: 16,
      name: 'Bold Play',
      path: 'Boldplay',
    },
    // {
    //   id: 17,
    //   name: 'Net Game',
    //   path: 'NetGame',
    // },
    {
      id: 18,
      name: 'KA Gaming',
      path: 'KAGaming',
    },
    // {
    //   id: 19,
    //   name: 'Bold Play',
    //   path: 'Boldplay',
    // },
  ];
  useEffect(() => {
    getCasinoGame();
    setDeviceType(isMobile ? 'mobile' : 'desktop');
  }, [providerSearch, gameSearch]);
  useEffect(() => {
    if (game === 'all') {
      setGameSearch('');
    } else {
      setGameSearch(game);
    }
  }, [game]);

  const getCasinoGame = async () => {
    setIsLoading(true);
    try {
      const response = await getData(
        `/user/live-casino-search?provider=${providerSearch}&search=${gameSearch}`,
      );
      if (response?.status === 201 || response?.status === 200) {
        setIsLoading(false);
        setAllCasinoGame(response?.data?.response);
      }
    } catch (e) {
      setIsLoading(true);
      console.error(e);
      return null;
    }
  };

  const handleCasinoGame = useCallback(async (id) => {
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
      return;
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
  }, []);

  const subPlayer = [
    {
      id: 0,
      image: '/images/subheader/all3.png',
      path: 'all',
    },
    {
      id: 1,
      image: '/images/subheader/ezugii.png',
      path: 'ezugi',
    },
    // {
    //   id: 2,
    //   image: '/images/subheader/vivo-gaming.jpg',
    //   path: 'vivogaming',
    // },
    // {
    //   id: 3,
    //   image: '/images/subheader/7mojos.jpeg',
    //   path: '7mojos',
    // },
    // {
    //   id: 4,
    //   image: '/images/subheader/luckyy.png',
    //   path: 'luckystreak',
    // },
    {
      id: 5,
      image: '/images/subheader/evolution.jpeg',
      path: 'Evolution',
    },
    {
      id: 6,
      image: '/images/subheader/spribe.png',
      path: 'Spribe',
    },
    // {
    //   id: 7,
    //   image: '/images/subheader/netgamelogo.png',
    //   path: 'netgame',
    // },
    // {
    //   id: 8,
    //   image: '/images/subheader/quickspin.png',
    //   path: 'quickspin',
    // },
    // {
    //   id: 9,
    //   image: '/images/subheader/tv-bet.jpg',
    //   path: 'tvbet',
    // },
    // {
    //   id: 10,
    //   image: '/images/subheader/golden-race.png',
    //   path: 'goldenrace',
    // },
    // {
    //   id: 11,
    //   image: '/images/subheader/spinomenal.jpg',
    //   path: 'spinomenal',
    // },
    {
      id: 12,
      image: '/images/subheader/netgame.png',
      path: 'NetGame',
    },
    {
      id: 13,
      image: '/images/subheader/KAgame.png',
      path: 'KAGaming',
    },
    {
      id: 14,
      image: '/images/subheader/boldplay.png',
      path: 'Boldplay',
    },
    {
      id: 15,
      image: '/images/subheader/Turbo.png',
      path: 'Turbogames',
    },
    {
      id: 16,
      image: '/images/subheader/bgaming.png',
      path: 'BGaming',
    },
    {
      id: 17,
      image: '/images/subheader/Betgame.png',
      path: 'Betgames',
    },
    {
      id: 18,
      image: '/images/subheader/conceptgame.png',
      path: 'ConceptGaming',
    },
    {
      id: 19,
      image: '/images/subheader/expresso.png',
      path: 'Espressogames',
    },
  ];
  return (
    <>
      {isLoading && <Loading />}
      <div>
        <Header />
        <SmallDesc />
        {url ? (
          <CasinoPlay url={url} />
        ) : (
          <div
            className="bg-cover bg-no-repeat fixed left-0 top-[112px] md:top-[120px]  right-0 bottom-0 z-[-1] h-[calc(100vh-112px)] md:h-[calc(100vh-120px)] overflow-y-auto pb-20 md:pb-0"
            style={{ backgroundImage: 'url("/images/casino.jpeg")' }}
          >
            <div className=" min-h-full flex flex-col md:flex-row md:justify-between  xl:gap-[20px] gap-[7px] w-full ">
              {/* sub header */}
              <div className="fixed z-10 py-1 flex flex-col items-center justify-center gap-2 h-24 w-full md:hidden bg-gray-200 text-black  overflow-hidden">
                <div className="flex w-full justify-center items-center ">
                  <div className=" -skew-x-[24deg] rounded-lg w-40 bg-black flex justify-between items-center px-4 pl-10 p-2 -translate-x-4">
                    <span className="text-yellow-500 skew-x-[24deg]">
                      {reactIcons.trophy}
                    </span>
                    <span className="text-white font-bold skew-x-[24deg]">
                      Live Casino
                    </span>
                  </div>
                  <div className="flex-1 border border-black rounded-lg mr-2 h-5/6">
                    <input
                      className="w-full h-full bg-none rounded-lg px-2"
                      type="text"
                      name={'search'}
                      value={gameSearch}
                      readOnly={readOnly}
                      onFocus={() => setReadOnly(false)}
                      onBlur={() => setReadOnly(true)}
                      onChange={(event) => setGameSearch(event.target.value)}
                      placeholder="Search Games"
                    />
                  </div>
                  <div className="pr-5">
                    <span>{reactIcons.trophy}</span>
                  </div>
                </div>
                <div className="w-full flex gap-2  overflow-x-auto ">
                  <ul className="h-full flex justify-center items-center gap-1">
                    {subPlayer.map((item) => {
                      return (
                        <li
                          key={item.id}
                          className="h-full w-24  border-2 border-black rounded-md"
                        >
                          <button
                            onClick={() => {
                              setProviderSearch(item.path),
                                setIds(item.id),
                                setGameSearch('');
                            }}
                            className="h-full w-full"
                          >
                            <img
                              className="object-cover h-full w-full rounded-md"
                              src={item.image}
                              alt=""
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="block md:hidden h-24"></div>

              <div className="hidden md:flex w-100%">
                <div className="side-bar ">
                  <div className="flex w-full h-full sidebar-inner">
                    <Drawer
                      variant="permanent"
                      anchor="left"
                      className="relative pb-[20px]"
                    >
                      <List>
                        <div className="px-3 pb-1">
                          <div>
                            <h1 className="text-white font-inter">
                              POPULAR GAMES
                            </h1>
                          </div>
                        </div>
                      </List>
                      <List>
                        <div className="px-3 py-1">
                          <div>
                            <span className="absolute text-[25px] text-white top-[21px] left-[16px]">
                              {reactIcons.search}
                            </span>
                            <input
                              readOnly={readOnly}
                              onFocus={() => setReadOnly(false)}
                              onBlur={() => setReadOnly(true)}
                              type="text"
                              name={'search'}
                              value={gameSearch}
                              onChange={(event) =>
                                setGameSearch(event.target.value)
                              }
                              placeholder="Search Games"
                              className="bg-black border-white border-[1px]  text-white casino-input"
                            />
                          </div>
                        </div>
                      </List>
                      <List>
                        <div className="p-3">
                          <div>
                            <button className="bg-blue-gradient rounded w-full p-2 text-white font-inter">
                              Provider
                            </button>
                          </div>
                        </div>
                      </List>
                      {playerList.map((items, index) => {
                        return (
                          <div key={index} className="px-3 py-1">
                            <button
                              onClick={() => {
                                setProviderSearch(items.path),
                                  setIds(items.id),
                                  setGameSearch('');
                              }}
                              className={`${
                                providerSearch === items.path &&
                                Number(ids) === Number(items?.id)
                                  ? 'gradient-btn text-white'
                                  : 'gradient-btn-2 text-black'
                              } flex text-start rounded w-full p-2  font-inter`}
                            >
                              <span
                                className={`mt-1  ${
                                  providerSearch === items.path &&
                                  Number(ids) === Number(items?.id)
                                    ? 'text-white'
                                    : 'text-[#f5c973]'
                                }`}
                              >
                                {reactIcons.trophy}
                              </span>
                              <span className="ml-2">{items.name}</span>
                            </button>
                          </div>
                        );
                      })}
                    </Drawer>
                  </div>
                </div>
              </div>
              <div className="w-full p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 text-white relative">
                  {allCasinoGame.length === 0 ? (
                    <div className="flex w-full justify-center items-center absolute h-24 backdrop-blur-sm bg-white/20 rounded-md">
                      <h1 className="text-white font-bold  text-16 lg:text-2xl">
                        No Live Casino Available
                      </h1>
                    </div>
                  ) : (
                    <>
                      {' '}
                      {allCasinoGame &&
                        allCasinoGame.map((item, index) => (
                          <div
                            // onClick={() => handleCasinoGame(item?.id)}
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
                              onClick={() => handleCasinoGame(item?.id)}
                            >
                              <button
                                // onClick={() => handleCasinoGame(item?.id)}
                                className=" text-white btn-skew border border-[#CB9640] bg-[#2f3236b3] font-bold py-2 px-6 hidden md:inline"
                              >
                                {isLogin ? (
                                  <span>Play</span>
                                ) : (
                                  <span>Demo</span>
                                )}
                              </button>
                            </div>
                            <div className="backdrop-blur-md absolute bottom-0 left-0 right-0 p-2 bg-white/30">
                              <h3 className="whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-black">
                                {item.title}
                              </h3>
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

export default CasinoTable;
