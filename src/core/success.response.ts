import type { Response } from 'express';

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created',
};

export class SuccessResponse {
  message: string;
  status: number;
  metadata: object;

  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: object;
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this);
  }
}

export class OK extends SuccessResponse {
  constructor(message: string, metadata = {}) {
    super({ message, metadata });
  }
}

export class CREATED extends SuccessResponse {
  options: object;
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata = {},
    options = {},
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: object;
    options?: object;
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
