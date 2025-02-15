'use client';

import { DUAL_STATUS } from '@/constants/dual';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { DualStatus as TDualStatus } from '@/types/dual';
import { FC } from 'react';

type Props = {
  activeStatus: TDualStatus;
  setActiveStatus: (status: TDualStatus) => void;
};

const DualStatus: FC<Props> = ({ activeStatus, setActiveStatus }) => {
  return (
    <div className="flex items-center gap-2 p-2 border border-zinc-800 w-fit rounded-2xl">
      {Object.entries(DUAL_STATUS).map(([key, status]) => {
        const isActive = status === activeStatus;
        return (
          <Button
            key={key}
            onClick={() => setActiveStatus(status as TDualStatus)}
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

export default DualStatus;
