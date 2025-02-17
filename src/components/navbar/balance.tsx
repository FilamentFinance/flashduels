import { useBalance } from '@/hooks/useBalance';
import { FC } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import Image from 'next/image';

const Balance: FC = () => {
  const { address } = useAccount();

  const { balance, symbol, decimals } = useBalance(address);
  return (
    <div className="flex gap-5 items-center self-stretch py-1 pr-1 pl-2 my-auto whitespace-nowrap rounded-lg border-2 border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] shadow-[0px_2px_10.3px_rgba(0,0,0,0.25)]">
      <div className="flex gap-1 items-center self-stretch my-auto text-base text-stone-200">
        <Image
          src="/logo/markets/dollar.svg"
          alt="Balance"
          width={18}
          height={18}
          className="object-contain"
        />
        <div className="self-stretch my-auto">
          {formatUnits((balance ?? 0) as bigint, decimals ?? 6)} {symbol}
        </div>
      </div>
    </div>
  );
};

export default Balance;
