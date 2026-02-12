import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesGrid from "@/components/FeaturesGrid";
import VideoShowcaseSection from "@/components/VideoShowcaseSection";
import Marketplace from "@/components/Marketplace";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import SEOHead from "@/components/SEOHead";
import { useEffect } from "react";

const PAGE_TITLE = "CheatVault - Premium Undetected Software";
const PAGE_DESCRIPTION =
  "CheatVault delivers premium undetected software with advanced HWID spoofing, elite performance tuning, and live support.";

const Index = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    let descriptionMeta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    const createdMeta = !descriptionMeta;
    const previousDescription = descriptionMeta?.content ?? "";

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.name = "description";
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.content = PAGE_DESCRIPTION;

    return () => {
      document.title = previousTitle;
      if (!descriptionMeta) return;
      if (createdMeta) {
        descriptionMeta.remove();
      } else {
        descriptionMeta.content = previousDescription;
      }
    };
  }, []);

  return (
    <>
      <SEOHead
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        keywords={['gaming', 'cheats', 'premium tools', 'undetected', 'hwid spoofer', 'gaming software']}
        breadcrumbs={[
          { position: 1, name: 'Home', url: '/' },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VideoBackground />
        <Navbar />
        <Hero />
        <Marketplace />
        <div className="section-divider" />
        <FeaturesGrid />
        <div className="section-divider" />
        <VideoShowcaseSection />
        <div className="section-divider" />
        <ReviewsSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
