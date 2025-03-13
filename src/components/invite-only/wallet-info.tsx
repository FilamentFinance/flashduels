// components/wallet-info.tsx
'use client';

import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { LogOut, User } from 'lucide-react';

const WalletInfo: React.FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex items-center justify-center space-x-4 mb-4">
      <div className="flex items-center space-x-2 text-white">
        <User className="w-6 h-6" />
        <span>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No Address'}</span>
      </div>
      <button
        onClick={() => disconnect()}
        className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
      >
        <LogOut className="w-5 h-5" />
        <span>Disconnect</span>
      </button>
    </div>
  );
};

export default WalletInfo;
