export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  meta?: Record<string, any>;
  errors?: unknown;
}