import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const TOOL_CATALOG_PATH = path.join(ROOT, 'src/data/toolCatalog.ts');
const OUTPUT_PATH = path.join(ROOT, 'public/data/live-status.json');

const FETCH_TIMEOUT_MS = 15000;
const FETCH_CONCURRENCY = 8;

const STATUS_PATTERNS = [
  'updating (not working)',
  'testing (working risky)',
  'testing (working)',
  'undetected (working)',
];

const normalizeStatus = (input, fallbackStatus, fallbackTone) => {
  const value = (input || '').trim().toLowerCase();

  if (/updat|not\s*working|detected/.test(value)) {
    return { status: 'Updating (Not Working)', statusTone: 'updating' };
  }

  if (/testing/.test(value)) {
    return {
      status: /risky/.test(value) ? 'Testing (Working Risky)' : 'Testing (Working)',
      statusTone: 'testing',
    };
  }

  if (/undetected|working/.test(value)) {
    return { status: 'Undetected (working)', statusTone: 'undetected' };
  }

  return { status: fallbackStatus, statusTone: fallbackTone };
};

const extractStatusLabel = (html) => {
  const productStatusMatch = html.match(
    /class=["'][^"']*productStatus[^"']*["'][^>]*>[\s\S]{0,450}?<span[^>]*>\s*([^<]+?)\s*<\/span>/i,
  );

  if (productStatusMatch?.[1]) {
    return productStatusMatch[1].trim();
  }

  const dataStatusMatch = html.match(/data-status=["']([^"']+)["']/i);
  if (dataStatusMatch?.[1]) {
    return dataStatusMatch[1].trim();
  }

  const lowered = html.toLowerCase();
  let found = null;
  let foundIndex = Number.POSITIVE_INFINITY;

  for (const pattern of STATUS_PATTERNS) {
    const idx = lowered.indexOf(pattern);
    if (idx !== -1 && idx < foundIndex) {
      found = pattern;
      foundIndex = idx;
    }
  }

  return found;
};

const mapConcurrent = async (items, limit, mapper) => {
  if (items.length === 0) return [];

  const results = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) break;
      results[index] = await mapper(items[index]);
    }
  });

  await Promise.all(workers);
  return results;
};

const loadToolCatalog = async () => {
  const raw = await fs.readFile(TOOL_CATALOG_PATH, 'utf8');
  const match = raw.match(/export const TOOL_CATALOG:\s*ToolCatalogItem\[\]\s*=\s*(\[[\s\S]*?\n\]);/);

  if (!match?.[1]) {
    throw new Error('Could not parse TOOL_CATALOG from src/data/toolCatalog.ts');
  }

  const catalog = vm.runInNewContext(`(${match[1]})`);
  if (!Array.isArray(catalog)) {
    throw new Error('Parsed TOOL_CATALOG is not an array');
  }

  return catalog;
};

const fetchToolStatus = async (tool) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(tool.sourceUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'CheatVaultStatusBot/1.0 (+https://cheatvault.io)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const extractedStatus = extractStatusLabel(html);
    const normalized = normalizeStatus(extractedStatus, tool.status, tool.statusTone);

    return {
      slug: tool.slug,
      status: normalized.status,
      statusTone: normalized.statusTone,
      source: 'live',
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      slug: tool.slug,
      status: tool.status,
      statusTone: tool.statusTone,
      source: 'fallback',
      checkedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Status fetch failed',
    };
  } finally {
    clearTimeout(timeout);
  }
};

const run = async () => {
  const startedAt = Date.now();
  const catalog = await loadToolCatalog();
  const tools = await mapConcurrent(catalog, FETCH_CONCURRENCY, fetchToolStatus);

  const undetected = tools.filter((tool) => tool.statusTone === 'undetected').length;
  const fallback = tools.filter((tool) => tool.source === 'fallback').length;

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    tools,
    summary: {
      total: tools.length,
      undetected,
      updating: tools.length - undetected,
      fallback,
    },
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'github-actions',
    cadenceMinutes: 60,
    snapshot,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Synced ${tools.length} tools in ${snapshot.durationMs}ms (${fallback} fallback).`);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Live status sync failed:', error);
  process.exitCode = 1;
});
