import { ErrorType } from '@/types/error';

interface AppErrorOptions {
  statusCode: number;
  type: ErrorType;
  message: string;
}

export class AppError extends Error {
  public statusCode: number;
  public type: ErrorType;

  constructor({ statusCode, type, message }: AppErrorOptions) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
