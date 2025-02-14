'use client';

import { FC } from 'react';



const DuelInfo: FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-1 items-start px-2 py-3 text-xs tracking-normal leading-4 text-gray-500 rounded-xl border border-solid bg-neutral-800 border-zinc-800">
        <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px]">
          <div className="flex-1 shrink gap-2.5 self-stretch w-full">
            Duels Must go through a 3 Hour Bootstrapping Phase, if volume does not exceed $10,000
            the collateral is returned The Duel May be closed by team if it is against our
            <span className="underline">guidelines</span>
          </div>
        </div>
      </div>

      {/* <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 border-zinc-700 hover:bg-zinc-900"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-pink-500 hover:bg-pink-600 text-black">
          Create Duel
        </Button>
      </div> */}
    </div>
  );
};

export default DuelInfo;
