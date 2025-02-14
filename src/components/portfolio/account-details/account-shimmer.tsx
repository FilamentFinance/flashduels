'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Skeleton } from '@/shadcn/components/ui/skeleton';

export const AccountShimmer: FC = () => {
  return (
    <Card className="max-w-[287px] bg-neutral-900 border-neutral-800">
      <CardContent className="p-3">
        <div className="flex relative flex-col max-w-full w-[263px]">
          {/* User Info Shimmer */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32 bg-neutral-800" />
            <Skeleton className="h-7 w-20 bg-neutral-800" />
          </div>

          {/* Account Value Shimmer */}
          <Skeleton className="mt-3 h-4 w-24 bg-neutral-800" />
          <Skeleton className="mt-3 h-12 w-32 bg-neutral-800" />
        </div>

        {/* Stats Shimmer */}
        <div className="flex flex-col mt-2.5 w-full gap-2 max-w-[268px]">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex justify-between items-center py-0.5 w-full">
              <Skeleton className="h-3 w-24 bg-neutral-800" />
              <Skeleton className="h-3 w-16 bg-neutral-800" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
