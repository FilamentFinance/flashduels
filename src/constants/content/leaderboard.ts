export const LEADERBOARD = {
  TITLE: 'Leaderboard',
  TABLE: {
    HEADERS: {
      RANK: 'Rank',
      ACCOUNT: 'Account',
      PROFIT: 'Profit (CRD)',
    },
  },
  EMPTY_STATE: {
    TITLE: 'No Data Available',
    DESCRIPTION:
      'There are no entries in the leaderboard yet. Be the first one to participate and claim your spot!',
  },
  ERROR: {
    MESSAGE: 'Failed to load leaderboard data. Please try again later.',
  },
} as const;
