export const CLAIM_FUNDS = {
  DIALOG: {
    TITLE: 'Withdraw Funds',
  },
  TRIGGER: {
    // DEFAULT_AMOUNT: '$0.00',
    DEFAULT_AMOUNT: '0.00 CRD',
    CLAIM_TEXT: 'Withdraw',
  },
  AMOUNT_SECTION: {
    LABEL: 'Amount',
    AVAILABLE: {
      LABEL: 'Available:',
      DEFAULT_VALUE: '0.00',
      MAX_TEXT: 'Max',
    },
    INPUT: {
      PLACEHOLDER: '0.00',
      CURRENCY: 'USDC',
    },
  },
  CLAIM_BUTTON: {
    TEXT: 'Withdraw Funds',
  },
} as const;
