import { put, takeLatest, all } from 'redux-saga/effects';
import * as types from './actions/actionConstants';
import {
  fetchBetDetailsAction,
  fetchCurrentCalculationAction,
  fetchLiveTvAction,
  fetchUserDetailsAction,
  fetchUserEventBetsAction,
} from './actions';
// import { getUser } from './modules/user';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
// import { getUser } from './modules/user';

function* fetchBet(action) {
  try {
    const betDetails = yield fetchBetDetailsAction(action.payload); // Implement this function
    yield put({ type: types.SET_SELECTED_BET, payload: betDetails });
  } catch (error) {
    // Handle errors
  }
}

function* fetchCurrentCalculation(action) {
  try {
    const calculation = yield fetchCurrentCalculationAction(action.payload); // Implement this function
    yield put({ type: types.CURRENT_CALCULATION, payload: calculation });
  } catch (error) {
    // Handle errors
  }
}
function* fetchUserDetails(action) {
  try {
    const detils = yield fetchUserDetailsAction(action.payload); // Implement this function
    yield put({ type: types.USER_DETAILS, payload: detils });
  } catch (error) {
    // Handle errors
  }
}
function* fetchLiveTvDetails(action) {
  try {
    const detils = yield fetchLiveTvAction(action.payload); // Implement this function
    yield put({ type: types.LIVE_TV, payload: detils });
  } catch (error) {
    // Handle errors
  }
}
function* fetchUserEventBets(action) {
  try {
    const allEventBets = yield fetchUserEventBetsAction(action.payload); // Implement this function
    yield put({ type: types.USER_EVENT_BETS, payload: allEventBets });
  } catch (error) {
    // Handle errors
  }
}

function* init() {
  const getUser = async () => {
    const islogin = isLoggedIn();
    if (islogin) {
      try {
        const response = await getAuthData('/user/get-user-details');
        if (response?.status === 200) {
          return response.data;
        }

        return null;
      } catch (e) {
        console.error('Error fetching user details:', e);
        return null;
      }
    }
  };
  const user = yield getUser();
  if (user) {
    yield put({
      type: types.SET_USER,
      payload: {
        ...user,
      },
    });
  }
}

function* refreshUserDetails() {
  const getUser = async () => {
    try {
      const response = await getAuthData('/user/get-user-details');

      if (response?.status === 200) {
        return response.data;
      }

      return null;
    } catch (e) {
      console.error('Error fetching user details:', e);
      return null;
    }
  };
  const user = yield getUser();
  if (user) {
    yield put({
      type: types.SET_USER,
      payload: user,
    });
  }
}

function* actionWatcher() {
  yield takeLatest(types.INIT, init);
  yield takeLatest(types.REFRESH_USER_DETAILS, refreshUserDetails);
}

function* betWatcher() {
  yield takeLatest(types.FETCH_BET_DETAILS, fetchBet);
  yield takeLatest(types.FETCH_CURRENT_CALCULATION, fetchCurrentCalculation);
  yield takeLatest(types.FETCH_USER_EVENT_BETS, fetchUserEventBets);
  yield takeLatest(types.FETCH_USER_DETAILS, fetchUserDetails);
  yield takeLatest(types.FETCH_LIVE_TV, fetchLiveTvDetails);
}

export default function* rootSaga() {
  yield all([actionWatcher(), betWatcher()]);
}
