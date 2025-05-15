'use client';
import { FC, useState } from 'react';
import AccountDetails from './account-details';
import Duels from './duels';
import DuelsHistory from './duels-history';

const Portfolio: FC = () => {
  const [showContent, setShowContent] = useState(false);

  // Show content after initial render
  useState(() => {
    requestAnimationFrame(() => {
      setShowContent(true);
    });
  });

  return (
    <div className="flex justify-stretch w-full h-full py-2 gap-2">
      <div
        className={`flex flex-col w-full gap-2 h-full transition-all duration-500 ease-in-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          visibility: showContent ? 'visible' : 'hidden',
          filter: !showContent ? 'blur(2px)' : 'none',
        }}
      >
        <div className="h-[65%]">
          <Duels />
        </div>
        <div className="h-[35%]">
          <DuelsHistory />
        </div>
      </div>
      <div
        className={`h-full transition-all duration-500 ease-in-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          visibility: showContent ? 'visible' : 'hidden',
          filter: !showContent ? 'blur(2px)' : 'none',
        }}
      >
        <AccountDetails />
      </div>
    </div>
  );
};

export default Portfolio;
