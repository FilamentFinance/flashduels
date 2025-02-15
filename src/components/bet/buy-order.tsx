import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { LOGOS } from '@/constants/app/logos';
import { useBalance } from '@/hooks/useBalance';
import useJoinDuel from '@/hooks/useJoinDuel';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { cn } from '@/shadcn/lib/utils';
import { Position } from '@/types/dual';
import { Dispatch, FC, SetStateAction } from 'react';
import { formatUnits, parseUnits } from 'viem/utils';
import { useAccount } from 'wagmi';

interface BuyOrderProps {
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  selectedPosition: Position | null;
  setSelectedPosition: Dispatch<SetStateAction<Position | null>>;
  yesPrice: number | undefined;
  noPrice: number | undefined;
  duelId: string;
  duelType: string;
  asset: string | undefined;
  winCondition: number | undefined;
}

const BuyOrder: FC<BuyOrderProps> = ({
  amount,
  setAmount,
  selectedPosition,
  setSelectedPosition,
  yesPrice,
  noPrice,
  duelId,
  duelType,
  asset,
  winCondition,
}) => {
  const { address } = useAccount();
  const { balance } = useBalance(address);
  const { joinDuel } = useJoinDuel();
  const handlePositionSelect = (position: Position) => {
    setSelectedPosition(position);
  };

  const calculateShares = () => {
    return Number(amount) / Number('0.15');
  };

  const handleMaxClick = () => {
    const maxAmount = formatUnits((balance ?? 0) as bigint, 6);
    setAmount(maxAmount);
  };

  const handleJoinDuel = async () => {
    const parsedAmount = parseUnits(amount, 6);
    const { success } = await joinDuel(parsedAmount);
    console.log('Approval check result:', success);
    if (success) {
      // Now you can proceed with the actual join duel logic
      const optionIndex = selectedPosition === 'YES' ? 0 : 1;
      console.log({
        twitterUsername: '',
        bet: selectedPosition,
        address: address?.toLowerCase(),
        betAmount: Number(amount),
        optionIndex,
        duelId,
        duelType,
        asset,
        winCondition,
      });
      await baseApiClient.post(`${SERVER_CONFIG.API_URL}/bets/create`, {
        twitterUsername: '',
        bet: selectedPosition,
        address: address?.toLowerCase(),
        betAmount: Number(amount),
        optionIndex,
        duelId,
        duelType,
        asset,
        winCondition,
      });
    }
  };

  return (
    <div>
      {/* YES/NO Buttons */}
      <div className="flex gap-2 mb-1">
        <button
          onClick={() => handlePositionSelect('YES')}
          className={cn(
            'flex-1 py-4 rounded-xl text-center font-medium text-lg transition-colors',
            selectedPosition === 'YES' ? 'bg-[#95DE64] text-black' : 'bg-zinc-800 text-zinc-500',
          )}
        >
          YES
        </button>
        <button
          onClick={() => handlePositionSelect('NO')}
          className={cn(
            'flex-1 py-4 rounded-xl text-center font-medium text-lg transition-colors',
            selectedPosition === 'NO' ? 'bg-[#E84749] text-white' : 'bg-zinc-800 text-zinc-500',
          )}
        >
          NO
        </button>
      </div>

      {/* Price per share */}
      <div className="flex justify-between mb-6 px-1">
        <span className="text-zinc-500 text-sm">${yesPrice?.toFixed(4)}/share</span>
        <span className="text-zinc-500 text-sm">${noPrice?.toFixed(4)}/share</span>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-zinc-400">Amount</span>
          <span className="text-zinc-400">
            Available: {formatUnits((balance ?? 0) as bigint, 6)}{' '}
            <span onClick={handleMaxClick} className="text-[#F19ED2] cursor-pointer">
              Max
            </span>
          </span>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white">$</div>
          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-800 rounded-xl py-6 pl-8 pr-4 text-xl text-white border-none focus:border-none focus:ring-0 focus-visible:ring-0"
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <img src={LOGOS.USDC.icon} alt="USDC" className="w-7 h-7" />
            <span className="text-white text-lg font-medium">USDC</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-zinc-500 text-sm">{calculateShares().toFixed(0)} Shares</span>
        </div>
      </div>

      <div className="flex gap-3 items-end p-2 mt-3 w-full text-sm tracking-normal leading-none text-gray-400 rounded border border-solid bg-neutral-900 border-white border-opacity-10 my-2">
        <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
          <div className="flex gap-10 justify-between items-center mt-1 w-full">
            <div className="flex flex-col items-start self-stretch my-auto w-[91px]">
              <div>
                {selectedPosition === 'YES'
                  ? (Number(amount) / Number(yesPrice)).toFixed(2)
                  : (Number(amount) / Number(noPrice)).toFixed(2)}{' '}
                {selectedPosition}
              </div>
            </div>
            <div className="flex flex-col self-stretch my-auto whitespace-nowrap">
              <div>${selectedPosition === 'YES' ? yesPrice?.toFixed(2) : noPrice?.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleJoinDuel}
        disabled={!selectedPosition}
        className={cn(
          'w-full py-6 rounded-xl font-medium transition-colors text-lg',
          selectedPosition
            ? 'bg-[#F19ED2] hover:bg-[#F19ED2]/90 text-white'
            : 'bg-zinc-800 text-zinc-400 cursor-not-allowed',
        )}
      >
        Join Duel
      </Button>
    </div>
  );
};

export default BuyOrder;
