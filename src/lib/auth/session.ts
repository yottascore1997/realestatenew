export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
}

const SECRET = process.env.SESSION_SECRET || "triyards-crm-dev-secret-change-me";
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string) {
  const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(payload: string) {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(new Uint8Array(sig));
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ ...user, exp })));
  const signature = await signPayload(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      new TextEncoder().encode(payload)
    );
    if (!valid) return null;

    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: data.avatar ?? null,
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "crm_session";
export const SESSION_MAX_AGE = MAX_AGE_SEC;
