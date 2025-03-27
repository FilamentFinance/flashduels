import Image from 'next/image';
import { FC } from 'react';
import DetailsAndRules from './details-and-rules';
import PercentageBlocks from './percentage-blocks';

type Props = {
  title: string;
  logo: string;
  triggerPrice: string;
  winCondition: number;
  token?: string;
  liquidity?: string;
  endsIn: string;
  percentage?: number;
  duelType?: 'COIN_DUEL' | string;
};

const Header: FC<Props> = ({
  title,
  triggerPrice,
  token,
  liquidity,
  endsIn,
  percentage,
  duelType,
}) => {
  let symbol, iconPath;
  if (duelType === 'COIN_DUEL') {
    symbol = title.split(' ')[1];
    iconPath = `/crypto-icons/light/crypto-${symbol.toLowerCase()}-usd.inline.svg`;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex justify-between items-stretch w-full">
        {/* Back Button and Logo */}
        <div className="flex items-center gap-4 mx-2">
          {duelType === 'COIN_DUEL' ? (
            <div>
              <Image
                src={iconPath || ''}
                alt={title}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </div>
          ) : null}
        </div>

        {/* Title and Details Button */}
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <DetailsAndRules triggerPrice={triggerPrice} token={token} />
        </div>
      </div>

      <div className="w-full flex justify-between items-center  px-4 py-2 rounded-lg">
        <div className="flex flex-col">
          <span className="text-zinc-500 text-sm">Liquidity</span>
          <span className="text-white font-medium">${liquidity}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-sm">Ends in</span>
          <span className="text-white font-medium">{endsIn}</span>
        </div>

        <div className="flex items-center gap-2">
          <PercentageBlocks percentage={percentage || 50} />
        </div>
      </div>
    </div>
  );
};

export default Header;
