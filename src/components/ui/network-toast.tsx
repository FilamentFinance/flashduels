import { FC } from 'react';
import Image from 'next/image';
import { DEFAULT_NETWORK_ICON } from '@/constants/app/networks';

interface NetworkToastProps {
  networkName: string;
  networkIcon?: string;
}

export const NetworkToast: FC<NetworkToastProps> = ({ networkName, networkIcon }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={networkIcon || DEFAULT_NETWORK_ICON}
        alt="Network Icon"
        width={20}
        height={20}
        className="rounded-full border border-zinc-700"
      />
      <span>Successfully connected to {networkName}</span>
    </div>
  );
};
