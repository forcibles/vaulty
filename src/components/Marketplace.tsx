import { useEffect, useMemo, useState } from "react";
import GameCard from "@/components/GameCard";
import { CircleCheckBig, Flame, Timer } from "lucide-react";
import { useLocation } from "react-router-dom";
import { TOOL_CATALOG, TOOL_CATEGORIES } from "@/data/toolCatalog";

type Category = (typeof TOOL_CATEGORIES)[number];

const isCategory = (value: string): value is Category =>
  TOOL_CATEGORIES.includes(value as Category);

type MarketplaceProps = {
  compactTop?: boolean;
};

const Marketplace = ({ compactTop = false }: MarketplaceProps) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam && isCategory(categoryParam)) {
      setActiveCategory(categoryParam);
      return;
    }

    setActiveCategory("All");
  }, [location.search]);

  useEffect(() => {
    const onCategorySelect = (event: Event) => {
      const selectedCategory = (event as CustomEvent<string>).detail;
      if (selectedCategory && isCategory(selectedCategory)) {
        setActiveCategory(selectedCategory);
      }
    };

    window.addEventListener("marketplace:category", onCategorySelect as EventListener);
    return () => window.removeEventListener("marketplace:category", onCategorySelect as EventListener);
  }, []);

  const filteredCatalog = useMemo(
    () =>
      activeCategory === "All"
        ? TOOL_CATALOG
        : TOOL_CATALOG.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  return (
    <section
      id="marketplace"
      className={`section-shell relative px-4 ${compactTop ? "-mt-4 pt-3 pb-20 sm:-mt-6 sm:pt-4 sm:pb-24" : "py-20 sm:py-24"}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[60%] h-[600px] w-[700px] -translate-y-1/2 rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[110px] animate-[godray-drift_20s_ease-in-out_infinite]" />
        <div className="absolute right-[-10%] top-[50%] h-[600px] w-[700px] -translate-y-1/2 -rotate-45 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent blur-[110px] animate-[godray-drift_25s_ease-in-out_infinite_reverse]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-gradient-silver sm:text-5xl">
            CheatVault Marketplace
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Imported catalog snapshot with {TOOL_CATALOG.length} tools across {TOOL_CATEGORIES.length - 1} categories.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-green-400">
              <CircleCheckBig className="h-3.5 w-3.5" />
              Undetected (Working)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
              <Timer className="h-3.5 w-3.5" />
              Instant Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
              <Flame className="h-3.5 w-3.5" />
              Fast Patch Lane
            </span>
          </div>
        </div>

        <div className="mb-7 -mx-4 overflow-x-auto px-4 pb-3 pt-1 md:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full touch-pan-x gap-2 pr-8">
            {TOOL_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`select-none whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  activeCategory === category
                    ? "border-primary/70 bg-primary/20 text-primary shadow-[0_0_20px_-8px_rgba(212,175,55,0.6)]"
                    : "border-white/10 bg-white/[0.03] text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <aside className="hidden md:col-span-3 md:block">
            <div className="sticky top-24 space-y-3">
              <div className="gloss-panel p-4">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Categories
                </p>
                <div className="space-y-2">
                  {TOOL_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] transition ${
                        activeCategory === category
                          ? "border-primary/70 bg-primary/20 text-primary shadow-[0_0_18px_-10px_rgba(212,175,55,0.7)]"
                          : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="gloss-panel p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Store Signals
                </p>
                <ul className="space-y-2 text-xs text-foreground/90">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Imported from SSZ category snapshots
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Status-mapped tool labels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Unified CheatVault visual system
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <div className="md:col-span-9">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCatalog.map((game) => (
                <GameCard
                  key={game.slug}
                  slug={game.slug}
                  title={game.title}
                  category={game.category}
                  description={game.description}
                  startingPrice={game.startingPrice}
                  status={game.status}
                  statusTone={game.statusTone}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
