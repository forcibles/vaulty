import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import Marketplace from "@/components/Marketplace";
import { motion } from "framer-motion";

const Pricing = () => {
  return (
    <>
      <SEOHead 
        title="Pricing - CheatVault Premium Gaming Tools"
        description="Choose the perfect plan for your gaming needs. From short-term passes to lifetime access, find the right CheatVault subscription for you."
        keywords={['gaming tools pricing', 'cheat subscription', 'gaming software plans', 'premium gaming tools']}
        breadcrumbs={[
          { position: 1, name: 'Home', url: '/' },
          { position: 2, name: 'Pricing' },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VideoBackground />
        <Navbar />
        <main className="page-main page-main-tight pb-0">
          <div className="page-wrap max-w-7xl">
            <span className="page-kicker">Storefront</span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="page-title"
            >
              Marketplace
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="page-subtitle"
            >
              Hand-selected tools, CheatVault tested.
            </motion.p>
          </div>
        </main>
        <Marketplace compactTop />

        <Footer />
      </div>
    </>
  );
};

export default Pricing;
