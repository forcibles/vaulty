import { Link } from "react-router-dom";
import { MessageCircle, Headset } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5">
      {/* Gold gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        {/* Main footer grid */}
        <div className="gloss-panel grid grid-cols-1 gap-8 md:grid-cols-3 mb-10 p-6">
          {/* Column 1: Brand */}
          <div>
            <Link to="/" className="inline-block font-heading text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors">
              CheatVault
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/72 leading-relaxed">
              Premium undetected gaming tools with instant delivery, dedicated support, and continuous reliability updates.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs uppercase tracking-[0.12em] text-white/68">All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/72">Quick Links</p>
            <ul className="space-y-2.5">
              {[
                { label: "Marketplace", path: "/#marketplace" },
                { label: "Features", path: "/features" },
                { label: "FAQ", path: "/faq" },
                { label: "Status", path: "/status" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/72 hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/72">Community</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-white/72 hover:text-foreground transition-colors duration-200"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Discord Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-white/72 hover:text-foreground transition-colors duration-200"
                >
                  <Headset className="h-3.5 w-3.5" />
                  Support Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© 2026 CheatVault. All rights reserved.</p>
          <p className="text-white/50">Premium tools · Instant delivery · 24/7 support</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
