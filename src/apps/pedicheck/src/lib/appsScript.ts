// Server-side only. Proxies to the Google Apps Script web app bound to the
// PediCheck Google Sheet. Do NOT import this from a Client Component — it reads
// server-only env (APPS_SCRIPT_URL / APPS_SCRIPT_TOKEN, deliberately no
// NEXT_PUBLIC_ prefix so the values never reach the browser). Only the route
// handlers in src/app/api/* may call it.

export type AppsScriptAction =
  | 'createLead'
  | 'createFeature'
  | 'listFeatures'
  | 'vote';

export class AppsScriptError extends Error {
  constructor(
    message: string,
    /** Machine-readable code from the script (e.g. "not_found"). */
    public readonly code: string,
  ) {
    super(message);
    this.name = 'AppsScriptError';
  }
}

interface AppsScriptResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function callAppsScript<T>(
  action: AppsScriptAction,
  payload: Record<string, unknown>,
): Promise<T> {
  const url = process.env.APPS_SCRIPT_URL;
  const token = process.env.APPS_SCRIPT_TOKEN;
  if (!url || !token) {
    throw new AppsScriptError(
      'Apps Script backend is not configured',
      'not_configured',
    );
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action, payload }),
      // Apps Script 302-redirects POSTs to googleusercontent; fetch follows it.
      redirect: 'follow',
      cache: 'no-store',
    });
  } catch {
    throw new AppsScriptError(
      'Apps Script request failed',
      'upstream_unreachable',
    );
  }

  if (!res.ok) {
    throw new AppsScriptError(`Apps Script HTTP ${res.status}`, 'upstream_error');
  }

  let json: AppsScriptResponse<T>;
  try {
    json = (await res.json()) as AppsScriptResponse<T>;
  } catch {
    throw new AppsScriptError('Apps Script returned non-JSON', 'bad_response');
  }

  if (!json.ok) {
    const code = json.error ?? 'unknown';
    throw new AppsScriptError(code, code);
  }
  return json.data as T;
}
