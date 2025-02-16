import './i18n';
import React, { Fragment } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Home,
  NotFound,
  Login,
  Signup,
  Main,
  ClickBet,
  EditStake,
  MoreOption,
  AccountInfo,
  Password,
  BankDetails,
  KycVerification,
  Deposit,
  Withdraw,
  History,
  WalletTransaction,
  MyBets,
  ProfitAndLoss,
  CasinoStatement,
  AccountStatement,
  TunroverStatement,
  SingleBetCricket,
  SingleBetFootball,
  SingleBetTennis,
  CasinoTable,
  Upi,
} from '@containers/pageListAsync';
import Profile from './containers/Profile';
import {
  AddAccount,
  AddUpi,
  AviatorTable,
  Cricket,
  EditBankAccountDetails,
  Football,
  SportsBookStatements,
  Tennis,
  ViewBetDetails,
} from './containers/pageListAsync';
import PrivateRoute from './containers/auth/PrivateRoute';
// import { useDispatch } from 'react-redux';
// import { fetchBetDetailsAction } from './redux/actions';
// import { loadStateFromLocalStorage } from '.';
import ScrollToTop from './components/ScrollToTop';
import AllMobileHome from './components/Home/AllMobileHome';
// import ScrollToTop from './components/ScrollToTop';

function App() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   if (loadStateFromLocalStorage()) {
  //     dispatch(fetchBetDetailsAction(loadStateFromLocalStorage().selectedBet));
  //   }
  // }, [dispatch]);

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={1}
        ProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        // pauseOnFocusLoss
        draggable
        // pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<NotFound />} />

          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/cricket" element={<Cricket />} />
            <Route path="/all" element={<AllMobileHome />} />
            <Route path="/in-play" element={<Home />} />
            <Route path="/football" element={<Football />} />
            <Route path="/casino" element={<MoreOption />} />
            <Route path="/tennis" element={<Tennis />} />
            <Route path="/click-bet" element={<ClickBet />} />
            <Route path="/bet-details" element={<ViewBetDetails />} />
            <Route path="/edit-stake" element={<EditStake />} />
            <Route
              path="/singlebet/cricket/:eventId"
              element={<SingleBetCricket />}
            />
            <Route
              path="/singlebet/soccer/:eventId"
              element={<SingleBetFootball />}
            />
            <Route
              path="/singlebet/tennis/:eventId"
              element={<SingleBetTennis />}
            />
            <Route path="/more-option" element={<MoreOption />} />
          </Route>
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <PrivateRoute>
                  <AccountInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/account-info"
              element={
                <PrivateRoute>
                  <AccountInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/password"
              element={
                <PrivateRoute>
                  <Password />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/bank-details"
              element={
                <PrivateRoute>
                  <BankDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/bank-details/add-account"
              element={
                <PrivateRoute>
                  <AddAccount />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/bank-details/edit-bank-account-details"
              element={
                <PrivateRoute>
                  <EditBankAccountDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/upi-details"
              element={
                <PrivateRoute>
                  <Upi />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/upi-details/add-upi"
              element={
                <PrivateRoute>
                  <AddUpi />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/kyc-verification"
              element={
                <PrivateRoute>
                  <KycVerification />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/deposit"
              element={
                <PrivateRoute>
                  <Deposit />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/withdraw"
              element={
                <PrivateRoute>
                  <Withdraw />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/history"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/wallet-transaction"
              element={
                <PrivateRoute>
                  <WalletTransaction />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/my-bets"
              element={
                <PrivateRoute>
                  <MyBets />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/profit-and-loss"
              element={
                <PrivateRoute>
                  <ProfitAndLoss />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/casino-statement"
              element={
                <PrivateRoute>
                  <CasinoStatement />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/account-statement"
              element={
                <PrivateRoute>
                  <AccountStatement />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/sportsbook-statement"
              element={
                <PrivateRoute>
                  <SportsBookStatements />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/turnover-statement"
              element={
                <PrivateRoute>
                  <TunroverStatement />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="/casino-table/:game/:id" element={<CasinoTable />} />
          <Route path="/aviator" element={<AviatorTable />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
