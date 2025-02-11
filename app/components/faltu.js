<div className="bg-white pb-2 text-12 ">
  <h1 className="border-b border-gray-200 px-2 py-1 text-16 font-bold bg-[#1f5058] text-white text-center">
    Bet Slip
  </h1>
  <div
    className={`relative px-2 ${
      bets?.[0]?.betOn === 'BACK' ? 'bg-[#a7d8fd]' : 'bg-[#f9c9d4]'
    } my-2`}
  >
    <button
      onClick={() => {
        handleRemoveBet(betData?.selectionId);
      }}
      className="absolute top-2 right-2 text-red-700 text-xl"
    >
      {reactIcons.close}
    </button>
    <p> {bets?.[0]?.event}</p>
    <p>{bets?.[0]?.bettingOn}</p>
    <p> {bets?.[0]?.selection}</p>
  </div>
  <div className="px-2">
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <label htmlFor="" className="text-14 flex items-end  font-medium">
          Odds
        </label>
        <div
          className={` ${
            bets?.[0]?.betOn === 'BACK' ? ' bg-[#DAEDFF]' : ' bg-[#FFD6D6]'
          }  bg-[#DAEDFF] flex gap-2 rounded-tl-md rounded-bl-md px-3 py-1 `}
        >
          <p className="text-[#35495E]">
            {bets?.[0]?.betOn === 'BACK' ? 'Profit' : 'Liability'}
          </p>
          <p
            className={
              bets?.[0]?.betOn === 'BACK' ? 'text-[#219642]' : 'text-[#fa7272]'
            }
          >
            {bets?.[0]?.betOn === 'BACK'
              ? currentBetWinLossDatas?.calculation?.win.toFixed(2) || 0.0
              : currentBetWinLossDatas?.calculation?.loss.toFixed(2) || 0.0}
          </p>
        </div>
      </div>
      <div className="relative rounded-md overflow-hidden">
        <input
          type="text"
          disabled
          value={
            betData?.market == 'bookmaker'
              ? parseFloat((betData?.price / 100 + 1 || 0).toFixed(2))
              : parseFloat((betData?.price || 0).toFixed(2))
          }
          className="outline-none border border-gray-200   rounded-sm w-full h-10 px-12"
        />
        <button
          type="button"
          onClick={handleDecrease}
          className="absolute ay-center cursor-pointer h-10 left-0 bg-[#051316] font-bold px-3 py-1 w-10 flex-center text-white"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleIncrease}
          className="absolute ay-center cursor-pointer  h-10 right-0 bg-[#051316] font-bold px-3 py-1 w-10 flex-center text-white"
        >
          +
        </button>
      </div>
    </div>
    <div className="flex flex-col gap-1">
      <label htmlFor="" className="text-14 font-medium">
        Stakes
      </label>
      <div className="relative rounded-md overflow-hidden">
        <input
          type="number"
          onChange={handleChange}
          value={betData?.stake}
          placeholder="0"
          className="outline-none border border-gray-200   rounded-sm w-full h-10 px-12"
        />
        <button
          onClick={decreaseStake}
          className="absolute ay-center h-10 left-0 bg-[#051316] font-bold px-3 py-1 w-10 flex-center text-white"
        >
          -
        </button>
        <button
          onClick={increaseStake}
          className="absolute ay-center h-10 right-0 bg-[#051316] font-bold px-3 py-1 w-10 flex-center text-white"
        >
          +
        </button>
      </div>
    </div>

    {formError.stake && (
      <div className="form-eror flex text-start text-14">{formError.stake}</div>
    )}
  </div>
  <div className="grid grid-cols-3 gap-3 p-2 ">
    {betStake &&
      betStake.map((item) => {
        return (
          <button
            key={item}
            onClick={() => {
              setBetData({
                ...betData,
                stake: item,
              });
            }}
            className={`border border-gray-200 rounded-xl flex-center ${
              item === betData?.stake ? 'bg-primary-700' : 'bg-white'
            }`}
          >
            {item}
          </button>
        );
      })}

    <button
      onClick={() => {
        setBetData({
          ...betData,
          stake: 25000,
        });
      }}
      className={`border border-gray-200 rounded-xl col-span-3 flex-center ${
        25000 === betData?.stake ? 'bg-primary-700' : 'bg-white'
      }`}
    >
      25000
    </button>
  </div>
  <div className="grid grid-cols-3 gap-2 px-2">
    <button
      onClick={() => setBetData({ ...betData, stake: 100 })}
      className="border border-gray-200 bg-gray-200 rounded-xl flex-center"
    >
      Min
    </button>
    <button
      onClick={() => setBetData({ ...betData, stake: 25000 })}
      className="border border-gray-200 bg-gray-200 rounded-xl flex-center"
    >
      Max
    </button>
    <button
      onClick={() => {
        setBetData({ ...betData, stake: '' });
      }}
      className="border border-gray-200 bg-gray-200 rounded-xl flex-center"
    >
      Clear
    </button>
  </div>
  <div className="flex items-center justify-end gap-2  p-2 mt-2">
    <button
      onClick={() => {
        handleRemoveBet(betData?.selectionId);
      }}
      className="bg-[#bf3e35] text-white px-4 py-1 rounded-lg"
    >
      Cancel
    </button>
    <button
      disabled={
        betData?.stake === '' || betData?.stake === 0 || loading ? true : false
      }
      onClick={(e) => placeBet(e)}
      className={`text-white px-4 flex gap-2 items-center py-1 rounded-lg ${
        betData?.stake === '' || betData?.stake === 0
          ? 'bg-[#5c996f] border-[#5c996f] '
          : 'bg-[#0EAD69] border-[#0EAD69]'
      }`}
    >
      {loading && (
        <AiOutlineLoading3Quarters className="animate-spin text-14" />
      )}{' '}
      Place Order
    </button>
  </div>
</div>;
