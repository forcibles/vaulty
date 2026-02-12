import { motion } from "framer-motion";
import { ShieldCheck, Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { ToolStatusTone } from "@/data/toolCatalog";

type GameCardProps = {
  slug: string;
  title: string;
  category: string;
  description: string;
  startingPrice: number;
  status: string;
  statusTone: ToolStatusTone;
};

// Generate a consistent gradient from the title for the icon badge
const getIconGradient = (title: string) => {
  const hash = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hue = (hash * 37) % 40 + 30; // Stay in the gold/amber range (30-70)
  return `linear-gradient(135deg, hsl(${hue} 80% 55%), hsl(${hue + 15} 90% 45%))`;
};

const getStatusClass = (statusTone: ToolStatusTone) => {
  if (statusTone === "updating") {
    return "border-yellow-400/35 bg-yellow-400/10 text-yellow-300";
  }
  if (statusTone === "testing") {
    return "border-sky-300/35 bg-sky-300/10 text-sky-200";
  }
  return "border-green-500/30 bg-green-500/10 text-green-400";
};

const GameCard = ({ slug, title, category, description, startingPrice, status, statusTone }: GameCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleViewProduct = () => {
    navigate(`/product/${slug}`);
  };

  const handleQuickPurchase = () => {
    addToCart({
      productId: `tool-${slug}`,
      name: title,
      price: startingPrice,
      quantity: 1,
    });

    toast.success(`${title} added to cart!`);

    // Navigate to checkout
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="gloss-card card-glow-hover group p-5"
    >
      {/* Top border gradient reveal on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-70" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Game icon initial badge */}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-lg shrink-0"
              style={{ background: getIconGradient(title) }}
            >
              {title.charAt(0)}
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStatusClass(statusTone)}`}>
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusTone === "updating" ? "bg-yellow-300" : statusTone === "testing" ? "bg-sky-200" : "bg-green-400"}`} />
              {status}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{category}</span>
        </div>

        <h3 className="mt-4 font-heading text-xl font-bold text-foreground">{title}</h3>
        <p className="mt-2 min-h-[48px] text-sm text-muted-foreground">{description}</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-gradient-gold font-heading text-2xl font-bold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            ${startingPrice.toFixed(2)}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={handleViewProduct}
            className="button-gloss-ghost px-3 py-3 font-heading text-xs font-bold uppercase tracking-[0.12em] text-foreground"
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Details
            </span>
          </button>
          <button
            onClick={handleQuickPurchase}
            className="button-gloss-primary px-3 py-3 font-heading text-xs font-bold uppercase tracking-[0.12em]"
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5" />
              Purchase
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default GameCard;
