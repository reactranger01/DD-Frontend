import React from 'react';
import loadable from '../utils/loadable';
import Loading from './Loading';

// Loading - No need to lazy load this component
export { default as Loading } from './Loading';
export { default as Header } from './Layout/Header';
export { default as Footer } from './Layout/Footer';
export { default as SmallDesc } from './Home/SmallDesc';
export { default as HeroSlider } from './Home/HeroSlider';
export { default as BottomHeader } from './Home/BottomHeader';
export { default as HeroSection } from './Home/HeroSection';
export { default as HeroSectionSlider } from './Home/HeroSectionSlider';
export { default as HeroSectionWebSlider } from './Home/HeroSectionWebSlider';
export { default as Banner } from './Home/Banner';
export { default as PlaceOrder } from './ClickBet/PlaceOrder';
export { default as BottomHeaderOption } from './MoreOption/BottomHeaderOption';
export { default as BannerOption } from './MoreOption/BannerOption';
export { default as BettingOption } from './MoreOption/BettingOption';
export { default as Sidebar } from './Layout/Sidebar';
export { default as InputField } from './FormElements/InputField';
export { default as SelectBox } from './FormElements/SelectBox';
export { default as DateRangePicker } from './FormElements/DateRangePicker';
export { default as HomeBottom } from './HomeBottom';

export const Welcome = loadable(() => import('./Welcome'), {
  fallback: <Loading />,
});
export const InplayCricket = loadable(() => import('./Home/InplayCricket'), {
  fallback: <Loading />,
});
export const InplayFootball = loadable(() => import('./Home/InplayFootball'), {
  fallback: <Loading />,
});
export const InplayTennis = loadable(() => import('./Home/InplayTennis'), {
  fallback: <Loading />,
});

export const BankAccountCard = loadable(() => import('./BankAccountCard'), {
  fallback: <Loading />,
});
export const CasinoPlay = loadable(() => import('./CasinoPlay'), {
  fallback: <Loading />,
});
export const MatchOddsCricket = loadable(
  () => import('./CricketSingleBet/MatchOddsCricket'),
  {
    fallback: <Loading />,
  },
);
export const BookmakersCricket = loadable(
  () => import('./CricketSingleBet/BookmakersCricket'),
  {
    fallback: <Loading />,
  },
);
export const SessionCricket = loadable(
  () => import('./CricketSingleBet/SessionCricket'),
  {
    fallback: <Loading />,
  },
);
