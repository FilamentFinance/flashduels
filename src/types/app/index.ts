import { TRANSACTION_STATUS } from "@/constants/app";

/**
 * TransactionStatusType definition
 * 
 * This type represents the possible transaction statuses.
 */
export type TransactionStatusType = (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
