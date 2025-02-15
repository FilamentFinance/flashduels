'use client';

import { FC } from 'react';
import { LucideIcon, AlertCircle, Wallet, Ban } from 'lucide-react';

interface DuelStateProps {
  type: 'error' | 'empty' | 'no-wallet';
  message?: string;
}

const stateConfig: Record<
  DuelStateProps['type'],
  { icon: LucideIcon; defaultMessage: string; className: string }
> = {
  error: {
    icon: AlertCircle,
    defaultMessage: 'Failed to load duels. Please try again later.',
    className: 'text-red-500 bg-red-500/10',
  },
  empty: {
    icon: Ban,
    defaultMessage: 'No duels available',
    className: 'text-gray-500 bg-gray-500/10',
  },
  'no-wallet': {
    icon: Wallet,
    defaultMessage: 'Please connect your wallet to view duels',
    className: 'text-blue-500 bg-blue-500/10',
  },
};

export const DuelState: FC<DuelStateProps> = ({ type, message }) => {
  const { icon: Icon, defaultMessage, className } = stateConfig[type];

  return (
    <div className="w-full rounded-lg border border-gray-800 bg-black">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className={`p-3 rounded-full mb-4 ${className}`}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-gray-400 text-sm">{message || defaultMessage}</p>
      </div>
    </div>
  );
};
