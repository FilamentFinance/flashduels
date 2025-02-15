import { Duel } from '@/types/dual';
import { FC } from 'react';
import DualRow from './row';

type Props = {
  data: Duel[];
  handleDualRowClick: (duelId: string) => void;
};

const Duals: FC<Props> = ({ data, handleDualRowClick }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-zinc-400">No duels available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-8">
      {data.map((duel) => (
        <DualRow key={duel.duelId} data={duel} onClick={() => handleDualRowClick(duel.duelId)} />
      ))}
    </div>
  );
};

export default Duals;
