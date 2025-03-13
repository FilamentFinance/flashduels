// components/invite-only.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Lock } from 'lucide-react';
import React from 'react';
import { useAccount } from 'wagmi';
import InviteCodeInput from './invite-code-input';
import WalletInfo from './wallet-info';

interface InviteOnlyProps {
  onSubmit: (code: string) => void;
  errorMessage: string | null;
}

const InviteOnly: React.FC<InviteOnlyProps> = ({ onSubmit, errorMessage }) => {
  const { isConnected } = useAccount();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden">
      <div className="bg-black bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-md text-center animate-fadeIn">
        <div className="flex flex-col items-center space-y-4">
          <Lock className="w-16 h-16 text-white animate-bounce" />
          <h1 className="text-2xl font-bold text-white">Invite Only Access</h1>
          <p className="text-white/80">
            {isConnected
              ? 'Enter your invite code to unlock the app.'
              : 'Connect your wallet to continue.'}
          </p>

          {errorMessage && <div className="text-red-400 text-sm mt-2">{errorMessage}</div>}
        </div>
        <div className="mt-6">
          {!isConnected ? (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          ) : (
            <>
              <WalletInfo />
              <div className="mt-4">
                <InviteCodeInput onSubmit={onSubmit} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteOnly;
