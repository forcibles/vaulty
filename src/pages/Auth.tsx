import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import VolumetricBackground from "@/components/VolumetricBackground";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Auth = () => {
  const { signIn, signUp, signInWithProvider, configured, oauthError, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fromPath = (location.state as { from?: string } | null)?.from || "/account";
  const displayError = error || oauthError;

  useEffect(() => {
    if (user) {
      navigate(fromPath, { replace: true });
    }
  }, [fromPath, navigate, user]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Login - CheatVault"
        description="Create your CheatVault account or log in to manage your tools and orders."
        keywords={["login", "account", "signup", "cheatvault auth"]}
        breadcrumbs={[
          { position: 1, name: "Home", url: "/" },
          { position: 2, name: "Login" },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VolumetricBackground />
        <Navbar />

        <main className="page-main">
          <div className="page-wrap max-w-lg">
            <span className="page-kicker">
              {isSignUp ? "Create Access" : "Member Access"}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="page-title"
            >
              {isSignUp ? "Create Account" : "Login"}
            </motion.h1>
            <p className="page-subtitle">
              {isSignUp ? "Create your account for access management." : "Use your account to access protected tools and pages."}
            </p>

            {!configured && (
              <div className="page-panel mt-6 border-yellow-500/35 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your env file.
              </div>
            )}

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              onSubmit={onSubmit}
              className="page-panel mt-6 p-6"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!configured || loading}
                  onClick={() => {
                    setError(null);
                    signInWithProvider("google");
                  }}
                  className="button-gloss-ghost inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/88 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">G</span>
                  Google
                </button>
                <button
                  type="button"
                  disabled={!configured || loading}
                  onClick={() => {
                    setError(null);
                    signInWithProvider("discord");
                  }}
                  className="button-gloss-ghost inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/88 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MessageCircle className="h-4 w-4 text-[#8ea1e1]" />
                  Discord
                </button>
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/12" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">or email</span>
                <div className="h-px flex-1 bg-white/12" />
              </div>

              <label className="block text-xs uppercase tracking-[0.14em] text-white/65">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="page-input mt-2"
                placeholder="you@example.com"
              />

              <label className="mt-4 block text-xs uppercase tracking-[0.14em] text-white/65">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="page-input mt-2"
                placeholder="Minimum 6 characters"
              />

              {displayError && <p className="mt-3 text-sm text-destructive">{displayError}</p>}

              <button
                type="submit"
                disabled={!configured || loading}
                className="button-gloss-primary mt-5 inline-flex w-full items-center justify-center px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
              </button>

              <button
                type="button"
                onClick={() => setIsSignUp((prev) => !prev)}
                className="button-gloss-ghost mt-3 w-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground"
              >
                {isSignUp ? "I already have an account" : "Create new account"}
              </button>
            </motion.form>

            <div className="mt-6">
              <Link
                to="/"
                className="page-chip"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Auth;
