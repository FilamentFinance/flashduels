import { Duel } from '@/types/dual';
import { FC } from 'react';
import DualRow from './row';
import NoDuels from './no-duels'; // Assuming the NoDuels component is in the same directory

type Props = {
  data: Duel[];
  handleDualRowClick: (duelId: string) => void;
};

const Duals: FC<Props> = ({ data, handleDualRowClick }) => {
  if (!data.length) {
    return <NoDuels />;
  }

  return (
    <div className="mt-8 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-500 pr-2">
      <div className="grid grid-cols-1 gap-4">
        {data.map((duel) => (
          <DualRow key={duel.duelId} data={duel} onClick={() => handleDualRowClick(duel.duelId)} />
        ))}
      </div>
    </div>
  );
};

export default Duals;
