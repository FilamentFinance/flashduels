import { TRANSACTION_STATUS } from '@/constants/app';
import { TransactionStatusType } from '@/types/app';

export const getTransactionStatusMessage = (
  status: TransactionStatusType,
  error: string | null = null,
): string => {
  switch (status) {
    case TRANSACTION_STATUS.CHECKING_ALLOWANCE:
      return 'Checking allowance...';
    case TRANSACTION_STATUS.APPROVAL_NEEDED:
      return 'Approval needed...';
    case TRANSACTION_STATUS.APPROVAL_PENDING:
      return 'Waiting for approval...';
    case TRANSACTION_STATUS.APPROVAL_MINING:
      return 'Confirming approval...';
    case TRANSACTION_STATUS.APPROVAL_COMPLETE:
      return 'Approval complete';
    case TRANSACTION_STATUS.CREATING_DUEL:
      return 'Creating duel...';
    case TRANSACTION_STATUS.DUEL_MINING:
      return 'Confirming duel creation...';
    case TRANSACTION_STATUS.DUEL_COMPLETE:
      return 'Duel created successfully!';
    case TRANSACTION_STATUS.FAILED:
      return error || 'Transaction failed';
    default:
      return '';
  }
};
