import type { ToolCatalogItem } from "@/data/toolCatalog";

export type CategorySeoContent = {
  intro: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

const createTemplate = (category: string): CategorySeoContent => ({
  intro: `CheatVault ${category} tools are curated for stable runtime behavior, practical defaults, and fast update recovery when game patches land. Every listing in this category is manually reviewed before publication so you can pick with more confidence.`,
  sections: [
    {
      title: `How We Vet ${category} Tools`,
      body: `Each ${category} listing is checked for launch consistency, profile stability, and expected feature behavior across normal sessions. We also verify that installation flow and baseline configuration are clear enough for quick setup without bloated guesswork.`,
    },
    {
      title: `${category} Status And Update Cadence`,
      body: `Tool status is tracked with operational labels so you can avoid dead time: undetected, testing, and updating. When updates are required, we prioritize restoration paths that minimize downtime and preserve clean profile behavior once service resumes.`,
    },
    {
      title: `Choosing The Right ${category} Option`,
      body: `Start by matching your session style to the feature set. External-focused options are usually preferred for minimal runtime noise, while broader packages are better if you need deeper controls. If two options look similar, choose the one with the stronger current status and lower configuration overhead.`,
    },
  ],
});

export const CATEGORY_SEO_CONTENT: Record<string, CategorySeoContent> = {
  "Arc Raiders": createTemplate("Arc Raiders"),
  "Call of Duty": createTemplate("Call of Duty"),
  "Apex Legends": createTemplate("Apex Legends"),
  Fortnite: createTemplate("Fortnite"),
  Valorant: createTemplate("Valorant"),
  PUBG: createTemplate("PUBG"),
  Roblox: createTemplate("Roblox"),
  Rust: createTemplate("Rust"),
  "Counter-Strike 2": createTemplate("Counter-Strike 2"),
  "Escape From Tarkov": createTemplate("Escape From Tarkov"),
  "Rainbow Six Siege X": createTemplate("Rainbow Six Siege X"),
  FiveM: createTemplate("FiveM"),
  Battlefield: createTemplate("Battlefield"),
  "Arena Breakout": createTemplate("Arena Breakout"),
  "HWID Spoofers": createTemplate("HWID Spoofers"),
};

export const buildCategoryFaqs = (
  category: string,
  tools: ToolCatalogItem[],
): Array<{ question: string; answer: string }> => [
  {
    question: `How often are ${category} tools updated?`,
    answer: `We refresh ${category} listings as game patches and provider updates roll out. Use the status label on each tool to prioritize options that are currently operational.`,
  },
  {
    question: `Which ${category} tool should I start with first?`,
    answer: `Start with the tool marked as operational and the simplest configuration path. For new users, lower-complexity options usually provide faster setup and cleaner first-session behavior.`,
  },
  {
    question: `Do these ${category} products include setup guidance?`,
    answer: `Yes. Core setup expectations are documented in each listing and we keep defaults practical so activation flow stays predictable for real sessions.`,
  },
  {
    question: `What if a ${category} product is currently updating?`,
    answer: `If a tool is in updating state, choose one of the other active listings in this category while patches are in progress. We keep multiple options listed to reduce downtime risk.`,
  },
  {
    question: `How many ${category} tools are currently listed on CheatVault?`,
    answer: `There are currently ${tools.length} listed options in the ${category} category snapshot on this page.`,
  },
];
