'use client';
import { baseApiClient } from '@/config/api-client';
import { FC, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Duels from './duels';
import AccountDetails from './account-details';

const Portfolio: FC = () => {
  
 
  
  return (
    <div className=' w-full py-2'>
      <div className='flex gap-2'>
      <Duels />
      <AccountDetails />
      </div>
    </div>
  );
};

export default Portfolio;
