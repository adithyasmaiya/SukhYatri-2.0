import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
  pagination?: PaginationMeta
) {
  const payload: any = {
    success: true,
    data,
  };
  if (message) payload.message = message;
  if (pagination) payload.pagination = pagination;
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string,
  errors?: any
) {
  const payload: any = {
    success: false,
    message,
  };
  if (code) payload.code = code;
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
}
