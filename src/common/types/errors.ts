export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'BAD_REQUEST'
  | 'ACCOUNT_CLOSED'
  | 'RISK_VIOLATION'
  | 'BLACKOUT_ACTIVE'
  | 'INSUFFICIENT_LEVEL'
  | 'WITHDRAWAL_INELIGIBLE'
  | 'KYC_REQUIRED'
  | 'TWO_FA_REQUIRED';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = 'INTERNAL_ERROR',
    details?: unknown,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(resource: string): AppError {
    return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409, 'CONFLICT');
  }

  static validation(message: string, details?: unknown): AppError {
    return new AppError(message, 422, 'VALIDATION_ERROR', details);
  }

  static riskViolation(message: string): AppError {
    return new AppError(message, 403, 'RISK_VIOLATION');
  }

  static blackoutActive(): AppError {
    return new AppError('Trading is suspended during market blackout window', 403, 'BLACKOUT_ACTIVE');
  }

  static withdrawalIneligible(reason: string): AppError {
    return new AppError(reason, 403, 'WITHDRAWAL_INELIGIBLE');
  }
}
