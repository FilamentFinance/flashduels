'use client';

import HowItWorks from '@/components/how-it-works';
import Markets from '@/components/markets';
import { useEffect, useState } from 'react';

export default function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

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

  return (
    <>
      <Markets />
      {showHowItWorks && <HowItWorks onClose={handleCloseHowItWorks} />}
    </>
  );
}
