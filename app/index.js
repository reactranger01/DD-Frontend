import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import createReducer from './redux/reducers';
import rootSaga from './redux/rootSaga';

const sagaMiddleware = createSagaMiddleware();
const reducer = createReducer();
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
});
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state.bet);
    localStorage.setItem('reduxState', serializedState);
  } catch (error) {
    // Handle any errors
  }
};
store.subscribe(() => {
  const state = store.getState();
  saveStateToLocalStorage(state);
});
sagaMiddleware.run(rootSaga);
const MOUNT_NODE = document.getElementById('app');
const root = ReactDOM.createRoot(MOUNT_NODE);
export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined; // Return undefined to use the initial state defined in your reducers
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined; // Return undefined to use the initial state defined in your reducers
  }
};
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
