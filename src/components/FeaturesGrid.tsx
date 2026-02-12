import { motion, useMotionValue, useTransform } from "framer-motion";
import { Check, Crosshair, Ghost, Swords, Target } from "lucide-react";
import React, { useRef, MouseEvent } from "react";

const features = [
  {
    icon: Ghost,
    title: "Arc Raiders",
    subtitle: "Top Pick: Ghostline Protocol",
    text: "Stealth-first setup with smooth behavior blending and quick profile tuning.",
    bullets: ["Most picked for Arc Raiders", "Undetected (Working)", "Fast patch lane"],
    className: "",
  },
  {
    icon: Target,
    title: "Call of Duty",
    subtitle: "Top Pick: Vanguard Operator Kit",
    text: "Ranked-focused precision stack built for stable control and clean tracking.",
    bullets: ["Most picked for COD", "Undetected (Working)", "Low-friction activation"],
    className: "",
  },
  {
    icon: Crosshair,
    title: "Apex Legends",
    subtitle: "Top Pick: Apex Phantom Suite",
    text: "Session-safe profile set tuned for recoil adaptation and tracking confidence.",
    bullets: ["Most picked for Apex", "Undetected (Working)", "Performance-aware defaults"],
    className: "",
  },
  {
    icon: Swords,
    title: "Fortnite",
    subtitle: "Top Pick: Dropzone Elite",
    text: "Late-game control toolkit designed around route pacing and fast response.",
    bullets: ["Most picked for Fortnite", "Undetected (Working)", "Frequent reliability updates"],
    className: "",
  },
];

const SpotlightCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,255,255,0.06), transparent 60%)`
  );

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`gloss-card relative p-5 sm:p-6 ${className}`}
    >
      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none rounded-xl opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat bg-[length:128px_128px]" />
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 18 } },
};

type FeaturesGridProps = {
  compactTop?: boolean;
};

const FeaturesGrid = ({ compactTop = false }: FeaturesGridProps) => {
  return (
    <section
      id="top-picks"
      className={`section-shell relative px-4 ${compactTop ? "pt-10 pb-20 sm:pt-12 sm:pb-20" : "py-20 sm:py-24"}`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center font-heading font-bold text-2xl sm:text-4xl md:text-5xl tracking-tight text-gradient-silver mb-3 sm:mb-4"
        >
          Top Picks
        </motion.h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-white/72 sm:mb-14 sm:text-base">
          Current most popular tool for each game. You can swap these picks anytime as demand changes.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants} className={f.className}>
              <SpotlightCard className="h-full">
                <f.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground mb-2 break-words">
                  {f.title}
                </h3>
                <p className="mb-3 text-xs uppercase tracking-[0.13em] text-primary/90">{f.subtitle}</p>
                <p className="text-sm text-white/75 leading-relaxed">{f.text}</p>
                <ul className="mt-4 space-y-2">
                  {f.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-xs text-white/90">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
