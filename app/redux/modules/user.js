import { SET_USER, CLEANUP } from '../actions/actionConstants';

// Async function to fetch user details

const initialState = {};

const userModule = (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
      };
    case CLEANUP:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default userModule;
