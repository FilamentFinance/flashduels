import { Duel, Position } from '@/types/duel';
import { FC } from 'react';
import NoDuels from './no-duels';
import DuelRow from './row';

type Props = {
  data: Duel[];
  handleDuelRowClick: (duelId: string, status: number) => void;
  onPositionSelect: (duelId: string, position: Position, status: number) => void;
};

const Duels: FC<Props> = ({ data, handleDuelRowClick, onPositionSelect }) => {
  if (!data.length) {
    return <NoDuels />;
  }

  return (
    <div className="mt-8 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-500 pr-2">
      <div className="grid grid-cols-1 gap-4">
        {data.map((duel) => (
          <DuelRow
            key={duel.duelId}
            data={duel}
            onClick={() => handleDuelRowClick(duel.duelId, duel.status)}
            onPositionSelect={onPositionSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default Duels;
