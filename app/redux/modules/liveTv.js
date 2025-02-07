import { LIVE_TV } from '../actions/actionConstants';

// import { SET_SELECTED_BET } from '@actions/actionConstants';

const initialState = {
  liveTv: { eventid: '', tvshow: false, game: '' },
};
const LiveTVModule = (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case LIVE_TV:
      return {
        ...state,
        liveTv: action.payload.payload,
      };
    default:
      return state;
  }
};

export default LiveTVModule;
