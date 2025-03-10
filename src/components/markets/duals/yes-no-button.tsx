import { OPTIONS_TYPE } from '@/constants/dual';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { RootState } from '@/store';
import { OptionsType } from '@/types/dual';
import { FC, MouseEvent } from 'react';
import { useSelector } from 'react-redux';

interface YesNoButtonProps {
  position: OptionsType;
  onClick: (e: MouseEvent) => void;
}

const YesNoButton: FC<YesNoButtonProps> = ({ position, onClick }) => {
  const selectedPosition = useSelector((state: RootState) => state.bet.selectedPosition);
  const isSelected = selectedPosition === position;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'w-24 py-4 text-base font-medium transition-all duration-200 rounded-xl border-0',
        position === OPTIONS_TYPE.YES &&
          !isSelected &&
          'text-[#95DE64] bg-[#95DE64]/10 hover:bg-[#95DE64]/20',
        position === OPTIONS_TYPE.YES &&
          isSelected &&
          'text-white bg-[#95DE64]/20 hover:bg-[#95DE64]/30',
        position === OPTIONS_TYPE.NO &&
          !isSelected &&
          'text-red-500 bg-red-500/10 hover:bg-red-500/20',
        position === OPTIONS_TYPE.NO &&
          isSelected &&
          'text-white bg-red-500/20 hover:bg-red-500/30',
      )}
    >
      {position}
    </Button>
  );
};

export default YesNoButton;
