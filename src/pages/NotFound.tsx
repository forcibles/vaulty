import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import SEOHead from "@/components/SEOHead";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="404 - Page Not Found | CheatVault"
        description="The page you requested could not be found."
        keywords={["404", "page not found", "cheatvault"]}
      />
      <div className="grain-overlay min-h-screen">
        <VideoBackground />
        <Navbar />

        <main className="page-main">
          <div className="page-wrap max-w-3xl">
            <div className="page-panel p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/8">
                <AlertTriangle className="h-8 w-8 text-white/72" />
              </div>
              <span className="page-chip">Error 404</span>
              <h1 className="page-title mt-4">Page Not Found</h1>
              <p className="mx-auto mt-4 max-w-xl text-white/68">
                The route <span className="font-mono text-white/[0.86]">{location.pathname}</span> does not exist.
              </p>
              <Link
                to="/"
                className="button-gloss-primary mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
              >
                <ArrowLeft className="h-4 w-4" />
                Return Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
