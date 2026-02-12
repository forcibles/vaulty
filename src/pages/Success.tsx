import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VolumetricBackground from "@/components/VolumetricBackground";
import SEOHead from "@/components/SEOHead";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <>
      <SEOHead
        title="Order Success - CheatVault"
        description="Your CheatVault order has been completed successfully."
        keywords={["order success", "payment confirmed", "cheatvault"]}
        breadcrumbs={[
          { position: 1, name: "Home", url: "/" },
          { position: 2, name: "Order Success" },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VolumetricBackground />
        <Navbar />

        <main className="page-main">
          <div className="page-wrap max-w-3xl">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="page-panel p-8 text-center sm:p-12"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/45 bg-emerald-400/12">
                <CheckCircle2 className="h-8 w-8 text-emerald-300" />
              </div>
              <span className="page-chip border-emerald-400/35 bg-emerald-400/10 text-emerald-300">
                Payment Confirmed
              </span>
              <h1 className="page-title mt-4">Welcome to CheatVault</h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-white/72 sm:text-base">
                Your order was completed successfully. Key delivery and activation details are sent through your checkout contact channel.
              </p>
              <Link
                to="/#marketplace"
                className="button-gloss-primary mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
              >
                Back To Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Success;
