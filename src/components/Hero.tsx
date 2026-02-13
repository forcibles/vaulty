import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import {
  ChevronRight,
  Eye,
  ShieldCheck,
  Star,
  Headset,
  Crosshair,
  Gamepad2,
  Swords,
  ScanEye,
  Radar,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TOOL_CATALOG, type ToolCatalogItem, type ToolStatusTone } from "@/data/toolCatalog";

type HeroCategory = "Call of Duty" | "Arc Raiders" | "Fortnite";
type HeroCardStatus = "Undetected" | "Testing" | "Updating";

const HERO_CATEGORY_ORDER: HeroCategory[] = ["Call of Duty", "Arc Raiders", "Fortnite"];

const HERO_CATEGORY_META: Record<HeroCategory, { code: string; accent: string }> = {
  "Call of Duty": { code: "COD", accent: "rgba(251, 191, 36, 0.9)" },
  "Arc Raiders": { code: "AR", accent: "rgba(114, 199, 255, 0.95)" },
  Fortnite: { code: "FN", accent: "rgba(52, 211, 153, 0.92)" },
};

const tonePriority: Record<ToolStatusTone, number> = {
  undetected: 0,
  testing: 1,
  updating: 2,
};

const toneToHeroStatus: Record<ToolStatusTone, HeroCardStatus> = {
  undetected: "Undetected",
  testing: "Testing",
  updating: "Updating",
};

const getTopToolForCategory = (category: HeroCategory): ToolCatalogItem | null => {
  const matches = TOOL_CATALOG.filter((tool) => tool.category === category);
  if (matches.length === 0) return null;

  return [...matches].sort((a, b) => {
    const toneDiff = tonePriority[a.statusTone] - tonePriority[b.statusTone];
    if (toneDiff !== 0) return toneDiff;
    if (b.startingPrice !== a.startingPrice) return b.startingPrice - a.startingPrice;
    return a.title.localeCompare(b.title);
  })[0];
};

const games = HERO_CATEGORY_ORDER.map((category) => {
  const tool = getTopToolForCategory(category);
  const meta = HERO_CATEGORY_META[category];

  return {
    name: category,
    toolTitle: tool?.title ?? `${category} Top Pick`,
    tagline: `Top tool for ${category}`,
    status: toneToHeroStatus[tool?.statusTone ?? "undetected"],
    features: [
      `Starts at $${(tool?.startingPrice ?? 0).toFixed(2)}`,
      tool?.statusTone === "undetected" ? "Live in marketplace" : tool?.statusTone === "testing" ? "Active testing lane" : "Update in progress",
      "CheatVault tested",
    ],
    code: meta.code,
    accent: meta.accent,
  };
});

const statusColors: Record<HeroCardStatus, { dot: string; text: string }> = {
  Undetected: { dot: "bg-emerald-400", text: "text-emerald-400/70" },
  Testing: { dot: "bg-sky-400", text: "text-sky-400/70" },
  Updating: { dot: "bg-amber-400/80", text: "text-amber-400/70" },
};

/* ─── Floating icons — very faint, organic drift ─── */
const floatingIcons = [
  { Icon: Crosshair, x: "7%", y: "20%", delay: 0, size: 18, opacity: 0.06 },
  { Icon: ShieldCheck, x: "90%", y: "15%", delay: 1.4, size: 20, opacity: 0.05 },
  { Icon: Gamepad2, x: "4%", y: "58%", delay: 0.8, size: 22, opacity: 0.04 },
  { Icon: Swords, x: "93%", y: "50%", delay: 2.0, size: 16, opacity: 0.05 },
  { Icon: ScanEye, x: "10%", y: "80%", delay: 2.6, size: 14, opacity: 0.04 },
  { Icon: Radar, x: "87%", y: "78%", delay: 0.4, size: 18, opacity: 0.05 },
  { Icon: Lock, x: "14%", y: "40%", delay: 1.8, size: 13, opacity: 0.035 },
  { Icon: Star, x: "88%", y: "35%", delay: 2.2, size: 14, opacity: 0.04 },
];

/* ─── Card layout ─── */
const cardTransforms = [
  { rotate: -5, x: 35, scale: 0.93, z: 1 },
  { rotate: 0, x: 0, scale: 1, z: 3 },
  { rotate: 5, x: -35, scale: 0.93, z: 1 },
];

type HeroGameCard = (typeof games)[number];

