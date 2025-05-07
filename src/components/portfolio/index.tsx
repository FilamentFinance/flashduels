'use client';
import { FC } from 'react';
import AccountDetails from './account-details';
import Duels from './duels';
import DuelsHistory from './duels-history';

const Portfolio: FC = () => {
  return (
    <div className="flex justify-stretch w-full h-full py-2 gap-2">
      <div className="flex flex-col w-full gap-2 h-full">
        <div className="h-[65%]">
          <Duels />
        </div>
        <div className="h-[35%]">
          <DuelsHistory />
        </div>
      </div>
      <div className="h-full">
        <AccountDetails />
      </div>
    </div>
  );
};

export default Portfolio;
