import { ApiResponse } from "domain/types/response";

export class HttpError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(message: string, statusCode = 500, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function successResponse<T>(
  data: T,
  meta?: Record<string, any>
): Response {
  const body: ApiResponse<T> = {
    status: "success",
    data,
    ...(meta ? { meta } : {}),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(
  message: string,
  statusCode = 400,
  errors?: unknown
): Response {
  const body: ApiResponse<null> = {
    status: "error",
    message,
    ...(errors ? { errors } : {}),
  };

  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
