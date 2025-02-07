import { combineReducers } from '@reduxjs/toolkit';
import ui from './modules/ui';
import betModule from './modules/bet';
import calculationModule from './modules/calculation';
import userBetsModule from './modules/userBets';
import userModule from './modules/user';
import userDetailsModule from './modules/userDeatil';
import LiveTVModule from './modules/liveTv';
import activeIndexReducer from './Slices/newBetSlice';

export default function createReducer() {
  const rootReducer = combineReducers({
    bet: betModule,
    calculation: calculationModule,
    userEventBets: userBetsModule,
    userDetails: userDetailsModule,
    activeNewBet: activeIndexReducer,
    user: userModule,
    tv: LiveTVModule,
    ui,
  });

  return rootReducer;
}
