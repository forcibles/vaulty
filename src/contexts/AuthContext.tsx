import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  beginOAuthSignIn,
  clearStoredSession,
  consumeOAuthRedirect,
  fetchCurrentUser,
  getStoredSession,
  isSupabaseConfigured,
  refreshSession,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  type AuthSession,
  type OAuthProvider,
} from "@/lib/supabase-auth";

type AuthUser = {
  id: string;
  email?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  configured: boolean;
  oauthError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: OAuthProvider) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = (value: unknown): AuthUser | null => {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== "string") return null;
  return {
    id: item.id,
    email: typeof item.email === "string" ? item.email : undefined,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!configured) {
        setLoading(false);
        return;
      }

      try {
        const oauthResult = consumeOAuthRedirect();
        if (oauthResult.error) {
          setOauthError(oauthResult.error);
        }

        const stored = oauthResult.session ?? getStoredSession();
        if (!stored?.access_token) {
          setLoading(false);
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        let activeSession = stored;

        if (stored.expires_at && stored.expires_at <= now && stored.refresh_token) {
          activeSession = await refreshSession(stored.refresh_token);
        }

        const currentUser = await fetchCurrentUser(activeSession.access_token);
        setSession(activeSession);
        setUser(mapUser(currentUser));
      } catch {
        clearStoredSession();
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrapAuth();
  }, [configured]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      loading,
      configured,
      signIn: async (email: string, password: string) => {
        setOauthError(null);
        const nextSession = await signInWithEmail(email, password);
        setSession(nextSession);
        setUser(mapUser(nextSession.user));
        if (!nextSession.user) {
          const currentUser = await fetchCurrentUser(nextSession.access_token);
          setUser(mapUser(currentUser));
        }
      },
      signUp: async (email: string, password: string) => {
        setOauthError(null);
        const created = await signUpWithEmail(email, password);
        if (created?.access_token) {
          setSession(created);
          setUser(mapUser(created.user));
        }
      },
      signInWithProvider: (provider: OAuthProvider) => {
        setOauthError(null);
        beginOAuthSignIn(provider, `${window.location.origin}/auth`);
      },
      logout: async () => {
        if (session?.access_token) await signOut(session.access_token);
        else clearStoredSession();
        setSession(null);
        setUser(null);
        setOauthError(null);
      },
      oauthError,
    }),
    [configured, loading, oauthError, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
