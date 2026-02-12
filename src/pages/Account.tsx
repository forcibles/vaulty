import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import VolumetricBackground from "@/components/VolumetricBackground";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, LogOut } from "lucide-react";

const Account = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <SEOHead
        title="Account - CheatVault"
        description="Manage your CheatVault account and active session."
        keywords={["account", "profile", "cheatvault"]}
        breadcrumbs={[
          { position: 1, name: "Home", url: "/" },
          { position: 2, name: "Account" },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VolumetricBackground />
        <Navbar />

        <main className="page-main">
          <div className="page-wrap max-w-4xl">
            <span className="page-kicker">Member Area</span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="page-title"
            >
              Account
            </motion.h1>
            <p className="page-subtitle">Signed in and ready. Manage your access from here.</p>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="page-panel mt-8 p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="page-chip border-emerald-400/35 bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Active Session
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
                <Mail className="mt-0.5 h-4 w-4 text-sky-200" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/58">Email</p>
                  <p className="mt-1 font-heading text-lg font-semibold text-foreground">
                    {user?.email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => void logout()}
                  className="button-gloss-ghost inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </motion.section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Account;
