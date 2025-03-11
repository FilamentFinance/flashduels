'use client';

import { DUEL_STATUS } from '@/constants/duel';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { DuelStatus as TDuelStatus } from '@/types/duel';
import { FC } from 'react';

type Props = {
  activeStatus: TDuelStatus;
  setActiveStatus: (status: TDuelStatus) => void;
};

const DuelStatus: FC<Props> = ({ activeStatus, setActiveStatus }) => {
  return (
    <div className="flex items-center gap-2 p-2 border border-zinc-800 w-fit rounded-2xl">
      {Object.entries(DUEL_STATUS).map(([key, status]) => {
        const isActive = status === activeStatus;
        return (
          <Button
            key={key}
            onClick={() => setActiveStatus(status as TDuelStatus)}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'rounded-xl text-sm font-medium',
              isActive
                ? 'bg-flashDualPink text-black hover:bg-flashDualPink'
                : 'text-zinc-400 hover:text-zinc-400',
            )}
          >
            {status}
          </Button>
        );
      })}
    </div>
  );
};

export default DuelStatus;
