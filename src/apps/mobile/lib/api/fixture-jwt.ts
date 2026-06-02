type FixtureClaims = {
  sub: string;
  role: string;
  tenantId?: string;
  practiceIds?: string[];
};

function base64url(input: string): string {
  // RN's btoa polyfill / Hermes both handle Latin-1; for safety, encode any
  // multi-byte characters first.
  const bytes = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, h) =>
    String.fromCharCode(parseInt(h, 16)),
  );
  // eslint-disable-next-line no-undef
  const b64 = typeof btoa === "function" ? btoa(bytes) : Buffer.from(bytes, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function signFixtureToken(claims: FixtureClaims): string {
  if (!__DEV__) {
    throw new Error("signFixtureToken must never run in a production build");
  }
  const header = { alg: "none", typ: "JWT" };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24;
  const payload = { ...claims, iat, exp };
  return `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}.`;
}
