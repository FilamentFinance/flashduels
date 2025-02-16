'use client';
import { FC } from 'react';
import AccountDetails from './account-details';
import Duels from './duels';
import DuelsHistory from './duels-history';

const Portfolio: FC = () => {
  return (
    <div className=" flex justify-stretch w-full py-2 gap-2">
      <div className="flex flex-col w-full gap-2">
        <Duels />
        <DuelsHistory />
      </div>
      <AccountDetails />
    </div>
  );
};

export default Portfolio;
