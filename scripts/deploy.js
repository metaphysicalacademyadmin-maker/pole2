#!/usr/bin/env node
/**
 * Build embed.html і одразу залити на metaphysical-way.academy через
 * PUT /api/static-pages/<slug>/content з Bearer-токеном.
 *
 * Використання:
 *   npm run deploy                           # slug і token із .env.local
 *   STATIC_DEPLOY_SLUG=newpole npm run deploy
 *
 * .env.local має містити:
 *   STATIC_DEPLOY_TOKEN=<той самий токен, що на сервері>
 *   STATIC_DEPLOY_SLUG=<slug існуючої сторінки на /demo>
 *   STATIC_DEPLOY_BASE=https://metaphysical-way.academy   # опційно
 *
 * Скрипт НЕ створює нову StaticPage — спочатку треба створити її через
 * /demo (заповнити whitelist, меню, title) — а потім деплоїти онови HTML.
 */

import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── Load .env.local without external deps ────────────────────────
const envPath = resolve(root, ".env.local");
if (existsSync(envPath)) {
  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const [, key, val] = m;
    if (process.env[key] === undefined) {
      process.env[key] = val.replace(/^['"]|['"]$/g, "");
    }
  }
}

const TOKEN = process.env.STATIC_DEPLOY_TOKEN;
const SLUG = process.env.STATIC_DEPLOY_SLUG;
const BASE = process.env.STATIC_DEPLOY_BASE || "https://metaphysical-way.academy";

if (!TOKEN) {
  console.error("✗ STATIC_DEPLOY_TOKEN не встановлено (додай у .env.local)");
  process.exit(1);
}
if (!SLUG) {
  console.error("✗ STATIC_DEPLOY_SLUG не встановлено (slug сторінки на /demo)");
  process.exit(1);
}

// ── 1. Build ──────────────────────────────────────────────────────
console.log(`▸ Build single-file (vite build --mode embed)…`);
const build = spawnSync("npm", ["run", "build:embed"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
if (build.status !== 0) {
  console.error("✗ Build failed");
  process.exit(build.status || 1);
}

// ── 2. Read result ────────────────────────────────────────────────
const distPath = resolve(root, "dist", "index.html");
if (!existsSync(distPath)) {
  console.error(`✗ Не знайдено ${distPath} після білду`);
  process.exit(1);
}
const html = await readFile(distPath, "utf8");
const sizeKB = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);

// ── 3. Upload ─────────────────────────────────────────────────────
const url = `${BASE.replace(/\/$/, "")}/api/static-pages/${encodeURIComponent(SLUG)}/content`;
console.log(`▸ Upload ${sizeKB} KB → ${url}`);

const t0 = Date.now();
let res;
try {
  res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "text/html; charset=utf-8",
    },
    body: html,
  });
} catch (err) {
  console.error(`✗ Network error: ${err.message}`);
  process.exit(1);
}

const dt = Date.now() - t0;

if (!res.ok) {
  let msg = `${res.status} ${res.statusText}`;
  try {
    const body = await res.json();
    if (body?.error) msg += ` — ${body.error}`;
  } catch {}
  console.error(`✗ Upload failed: ${msg}`);
  process.exit(1);
}

const result = await res.json().catch(() => ({}));
console.log(
  `✓ Deployed in ${(dt / 1000).toFixed(1)}s · ${(result.bytes / 1024).toFixed(1)} KB · ${BASE}/${SLUG}`,
);
