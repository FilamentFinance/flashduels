export const CREATE_DUEL = {
  DIALOG: {
    TITLE: 'Create a Duel',
  },
  MARKET_SECTION: {
    HEADING: 'Choose a market',
    COIN_DUEL: {
      TITLE: 'Coin Duel',
      DESCRIPTION: 'Create Battles Based on Token Prices, resolved by Oracle price from Pyth',
    },
    FLASH_DUEL: {
      TITLE: 'Flash Duel',
      DESCRIPTION:
        'Create Duel Based on Sports, News, pop Culture, bets are settled by Flash Duels',
    },
  },
  BUTTONS: {
    NEXT: 'Next',
  },
  TOAST: {
    SUCCESS: {
      TITLE: 'Success',
      DESCRIPTION: 'Duel created successfully',
    },
    ERROR: {
      TITLE: 'Error',
      DESCRIPTION: 'Failed to create duel',
    },
  },
  INFO: {
    DISCLAIMER: {
      TEXT: 'Duels enter a 30-minute Bootstrapping Phase if lasting ≥ 1 hour. Collateral is returned if volume stays below $50. The team may close duels that violate our',
      GUIDELINES_LINK: 'GUIDELINES',
    },
  },
} as const;
