import React from 'react';
import { Loading } from '@/components';
import loadable from '../utils/loadable';

// Main Page
export const Main = loadable(() => import('./Main'), {
  fallback: <Loading />,
});

// Home Page
export const Home = loadable(() => import('./Home'), {
  fallback: <Loading />,
});

// ClickBate Page
export const ClickBet = loadable(() => import('./ClickBet'), {
  fallback: <Loading />,
});

// ClickBate Page
export const EditStake = loadable(() => import('./EditStake'), {
  fallback: <Loading />,
});
// Cricket
export const Cricket = loadable(() => import('./Cricket'), {
  fallback: <Loading />,
});

// Football
export const Football = loadable(() => import('./Football'), {
  fallback: <Loading />,
});
// Tennis
export const Tennis = loadable(() => import('./Tennis'), {
  fallback: <Loading />,
});
// Casino
export const Casino = loadable(() => import('./Casino'), {
  fallback: <Loading />,
});

// More option Page
export const MoreOption = loadable(() => import('./MoreOption'), {
  fallback: <Loading />,
});

//Single Bet Cricket
export const SingleBetCricket = loadable(() => import('./SingleBetCricket'), {
  fallback: <Loading />,
});
//Single Bet Football
export const SingleBetFootball = loadable(() => import('./SingleBetFootball'), {
  fallback: <Loading />,
});
export const SingleBetTennis = loadable(() => import('./SingleBetTennis'), {
  fallback: <Loading />,
});

// Login Page
export const Login = loadable(() => import('./Login'), {
  fallback: <Loading />,
});

// Signup Page
export const Signup = loadable(() => import('./Signup'), {
  fallback: <Loading />,
});

// Signup Page
export const Profile = loadable(() => import('./Profile'), {
  fallback: <Loading />,
});

// AccountInfo Page
export const AccountInfo = loadable(() => import('./AccountInfo'), {
  fallback: <Loading />,
});

// Password Page
export const Password = loadable(() => import('./Password'), {
  fallback: <Loading />,
});

// BankDetails Page
export const BankDetails = loadable(() => import('./BankDetails'), {
  fallback: <Loading />,
});
export const AddAccount = loadable(() => import('./BankDetails/AddAccount'), {
  fallback: <Loading />,
});
export const EditBankAccountDetails = loadable(
  () => import('./BankDetails/EditBankAccountDetails'),
  {
    fallback: <Loading />,
  },
);
// UPIDetails Page
export const Upi = loadable(() => import('./Upi'), {
  fallback: <Loading />,
});
export const AddUpi = loadable(() => import('./Upi/AddUpi'), {
  fallback: <Loading />,
});
// KycVerification Page
export const KycVerification = loadable(() => import('./KycVerification'), {
  fallback: <Loading />,
});

// Deposit Page
export const Deposit = loadable(() => import('./Deposit'), {
  fallback: <Loading />,
});

// Withdraw Page
export const Withdraw = loadable(() => import('./Withdraw'), {
  fallback: <Loading />,
});

// History Page
export const History = loadable(() => import('./History'), {
  fallback: <Loading />,
});
// WalletTransaction Page
export const WalletTransaction = loadable(() => import('./WalletTransaction'), {
  fallback: <Loading />,
});
// MyBets Page
export const MyBets = loadable(() => import('./MyBets'), {
  fallback: <Loading />,
});
// ProfitAndLoss Page
export const ProfitAndLoss = loadable(() => import('./ProfitAndLoss'), {
  fallback: <Loading />,
});
// CasinoStatement Page
export const CasinoStatement = loadable(() => import('./CasinoStatement'), {
  fallback: <Loading />,
});
// AccountStatement Page
export const AccountStatement = loadable(() => import('./AccountStatement'), {
  fallback: <Loading />,
});
// TunroverStatement Page
export const TunroverStatement = loadable(() => import('./TurnoverStatement'), {
  fallback: <Loading />,
});

// export const ShowBet = loadable(() => import('./ShowBet'), {
//   fallback: <Loading />,
// });
export const ViewBetDetails = loadable(() => import('./ViewBetDetails'), {
  fallback: <Loading />,
});

export const SportsBookStatements = loadable(
  () => import('./SportsBookStatements'),
  {
    fallback: <Loading />,
  },
);
export const CasinoTable = loadable(() => import('./CasinoTable'), {
  fallback: <Loading />,
});
//Aviator game
export const AviatorTable = loadable(() => import('./AviatorTable'), {
  fallback: <Loading />,
});
// Static Pages
export const NotFound = loadable(() => import('./NotFound'), {
  fallback: <Loading />,
});
