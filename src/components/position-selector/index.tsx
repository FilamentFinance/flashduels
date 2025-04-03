import { POSITION } from '@/constants/duel';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { Position } from '@/types/duel';
import { FC } from 'react';

interface PositionSelectorProps {
  selectedPosition?: Position | null;
  onPositionSelect?: (position: Position) => void;
  className?: string;
}

const PositionSelector: FC<PositionSelectorProps> = ({
  selectedPosition,
  onPositionSelect,
  className = '',
}) => {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <Button
        onClick={() => onPositionSelect?.(POSITION.YES)}
        variant="ghost"
        className={cn(
          'h-12 rounded-2xl font-medium text-lg transition-all duration-200',
          selectedPosition === POSITION.YES
            ? 'bg-[#95DE64] text-black hover:bg-[#95DE64]/90'
            : 'bg-[#4BF90F0D] text-zinc-400 border-2 border-[#4BF90F0D] hover:bg-[#4BF90F0D]/20',
        )}
      >
        {POSITION.YES}
      </Button>
      <Button
        onClick={() => onPositionSelect?.(POSITION.NO)}
        variant="ghost"
        className={cn(
          'h-12 rounded-2xl font-medium text-lg transition-all duration-200',
          selectedPosition === POSITION.NO
            ? 'bg-[#E84749] text-white hover:bg-[#E84749]/90'
            : 'bg-[#F814161A] text-zinc-400 hover:bg-[#E84749]/20',
        )}
      >
        {POSITION.NO}
      </Button>
    </div>
  );
};

export default PositionSelector;
