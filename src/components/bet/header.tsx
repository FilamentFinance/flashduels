import { FC } from 'react';
import DetailsAndRules from './details-and-rules';

type Props = {
  title: string;
  logo: string;
  triggerPrice: string;
  winCondition: number;
  token?: string;
};

const Header: FC<Props> = ({ title, logo, triggerPrice, token }) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      {/* Back Button and Logo */}
      <div className="flex items-center gap-4">
        <img src={logo || '/empty-string.png'} alt={title} className="w-12 h-12 rounded-full" />
      </div>

      {/* Title and Details Button */}
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <DetailsAndRules triggerPrice={triggerPrice} token={token} />
      </div>
    </div>
  );
};

export default Header;
