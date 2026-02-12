import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VolumetricBackground from "@/components/VolumetricBackground";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Ghost, Radar, ShieldCheck, Sparkles, Timer, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const featurePlaceholders = [
  {
    icon: ShieldCheck,
    title: "Detection Shield",
    description: "Active anti-flag pipeline and session integrity monitoring.",
    status: "Live",
  },
  {
    icon: Ghost,
    title: "Stealth Runtime",
    description: "Isolated loader mode with reduced signature footprint.",
    status: "Active",
  },
  {
    icon: Radar,
    title: "Realtime Telemetry",
    description: "Live performance and status feed while you are in-session.",
    status: "Planned",
  },
  {
    icon: Timer,
    title: "Fast Rollouts",
    description: "Hotfix lane for game patches with rollback protection.",
    status: "Preview",
  },
  {
    icon: Wrench,
    title: "Config Profiles",
    description: "Preset profiles for low-latency and high-safety usage.",
    status: "Planned",
  },
  {
    icon: Sparkles,
    title: "Visual Packs",
    description: "Theme-ready UI overlays for a cleaner in-app experience.",
    status: "In Progress",
  },
];

const Features = () => {
  const badgeClass = (status: string) =>
    status === "Live" || status === "Active"
      ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300"
      : "border-sky-300/35 bg-sky-300/10 text-sky-200";

  return (
    <>
      <SEOHead 
        title="Feature Lab - CheatVault Premium Gaming Tools"
        description="Explore upcoming features and modules in development for CheatVault. Preview detection shields, stealth runtime, and more."
        keywords={['gaming features', 'cheat features', 'detection shield', 'stealth runtime', 'gaming tools']}
        breadcrumbs={[
          { position: 1, name: 'Home', url: '/' },
          { position: 2, name: 'Features' },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VolumetricBackground />
        <Navbar />

        <main className="page-main">
          <div className="page-wrap max-w-6xl">
            <span className="page-kicker">Feature Lab</span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="page-title"
            >
              Feature Lab
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="page-subtitle"
            >
              Roadmap modules and live capabilities currently in rollout.
            </motion.p>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featurePlaceholders.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.04 * index }}
                  className="page-panel p-5"
                >
                  <item.icon className="h-6 w-6 text-sky-200" />
                  <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/68">
                    {item.description}
                  </p>
                  <span className={`page-chip mt-4 ${badgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </motion.article>
              ))}
            </div>

            <div className="mt-10">
              <Link
                to="/pricing"
                className="button-gloss-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
              >
                Open Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Features;
