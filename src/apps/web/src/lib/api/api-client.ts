import axios, { AxiosInstance } from 'axios';
import { getAuthHeaders } from './auth-bridge';
import { toApiError } from './errors';

const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  for (const [k, v] of Object.entries(headers)) {
    config.headers.set(k, v);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);

// Re-export the instance under the name `api` to mirror mobile's `lib/api` shape.
export const api = apiClient;
