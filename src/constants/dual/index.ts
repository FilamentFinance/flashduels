export const DUAL = {
  COIN: 'coin',
  FLASH: 'flash',
} as const;

export const DUAL_DURATION = {
  THREE_HOURS: '3H',
  SIX_HOURS: '6H',
  TWELVE_HOURS: '12H',
  TWENTY_FOUR_HOURS: '24H',
  FORTY_EIGHT_HOURS: '48H',
} as const;

export const DUAL_STATUS = {
  LIVE: 'Live',
  BOOTSTRAPPING: 'Bootstrapping',
  COMPLETED: 'Completed',
} as const;
