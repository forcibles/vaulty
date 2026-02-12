import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VolumetricBackground from "@/components/VolumetricBackground";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "When will full feature docs go live?",
    answer:
      "This is a placeholder FAQ page. Detailed product docs and setup steps are being prepared for this section.",
  },
  {
    question: "Where do I manage purchased access?",
    answer:
      "Checkout links currently open the Antistock flow. Account and license management sections can be expanded in a later pass.",
  },
  {
    question: "How fast are post-update fixes?",
    answer:
      "Fast-lane updates are prioritized. This page will eventually include a public update timeline and status feed.",
  },
  {
    question: "Will there be onboarding guides?",
    answer:
      "Yes. Starter guides, safety defaults, and recommended profile presets are planned for this route.",
  },
];

const Faq = () => {
  return (
    <>
      <SEOHead
        title="FAQ - Frequently Asked Questions | CheatVault"
        description="Find answers to commonly asked questions about CheatVault gaming tools, licensing, updates, and support policies."
        keywords={['gaming tools FAQ', 'cheat software questions', 'gaming support', 'license management', 'software updates']}
        breadcrumbs={[
          { position: 1, name: 'Home', url: '/' },
          { position: 2, name: 'FAQ' },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VolumetricBackground />
        <Navbar />

        <main className="page-main">
          <div className="page-wrap max-w-4xl">
            <span className="page-kicker">Help Center</span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="page-title"
            >
              FAQ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="page-subtitle"
            >
              Quick answers for common setup, access, and update questions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="page-panel mt-8 px-5"
            >
              <Accordion type="single" collapsible>
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.question} value={`item-${index + 1}`} className="border-white/10">
                    <AccordionTrigger className="text-left text-white/92 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/72">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            <div className="mt-8">
              <Link
                to="/pricing"
                className="button-gloss-primary inline-flex px-6 py-3 font-heading font-bold text-sm transition-all duration-200"
              >
                Open Pricing
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Faq;
