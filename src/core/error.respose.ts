import { ReasonPhrases } from '@/utils/reasonPhrase.js';
import { StatusCode } from '@/utils/statusCode.js';

class ErrorResponse extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
    // Error.captureStackTrace(this, this.constructor)
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.CONFLICT, statusCode: number = StatusCode.FORBIDDEN) {
    super(message, statusCode);
    this.name = 'ConflictRequestError';
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.CONFLICT, statusCode: number = StatusCode.FORBIDDEN) {
    super(message, statusCode);
    this.name = 'BadRequestError';
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED, statusCode: number = StatusCode.UNAUTHORIZED) {
    super(message, statusCode);
    this.name = 'AuthFailureError';
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.NOT_FOUND, statusCode: number = StatusCode.NOT_FOUND) {
    super(message, statusCode);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.FORBIDDEN, statusCode: number = StatusCode.FORBIDDEN) {
    super(message, statusCode);
    this.name = 'ForbiddenError';
  }
}
