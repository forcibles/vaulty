export type ToolStatusTone = "undetected" | "testing" | "updating";

export type ToolCatalogItem = {
  slug: string;
  title: string;
  category: string;
  description: string;
  startingPrice: number;
  status: string;
  statusTone: ToolStatusTone;
  sourceUrl: string;
};

export const TOOL_CATEGORIES = [
  "All",
  "Apex Legends",
  "Arc Raiders",
  "Arena Breakout",
  "Battlefield",
  "Call of Duty",
  "Counter-Strike 2",
  "Escape From Tarkov",
  "FiveM",
  "Fortnite",
  "HWID Spoofers",
  "PUBG",
  "Rainbow Six Siege X",
  "Roblox",
  "Rust",
  "Valorant",
] as const;

export const TOOL_CATALOG: ToolCatalogItem[] = [
  {
    "slug": "kernaim-apex",
    "title": "Kernaim (Apex)",
    "category": "Apex Legends",
    "description": "CheatVault-tested Apex Legends package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 27.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/637-kernaim-apex/"
  },
  {
    "slug": "redeye-external-apex",
    "title": "RedEye External (Apex)",
    "category": "Apex Legends",
    "description": "CheatVault-tested Apex Legends package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 6.99,
    "status": "Testing (Working)",
    "statusTone": "testing",
    "sourceUrl": "https://ssz.gg/cheats/product/429-redeye-external-apex/"
  },
  {
    "slug": "eden-dma-arc-raiders",
    "title": "Eden DMA (Arc Raiders)",
    "category": "Arc Raiders",
    "description": "CheatVault-tested Arc Raiders package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 4.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/623-eden-dma-arc-raiders/"
  },
  {
    "slug": "ghost-arc-raiders",
    "title": "Ghost (Arc Raiders)",
    "category": "Arc Raiders",
    "description": "CheatVault-tested Arc Raiders package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 7.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/667-ghost-arc-raiders/"
  },
  {
    "slug": "kernaim-ar",
    "title": "Kernaim (AR)",
    "category": "Arc Raiders",
    "description": "CheatVault-tested Arc Raiders package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 22.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/611-kernaim-ar/"
  },
  {
    "slug": "nocturnal-arc-raiders",
    "title": "Nocturnal (Arc Raiders)",
    "category": "Arc Raiders",
    "description": "CheatVault-tested Arc Raiders package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 4.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/651-nocturnal-arc-raiders/"
  },
  {
    "slug": "ez-abi-dma",
    "title": "EZ ABI (DMA)",
    "category": "Arena Breakout",
    "description": "CheatVault-tested Arena Breakout package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 64.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/603-ez-abi-dma/"
  },
  {
    "slug": "inferno-abi",
    "title": "Inferno (ABI)",
    "category": "Arena Breakout",
    "description": "CheatVault-tested Arena Breakout package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 9.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/431-inferno-abi/"
  },
  {
    "slug": "blurred-dma-bf6",
    "title": "Blurred DMA (BF6)",
    "category": "Battlefield",
    "description": "CheatVault-tested Battlefield package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 29.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/599-blurred-dma-bf6/"
  },
  {
    "slug": "fecurity-bf",
    "title": "Fecurity (BF)",
    "category": "Battlefield",
    "description": "CheatVault-tested Battlefield package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 7.99,
    "status": "Testing (Working)",
    "statusTone": "testing",
    "sourceUrl": "https://ssz.gg/cheats/product/435-fecurity-bf/"
  },
  {
    "slug": "blurred-cod-dma",
    "title": "Blurred COD (DMA)",
    "category": "Call of Duty",
    "description": "CheatVault-tested Call of Duty package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 19.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/402-blurred-cod-dma/"
  },
  {
    "slug": "bot-lobby",
    "title": "Bot Lobby",
    "category": "Call of Duty",
    "description": "CheatVault-tested Call of Duty package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 9.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/287-bot-lobby/"
  },
  {
    "slug": "fecurity-external-cod-bo7-6-mw2-3",
    "title": "Fecurity External COD (BO7-6 & MW2-3)",
    "category": "Call of Duty",
    "description": "CheatVault-tested Call of Duty package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 5.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/515-fecurity-external-cod-bo7-6-mw2-3/"
  },
  {
    "slug": "noah-bo7-bo6",
    "title": "Noah BO7 & BO6",
    "category": "Call of Duty",
    "description": "CheatVault-tested Call of Duty package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 9.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/500-noah-bo7-bo6/"
  },
  {
    "slug": "nocturnal-bo7",
    "title": "Nocturnal (BO7)",
    "category": "Call of Duty",
    "description": "CheatVault-tested Call of Duty package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 4.99,
    "status": "Updating (Not Working)",
    "statusTone": "updating",
    "sourceUrl": "https://ssz.gg/cheats/product/630-nocturnal-bo7/"
  },
  {
    "slug": "permanent-uav-bo7",
    "title": "Permanent UAV (BO7)",
    "category": "Call of Duty",
    "description": "CheatVault-tested Call of Duty package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 19.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/437-permanent-uav-bo7/"
  },
  {
    "slug": "memesense",
    "title": "Memesense",
    "category": "Counter-Strike 2",
    "description": "CheatVault-tested Counter-Strike 2 package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 3.5,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/473-memesense/"
  },
  {
    "slug": "midnight",
    "title": "Midnight",
    "category": "Counter-Strike 2",
    "description": "CheatVault-tested Counter-Strike 2 package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 6.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/84-midnight/"
  },
  {
    "slug": "predator-cs2",
    "title": "Predator (CS2)",
    "category": "Counter-Strike 2",
    "description": "CheatVault-tested Counter-Strike 2 package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 3.5,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/592-predator-cs2/"
  },
  {
    "slug": "eft-full",
    "title": "EFT Full",
    "category": "Escape From Tarkov",
    "description": "CheatVault-tested Escape From Tarkov package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 6.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/449-eft-full/"
  },
  {
    "slug": "eft-lite",
    "title": "EFT Lite",
    "category": "Escape From Tarkov",
    "description": "CheatVault-tested Escape From Tarkov package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 4.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/448-eft-lite/"
  },
  {
    "slug": "kernaim-eft",
    "title": "Kernaim (EFT)",
    "category": "Escape From Tarkov",
    "description": "CheatVault-tested Escape From Tarkov package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 28.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/641-kernaim-eft/"
  },
  {
    "slug": "redengine-lua-executor",
    "title": "redENGINE Lua Executor",
    "category": "FiveM",
    "description": "CheatVault-tested FiveM package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 8.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/452-redengine-lua-executor/"
  },
  {
    "slug": "redengine-spoofer",
    "title": "redENGINE Spoofer",
    "category": "FiveM",
    "description": "CheatVault-tested FiveM package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 8.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/453-redengine-spoofer/"
  },
  {
    "slug": "tz-internal",
    "title": "TZ Internal",
    "category": "FiveM",
    "description": "CheatVault-tested FiveM package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 3.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/451-tz-internal/"
  },
  {
    "slug": "tzx-external",
    "title": "TZX External",
    "category": "FiveM",
    "description": "CheatVault-tested FiveM package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 4.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/450-tzx-external/"
  },
  {
    "slug": "arcane-fn",
    "title": "Arcane (FN)",
    "category": "Fortnite",
    "description": "CheatVault-tested Fortnite package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 8.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/569-arcane-fn/"
  },
  {
    "slug": "blurred-fortnite-dma",
    "title": "Blurred Fortnite (DMA)",
    "category": "Fortnite",
    "description": "CheatVault-tested Fortnite package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 19.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/383-blurred-fortnite-dma/"
  },
  {
    "slug": "disconnect-external-fortnite",
    "title": "Disconnect External (Fortnite)",
    "category": "Fortnite",
    "description": "CheatVault-tested Fortnite package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 8.99,
    "status": "Testing (Working)",
    "statusTone": "testing",
    "sourceUrl": "https://ssz.gg/cheats/product/455-disconnect-external-fortnite/"
  },
  {
    "slug": "exception",
    "title": "Exception",
    "category": "HWID Spoofers",
    "description": "CheatVault-tested HWID Spoofers package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 4.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/471-exception/"
  },
  {
    "slug": "permanent-spoofer",
    "title": "Permanent Spoofer",
    "category": "HWID Spoofers",
    "description": "CheatVault-tested HWID Spoofers package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 19.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/519-permanent-spoofer/"
  },
  {
    "slug": "ssz-spoofer",
    "title": "SSZ Spoofer",
    "category": "HWID Spoofers",
    "description": "CheatVault-tested HWID Spoofers package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 29.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/470-ssz-spoofer/"
  },
  {
    "slug": "arcane-pubg",
    "title": "Arcane (Pubg)",
    "category": "PUBG",
    "description": "CheatVault-tested PUBG package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 6.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/462-arcane-pubg/"
  },
  {
    "slug": "ring-1-full-pubg-intel-cpu-only",
    "title": "Ring-1 Full (PUBG) [Intel CPU Only]",
    "category": "PUBG",
    "description": "CheatVault-tested PUBG package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 6.99,
    "status": "Updating (Not Working)",
    "statusTone": "updating",
    "sourceUrl": "https://ssz.gg/cheats/product/463-ring-1-full-pubg-intel-cpu-only/"
  },
  {
    "slug": "bun-r6-siege-x-dma",
    "title": "Bun R6 Siege x (DMA)",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 32.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/533-bun-r6-siege-x-dma/"
  },
  {
    "slug": "caruso-r6-dma",
    "title": "Caruso R6 (DMA)",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 46.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/680-caruso-r6-dma/"
  },
  {
    "slug": "frost-r6",
    "title": "Frost (R6)",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 9.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/559-frost-r6/"
  },
  {
    "slug": "ghost-r6",
    "title": "Ghost (R6)",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 6.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/672-ghost-r6/"
  },
  {
    "slug": "inferno-r6",
    "title": "Inferno (R6)",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 7.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/474-inferno-r6/"
  },
  {
    "slug": "lethal-full",
    "title": "Lethal Full",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 10.99,
    "status": "Updating (Not Working)",
    "statusTone": "updating",
    "sourceUrl": "https://ssz.gg/cheats/product/476-lethal-full/"
  },
  {
    "slug": "lethal-lite",
    "title": "Lethal Lite",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 9.99,
    "status": "Updating (Not Working)",
    "statusTone": "updating",
    "sourceUrl": "https://ssz.gg/cheats/product/475-lethal-lite/"
  },
  {
    "slug": "ring-1-r6",
    "title": "Ring-1 (R6)",
    "category": "Rainbow Six Siege X",
    "description": "CheatVault-tested Rainbow Six Siege X package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 10.99,
    "status": "Updating (Not Working)",
    "statusTone": "updating",
    "sourceUrl": "https://ssz.gg/cheats/product/477-ring-1-r6/"
  },
  {
    "slug": "dx9ware",
    "title": "DX9WARE",
    "category": "Roblox",
    "description": "CheatVault-tested Roblox package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 4.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/615-dx9ware/"
  },
  {
    "slug": "wave",
    "title": "Wave",
    "category": "Roblox",
    "description": "CheatVault-tested Roblox package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 7.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/464-wave/"
  },
  {
    "slug": "blurred-dma-rust",
    "title": "Blurred DMA (Rust)",
    "category": "Rust",
    "description": "CheatVault-tested Rust package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 39.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/560-blurred-dma-rust/"
  },
  {
    "slug": "disconnect-external",
    "title": "Disconnect External",
    "category": "Rust",
    "description": "CheatVault-tested Rust package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 7.99,
    "status": "Testing (Working)",
    "statusTone": "testing",
    "sourceUrl": "https://ssz.gg/cheats/product/479-disconnect-external/"
  },
  {
    "slug": "fluent-full",
    "title": "Fluent Full",
    "category": "Rust",
    "description": "CheatVault-tested Rust package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 9.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/482-fluent-full/"
  },
  {
    "slug": "recoilclub-script",
    "title": "Recoil.Club Script",
    "category": "Rust",
    "description": "CheatVault-tested Rust package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 9.99,
    "status": "Testing (Working Risky)",
    "statusTone": "testing",
    "sourceUrl": "https://ssz.gg/cheats/product/552-recoilclub-script/"
  },
  {
    "slug": "ssz-external",
    "title": "SSZ External",
    "category": "Rust",
    "description": "CheatVault-tested Rust package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 6.99,
    "status": "Testing (Working Risky)",
    "statusTone": "testing",
    "sourceUrl": "https://ssz.gg/cheats/product/541-ssz-external/"
  },
  {
    "slug": "moonshine-valorant",
    "title": "Moonshine (Valorant)",
    "category": "Valorant",
    "description": "CheatVault-tested Valorant package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 7.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/425-moonshine-valorant/"
  },
  {
    "slug": "sensory-valorant-dma",
    "title": "Sensory Valorant (DMA)",
    "category": "Valorant",
    "description": "CheatVault-tested Valorant package with clean runtime defaults and reliable session behavior.",
    "startingPrice": 19.99,
    "status": "Undetected (working)",
    "statusTone": "undetected",
    "sourceUrl": "https://ssz.gg/cheats/product/373-sensory-valorant-dma/"
  }
];

export const TOOL_CATALOG_MAP: Record<string, ToolCatalogItem> = Object.fromEntries(
  TOOL_CATALOG.map((tool) => [tool.slug, tool]),
);
