'use client';

import PortfolioComponent from '@/components/portfolio';
import { FC } from 'react';

const Portfolio: FC = () => {
  return (
    <main className="h-[calc(100vh-4rem)]">
      <PortfolioComponent />
    </main>
  );
};

export default Portfolio;
