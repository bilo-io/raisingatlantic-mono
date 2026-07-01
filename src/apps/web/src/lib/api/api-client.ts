import axios, { AxiosInstance } from 'axios';
import { toApiError } from './errors';

const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/v1';

// Sent on every request when deploying to a Vercel preview environment that has
// SSO deployment protection enabled. The secret must match VERCEL_AUTOMATION_BYPASS_SECRET
// on the API project. Never set this var in Production.
const vercelBypassToken = process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN;

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  // Send the httpOnly auth cookie with every request (cross-origin API).
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    ...(vercelBypassToken ? { 'x-vercel-protection-bypass': vercelBypassToken } : {}),
  },
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bounce to /login when a live session expires mid-use. Excludes the auth
    // probes themselves (GET /auth/me returns 401 for logged-out visitors — we
    // must not redirect-loop on that) and never runs on the server or when
    // already on an auth screen.
    const status = error?.response?.status;
    const requestUrl: string = error?.config?.url ?? '';
    if (
      typeof window !== 'undefined' &&
      status === 401 &&
      !requestUrl.includes('/auth/') &&
      !window.location.pathname.startsWith('/login')
    ) {
      window.location.assign('/login');
    }
    return Promise.reject(toApiError(error));
  },
);

// Re-export the instance under the name `api` to mirror mobile's `lib/api` shape.
export const api = apiClient;
