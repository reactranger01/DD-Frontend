import {
  Banner,
  BottomHeader,
  HeroSectionWebSlider,
  // HeroSlider,
  InplayFootball,
  SmallDesc,
} from '@/components';
import PopularFixtureFootball from '@/components/Home/PopularFixtureFootball';
import { getAuthData } from '@/utils/apiHandlers';
import { popularList } from '@/utils/contants';
import { mapOddsWithRunners, mergeData } from '@/utils/mergeData';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Football = () => {
  const navigate = useNavigate();
  const [openTab, setOpenTab] = useState(1);
  const [fixtureData, setFixtureData] = useState([]);
  const [fixtureEventName, setFixtureEventName] = useState([]);
  const todayDate = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  // const dayAfterTomorrow = new Date();
  // dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  // const yesterdatDate = dayAfterTomorrow.toISOString().split('T')[0];
  // const pastDate = new Date();
  // pastDate.setDate(pastDate.getDate() - 1);
  // const pastDateTime = pastDate.toISOString().split('T')[0];
  const tomorrowDateString = tomorrowDate.toISOString().split('T')[0];
  useEffect(() => {
    // Initial call to fetch data
    getEventData();
    const intervalId = setInterval(() => {
      getEventData();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const getEventData = async () => {
    try {
      const response = await getAuthData(
        '/catalogue/soccer/get-events-with-markets',
      );
      // /catalogue/cricket/get-events-with-markets

      if (response?.status === 201 || response?.status === 200) {
        if (response?.data) {
          const convertedData = response?.data;
          setFixtureEventName(convertedData);
        }
      } else {
        setFixtureEventName([]);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    let source;
    const getSteam = () => {
      try {
        if (source) {
          source.close();
        }
        source = new EventSource(
          `${process.env.API_URL}/catalogue/soccer/get-fixture-stream`,
        );
        source.onmessage = function (e) {
          if (e.data) {
            const dataArray = Object.values(JSON.parse(e.data)).map((item) => ({
              ...item,
            }));
            setFixtureData(dataArray);
          }
        };
      } catch (error) {
        console.log(error);
      }
    };
    getSteam();
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [navigate]);
  const parsedFixtureData = fixtureData
    .filter((item) => item.status !== 'CLOSED')
    .map((item) => {
      const parsedItem = {
        ...item,
        odds: JSON.parse(item.runners),
      };
      delete parsedItem.runners;
      return parsedItem;
    });

  const mergedData = mergeData(fixtureEventName, parsedFixtureData);
  // runnername add in runners
  let WantData = mapOddsWithRunners(mergedData);
  // openDate & inplay not available remove data from array && item.odds.status === 'OPEN',
  const NewfilteredData = WantData.filter(
    (item) =>
      'matchDateTime' in item &&
      item?.isDelete === false &&
      item?.status !== 'CLOSED',
  );

  // today matches
  const todayDataInplayFalse = NewfilteredData.filter((entry) => {
    const entryDate = new Date(entry?.matchDateTime)
      ?.toISOString()
      ?.split('T')[0];
    return entryDate === todayDate && entry?.odds?.inplay === false;
  });

  //tomorrow matches
  const tomorrowData = NewfilteredData?.filter((entry) => {
    const entryDate = new Date(entry.matchDateTime)
      ?.toISOString()
      ?.split('T')[0];
    return entryDate === tomorrowDateString;
  });
  //upcoming matches
  // const remainingData = NewfilteredData?.filter((entry) => {
  //   const entryDate = new Date(entry.openDate)?.toISOString()?.split('T')[0];
  //   return entryDate >= dayAfterTomorrowDateString;
  // });

  const remainingData = NewfilteredData.filter((entry) => {
    const entryDate = new Date(entry?.matchDateTime)
      ?.toISOString()
      ?.split('T')[0];
    return (
      entryDate !== todayDate &&
      entryDate !== tomorrowDateString &&
      entryDate >= todayDate
    );
  });

  return (
    <>
      <SmallDesc />
      {/* <HeroSlider /> */}
      <div className="hidden md:flex bg-white">
        <HeroSectionWebSlider />
      </div>
      <BottomHeader />
      <div
        className="flex justify-between w-full h-auto bg-cover bg-no-repeat bg-right-top bg-fixed md:px-2 gap-3 xl:gap-5 flex-col xl:flex-row"
        style={{ backgroundImage: 'url("/images/newBanners/allBg.webp")' }}
      >
        <div className="flex-1 bg-black md:bg-transparent">
          <InplayFootball fixtureData={mergedData} />
          <div className="">
            <div className="relative">
              <div className="shape-rect h-[35px] flex">
                <div className="bg-primary-1200 h-full w-[120px] md:w-[250px] flex items-center p-[10px] font-medium text-white text-20">
                  Popular
                </div>
                <div className="curve-part bg-primary-1200 w-[50px] h-full skew-x-[33deg] rounded-10 -ml-[27px] border-none"></div>
              </div>

              <div className="h-full overflow-auto custom-scroll">
                <div className="flex flex-wrap">
                  <div className="w-full">
                    <div className="w-full flex justify-between items-center">
                      <ul
                        className="flex mb-0 list-none w-full flex-wrap flex-row border-b border-[#ffffff]"
                        role="tablist"
                      >
                        {popularList.map((item, index) => (
                          <li
                            className="-mb-px mr-2 last:mr-0 flex-auto text-center max-w-[120px] font-inter"
                            key={index}
                          >
                            <a
                              className={
                                'text-sm font-bold px-4 py-2 shadow-lg leading-normal flex items-center justify-center ' +
                                (openTab === item.id
                                  ? 'text-primary-1300 border-b-[3px] border-primary-1300'
                                  : 'text-white border-0')
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenTab(item.id);
                              }}
                              data-toggle="tab"
                              href="#link1"
                              role="tablist"
                            >
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative flex flex-col min-w-0 break-words w-full mt-4 font-inter">
                      <div className="flex-auto">
                        <div className="tab-content tab-space">
                          <div
                            className={openTab === 1 ? 'block' : 'hidden'}
                            id="link1"
                          >
                            <div className="w-full flex flex-col pb-3 md:pb-8">
                              <div className="w-full md:flex flex-row items-center hidden">
                                <ul className="bg-[#201c67] w-full grid grid-cols-5 items-center m-0 pl-3 rounded-md">
                                  <li className="col-span-2">
                                    <div className="grid items-center grid-cols-2">
                                      <span className="col-span-1 text-[13px] uppercase font-semibold text-white">
                                        Match
                                      </span>
                                      <span className="col-span-1 flex justify-center text-[13px] uppercase font-semibold text-white">
                                        Status
                                      </span>
                                    </div>
                                  </li>
                                  <li className="col-span-2 text-[13px] uppercase font-semibold text-center text-white">
                                    Click on Odds to BET
                                  </li>
                                  <li className="col-span-1 bg-[#6778E3] flex justify-center flex-col items-center rounded-br-md rounded-tr-md py-1 leading-none">
                                    <span className="uppercase text-[13px] font-semibold text-white">
                                      Boost your BET
                                    </span>
                                    <p className="text-xs text-[#281960] !text-10 !xl:text-12 font-semibold">
                                      Use Bookmaker And Fancy
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div className="hidden md:grid grid-cols-5 items-center w-full relative text-[13px] text-[#ced8ea] bg-[#323232] pl-3">
                                <div className="col-span-2 py-2">
                                  <span>Teams</span>
                                </div>
                                <div className="col-span-2 flex items-center justify-around py-2">
                                  <span>1</span>
                                  <span>X</span>
                                  <span>2</span>
                                </div>
                                <div className="col-span-1 bg-[#454545] h-full"></div>
                              </div>
                              <PopularFixtureFootball
                                data={todayDataInplayFalse}
                              />
                            </div>
                          </div>
                          <div
                            className={openTab === 2 ? 'block' : 'hidden'}
                            id="link1"
                          >
                            <div className="w-full flex flex-col pb-3 md:pb-8">
                              <div className="w-full md:flex flex-row items-center hidden">
                                <ul className="bg-[#201c67] w-full grid grid-cols-5 items-center m-0 pl-3 rounded-md">
                                  <li className="col-span-2">
                                    <div className="grid items-center grid-cols-2">
                                      <span className="col-span-1 text-[13px] uppercase font-semibold text-white">
                                        Match
                                      </span>
                                      <span className="col-span-1 flex justify-center text-[13px] uppercase font-semibold text-white">
                                        Status
                                      </span>
                                    </div>
                                  </li>
                                  <li className="col-span-2 text-[13px] uppercase font-semibold text-center text-white">
                                    Click on Odds to BET
                                  </li>
                                  <li className="col-span-1 bg-[#6778E3] flex justify-center flex-col items-center rounded-br-md rounded-tr-md py-1 leading-none">
                                    <span className="uppercase text-[13px] font-semibold text-white">
                                      Boost your BET
                                    </span>
                                    <p className="text-xs text-[#281960] !text-10 !xl:text-12 font-semibold">
                                      Use Bookmaker And Fancy
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div className="hidden md:grid grid-cols-5 items-center w-full relative text-[13px] text-[#ced8ea] bg-[#323232] pl-3">
                                <div className="col-span-2 py-2">
                                  <span>Teams</span>
                                </div>
                                <div className="col-span-2 flex items-center justify-around py-2">
                                  <span>1</span>
                                  <span>X</span>
                                  <span>2</span>
                                </div>
                                <div className="col-span-1 bg-[#454545] h-full"></div>
                              </div>

                              <PopularFixtureFootball data={tomorrowData} />
                            </div>
                          </div>
                          <div
                            className={openTab === 3 ? 'block' : 'hidden'}
                            id="link1"
                          >
                            <div className="w-full flex flex-col pb-3 md:pb-8">
                              <div className="w-full md:flex flex-row items-center hidden">
                                <ul className="bg-[#201c67] w-full grid grid-cols-5 items-center m-0 pl-3 rounded-md">
                                  <li className="col-span-2">
                                    <div className="grid items-center grid-cols-2">
                                      <span className="col-span-1 text-[13px] uppercase font-semibold text-white">
                                        Match
                                      </span>
                                      <span className="col-span-1 flex justify-center text-[13px] uppercase font-semibold text-white">
                                        Status
                                      </span>
                                    </div>
                                  </li>
                                  <li className="col-span-2 text-[13px] uppercase font-semibold text-center text-white">
                                    Click on Odds to BET
                                  </li>
                                  <li className="col-span-1 bg-[#6778E3] flex justify-center flex-col items-center rounded-br-md rounded-tr-md py-1 leading-none">
                                    <span className="uppercase text-[13px] font-semibold text-white">
                                      Boost your BET
                                    </span>
                                    <p className="text-xs text-[#281960] !text-10 !xl:text-12 font-semibold">
                                      Use Bookmaker And Fancy
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div className="hidden md:grid grid-cols-5 items-center w-full relative text-[13px] text-[#ced8ea] bg-[#323232] pl-3">
                                <div className="col-span-2 py-2">
                                  <span>Teams</span>
                                </div>
                                <div className="col-span-2 flex items-center justify-around py-2">
                                  <span>1</span>
                                  <span>X</span>
                                  <span>2</span>
                                </div>
                                <div className="col-span-1 bg-[#454545] h-full"></div>
                              </div>

                              <PopularFixtureFootball data={remainingData} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:max-w-[390px] w-full hidden md:block">
          <Banner />
        </div>
      </div>
    </>
  );
};

export default Football;
