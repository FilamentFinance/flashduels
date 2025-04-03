export const DUEL = {
  COIN: 'coin',
  FLASH: 'flash',
} as const;

export const DUEL_DURATION = {
  FIVE_MINUTES: '5M',
  FIFTEEN_MINUTES: '15M',
  THIRTY_MINUTES: '30M',
  ONE_HOUR: '1H',
  THREE_HOURS: '3H',
  SIX_HOURS: '6H',
  TWELVE_HOURS: '12H',
  // TWENTY_FOUR_HOURS: '24H',
  // FORTY_EIGHT_HOURS: '48H',
} as const;

// Add new constants for specific duel types
export const COIN_DUEL_DURATION = {
  FIVE_MINUTES: '5M',
  FIFTEEN_MINUTES: '15M',
  THIRTY_MINUTES: '30M',
  ONE_HOUR: '1H',
  THREE_HOURS: '3H',
  SIX_HOURS: '6H',
  TWELVE_HOURS: '12H',
} as const;

export const FLASH_DUEL_DURATION = {
  ONE_HOUR: '1H',
  THREE_HOURS: '3H',
  SIX_HOURS: '6H',
  TWELVE_HOURS: '12H',
} as const;

export const DUEL_STATUS = {
  LIVE: 'Live',
  BOOTSTRAPPING: 'Bootstrapping',
  COMPLETED: 'Completed',
  YET_TO_BE_RESOLVED: 'To Be Resolved (Flash Duels)'
} as const;

export const POSITION = {
  YES: 'YES',
  NO: 'NO',
} as const;

export const COIN_DUEL_ASSETS: {
  [key: string]: {
    image: string;
    symbol: string;
    address: string;
  };
} = {
  '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43': {
    image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/BTC.svg',
    symbol: 'BTC',
    address: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  },
  '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace': {
    image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/ETH.svg',
    symbol: 'ETH',
    address: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  },
  '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d': {
    image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/SOL.svg',
    symbol: 'SOL',
    address: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  },
};

export const DURATIONS = [0.084, 0.25, 0.5, 1, 3, 6, 12];

export const assetImages = [
  {
    symbol: 'BTC',
    image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/BTC.svg',
  },
  {
    symbol: 'ETH',
    image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/ETH.svg',
  },
  {
    symbol: 'SOL',
    image: 'https://filamentimages.s3.ap-southeast-1.amazonaws.com/tokens/SOL.svg',
  },
];

export const getAssetImage = (symbol: string) => {
  const asset = assetImages.find((item) => item.symbol === symbol);
  return asset ? asset.image : null;
};

export const OPTIONS = ['YES', 'NO'];

export const WIN_CONDITIONS = {
  ABOVE: 'above',
  BELOW: 'below',
} as const;

export const DUEL_TYPE = {
  COIN_DUEL: 'COIN_DUEL',
  FLASH_DUEL: 'FLASH_DUEL',
} as const;

export const ORDER_TYPE = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

export const OPTIONS_TYPE = {
  YES: 'YES',
  NO: 'NO',
} as const;

export const ORDER_LABELS = {
  [ORDER_TYPE.BUY]: 'Buy',
  [ORDER_TYPE.SELL]: 'Sell',
} as const;

export const POSITION_COLORS = {
  [OPTIONS_TYPE.YES]: {
    active: 'bg-[#95DE64] text-black hover:bg-[#95DE64]/90',
    inactive: 'bg-[#1C2A1C] text-[#95DE64] hover:bg-[#1C2A1C]/80',
  },
  [OPTIONS_TYPE.NO]: {
    active: 'bg-[#E84749] text-white hover:bg-[#E84749]/90',
    inactive: 'bg-[#2A1C1C] text-[#E84749] hover:bg-[#2A1C1C]/80',
  },
} as const;
