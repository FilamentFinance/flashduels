'use client';

import { Button } from '@/shadcn/components/ui/button';
import { FC } from 'react';

interface FormFooterProps {
  onBack: () => void;
}

const FormFooter: FC<FormFooterProps> = ({ onBack }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-zinc-400 space-y-2 bg-zinc-900 p-4 rounded-lg">
        <p>
          Duels Must go through a 3 Hour Bootstrapping Phase, if volume does not exceed $10,000 the
          collateral is returned
        </p>
        <p>
          The Duel May be closed by team if it is against our{' '}
          <span className="text-blue-500">guidelines</span>
        </p>
      </div>

      <div className="flex gap-4">
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
      </div>
    </div>
  );
};

export default FormFooter;
