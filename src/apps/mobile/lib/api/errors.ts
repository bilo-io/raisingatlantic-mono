import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ message?: string | string[]; error?: string }>;
    const status = ax.response?.status ?? 0;
    const body = ax.response?.data;
    const messageFromBody = body?.message
      ? Array.isArray(body.message)
        ? body.message.join(", ")
        : body.message
      : undefined;
    const raw = messageFromBody || ax.message || "Network error";
    return new ApiError(raw, status, body);
  }
  if (err instanceof Error) return new ApiError(err.message, 0, null);
  return new ApiError("Unknown error", 0, err);
}
