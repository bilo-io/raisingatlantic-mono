import axios, { AxiosInstance } from "axios";
import { apiBaseUrl } from "../env";
import { getAuthHeaders } from "./auth-header";
import { toApiError } from "./errors";
import { triggerSignOut } from "./sign-out-bridge";

export const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  for (const [k, v] of Object.entries(headers)) {
    config.headers.set(k, v);
  }
  return config;
});

// Auth-flow endpoints legitimately return 401 for bad credentials/codes —
// only an invalid *session* (any other route, incl. /auth/me) forces sign-out.
const AUTH_FLOW_401 =
  /\/auth\/(login|google|mfa|password-reset|verify-email)/;

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    const url =
      (error as { config?: { url?: string } })?.config?.url ?? "";
    if (apiError.status === 401 && !AUTH_FLOW_401.test(url)) {
      void triggerSignOut();
    }
    return Promise.reject(apiError);
  },
);
