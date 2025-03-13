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
      TEXT: 'Duels Must go through a 30 minutes Bootstrapping Phase, if volume does not exceed $50 the collateral is returned The Duel May be closed by team if it is against our',
      GUIDELINES_LINK: 'guidelines',
    },
  },
} as const;
