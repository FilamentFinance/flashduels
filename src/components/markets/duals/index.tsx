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
    <>
      {data.map((duel) => (
        <DuelRow
          key={duel.duelId}
          data={duel}
          onClick={() => handleDuelRowClick(duel.duelId, duel.status)}
          onPositionSelect={onPositionSelect}
        />
      ))}
    </>
  );
};

export default Duels;
