import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import SEOHead from "@/components/SEOHead";
import { ShieldCheck, Plus, Minus, Check, Cpu, Monitor, Gamepad2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { TOOL_CATALOG_MAP, type ToolStatusTone } from "@/data/toolCatalog";
import { useStructuredData } from "@/services/structured-data-service";

type RequirementInfo = {
  cpu: string;
  windows: string;
  platforms: string;
};

type FeatureBlock = {
  title: string;
  icon: string;
  description: string;
  items: string[];
};

type Subscription = {
  id: string;
  duration: string;
  price: number;
  stock: number;
};

const STATUS_CHIP_CLASS: Record<ToolStatusTone, string> = {
  undetected: "border-green-500/35 bg-green-500/10 text-green-300",
  testing: "border-sky-300/35 bg-sky-300/10 text-sky-200",
  updating: "border-yellow-400/35 bg-yellow-400/10 text-yellow-300",
};

const REQUIREMENTS_BY_CATEGORY: Record<string, RequirementInfo> = {
  "Apex Legends": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Steam, EA App" },
  "Arc Raiders": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Steam / Launcher" },
  "Arena Breakout": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Game Launcher" },
  Battlefield: { cpu: "Intel / AMD", windows: "10 - 11", platforms: "EA App, Steam" },
  "Call of Duty": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Battle.net, Steam" },
  "Counter-Strike 2": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Steam" },
  "Escape From Tarkov": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "BSG Launcher" },
  FiveM: { cpu: "Intel / AMD", windows: "10 - 11", platforms: "FiveM / Cfx.re" },
  Fortnite: { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Epic Games" },
  "HWID Spoofers": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "System-wide runtime" },
  PUBG: { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Steam" },
  "Rainbow Six Siege X": { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Ubisoft Connect, Steam" },
  Roblox: { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Roblox Client" },
  Rust: { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Steam" },
  Valorant: { cpu: "Intel / AMD", windows: "10 - 11", platforms: "Riot Client" },
};

const roundCurrency = (value: number) => Number(value.toFixed(2));

const buildSubscriptions = (startingPrice: number, monetizationModel: "subscription" | "one-time"): Subscription[] => {
  if (monetizationModel === "one-time") {
    return [{ id: "one-time", duration: "One-Time Purchase", price: roundCurrency(startingPrice), stock: 20 }];
  }

  return [
    { id: "1day", duration: "1 Day", price: roundCurrency(startingPrice), stock: 20 },
    { id: "1week", duration: "1 Week", price: roundCurrency(startingPrice * 3.2), stock: 14 },
    { id: "1month", duration: "1 Month", price: roundCurrency(startingPrice * 6.8), stock: 9 },
    { id: "lifetime", duration: "Lifetime", price: roundCurrency(startingPrice * 18), stock: 3 },
  ];
};

const defaultFeatureBlocks: FeatureBlock[] = [
  {
    title: "Visual Intel",
    icon: "👁️",
    description: "Enhanced in-session awareness with low-noise visual telemetry.",
    items: ["Entity overlay", "Distance markers", "Context filters", "Threat indicators"],
  },
  {
    title: "Aim Suite",
    icon: "🎯",
    description: "Precision controls tuned for consistent tracking behavior.",
    items: ["Smoothing controls", "FOV tuning", "Target filtering", "Recoil management"],
  },
  {
    title: "Session Safety",
    icon: "🛡️",
    description: "Operational defaults focused on cleaner runtime behavior.",
    items: ["Profile isolation", "Runtime guards", "Fast patch lane", "Safety-first defaults"],
  },
  {
    title: "Config Profiles",
    icon: "⚙️",
    description: "Quick-load presets for different session styles.",
    items: ["Save / load configs", "Hotkey profiles", "Import / export", "Backup snapshots"],
  },
];

const spoofFeatureBlocks: FeatureBlock[] = [
  {
    title: "Identity Layer",
    icon: "🧬",
    description: "System identity masking with persistence-safe options.",
    items: ["Disk serial masking", "SMBIOS transforms", "NIC profile rotation", "One-click revert"],
  },
  {
    title: "Runtime Guard",
    icon: "🛡️",
    description: "Protection helpers for cleaner launch behavior.",
    items: ["Pre-launch checks", "Conflict detection", "Service audit", "Fallback mode"],
  },
  {
    title: "Compatibility",
    icon: "🧩",
    description: "Platform-aware presets for major anti-cheat stacks.",
    items: ["Preset templates", "Safe apply flow", "Version validation", "Rollback support"],
  },
  {
    title: "Tooling",
    icon: "🧰",
    description: "Utility panel for maintenance and quick diagnostics.",
    items: ["Log viewer", "Health monitor", "Quick reset", "Support export"],
  },
];

const dmaFeatureBlocks: FeatureBlock[] = [
  {
    title: "Hardware Channel",
    icon: "🧠",
    description: "DMA-oriented runtime routing and capture control.",
    items: ["PCIe sync", "Capture stream tuning", "Memory map profile", "Low-latency mode"],
  },
  {
    title: "Overlay Control",
    icon: "🛰️",
    description: "External visualization with stable frame pacing.",
    items: ["ESP pipeline", "Refresh controls", "Color profile presets", "HUD minimization"],
  },
  {
    title: "Calibration",
    icon: "🎛️",
    description: "Per-game calibration for predictable behavior.",
    items: ["Pointer offsets", "Aim dampening", "Curve presets", "Device profile save"],
  },
  {
    title: "Maintenance",
    icon: "🔧",
    description: "Operational tooling for firmware and runtime upkeep.",
    items: ["Firmware checks", "Version sync", "Error scanner", "Fast recovery"],
  },
];

const buildFeatures = (category: string, title: string): FeatureBlock[] => {
  if (category === "HWID Spoofers") {
    return spoofFeatureBlocks;
  }

  const dmaHint = title.toLowerCase().includes("dma") || category.toLowerCase().includes("dma");
  if (dmaHint) {
    return dmaFeatureBlocks;
  }

  return defaultFeatureBlocks;
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const tool = productId ? TOOL_CATALOG_MAP[productId] : null;

  const subscriptions = useMemo(
    () => (tool ? buildSubscriptions(tool.startingPrice, tool.monetizationModel) : []),
    [tool],
  );

  const [selectedSubscription, setSelectedSubscription] = useState<string>(subscriptions[0]?.id || "1day");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (subscriptions.length > 0) {
      setSelectedSubscription(subscriptions[0].id);
      setQuantity(1);
    }
  }, [tool?.slug, subscriptions]);

  if (!tool) {
    return (
      <div className="grain-overlay min-h-screen">
        <VideoBackground />
        <Navbar />
        <div className="page-main">
          <div className="page-wrap max-w-3xl">
            <div className="page-panel p-8 text-center sm:p-10">
              <span className="page-chip">Catalog</span>
              <h1 className="page-title mt-4">Product Not Found</h1>
              <p className="mt-4 text-white/70">The product you are looking for does not exist in the imported catalog.</p>
              <Link
                to="/pricing"
                className="button-gloss-primary mt-6 inline-flex px-5 py-2.5 text-sm font-bold"
              >
                Return to Store
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedSub = subscriptions.find((sub) => sub.id === selectedSubscription) || subscriptions[0];
  const maxStock = selectedSub?.stock || 0;
  const oneTimePurchase = tool.monetizationModel === "one-time";
  const features = buildFeatures(tool.category, tool.title);
  const requirements = REQUIREMENTS_BY_CATEGORY[tool.category] || {
    cpu: "Intel / AMD",
    windows: "10 - 11",
    platforms: "Launcher dependent",
  };

  const productSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: tool.title,
      description: tool.description,
      category: tool.category,
      brand: {
        "@type": "Brand",
        name: "CheatVault",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: (selectedSub?.price || tool.startingPrice).toFixed(2),
        availability:
          tool.statusTone === "updating"
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "CheatVault",
        },
        url: `${window.location.origin}/product/${tool.slug}`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "800",
      },
    }),
    [selectedSub?.price, tool],
  );

  useStructuredData(productSchema, "product-schema");

  const handleQuantityChange = (change: number) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= maxStock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSub) return;

    const cartName = oneTimePurchase ? tool.title : `${tool.title} - ${selectedSub.duration}`;

    addToCart({
      productId: `${tool.slug}-${selectedSubscription}`,
      name: cartName,
      price: selectedSub.price,
      quantity,
    });

    toast.success(
      oneTimePurchase
        ? `Added ${quantity}x ${tool.title} to cart!`
        : `Added ${quantity}x ${tool.title} (${selectedSub.duration}) to cart!`,
    );

    window.setTimeout(() => {
      navigate("/checkout");
    }, 800);
  };

  return (
    <>
      <SEOHead
        title={`${tool.title} - CheatVault`}
        description={`View details and purchase options for ${tool.title} on CheatVault.`}
        keywords={[tool.title, tool.category, "cheatvault", "marketplace", "undetected tools"]}
        breadcrumbs={[
          { position: 1, name: "Home", url: "/" },
          { position: 2, name: "Marketplace", url: "/pricing" },
          { position: 3, name: tool.title },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VideoBackground />
        <Navbar />

        <section className="page-main page-main-tight pb-8">
          <div className="page-wrap max-w-7xl">
            <div className="text-center">
              <span className={`page-chip ${STATUS_CHIP_CLASS[tool.statusTone]}`}>
                <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                  tool.statusTone === "updating"
                    ? "bg-yellow-300"
                    : tool.statusTone === "testing"
                      ? "bg-sky-200"
                      : "bg-green-400"
                }`} />
                {tool.status}
              </span>
              <h1 className="page-title mt-4">{tool.title}</h1>
              <p className="mt-3 text-white/72">{tool.description}</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <span className="page-chip border-sky-300/35 bg-sky-300/10 text-sky-200">
                  Category: {tool.category}
                </span>
                <a
                  href={tool.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="page-chip border-white/25 bg-white/8 text-white/86"
                >
                  Source Snapshot
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <div className="hero-stat-chip hero-stat-chip-tested min-w-[134px]">
                  <div className="text-center text-xl font-bold leading-none text-white">23k+</div>
                  <div className="mt-1 text-center text-[10px] uppercase tracking-[0.18em] text-white/62">
                    Hours Tested
                  </div>
                </div>
                <div className="hero-stat-chip hero-stat-chip-reviews min-w-[134px]">
                  <div className="text-center text-xl font-bold leading-none text-white">4.9/5</div>
                  <div className="mt-1 text-center text-[10px] uppercase tracking-[0.18em] text-white/62">
                    Reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10 px-4 pb-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="page-panel sticky top-24 p-6">
                  <h2 className="mb-4 font-heading text-xl font-bold text-gradient-silver">
                    {oneTimePurchase ? "Purchase Option" : "Choose Subscription"}
                  </h2>

                  <div className="mb-6 flex items-center justify-between rounded-lg border border-white/12 bg-black/35 px-4 py-3">
                    <span className="text-sm font-semibold text-white/88">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="rounded-md border border-white/15 bg-white/[0.06] p-2 text-white/[0.86] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-mono font-bold text-white">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= maxStock}
                        className="rounded-md border border-white/15 bg-white/[0.06] p-2 text-white/[0.86] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {subscriptions.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubscription(sub.id);
                          setQuantity(1);
                        }}
                        className={`w-full rounded-lg border p-4 text-left transition ${
                          selectedSubscription === sub.id
                            ? "border-sky-300/70 bg-sky-300/10 shadow-[0_0_24px_-14px_rgba(132,196,255,0.75)]"
                            : "border-white/15 bg-white/5 hover:border-sky-300/45"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-foreground">{sub.duration}</div>
                            <div className="text-xs text-white/58">
                              {oneTimePurchase ? "One-time payment" : `In Stock (${sub.stock})`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gradient-gold">${sub.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="button-gloss-primary mt-6 inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Add to Cart - ${((selectedSub?.price || 0) * quantity).toFixed(2)}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="page-panel mb-8 p-6">
                  <h2 className="mb-4 font-heading text-2xl font-bold text-gradient-silver">Requirements</h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <Cpu className="mt-1 h-5 w-5 text-sky-200" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">Supported CPU</div>
                        <div className="text-xs text-white/62">{requirements.cpu}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Monitor className="mt-1 h-5 w-5 text-sky-200" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">Windows Version</div>
                        <div className="text-xs text-white/62">{requirements.windows}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gamepad2 className="mt-1 h-5 w-5 text-sky-200" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">Platforms</div>
                        <div className="text-xs text-white/62">{requirements.platforms}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature.title} className="page-panel p-6">
                      <div className="mb-4">
                        <div className="mb-2 text-3xl">{feature.icon}</div>
                        <h3 className="font-heading text-xl font-bold text-gradient-silver">{feature.title}</h3>
                        <p className="mt-1 text-sm text-white/65">{feature.description}</p>
                      </div>
                      <ul className="space-y-2">
                        {feature.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-200" />
                            <span className="text-white/66">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
