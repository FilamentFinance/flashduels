'use client';
import { FC } from 'react';
import AccountDetails from './account-details';
import Duels from './duels';

const Portfolio: FC = () => {
  return (
    <div className=" w-full py-2">
      <div className="flex gap-2">
        <Duels />
        <AccountDetails />
      </div>
    </div>
  );
};

export default Portfolio;
