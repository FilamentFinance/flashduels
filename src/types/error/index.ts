import { ERRORS } from '@/constants/error';

export type ErrorType = (typeof ERRORS)[keyof typeof ERRORS];
