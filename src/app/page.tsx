'use client';

import HowItWorks from '@/components/how-it-works';
import Markets from '@/components/markets';
import { useEffect, useState } from 'react';
import { useNetworkConfig } from '@/hooks/useNetworkConfig';
// import { Button } from '@/shadcn/components/ui/button';

export default function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  // const { chainId, isChainSupported, switchToSupportedNetwork, getCurrentNetworkName } =
  //   useNetworkConfig();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');

    if (hasVisited) {
      setShowHowItWorks(false);
      setIsFirstVisit(false);
    } else {
      setShowHowItWorks(true);
      setIsFirstVisit(true);
    }
  }, []);

  const handleCloseHowItWorks = () => {
    setShowHowItWorks(false);
    if (isFirstVisit) {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  };

  // const handleNetworkSwitch = async () => {
  //   await switchToSupportedNetwork();
  // };

  // const networkBanner = (
  //   <div className="fixed top-4 right-4 z-50">
  //     <div className="flex items-center gap-2 bg-glass p-2 rounded-lg border border-zinc-800">
  //       <span className={isChainSupported(chainId) ? 'text-green-500' : 'text-red-500'}>
  //         {getCurrentNetworkName()}
  //       </span>
  //       {!isChainSupported(chainId) && (
  //         <Button
  //           variant="pinkOutline"
  //           size="sm"
  //           onClick={handleNetworkSwitch}
  //           className="text-xs bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 hover:text-pink-500 hover:border-pink-500"
  //         >
  //           Switch Network
  //         </Button>
  //       )}
  //     </div>
  //   </div>
  // );

  // if (!isChainSupported(chainId)) {
  //   return networkBanner;
  // }

  return (
    <>
      {/* {networkBanner} */}
      <Markets />
      {showHowItWorks && <HowItWorks onClose={handleCloseHowItWorks} />}
    </>
  );
}
