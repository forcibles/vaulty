import { motion } from "framer-motion";
import { ShieldCheck, Crosshair, Eye, Zap } from "lucide-react";
import { Link } from "react-router-dom";

type GameInfo = {
    name: string;
    slug: string;
    tagline: string;
    features: string[];
    status: "Active" | "Updated" | "New";
    accent: string;
};

const games: GameInfo[] = [
    {
        name: "Arc Raiders",
        slug: "arc-raiders",
        tagline: "Next-gen co-op extraction",
        features: ["ESP Overlay", "Aimbot", "Loot Filter"],
        status: "New",
        accent: "from-cyan-500/20 to-blue-600/20",
    },
    {
        name: "Fortnite",
        slug: "fortnite",
        tagline: "Battle Royale dominance",
        features: ["Soft Aim", "ESP", "Recoil Control"],
        status: "Active",
        accent: "from-primary/20 to-amber-500/20",
    },
    {
        name: "Call of Duty",
        slug: "call-of-duty",
        tagline: "Warzone & multiplayer suite",
        features: ["Aimbot", "Wallhack", "Radar"],
        status: "Updated",
        accent: "from-emerald-500/20 to-green-600/20",
    },
];

const statusColors: Record<string, string> = {
    Active: "border-green-500/40 bg-green-500/10 text-green-400",
    Updated: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    New: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
};

const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 60,
            damping: 18,
            delay: 0.15 + i * 0.12,
        },
    }),
};

const FeatureIcon = ({ index }: { index: number }) => {
    const icons = [Crosshair, Eye, Zap];
    const Icon = icons[index % icons.length];
    return <Icon className="h-3 w-3 text-primary/70" />;
};

const GameCard = ({
    game,
    index,
    isCenter,
}: {
    game: GameInfo;
    index: number;
    isCenter: boolean;
}) => {
    const rotation = isCenter ? 0 : index === 0 ? -6 : 6;
    const scale = isCenter ? 1 : 0.92;
    const zIndex = isCenter ? 30 : 10;
    const xOffset = isCenter ? 0 : index === 0 ? -30 : 30;

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, scale: isCenter ? 1.03 : 0.96 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative"
            style={{
                zIndex,
                transform: `rotate(${rotation}deg) translateX(${xOffset}px) scale(${scale})`,
            }}
        >
            <div
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 w-[280px] sm:w-[300px] ${isCenter ? "shadow-2xl shadow-primary/10" : "opacity-85"
                    }`}
            >
                {/* Gradient accent at top */}
                <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${game.accent.replace(/\/20/g, "/60")}`}
                />

                {/* Inner glow from spotlight */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

                {/* Status chip */}
                <div className="mb-4 flex items-center justify-between">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusColors[game.status]}`}
                    >
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                        {game.status}
                    </span>
                    <ShieldCheck className="h-4 w-4 text-green-500/50" />
                </div>

                {/* Game title */}
                <h3 className="font-heading text-xl font-bold text-foreground">
                    {game.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{game.tagline}</p>

                {/* Feature list */}
                <ul className="mt-5 space-y-2">
                    {game.features.map((feature, i) => (
                        <li
                            key={feature}
                            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-muted-foreground"
                        >
                            <FeatureIcon index={i} />
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <Link
                    to={`/product/${game.slug}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary/20"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

const FeaturedGames = () => {
    return (
        <section className="relative overflow-hidden px-4 py-16 sm:py-24">
            {/* Ambient glow behind cards */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[400px] w-[600px] rounded-full bg-primary/8 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
                        Featured Titles
                    </p>
                    <h2 className="font-heading text-3xl font-bold text-spotlight sm:text-5xl">
                        Supported Games
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
                        Premium tools for the most popular titles. Undetected, updated, and
                        ready to deploy.
                    </p>
                </motion.div>

                {/* Overlapping card layout */}
                <div className="relative flex items-center justify-center">
                    {/* Desktop: overlapping */}
                    <div className="hidden md:flex items-center justify-center -space-x-10">
                        {games.map((game, index) => (
                            <GameCard
                                key={game.name}
                                game={game}
                                index={index}
                                isCenter={index === 1}
                            />
                        ))}
                    </div>

                    {/* Mobile: stacked vertically */}
                    <div className="flex md:hidden flex-col items-center gap-6">
                        {games.map((game, index) => (
                            <motion.div
                                key={game.name}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-40px" }}
                            >
                                <div
                                    className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 w-[300px] ${index === 1 ? "shadow-2xl shadow-primary/10" : ""
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${game.accent.replace(/\/20/g, "/60")}`}
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

                                    <div className="mb-4 flex items-center justify-between">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusColors[game.status]}`}
                                        >
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                                            {game.status}
                                        </span>
                                        <ShieldCheck className="h-4 w-4 text-green-500/50" />
                                    </div>

                                    <h3 className="font-heading text-xl font-bold text-foreground">
                                        {game.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {game.tagline}
                                    </p>

                                    <ul className="mt-5 space-y-2">
                                        {game.features.map((feature, i) => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-muted-foreground"
                                            >
                                                <FeatureIcon index={i} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={`/product/${game.slug}`}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary/20"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedGames;
