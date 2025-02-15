import { STATUS_CODES } from '@/constants/statusCodes';

export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
