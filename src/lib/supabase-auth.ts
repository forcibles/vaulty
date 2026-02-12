const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const STORAGE_KEY = "cv_auth_session";

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user?: {
    id: string;
    email?: string;
    [key: string]: unknown;
  };
};

export type OAuthProvider = "google" | "discord";

const hasSupabaseConfig = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const buildHeaders = (accessToken?: string): HeadersInit => {
  if (!SUPABASE_ANON_KEY) return {};
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

const endpoint = (path: string) => `${SUPABASE_URL}/auth/v1/${path}`;

const storeSession = (session: AuthSession | null) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const getStoredSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

const parseError = async (response: Response) => {
  const payload = await response.json().catch(() => null);
  return payload?.msg || payload?.error_description || payload?.error || "Auth request failed.";
};

const assertConfigured = () => {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<AuthSession | null> => {
  assertConfigured();
  const response = await fetch(endpoint("signup"), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error(await parseError(response));
  const payload = (await response.json()) as AuthSession;
  if (payload?.access_token) storeSession(payload);
  return payload;
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthSession> => {
  assertConfigured();
  const response = await fetch(endpoint("token?grant_type=password"), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error(await parseError(response));
  const payload = (await response.json()) as AuthSession;
  storeSession(payload);
  return payload;
};

export const signOut = async (accessToken: string) => {
  if (!hasSupabaseConfig()) {
    storeSession(null);
    return;
  }
  await fetch(endpoint("logout"), {
    method: "POST",
    headers: buildHeaders(accessToken),
  }).catch(() => null);
  storeSession(null);
};

export const fetchCurrentUser = async (accessToken: string) => {
  assertConfigured();
  const response = await fetch(endpoint("user"), {
    method: "GET",
    headers: buildHeaders(accessToken),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
};

export const refreshSession = async (refreshToken: string): Promise<AuthSession> => {
  assertConfigured();
  const response = await fetch(endpoint("token?grant_type=refresh_token"), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const payload = (await response.json()) as AuthSession;
  storeSession(payload);
  return payload;
};

export const clearStoredSession = () => storeSession(null);
export const isSupabaseConfigured = hasSupabaseConfig;

export const beginOAuthSignIn = (provider: OAuthProvider, redirectTo?: string) => {
  assertConfigured();

  const callbackUrl = redirectTo || `${window.location.origin}/auth`;
  const url = new URL(endpoint("authorize"));
  url.searchParams.set("provider", provider);
  url.searchParams.set("redirect_to", callbackUrl);

  // Discord requires explicit scope declaration for email profile claims.
  if (provider === "discord") {
    url.searchParams.set("scopes", "identify email");
  }

  window.location.assign(url.toString());
};

export const consumeOAuthRedirect = (): { session: AuthSession | null; error: string | null } => {
  if (typeof window === "undefined") return { session: null, error: null };

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const errorParam =
    hash.get("error_description") ||
    hash.get("error") ||
    new URLSearchParams(window.location.search).get("error_description") ||
    new URLSearchParams(window.location.search).get("error");

  if (errorParam) {
    window.history.replaceState({}, document.title, window.location.pathname);
    return { session: null, error: decodeURIComponent(errorParam) };
  }

  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  const expiresIn = Number(hash.get("expires_in") || "0");

  if (!accessToken || !refreshToken) {
    return { session: null, error: null };
  }

  const session: AuthSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    ...(expiresIn > 0 ? { expires_at: Math.floor(Date.now() / 1000) + expiresIn } : {}),
  };

  storeSession(session);
  window.history.replaceState({}, document.title, window.location.pathname);
  return { session, error: null };
};
