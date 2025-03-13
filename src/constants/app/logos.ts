export const LOGOS = {
  USDC: {
    icon: '/logo/usdc.svg',
    alt: 'USDC token icon',
    height: 20,
    width: 20,
  },
  FLASH: {
    icon: '/logo/flash.svg',
    alt: 'Flash token icon',
    height: 20,
    width: 20,
  },
  DOLLAR: {
    icon: '/logo/dollar.svg',
    alt: 'Dollar token icon',
    height: 20,
    width: 20,
  },
} as const;

export const DUEL_LOGOS = {
  COIN: {
    active: '/logo/coin-dual-active.svg',
    inactive: '/logo/coin-dual.svg',
    alt: 'Coin Duel',
    height: 48,
    width: 48,
  },
  FLASH: {
    active: '/logo/flash-dual-battle-active.svg',
    inactive: '/logo/flash-dual-battle.svg',
    alt: 'Flash Duel',
    height: 48,
    width: 48,
  },
} as const;

export const FAUCET_LOGOS = {
  TRIGGER: {
    icon: '/logo/faucet.svg',
    alt: 'Faucet trigger icon',
    height: 12,
    width: 12,
  },
  MAIN: {
    icon: '/logo/claim-faucet.svg',
    alt: 'Claim faucet icon',
    height: 300,
    width: 300,
  },
} as const;
