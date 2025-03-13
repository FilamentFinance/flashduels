'use client';

import { CREATE_DUEL } from '@/constants/content/create-duel';
import { FC } from 'react';

const DuelInfo: FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-1 items-start px-2 py-3 text-xs tracking-normal leading-4 text-gray-500 rounded-xl border border-solid bg-neutral-800 border-zinc-800">
        <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px]">
          <div className="flex-1 shrink gap-2.5 self-stretch w-full">
            {CREATE_DUEL.INFO.DISCLAIMER.TEXT}{' '}
            <span className="underline">{CREATE_DUEL.INFO.DISCLAIMER.GUIDELINES_LINK}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuelInfo;
