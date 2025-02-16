import { POSITION_TYPE } from '@/constants/dual';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { PositionType } from '@/types/dual';
import { FC } from 'react';

interface PositionSelectorProps {
  selectedPosition: PositionType | null;
  onPositionSelect: (position: PositionType) => void;
  disabled?: boolean;
}

const PositionSelector: FC<PositionSelectorProps> = ({
  selectedPosition,
  onPositionSelect,
  disabled = false,
}) => {
  const getButtonStyles = (position: PositionType) => {
    if (position === POSITION_TYPE.YES) {
      return selectedPosition === position
        ? 'bg-[#95DE64] text-black hover:bg-[#95DE64]/90'
        : 'bg-[#1A2515] text-[#95DE64] hover:bg-[#1A2515]/80';
    }
    return selectedPosition === position
      ? 'bg-red-500 text-black hover:bg-red-500/90'
      : 'bg-[#251515] text-red-500 hover:bg-[#251515]/80';
  };

  return (
    <div className="flex gap-2">
      {Object.values(POSITION_TYPE).map((position) => (
        <Button
          key={position}
          onClick={() => onPositionSelect(position)}
          variant="ghost"
          disabled={disabled}
          className={cn(
            'flex-1 py-6 text-lg font-medium transition-colors rounded-2xl border-0',
            getButtonStyles(position),
          )}
        >
          {position}
        </Button>
      ))}
    </div>
  );
};

export default PositionSelector;
