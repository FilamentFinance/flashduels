'use client';

import { FC } from 'react';
import Duels from './duels';
import AccountInfo from './account-info';
import PortfolioComponent from '@/components/portfolio';

const Portfolio: FC = () => {
  return (
    <main>
      {/* <div>
        <Duels />
      </div>
      <AccountInfo /> */}
      <PortfolioComponent />
    </main>
  );
};

export default Portfolio;
