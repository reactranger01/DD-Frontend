import { USER_DETAILS } from '../actions/actionConstants';

// import { SET_SELECTED_BET } from '@actions/actionConstants';

const userDetails = {
  data: {},
};
const userDetailsModule = (state = { ...userDetails }, action = {}) => {
  switch (action.type) {
    case USER_DETAILS:
      return {
        ...state,
        data: action.payload.payload,
      };
    default:
      return state;
  }
};

export default userDetailsModule;
