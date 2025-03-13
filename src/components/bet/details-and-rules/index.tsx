import { Info } from 'lucide-react';
import { FC } from 'react';
import { Dialog } from '@/components/ui/custom-modal';

interface DetailsAndRulesProps {
  triggerPrice: string;
  token?: string;
}

const DetailsAndRules: FC<DetailsAndRulesProps> = ({ triggerPrice, token = 'BTC' }) => {
  return (
    <Dialog
      trigger={
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 rounded-lg transition-colors">
          <Info className="w-4 h-4" />
          Details & Rules
        </button>
      }
      title="Details And Rules"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-8">
        {/* Resolution Criteria */}
        <div>
          <h3 className="text-2xl mb-4">Resolution Criteria</h3>
          <p className="text-zinc-300 mb-4">The market will resolve as follows:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>
              Yes: If the Price of {token} is at or above (equal or more than) ${triggerPrice}, at
              the end of betting period
            </li>
            <li>
              No: If the price of {token} is below (less than) ${triggerPrice} at the end of betting
              period
            </li>
          </ul>
        </div>

        {/* Resolution Source */}
        <div>
          <h3 className="text-2xl mb-4">Resolution Source</h3>
          <p className="text-zinc-300">The resolution is based on price feed from Pyth Oracle</p>
        </div>
      </div>
    </Dialog>
  );
};

export default DetailsAndRules;
