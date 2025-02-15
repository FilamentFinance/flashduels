export const DUAL = {
  COIN: 'coin',
  FLASH: 'flash',
} as const;

export const DUAL_DURATION = {
  THREE_HOURS: '3H',
  SIX_HOURS: '6H',
  TWELVE_HOURS: '12H',
  // TWENTY_FOUR_HOURS: '24H',
  // FORTY_EIGHT_HOURS: '48H',
} as const;

export const DUAL_STATUS = {
  LIVE: 'Live',
  BOOTSTRAPPING: 'Bootstrapping',
  COMPLETED: 'Completed',
} as const;

export const POSITION = {
  YES: 'YES',
  NO: 'NO',
} as const;

export const COIN_DUAL_ASSETS: {
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

export const DURATIONS = [3, 6, 12];

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