const Hero = () => {
  const navigate = useNavigate();

  const handleViewDetails = (category: string) => {
    const targetUrl = `/?category=${encodeURIComponent(category)}#marketplace`;

    // Keep category selection deterministic, even when user re-clicks the same card.
    window.dispatchEvent(new CustomEvent("marketplace:category", { detail: category }));
    navigate(targetUrl);

    window.setTimeout(() => {
      document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  const renderCardBody = (game: HeroGameCard, isCenter: boolean) => (
    <div
      className={`gloss-card hero-feature-card relative ${isCenter ? "shadow-[0_8px_60px_-12px_rgba(88,168,255,0.3)]" : "opacity-80"}`}
      style={
        {
          width: "clamp(210px, 22vw, 260px)",
          padding: "clamp(18px, 2vw, 28px)",
          "--card-accent": game.accent,
        } as CSSProperties
      }
    >
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />
      <div className="hero-card-diamond hero-card-diamond-left" />
      <div className="hero-card-diamond hero-card-diamond-right" />

      <div className="mb-4 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[game.status].dot}`} />
        <span className={`text-[9px] uppercase tracking-[0.18em] font-semibold ${statusColors[game.status].text}`}>
          {game.status}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="hero-card-code">{game.code}</span>
          {isCenter && <ShieldCheck className="h-3 w-3 text-emerald-400/40" />}
        </div>
      </div>

      <p className="text-[9px] uppercase tracking-[0.16em] text-white/52">{game.name}</p>
      <h3 className="mt-1 font-heading text-sm sm:text-[15px] font-semibold leading-tight text-white/92">
        {game.toolTitle}
      </h3>
      <p className="mb-5 mt-1 text-[10px] leading-relaxed text-white/55">{game.tagline}</p>

      <div className="mb-5 space-y-1.5">
        {game.features.map((feat) => (
          <div key={feat} className="flex items-center gap-2.5 text-[10px] font-medium text-white/70 sm:text-[11px]">
            <div className="h-px w-2.5 shrink-0 bg-[color:var(--card-accent)] opacity-70" />
            {feat}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => handleViewDetails(game.name)}
        className={`hero-diamond-btn block w-full text-center py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
          isCenter ? "hero-diamond-btn-primary" : "hero-diamond-btn-ghost text-white/90"
        }`}
      >
        View Details
      </button>
    </div>
  );

  return (
    <section className="section-shell relative flex min-h-[100svh] flex-col items-center justify-start overflow-hidden px-4 pt-32 pb-10 sm:pt-40 sm:pb-12">
      {/* ── Background layers ── */}
      {/* Faint arc rings for mixed-mode background */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-34rem] h-[72rem] w-[72rem] -translate-x-1/2 rounded-full"
        style={{
          border: "1px solid rgba(186, 222, 255, 0.18)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.08) 76%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.08) 76%, transparent)",
          boxShadow: "0 0 70px -28px rgba(126,188,255,0.32)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-30rem] h-[58rem] w-[58rem] -translate-x-1/2 rounded-full"
        style={{
          border: "1px solid rgba(232, 245, 255, 0.1)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.12) 72%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.12) 72%, transparent)",
        }}
      />

      {/* Primary radial wash — cooler and cleaner */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 65% at 50% 18%, rgba(88,168,255,0.14) 0%, rgba(88,168,255,0.04) 45%, transparent 75%)",
          animation: "spotlight-breathe 8s ease-in-out infinite",
        }}
      />
      {/* Secondary white wash — very subtle top illumination */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 12%, rgba(255,255,255,0.04) 0%, transparent 60%)",
        }}
      />
      {/* Tight top hotspot */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(118,196,255,0.2) 0%, transparent 72%)",
          filter: "blur(40px)",
        }}
      />

      {/* Decorative frame — thinner, more subtle */}
      <div className="pointer-events-none absolute inset-10 sm:inset-20 lg:inset-28 border border-dashed border-white/[0.035] rounded-2xl">
        <svg className="absolute -top-2 -left-2 w-4 h-4 text-white/[0.07]" viewBox="0 0 16 16"><line x1="0" y1="0" x2="16" y2="16" stroke="currentColor" strokeWidth="0.8" /><line x1="16" y1="0" x2="0" y2="16" stroke="currentColor" strokeWidth="0.8" /></svg>
        <svg className="absolute -top-2 -right-2 w-4 h-4 text-white/[0.07]" viewBox="0 0 16 16"><line x1="0" y1="0" x2="16" y2="16" stroke="currentColor" strokeWidth="0.8" /><line x1="16" y1="0" x2="0" y2="16" stroke="currentColor" strokeWidth="0.8" /></svg>
        <svg className="absolute -bottom-2 -left-2 w-4 h-4 text-white/[0.07]" viewBox="0 0 16 16"><line x1="0" y1="0" x2="16" y2="16" stroke="currentColor" strokeWidth="0.8" /><line x1="16" y1="0" x2="0" y2="16" stroke="currentColor" strokeWidth="0.8" /></svg>
        <svg className="absolute -bottom-2 -right-2 w-4 h-4 text-white/[0.07]" viewBox="0 0 16 16"><line x1="0" y1="0" x2="16" y2="16" stroke="currentColor" strokeWidth="0.8" /><line x1="16" y1="0" x2="0" y2="16" stroke="currentColor" strokeWidth="0.8" /></svg>
      </div>

      {/* Floating icons — very faint, organic */}
      {floatingIcons.map(({ Icon, x, y, delay, size, opacity }, i) => (
        <div
          key={i}
          className="pointer-events-none absolute hidden sm:block"
          style={{
            left: x,
            top: y,
            opacity,
            animation: `float-drift ${9 + i * 1.6}s ease-in-out ${delay}s infinite`,
          }}
        >
          <Icon size={size} className="text-white" />
        </div>
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col text-center">
        {/* "Introducing" with flanking lines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-5 mb-8"
        >
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-white/15" />
          <span className="hero-microcopy text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/60 font-medium select-none">
            Introducing
          </span>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-white/15" />
        </motion.div>

        {/* Main heading */}
        <div className="relative inline-flex items-center justify-center">
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 22, delay: 0.26 }}
            className="pointer-events-none absolute inset-0 select-none whitespace-nowrap font-heading font-bold leading-[0.88] tracking-[-0.03em] text-sky-300/55 blur-[22px]"
            style={{ fontSize: "clamp(3rem, 13vw, 10rem)" }}
          >
            CheatVault.io
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 22, delay: 0.2 }}
            className="relative z-10 font-heading font-bold leading-[0.88] tracking-[-0.03em] whitespace-nowrap"
            style={{
              fontSize: "clamp(3rem, 13vw, 10rem)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(230,243,255,0.9) 38%, rgba(161,203,255,0.72) 75%, rgba(108,166,236,0.62) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.14)",
              textShadow:
                "0 0 1px rgba(255,255,255,0.5), 0 10px 35px rgba(0,0,0,0.62), 0 0 42px rgba(108,166,236,0.25)",
            }}
          >
            CheatVault.io
          </motion.h1>
        </div>

        {/* Subtitle — more breathing room */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 22, delay: 0.4 }}
          className="hero-subline mt-6 text-[10px] sm:text-[12px] uppercase tracking-[0.3em] text-white/62 font-medium select-none"
        >
          Undetected &nbsp;·&nbsp; Premium &nbsp;·&nbsp; Exclusive
        </motion.p>

        {/* CTA buttons — refined */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 22, delay: 0.55 }}
          className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center"
        >
          <Link
            to="/auth"
            className="button-gloss-primary min-h-[44px] w-full sm:w-auto px-7 py-3 font-heading font-semibold text-[13px] tracking-wide flex items-center justify-center gap-2 touch-manipulation"
          >
            Register
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="#top-picks"
            className="button-gloss-ghost min-h-[44px] w-full sm:w-auto px-7 py-3 font-heading font-medium text-[13px] tracking-wide flex items-center justify-center gap-2 touch-manipulation"
          >
            <Eye className="w-3.5 h-3.5" />
            View Top Picks
          </a>
        </motion.div>

        <div className="mt-12 flex flex-col sm:mt-14">
          {/* ── Card Stack ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 45, damping: 20, delay: 0.75 }}
            className="flex items-center justify-center"
          >
            {/* Mobile: swipeable cards (avoid clipped overlaps) */}
            <div className="w-full sm:hidden -mx-4 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max min-w-full snap-x snap-mandatory gap-4 pr-8 touch-pan-x">
                {games.map((game, i) => {
                  const isCenter = i === 1;
                  return (
                    <motion.div
                      key={game.name}
                      initial={{ opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring" as const, stiffness: 55, damping: 20, delay: 0.9 + i * 0.08 }}
                      className="snap-center"
                      style={{ width: "min(86vw, 340px)" }}
                    >
                      <div className="w-full" style={{ width: "100%" }}>
                        {/* Render at full container width on mobile */}
                        <div
                          className={`w-full ${isCenter ? "" : ""}`}
                          style={
                            {
                              "--card-accent": game.accent,
                            } as CSSProperties
                          }
                        >
                          <div
                            className={`gloss-card hero-feature-card relative ${isCenter ? "shadow-[0_8px_60px_-12px_rgba(88,168,255,0.3)]" : "opacity-90"}`}
                            style={{ width: "100%", padding: "22px", ["--card-accent" as any]: game.accent }}
                          >
                            {/* reuse body but with width 100% */}
                            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />
                            <div className="hero-card-diamond hero-card-diamond-left" />
                            <div className="hero-card-diamond hero-card-diamond-right" />

                            <div className="mb-4 flex items-center gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full ${statusColors[game.status].dot}`} />
                              <span className={`text-[9px] uppercase tracking-[0.18em] font-semibold ${statusColors[game.status].text}`}>
                                {game.status}
                              </span>
                              <div className="ml-auto flex items-center gap-2">
                                <span className="hero-card-code">{game.code}</span>
                                {isCenter && <ShieldCheck className="h-3 w-3 text-emerald-400/40" />}
                              </div>
                            </div>

                            <p className="text-[9px] uppercase tracking-[0.16em] text-white/52">{game.name}</p>
                            <h3 className="mt-1 font-heading text-sm font-semibold leading-tight text-white/92">
                              {game.toolTitle}
                            </h3>
                            <p className="mb-5 mt-1 text-[10px] leading-relaxed text-white/55">{game.tagline}</p>

                            <div className="mb-5 space-y-1.5">
                              {game.features.map((feat) => (
                                <div key={feat} className="flex items-center gap-2.5 text-[10px] font-medium text-white/70">
                                  <div className="h-px w-2.5 shrink-0 bg-[color:var(--card-accent)] opacity-70" />
                                  {feat}
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleViewDetails(game.name)}
                              className={`hero-diamond-btn block w-full text-center py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                                isCenter ? "hero-diamond-btn-primary" : "hero-diamond-btn-ghost text-white/90"
                              }`}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Desktop/tablet: overlapped card stack */}
            <div className="relative hidden items-end justify-center sm:flex" style={{ width: "min(88vw, 820px)" }}>
              {games.map((game, i) => {
                const { rotate, x: xOff, scale, z } = cardTransforms[i];
                const isCenter = i === 1;
                return (
                  <motion.div
                    key={game.name}
                    initial={{ opacity: 0, y: 50, rotate }}
                    animate={{ opacity: 1, y: 0, rotate }}
                    transition={{
                      type: "spring" as const,
                      stiffness: 55,
                      damping: 20,
                      delay: 0.9 + i * 0.1,
                    }}
                    whileHover={{ y: -8, scale: isCenter ? 1.03 : 0.96 }}
                    className="flex-shrink-0 cursor-pointer"
                    style={{
                      zIndex: z,
                      transform: `rotate(${rotate}deg) translateX(${xOff}px) scale(${scale})`,
                      marginLeft: i === 0 ? 0 : "-35px",
                    }}
                  >
                    {renderCardBody(game, isCenter)}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div className="mx-auto mt-6 h-px w-[min(86vw,560px)] bg-gradient-to-r from-transparent via-white/20 to-transparent sm:mt-7" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.05 }}
            className="mt-6 flex justify-center sm:mt-7"
          >
            <a
              href="#marketplace"
              className="hero-diamond-btn hero-diamond-btn-gold hero-vault-cta inline-flex min-h-[56px] w-full max-w-[390px] items-center justify-center gap-2 px-9 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.16em] sm:w-auto sm:min-w-[320px]"
            >
              Shop the Vault
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Stats — more minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="gloss-panel mx-auto mt-6 flex w-full max-w-3xl flex-col items-center justify-center gap-9 px-6 py-4 sm:mt-7 sm:flex-row sm:gap-16"
          >
            {[
              { icon: ShieldCheck, value: "23K+", label: "Hours Tested", color: "text-emerald-300/90", chipClass: "hero-stat-chip hero-stat-chip-tested", textClass: "text-center" },
              { icon: Star, value: "4.9 / 5", label: "Reviews", color: "text-sky-300/90", chipClass: "hero-stat-chip hero-stat-chip-reviews", textClass: "text-left" },
              { icon: Headset, value: "24/7", label: "Support", color: "text-cyan-300/90", chipClass: "hero-stat-chip hero-stat-chip-support", textClass: "text-left" },
            ].map(({ icon: Icon, value, label, color, chipClass, textClass }) => (
              <div key={label} className={`flex items-center gap-3 ${chipClass}`}>
                <Icon className={`h-4 w-4 ${color}`} />
                <div className={textClass}>
                  <p className="font-heading text-sm font-semibold text-white/90">{value}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/55">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
