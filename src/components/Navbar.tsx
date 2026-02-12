import { motion, AnimatePresence } from "framer-motion";
import { Activity, CircleHelp, LogIn, LogOut, Menu, Store, User, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Marketplace", sectionId: "marketplace", icon: Store },
  { label: "Status", path: "/status", icon: Activity },
  { label: "FAQ", path: "/faq", icon: CircleHelp },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const sectionHref = (id: string) =>
    location.pathname === "/" ? `#${id}` : `/#${id}`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? "hidden" : "";
  };

  const getIsActive = (link: (typeof navLinks)[0]) => {
    if (link.path) return location.pathname === link.path;
    if (!link.sectionId) return false;
    if (location.pathname !== "/") return false;
    if (location.hash === `#${link.sectionId}`) return true;
    return location.hash === "" && link.sectionId === "marketplace";
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-black/65 backdrop-blur-2xl border-b border-white/[0.12] shadow-[0_14px_42px_-28px_rgba(0,0,0,0.95)]"
          : "bg-black/28 backdrop-blur-xl border-b border-white/[0.06]"
          }`}
        aria-label="Main navigation"
      >
        <div className="relative mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo — left */}
          <Link
            to="/"
            className="group relative flex w-max shrink-0 items-center justify-self-start gap-1.5 rounded-md px-1 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="CheatVault Home"
          >
            <span className="relative inline-flex items-center leading-none">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 select-none whitespace-nowrap font-heading font-bold tracking-[-0.03em] text-sky-300/45 blur-[7px]"
              >
                CheatVault
              </span>
              <span
                className="relative z-10 select-none whitespace-nowrap font-heading text-[1.28rem] font-bold tracking-[-0.03em] transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(230,243,255,0.9) 45%, rgba(161,203,255,0.72) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextStroke: "0.7px rgba(255,255,255,0.12)",
                  textShadow:
                    "0 0 1px rgba(255,255,255,0.45), 0 6px 18px rgba(0,0,0,0.45), 0 0 18px rgba(108,166,236,0.2)",
                }}
              >
                CheatVault
              </span>
            </span>
            <span className="nav-brand-tag hidden lg:inline-flex">
              <span className="nav-brand-dot" aria-hidden="true" />
              Online
            </span>
          </Link>

          {/* Center nav rail — desktop */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex items-center">
            <div className="nav-frost-rail">
              {navLinks.map((link) => {
                const isActive = getIsActive(link);
                const Icon = link.icon;
                if (link.path) {
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className={`nav-frost-link ${isActive ? "nav-frost-link-active" : "text-white/75 hover:text-white"
                        }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-chip"
                          className="nav-frost-link-active-surface"
                          transition={{
                            type: "spring" as const,
                            stiffness: 360,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative z-10 inline-flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {link.label}
                      </span>
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.sectionId}
                    href={sectionHref(link.sectionId!)}
                    className={`nav-frost-link ${isActive ? "nav-frost-link-active" : "text-white/75 hover:text-white"
                      }`}
                    aria-label={`${link.label} section`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-chip"
                        className="nav-frost-link-active-surface"
                        transition={{
                          type: "spring" as const,
                          stiffness: 360,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex min-w-0 items-center gap-2 md:min-w-[220px] md:justify-end">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/account"
                  className="button-gloss-ghost inline-flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium text-white/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Open your account"
                >
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  Account
                </Link>
                <button
                  onClick={() => void logout()}
                  className="button-gloss-ghost inline-flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium text-white/70 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-destructive/50"
                  aria-label="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
                <Link
                  to="/auth"
                  className="button-gloss-primary hidden md:inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Sign in to CheatVault"
                >
                <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:border-white/[0.15] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu — full-screen overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col items-center justify-center min-h-screen gap-2 p-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                >
                  {link.path ? (
                    <Link
                      to={link.path}
                      className={`nav-mobile-chip block px-6 py-3 text-2xl font-heading font-semibold transition-colors duration-200 ${location.pathname === link.path ? "nav-mobile-chip-active" : "text-white/80 hover:text-white"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={
                        location.pathname === link.path ? "page" : undefined
                      }
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </span>
                    </Link>
                  ) : (
                    <a
                      href={sectionHref(link.sectionId!)}
                      className={`nav-mobile-chip block px-6 py-3 text-2xl font-heading font-semibold transition-colors duration-200 ${location.pathname === "/" && (location.hash === `#${link.sectionId}` || (location.hash === "" && link.sectionId === "marketplace"))
                          ? "nav-mobile-chip-active"
                          : "text-white/80 hover:text-white"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                      aria-label={`${link.label} section`}
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </span>
                    </a>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-6 w-full max-w-xs flex flex-col gap-3"
              >
                {user ? (
                  <>
                    <Link
                      to="/account"
                      className="button-gloss-ghost flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white/85"
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="Open your account"
                    >
                      <User className="h-5 w-5" aria-hidden="true" />
                      Account
                    </Link>
                    <button
                      onClick={() => {
                        void logout();
                        setIsMenuOpen(false);
                      }}
                      className="button-gloss-ghost flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white/70 hover:text-red-300"
                      aria-label="Logout"
                    >
                      <LogOut className="h-5 w-5" aria-hidden="true" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="button-gloss-primary flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Register to CheatVault"
                  >
                    <LogIn className="h-5 w-5" aria-hidden="true" />
                    Register
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
