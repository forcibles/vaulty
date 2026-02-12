import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";

const reviews = [
  {
    name: "uncle._.sai",
    text: "Instant and ready to help in support tickets, excellent assistance every time.",
  },
  {
    name: "solidtag.",
    text: "Fast replies, helpful staff, and clean pricing. Best support experience I have had.",
  },
  {
    name: "player_onex",
    text: "Response times are quick and they actually follow through on fixes.",
  },
  {
    name: "rascalnekro",
    text: "Professional support and stable tools. Easy recommendation.",
  },
];

// Generate a consistent color from the username
const getAvatarColor = (name: string) => {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const colors = [
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-green-600",
    "from-violet-500 to-purple-600",
  ];
  return colors[hash % colors.length];
};

const ReviewsSection = () => {
  return (
    <section className="section-shell relative px-4 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(126,188,255,0.16),transparent_55%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-gradient-silver sm:text-5xl">
              Community Reviews
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
              Real feedback from active members who use CheatVault daily.
            </p>
          </div>
          <div className="gloss-panel px-4 py-3 text-right">
            <p className="font-heading text-lg font-bold text-foreground">4.9 / 5 rating</p>
            <p className="text-xs uppercase tracking-[0.14em] text-white/70">800+ verified reviews</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.02 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="gloss-card relative p-5 card-glow-hover"
            >
              {/* Gold left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

              {/* Decorative quote mark */}
              <div className="pointer-events-none absolute -top-2 right-3 font-heading text-[4rem] leading-none text-primary/[0.07] select-none">
                "
              </div>

              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* Avatar initial */}
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(review.name)} text-[10px] font-bold text-white shadow-md shrink-0`}>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-heading text-sm font-bold text-foreground">{review.name}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>
              <div className="mb-3 flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-white/75">{review.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
