import { useBalance } from '@/hooks/useBalance';
import { FC } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

const Balance: FC = () => {
  const { address } = useAccount();

  const { balance, symbol, decimals, isLoading, isError } = useBalance(address);
  return (
    <div className="flex gap-5 items-center self-stretch py-1 pr-1 pl-2 my-auto whitespace-nowrap rounded-lg border-2 border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] shadow-[0px_2px_10.3px_rgba(0,0,0,0.25)]">
      <div className="flex gap-1 items-center self-stretch my-auto text-base text-stone-200">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/427d45b45afa37b1eb87be276dafef70bc14ecf23817ee21e7de77d5a21bc791?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353"
          alt=""
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
        />
        <div className="self-stretch my-auto">
          {formatUnits((balance ?? 0) as bigint, decimals ?? 6)} {symbol}
        </div>
      </div>
    </div>
  );
};

export default Balance;
