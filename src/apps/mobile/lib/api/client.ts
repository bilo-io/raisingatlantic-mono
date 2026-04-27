import axios, { AxiosInstance } from "axios";
import { apiBaseUrl } from "../env";
import { getAuthHeaders } from "./auth-header";
import { toApiError } from "./errors";

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

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);
