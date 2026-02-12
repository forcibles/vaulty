import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const showcases = [
  {
    badge: "CHEATVAULT TOOLS",
    title: "Hand-Selected Tools, CheatVault Tested",
    description:
      "Every cheat on our website has been personally tested by us. Experienced cheaters since the JTAG days on Xbox. Whether it’s internal or external, we’ve tested so you don’t have to.",
    points: [],
    reverse: false,
  },
  {
    badge: "CheatVault Showcase",
    title: "Tested Release Flow With Continuous Reliability Passes",
    description:
      "We ship with a maintenance-first mindset: patch response, quality checks, and support feedback loops that prioritize uptime and consistency.",
    points: ["Rapid post-update checks", "Issue-first support escalation", "Iterative stability tuning"],
    reverse: true,
  },
];

const VideoShowcaseSection = () => {
  return (
    <section className="section-shell relative px-4 py-20 sm:py-24">
      <div className="relative z-10 mx-auto max-w-7xl space-y-8 sm:space-y-10">
        {showcases.map((showcase, index) => (
          <motion.article
            key={showcase.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className={`gloss-panel grid gap-5 p-3 md:grid-cols-2 md:gap-6 md:p-4 ${
              showcase.reverse ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
            }`}
          >
            <div className="gloss-card relative border-white/15">
              <video autoPlay muted loop playsInline className="h-full min-h-[240px] w-full object-cover sm:min-h-[320px]">
                <source src="/loop_vault.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </div>

            <div className="gloss-card flex flex-col justify-center p-5 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.16em] text-primary/95">{showcase.badge}</p>
              <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {showcase.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{showcase.description}</p>
              {showcase.points.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {showcase.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-white/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
