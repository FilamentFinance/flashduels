'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export const MobileWarning = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024); // 1024px is typical tablet breakpoint
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
        <h2 className="mb-2 text-xl font-bold">Desktop Experience Recommended</h2>
        <p className="text-gray-600">
          For the best experience please access the app from web browser. Mobile PWA is in works and
          will launch soon.
        </p>
      </div>
    </div>
  );
};
