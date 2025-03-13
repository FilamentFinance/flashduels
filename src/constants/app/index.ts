export const SEI_TESTNET_CHAIN_ID = 1328;

export const TRANSACTION_STATUS = {
  IDLE: 'idle',
  CHECKING_ALLOWANCE: 'checking_allowance',
  APPROVAL_NEEDED: 'approval_needed',
  APPROVAL_PENDING: 'approval_pending',
  APPROVAL_MINING: 'approval_mining',
  APPROVAL_FAILED: 'approval_failed',
  APPROVAL_COMPLETE: 'approval_complete',
  CREATING_DUEL: 'creating_duel',
  DUEL_MINING: 'duel_mining',
  DUEL_COMPLETE: 'duel_complete',
  FAILED: 'failed',
  CONTENT_CREATED: 'content_created',
  JOINING_DUEL: 'joining_duel',
  JOIN_MINING: 'join_mining',
  JOIN_COMPLETE: 'join_complete',
  PENDING: 'pending',
  SUCCESS: 'success',
  MINTING:'minting'
} as const;
