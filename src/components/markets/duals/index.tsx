import { Duel, Position } from '@/types/dual';
import { FC } from 'react';
import DualRow from './row';
import NoDuels from './no-duels';

type Props = {
  data: Duel[];
  handleDualRowClick: (duelId: string) => void;
  onPositionSelect: (duelId: string, position: Position) => void;
};

const Duals: FC<Props> = ({ data, handleDualRowClick, onPositionSelect }) => {
  if (!data.length) {
    return <NoDuels />;
  }

  return (
    <div className="mt-8 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-500 pr-2">
      <div className="grid grid-cols-1 gap-4">
        {data.map((duel) => (
          <DualRow 
            key={duel.duelId} 
            data={duel} 
            onClick={() => handleDualRowClick(duel.duelId)}
            onPositionSelect={onPositionSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default Duals;
