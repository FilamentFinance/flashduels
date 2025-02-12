import { FC } from 'react';
import Categories from './categories';
import DualStatus from './dual-status';

const Markets: FC = () => {
  return (
    <div>
      <Categories />
      <DualStatus />
    </div>
  );
};

export default Markets;
