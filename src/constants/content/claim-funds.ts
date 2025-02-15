export const CLAIM_FUNDS = {
  DIALOG: {
    TITLE: 'Claim Funds',
  },
  TRIGGER: {
    DEFAULT_AMOUNT: '$0.00',
    CLAIM_TEXT: 'Claim',
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
    TEXT: 'Claim Funds',
  },
} as const;
