export const CREATE_DUAL = {
  DIALOG: {
    TITLE: 'Create a Dual',
  },
  MARKET_SECTION: {
    HEADING: 'Choose a market',
    COIN_DUAL: {
      TITLE: 'Coin Duel',
      DESCRIPTION: 'Create Battles Based on Token Prices, resolved by Oracle price from Pyth',
    },
    FLASH_DUAL: {
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
      DESCRIPTION: 'Dual created successfully',
    },
    ERROR: {
      TITLE: 'Error',
      DESCRIPTION: 'Failed to create dual',
    },
  },
  INFO: {
    DISCLAIMER: {
      TEXT: 'Duels Must go through a 3 Hour Bootstrapping Phase, if volume does not exceed $10,000 the collateral is returned The Duel May be closed by team if it is against our',
      GUIDELINES_LINK: 'guidelines',
    },
  },
} as const;
