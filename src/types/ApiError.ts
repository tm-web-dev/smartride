import { NextResponse } from "next/server";

export interface IApiError {
  success: boolean;
  message: string;
  statusCode: number;
  error?: string; // 👈 machine-readable code
  errors?: any[];
}

export class ApiError implements IApiError {
  public success: boolean = false;

  constructor(
    public statusCode: number,
    public message: string,
    public error?: string, // 👈 NEW
    public errors?: any[]
  ) {}

  toResponse() {
    return NextResponse.json(
      {
        success: this.success,
        message: this.message,
        ...(this.error && { error: this.error }),   // 👈 only include if exists
        ...(this.errors?.length ? { errors: this.errors } : {}), // 👈 only if not empty
      },
      { status: this.statusCode }
    );
  }

  // 400
  static badRequest(
    message: string = "Bad Request",
    errors: any[] = []
  ): ApiError {
    return new ApiError(400, message, "BAD_REQUEST", errors);
  }

  // 401
  static unauthorized(message: string = "Unauthorized access"): ApiError {
    return new ApiError(401, message, "UNAUTHORIZED");
  }

  // 403
  static forbidden(message: string = "Permission denied"): ApiError {
    return new ApiError(403, message, "FORBIDDEN");
  }

  // 404
  static notFound(message: string = "Resource not found"): ApiError {
    return new ApiError(404, message, "NOT_FOUND");
  }

  // 409
  static conflict(data: any, message: string = "Already exists"): ApiError {
    return new ApiError(409, message, "CONFLICT", [data]);
  }

  // 429
  static tooManyRequests(
    message: string = "Too many attempts. Please try again later."
  ): ApiError {
    return new ApiError(429, message, "TOO_MANY_REQUESTS");
  }

  // 500
  static internal(
    message: string = "Internal Server Error",
    err: any = null
  ): ApiError {
    const errorDetails = err instanceof Error ? [err.message] : undefined;
    return new ApiError(500, message, "INTERNAL_ERROR", errorDetails);
  }
}