export const mergeData = (eventNames, parsedData) => {
  return eventNames.map((eventItem) => {
    // Find a matching parsedItem based on event_id
    const parsedItem = parsedData.find(
      (item) => Number(item.eventid || item.matchId) === eventItem.event_id,
    );

    if (parsedItem) {
      // If matching parsedItem is found, update with parsed data
      const updatedRunners = parsedItem.odds.map((runner) => {
        const eventRunner = eventItem.runners.find(
          (er) => er.selectionId === runner.selectionId,
        );

        return {
          ...runner,
          runnerName: eventRunner ? eventRunner.runnerName : null,
        };
      });

      return {
        ...eventItem,
        ...parsedItem, // Merge all keys from parsedItem
        odds: updatedRunners || [], // Update odds with parsed data
        runners: eventItem.runners, // Ensure runners are included
      };
    }

    // If no matching parsedItem is found, return eventItem with default values for odds
    return {
      ...eventItem,
      odds: [], // Default value if no parsedItem found
      // Keep other properties as they are
    };
  });
};
export const mapOddsWithRunners = (data) => {
  return data?.map((item) => {
    let modifiedOdds = item?.odds?.map((odd) => {
      let correspondingRunner = item?.runners?.find(
        (r) => r.selectionId === Number(odd.selectionId),
      );
      return {
        ...odd,
        runnerName: correspondingRunner?.runnerName || '',
      };
    });
    return {
      ...item,
      odds: {
        ...item.odds,
        runners: modifiedOdds,
        marketId: item.marketId || item.market_id,
        inplay: item.inplay || false,
      },
    };
  });
};
export const getRunnerName = (items, fixtureEventName) => {
  const correspondingFixture = fixtureEventName.find((fixture) =>
    fixture.runners.some(
      (fixtureRunner) =>
        fixtureRunner.selectionId.toString() === items.selectionId,
    ),
  );

  const fixtureRunner = correspondingFixture
    ? correspondingFixture.runners.find(
        (fixtureRunner) =>
          fixtureRunner.selectionId.toString() === items.selectionId,
      )
    : null;

  return fixtureRunner ? fixtureRunner.runnerName : '';
};
export function intToString(num) {
  if (num < 1000) {
    return num;
  }
  var si = [
    { v: 1e3, s: 'K' },
    { v: 1e6, s: 'M' },
    { v: 1e9, s: 'B' },
    { v: 1e12, s: 'T' },
    { v: 1e15, s: 'P' },
    { v: 1e18, s: 'E' },
  ];
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].v) {
      break;
    }
  }
  return (
    (num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
    si[i].s
  );
}
export const parseRunners = (marketData, marketName) => {
  return (
    marketData?.catalogue?.map((item) => {
      if (item.marketName === marketName) {
        return {
          ...item,
          runners: JSON.parse(item.runners),
        };
      }
      return item;
    }) || []
  );
};
export const parseRunnerss = (marketData, marketName) => {
  if (marketData?.catalogue) {
    const marketItem = marketData.catalogue.find(
      (item) => item.marketName === marketName,
    );
    if (marketItem) {
      return {
        ...marketItem,
        runners: JSON.parse(marketItem.runners),
      };
    }
  }
  return null;
};

// if (OverUnder15Goals?.catalogue) {
//   OverUnder15Goals?.catalogue?.forEach((item) => {
//     if (item.marketName === 'Over/Under 1.5 Goals') {
//       const parsedRunners = JSON.parse(item.runners);

//       const updatedItem = {
//         ...item,
//         runners: parsedRunners,
//       };

//       setOverUnder15Goals(updatedItem);
//     }
//   });
// } else {
//   setOverUnder15Goals([]);
// }
// if (OverUnder25Goals?.catalogue?.length !== 0) {
//   OverUnder25Goals?.catalogue?.forEach((item) => {
//     if (item.marketName === 'Over/Under 2.5 Goals') {
//       const parsedRunners = JSON.parse(item.runners);

//       const updatedItem = {
//         ...item,
//         runners: parsedRunners,
//       };

//       setOverUnder25Goals(updatedItem);
//     }
//   });
// }
// if (MatchOdds?.catalogue.length !== 0) {
//   MatchOdds?.catalogue?.forEach((item) => {
//     if (
//       item?.marketName === 'Match Odds' ||
//       item?.marketName === 'Winner' ||
//       item?.marketName === 'MATCH_ODDS'
//     ) {
//       const parsedRunners = JSON.parse(item.runners);
//       const updatedItem = {
//         ...item,
//         runners: parsedRunners,
//       };
//       setOdds(updatedItem);
//     }
//   });
// } else {
//   setOdds([]);
// }
// if (OverUnder35Goals?.catalogue?.length !== 0) {
//   OverUnder35Goals?.catalogue?.forEach((item) => {
//     if (item?.marketName === 'Over/Under 3.5 Goals') {
//       const parsedRunners = JSON.parse(item.runners);
//       const updatedItem = {
//         ...item,
//         runners: parsedRunners,
//       };
//       setOverUnder35Goals(updatedItem);
//     } else {
//       setOverUnder35Goals([]);
//     }
//   });
// } else {
//   setOverUnder35Goals([]);
// }
