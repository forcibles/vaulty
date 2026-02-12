import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VideoBackground from "@/components/VideoBackground";
import SEOHead from "@/components/SEOHead";
import { TOOL_CATALOG, TOOL_CATEGORIES, type ToolCatalogItem, type ToolStatusTone } from "@/data/toolCatalog";
import { motion } from "framer-motion";
import { CircleCheckBig, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import statusVideo from "../../videos/3141210-uhd_3840_2160_25fps.mp4";

type LiveToolStatus = {
  slug: string;
  status: string;
  statusTone: ToolStatusTone;
  source: "live" | "fallback";
  checkedAt: string;
  error?: string;
};

type LiveStatusFeed = {
  generatedAt: string;
  source: string;
  cadenceMinutes: number;
  snapshot: {
    fetchedAt: string;
    tools: LiveToolStatus[];
    summary: {
      total: number;
      undetected: number;
      updating: number;
      fallback: number;
    };
  };
};

const categoryOrder = TOOL_CATEGORIES.filter((category) => category !== "All");

const groupByCategory = (tools: ToolCatalogItem[]) =>
  categoryOrder
    .map((category) => ({
      category,
      tools: tools
        .filter((tool) => tool.category === category)
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((entry) => entry.tools.length > 0);

const sortByCategoryAndName = (a: ToolCatalogItem, b: ToolCatalogItem) =>
  a.category.localeCompare(b.category) || a.title.localeCompare(b.title);

const Status = () => {
  const [liveStatusBySlug, setLiveStatusBySlug] = useState<Record<string, LiveToolStatus>>({});
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [fallbackCount, setFallbackCount] = useState(0);
  const [syncCadenceMinutes, setSyncCadenceMinutes] = useState<number>(60);

  const fetchLiveStatuses = async (cacheBust: boolean) => {
    setIsRefreshing(true);
    setSyncError(null);

    try {
      const endpoint = cacheBust ? `/data/live-status.json?t=${Date.now()}` : "/data/live-status.json";
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Status feed returned ${response.status}`);
      }

      const payload = (await response.json()) as LiveStatusFeed;
      if (!payload.snapshot?.tools) {
        throw new Error("Invalid status feed payload.");
      }

      const nextMap = Object.fromEntries(payload.snapshot.tools.map((tool) => [tool.slug, tool]));
      setLiveStatusBySlug(nextMap);
      setLastSyncedAt(payload.snapshot.fetchedAt);
      setFallbackCount(payload.snapshot.summary.fallback);
      setSyncCadenceMinutes(payload.cadenceMinutes || 60);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "Status feed load failed.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchLiveStatuses(false);
  }, []);

  const toolsWithLiveStatus = useMemo(
    () =>
      TOOL_CATALOG.map((tool) => {
        const live = liveStatusBySlug[tool.slug];
        if (!live) return tool;
        return {
          ...tool,
          status: live.status,
          statusTone: live.statusTone,
        };
      }),
    [liveStatusBySlug],
  );

  const undetectedTools = useMemo(
    () => toolsWithLiveStatus.filter((tool) => tool.statusTone === "undetected").sort(sortByCategoryAndName),
    [toolsWithLiveStatus],
  );

  const updatingTools = useMemo(
    () => toolsWithLiveStatus.filter((tool) => tool.statusTone !== "undetected").sort(sortByCategoryAndName),
    [toolsWithLiveStatus],
  );

  const statusGroups = useMemo(
    () => [
      {
        title: "Undetected (Working)",
        icon: CircleCheckBig,
        className: "border-green-500/30 bg-green-500/10 text-green-400",
        dotClass: "bg-green-400",
        tools: undetectedTools,
        groupedTools: groupByCategory(undetectedTools),
      },
      {
        title: "Updating",
        icon: RefreshCcw,
        className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        dotClass: "bg-yellow-400",
        tools: updatingTools,
        groupedTools: groupByCategory(updatingTools),
      },
    ],
    [undetectedTools, updatingTools],
  );

  const totalTools = TOOL_CATALOG.length;
  const liveCoverage = totalTools ? Math.round((undetectedTools.length / totalTools) * 100) : 0;

  return (
    <>
      <SEOHead
        title="Status - CheatVault Tool Status"
        description="Live CheatVault status page showing tools that are undetected and currently updating."
        keywords={["tool status", "undetected status", "updating status", "cheatvault status"]}
        breadcrumbs={[
          { position: 1, name: "Home", url: "/" },
          { position: 2, name: "Status" },
        ]}
      />
      <div className="grain-overlay min-h-screen">
        <VideoBackground src={statusVideo} />
        <Navbar />

        <main className="page-main">
          <div className="page-wrap max-w-6xl">
            <span className="page-kicker">Realtime Monitor</span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="page-title"
            >
              Tool Status
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="page-subtitle"
            >
              Current operational state for all imported marketplace tools.
            </motion.p>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  void fetchLiveStatuses(true);
                }}
                disabled={isRefreshing}
                className="status-refresh-btn group inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <RefreshCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                {isRefreshing ? "Refreshing..." : "Refresh Status"}
              </button>
              <p className="mt-2 text-[11px] text-white/62">
                {lastSyncedAt
                  ? `Last synced ${new Date(lastSyncedAt).toLocaleString()}`
                  : "Syncing live status feed..."}
              </p>
              <p className="mt-1 text-[11px] text-white/52">
                Auto-sync runs every {syncCadenceMinutes} minutes via GitHub Actions.
              </p>
              {fallbackCount > 0 && (
                <p className="mt-1 text-[11px] text-yellow-200/85">
                  {fallbackCount} tools currently using fallback status snapshot.
                </p>
              )}
              {syncError && <p className="mt-1 text-[11px] text-red-300">{syncError}</p>}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="page-chip">{totalTools} Total Tools</span>
              <span className="page-chip border-green-500/25 bg-green-500/10 text-green-300">
                {undetectedTools.length} Undetected
              </span>
              <span className="page-chip border-yellow-500/25 bg-yellow-500/10 text-yellow-200">
                {updatingTools.length} Updating
              </span>
              <span className="page-chip border-sky-500/25 bg-sky-500/10 text-sky-200">
                {liveCoverage}% Live Coverage
              </span>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {statusGroups.map((group, index) => (
                <motion.section
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.06 * index }}
                  className="page-panel p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-heading text-xl font-semibold text-foreground">{group.title}</h2>
                    <span className={`page-chip ${group.className}`}>
                      <group.icon className="h-3.5 w-3.5" />
                      {group.tools.length} Tools / {group.groupedTools.length} Games
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.groupedTools.map((categoryEntry) => (
                      <div key={categoryEntry.category} className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">{categoryEntry.category}</p>
                          <span className="text-[11px] text-white/55">{categoryEntry.tools.length}</span>
                        </div>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {categoryEntry.tools.map((tool) => (
                            <li key={tool.slug}>
                              <Link
                                to={`/product/${tool.slug}`}
                                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-sm text-white/90 transition hover:border-primary/45 hover:text-white"
                              >
                                <span className="line-clamp-1">{tool.title}</span>
                                <span className={`ml-3 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${group.dotClass}`} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Status;
