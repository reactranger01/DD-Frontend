import React from 'react';

const FancyCricket = () => {
  return (
    <div className="w-full flex items-start bg-[#ccc]-200 mb-5 md:mb-10">
      <div className="w-full flex flex-col">
        <BettingOption
          title={'FANCY'}
          heading1={'Back'}
          heading2={'Lay'}
          handleClick={handleFancyShow}
          showIcon={fancyShow}
        />
        {fancyShow && (
          <>
            {' '}
            {fancy &&
              fancy?.runners &&
              fancy?.runners?.map((items, index) => {
                const fancyExposer =
                  placedBetWinLossFancy?.type === 'fancy' &&
                  placedBetWinLossFancy?.exposer !== ''
                    ? placedBetWinLossFancy?.exposer?.find(
                        (fancy) => fancy?.id === Number(items?.SelectionId),
                      )
                    : '';
                return (
                  <div
                    key={index}
                    className={` md:mb-0.5 w-full flex flex-row  text-[13px] justify-evenly relative pr-0 rounded-[0px_0px_20px] bg-white font-inter items-center my-1 ${
                      items.RunnerName.toLowerCase().includes('win the toss') ||
                      items.RunnerName.toLowerCase().includes('lunch fav') ||
                      items.RunnerName.toLowerCase().includes('hatrick') ||
                      items.RunnerName.toLowerCase().includes('maiden') ||
                      items.RunnerName.toLowerCase().includes(
                        '1st wkt caught out',
                      )
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    <div className="md:basis-[40%] basis-[75%] p-2 md:p-0 text-sm font-[normal] flex justify-start items-center  border-r-[rgba(128,128,128,0.2)] border-r border-solid">
                      <div>
                        <div
                          onClick={() =>
                            handleOpenModal(
                              items?.SelectionId,
                              items?.RunnerName,
                              'fancy',
                            )
                          }
                          className="flex cursor-pointer flex-col justify-center"
                        >
                          <span className="capitalize text-14 leading-5 font-medium m-0 font-inter">
                            {items?.RunnerName}
                          </span>
                        </div>
                        {fancyExposer ? (
                          <>
                            <div>
                              {fancyExposer?.type === 'profit' ? (
                                <div className="">
                                  {' '}
                                  <span
                                    className={`text-14 ${
                                      fancyExposer?.data > 0
                                        ? 'text-[#04a928]'
                                        : 'text-black'
                                    }`}
                                  >
                                    {(fancyExposer?.data || 0).toFixed(2) || 0}
                                  </span>
                                </div>
                              ) : (
                                0
                              )}
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <div className="flex flex-wrap items-center text-sm font-[normal] mt-[0.25em]"></div>
                      </div>
                    </div>

                    <div className="flex basis-[60%] md:justify-center justify-end relative  min-w-0 p-0">
                      <div className="flex w-full justify-center md:flex-none flex-1">
                        <div className="md:flex hidden w-1/3 "></div>
                        <div className="flex md:w-1/3 w-full justify-center md:p-0 p-1">
                          {items?.GameStatus === '' ||
                          items?.GameStatus === 'ACTIVE' ? (
                            <div className="flex flex-1">
                              <BlueButton
                                backPrize={items?.BackPrice1}
                                backSize={items?.BackSize1}
                                onClick={async () => {
                                  if (isLogin) {
                                    await addToNormalBetPlace(
                                      items,
                                      'BACK',
                                      index,
                                      items.BackPrice1,
                                      fancy.market,
                                      matchData?.name,
                                      items.BackSize1,
                                      items.RunnerName,
                                      fancy,
                                      fixtureEventName?.[0]
                                        ?.inPlayFancyMinLimit,
                                      fixtureEventName?.[0]
                                        ?.inPlayFancyMaxLimit,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              />
                              <PinkButton
                                layPrize={items?.LayPrice1}
                                laySize={items?.LaySize1}
                                onClick={async () => {
                                  if (isLogin) {
                                    await addToNormalBetPlace(
                                      items,
                                      'LAY',
                                      index,
                                      items.LayPrice1,
                                      fancy.market,
                                      matchData?.name,
                                      items.LaySize1,
                                      items.RunnerName,
                                      fancy,
                                      fixtureEventName?.[0]
                                        ?.inPlayFancyMinLimit,
                                      fixtureEventName?.[0]
                                        ?.inPlayFancyMaxLimit,
                                    );
                                  } else {
                                    navigate('/login');
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex justify-center md:w-1/3 flex-1">
                              <StatusButton status={items?.GameStatus} />
                            </div>
                          )}
                        </div>

                        <div className=" hidden w-1/3 md:flex flex-col justify-center grow relative z-0 text-right min-h-[42px] cursor-not-allowed pointer-events-none mx-[0.15em] my-0 px-[0.5em] py-[0.12em]">
                          <p className="leading-[17px] text-black text-12">
                            Min Bet:
                            {fixtureEventName?.[0]?.inPlayFancyMinLimit}
                          </p>
                          <p className="leading-[17px] text-black text-12">
                            Max Bet:
                            {fixtureEventName?.[0]?.inPlayFancyMaxLimit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
};

export default FancyCricket;
