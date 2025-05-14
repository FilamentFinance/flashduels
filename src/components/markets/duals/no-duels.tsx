'use client';

import { Card, CardContent } from '@/shadcn/components/ui/card';
import { GhostIcon } from 'lucide-react';

const NoDuels = () => {
  return (
    <div className="px-4 py-12 flex justify-center">
      <Card className="mx-auto max-w-md bg-neutral-900 border-2 border-neutral-800 rounded-xl">
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
              <GhostIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold text-neutral-200">No Duels Available</h3>
              <p className="text-sm text-neutral-400">
                There are currently no active duels. Check back later for more opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoDuels;
