'use client';

import Bet from '@/components/bet';
import { FC, Suspense } from 'react';

const BetPage: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Bet />
    </Suspense>
  );
};

export default BetPage;
