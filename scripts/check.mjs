#!/usr/bin/env node
/**
 * scripts/check.mjs — deterministic quality assurance (npm run check)
 * ===========================================================================
 *
 *  1. `astro build` (unless --no-build);
 *  2. checks the SOURCES, the THEME and the generated site (dist/);
 *  3. exits 1 if there is at least one ERROR. WARNINGS (fields to fill in
 *     before going live) are listed without failing the run.
 *
 *  ERRORS
 *  ------
 *  Theme (src/styles/theme.css AND every src/styles/themes/*.example.css):
 *   - every token in REQUIRED_TOKENS is defined;
 *   - --c-bg, --c-bg-deep, --c-surface, --c-surface-2 are opaque colours;
 *   - WCAG 2.x contrast (var() resolved; hex, rgb/rgba, hsl/hsla; a
 *     semi-transparent colour is composited over the background tested):
 *       · --c-text, --c-text-soft, --c-text-muted on the 4 backgrounds ... >= 4.5:1
 *       · --c-text-on-accent on --c-accent and --c-accent-bright ......... >= 4.5:1
 *       · --c-accent on --c-bg (interface element) .......................  >= 3:1
 *       · ANY token used in a `color:` declaration in global.css or in a
 *         component <style> (local aliases such as --btn-color followed)
 *         on the 4 backgrounds ............................................ >= 4.5:1
 *         (documented exceptions in ON_BACKGROUND: text on a specific background);
 *   - color-mix() is forbidden inside a `color:` declaration (the contrast of
 *     text must be computable from the tokens);
 *   - no hard-coded colour (hex, rgb/hsl, names) in global.css, in a .astro
 *     <style>, or in an SVG fill/stroke attribute (nor var() in those attributes);
 *   - SELF-HOSTED FONTS: no fonts.googleapis.com / fonts.gstatic.com URL; every
 *     theme @import exists in node_modules, and the first family of
 *     --font-display / --font-body / --font-label is provided by an @import
 *     (or is a system font).
 *  Sources:
 *   - no hard-coded text in the .astro files (all text comes from src/data/);
 *   - exactly one "placeholder" helper: isSet (src/lib/utils.ts);
 *   - icons named in the copy exist in Icon.astro;
 *   - NO UNVERIFIABLE CLAIM: awards, accreditations, memberships, ratings,
 *     years in business, customer counts, "leading", "best", "certified",
 *     "insured", "guaranteed" and the like. A registered company may state
 *     facts from its own register entry; it may not invent credentials.
 *     Genuine credentials belong in site.ts, not in prose.
 *   - NO PRICE AND NO CHECKOUT: no currency amount and no "pay online",
 *     "checkout", "add to basket". These are brochure sites: everything is
 *     quoted per job, so a published figure would be an unintended offer.
 *   - site.ts coherence: https URL with no trailing slash, valid email,
 *     8-character company number, Companies House URL that actually contains
 *     that number, parseable incorporation date, CNAME = domain,
 *     og:image present in public/.
 *  dist/:
 *   - no fonts.googleapis.com / fonts.gstatic.com URL (HTML, CSS, JS);
 *   - the 7 pages exist, each links to /legal-notice and /privacy;
 *   - COMPANIES ACT 2006 s.82: every page states the registered company name,
 *     the company number and the registered office (the footer disclosure);
 *   - no visible TODO, undefined, null, NaN, [object Object], lorem;
 *   - no HTML comment <!--;
 *   - exactly one <h1> per page; no empty heading, paragraph, element or list;
 *   - unique ids; every internal link href="/…" or "#…" (and every
 *     aria-labelledby / aria-controls reference) resolves to a page or an
 *     existing id;
 *   - typography: no space before : ; ! ? and no straight apostrophe
 *     (the typographic apostrophe is used throughout);
 *   - optional sections (data-optional): present IF AND ONLY IF their data is
 *     filled in (social links, CTA note).
 *
 *  WARNINGS: unset fields in site.ts, legal disclosures showing
 *  "(to be completed)", empty optional data — as a checklist.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');
const args = new Set(process.argv.slice(2));

const errors = [];
const warnings = [];
const optionalInfo = [];
const err = (scope, msg) => errors.push(`[${scope}] ${msg}`);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/* ------------------------------------------------------------------- TOOLS */

function walk(dir, filter = () => true) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, filter) : filter(p) ? [p] : [];
  });
}
const read = (p) => fs.readFileSync(p, 'utf8');
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (all, n) => ENTITIES[n.toLowerCase()] ?? all);
}

/* ================================================================== 1. BUILD */

if (!args.has('--no-build')) {
  console.log('> astro build');
  const r = spawnSync(process.execPath, [path.join(ROOT, 'node_modules', 'astro', 'astro.js'), 'build'], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    console.error('\nFAILED: astro build did not succeed.');
    process.exit(1);
  }
}

/* ============================================================== 2. DATA (TS) */

const esbuild = await import('esbuild');
const bundle = await esbuild.build({
  stdin: {
    contents: [
      "export { site } from './src/data/site.ts';",
      "export * as content from './src/data/content.ts';",
      "export { isSet } from './src/lib/utils.ts';",
    ].join('\n'),
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  logLevel: 'silent',
});
const { site, content, isSet } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);

/* ================================================================= 3. THEME */

/** Mandatory tokens of theme.css (documented at the top of theme.css). */
const REQUIRED_TOKENS = [
  '--color-scheme',
  // backgrounds and surfaces
  '--c-bg', '--c-bg-deep', '--c-surface', '--c-surface-2', '--c-surface-3',
  // borders and veils
  '--c-border', '--c-border-strong', '--c-overlay', '--c-overlay-alt', '--c-grid-line', '--c-shadow',
  // text
  '--c-text', '--c-text-soft', '--c-text-muted', '--c-text-faint', '--c-text-on-accent',
  // accents
  '--c-accent', '--c-accent-bright', '--c-accent-dim', '--c-accent-soft', '--c-accent-2', '--c-accent-2-soft',
  // halos and gradients
  '--halo-1', '--halo-2', '--halo-strength', '--grad-accent', '--grad-surface', '--grad-line', '--grad-visual',
  // shadows
  '--shadow-xs', '--shadow-s', '--shadow-m', '--shadow-l', '--shadow-accent', '--ring',
  // print
  '--c-print-bg', '--c-print-text',
  // fonts (files pulled in by the @import lines at the top of the theme)
  '--font-display', '--font-label', '--font-body', '--font-mono',
  // radii
  '--radius-xs', '--radius-s', '--radius-m', '--radius-l', '--radius-xl', '--radius-pill', '--radius-btn',
  // style variables
  '--heading-transform', '--heading-weight', '--heading-tracking', '--display-leading', '--label-transform',
];
const OPAQUE_BGS = ['--c-bg', '--c-bg-deep', '--c-surface', '--c-surface-2'];
const TEXT_TOKENS = ['--c-text', '--c-text-soft', '--c-text-muted'];
/** Text tokens placed on one specific background (instead of the 4 backgrounds). */
const ON_BACKGROUND = {
  '--c-text-on-accent': ['--c-accent', '--c-accent-bright'],
  '--c-print-text': ['--c-print-bg'],
};

function parseTokens(css) {
  const tokens = {};
  const re = /(--[\w-]+)\s*:\s*((?:'[^']*'|"[^"]*"|[^;{}])+);/g;
  for (const m of stripCssComments(css).matchAll(re)) tokens[m[1]] = m[2].trim();
  return tokens;
}

function resolveVars(value, tokens, depth = 0) {
  if (depth > 12) return value;
  const out = value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, n, fb) =>
    tokens[n] !== undefined ? tokens[n] : fb !== undefined ? fb : '',
  );
  return /var\(/.test(out) && out !== value ? resolveVars(out, tokens, depth + 1) : out;
}

function parseColor(input) {
  const s = input.trim().toLowerCase();
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (s === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (s === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  m = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/);
  if (!m) return null;
  const parts = m[2].replace(/\s*\/\s*/, ' / ').split(/[\s,]+/).filter((p) => p && p !== '/');
  const alphaOf = (p) => (p === undefined ? 1 : p.endsWith('%') ? parseFloat(p) / 100 : parseFloat(p));
  if (m[1].startsWith('rgb')) {
    const ch = (p) => (p.endsWith('%') ? (parseFloat(p) * 255) / 100 : parseFloat(p));
    const [r, g, b] = parts.slice(0, 3).map(ch);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a: alphaOf(parts[3]) };
  }
  const hDeg = parseFloat(parts[0]);
  const sat = parseFloat(parts[1]) / 100;
  const lig = parseFloat(parts[2]) / 100;
  if ([hDeg, sat, lig].some(Number.isNaN)) return null;
  const k = (n) => (n + hDeg / 30) % 12;
  const f = (n) => lig - sat * Math.min(lig, 1 - lig) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255, a: alphaOf(parts[3]) };
}

const luminance = ({ r, g, b }) => {
  const lin = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const composite = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
function contrast(fg, bg) {
  const top = fg.a < 1 ? composite(fg, bg) : fg;
  const [l1, l2] = [luminance(top), luminance(bg)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* --- CSS declarations from the sources (global.css + .astro <style>) --- */
const astroFiles = walk(SRC, (p) => p.endsWith('.astro'));
const globalCssPath = path.join(SRC, 'styles', 'global.css');
const cssSources = [
  { file: globalCssPath, css: read(globalCssPath) },
  ...astroFiles.flatMap((file) =>
    [...read(file).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({ file, css: m[1] })),
  ),
];

function declarations(css) {
  const out = [];
  for (const m of stripCssComments(css).matchAll(/([-\w]+)\s*:\s*([^;{}]+)(?=[;}])/g)) {
    out.push({ prop: m[1].trim(), value: m[2].trim() });
  }
  return out;
}

/* Tokens used as a text colour (following local aliases). */
const localAssignments = {};
const colorValues = [];
for (const { file, css } of cssSources) {
  for (const d of declarations(css)) {
    if (d.prop.startsWith('--')) (localAssignments[d.prop] ??= []).push(d.value);
    if (d.prop === 'color') {
      colorValues.push({ file, value: d.value });
      if (/color-mix\(/i.test(d.value)) {
        err('theme', `${rel(file)}: color-mix() is forbidden in "color: ${d.value}" (see the color-mix rule)`);
      }
    }
  }
}
function textTokensFromSources(themeTokens) {
  const found = new Set();
  const visit = (value, seen = new Set()) => {
    for (const m of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      const name = m[1];
      if (seen.has(name)) continue;
      seen.add(name);
      if (themeTokens[name] !== undefined) found.add(name);
      else for (const v of localAssignments[name] ?? []) visit(v, seen);
    }
  };
  colorValues.forEach(({ value }) => visit(value));
  return [...found];
}

function checkTheme(file) {
  const scope = `theme ${rel(file)}`;
  const tokens = parseTokens(read(file));
  for (const t of REQUIRED_TOKENS) if (tokens[t] === undefined) err(scope, `mandatory token missing: ${t}`);

  const color = (name) => {
    const raw = tokens[name];
    if (raw === undefined) return null;
    const c = parseColor(resolveVars(raw, tokens));
    if (!c) err(scope, `${name}: colour not recognised ("${raw}") — use hex, rgb() or hsl()`);
    return c;
  };

  const bgs = {};
  for (const b of OPAQUE_BGS) {
    const c = color(b);
    if (!c) continue;
    if (c.a < 1) err(scope, `${b} must be opaque`);
    bgs[b] = c;
  }
  const pair = (fgName, bgName, min, what) => {
    const fg = color(fgName);
    const bg = bgs[bgName] ?? color(bgName);
    if (!fg || !bg) return;
    const ratio = contrast(fg, bg);
    if (args.has('--verbose')) console.log(`  ${rel(file)}  ${fgName} / ${bgName}: ${ratio.toFixed(2)}:1 (min ${min})`);
    if (ratio + 1e-9 < min) {
      err(scope, `contrast ${fgName} on ${bgName} = ${ratio.toFixed(2)}:1 < ${min}:1 (${what})`);
    }
  };

  for (const t of TEXT_TOKENS) for (const b of OPAQUE_BGS) pair(t, b, 4.5, 'text');
  for (const b of ON_BACKGROUND['--c-text-on-accent']) pair('--c-text-on-accent', b, 4.5, 'text on accent');
  pair('--c-accent', '--c-bg', 3, 'interface element');

  for (const t of textTokensFromSources(tokens)) {
    if (TEXT_TOKENS.includes(t)) continue;
    const targets = ON_BACKGROUND[t] ?? OPAQUE_BGS;
    for (const b of targets) pair(t, b, 4.5, 'token used as a text colour');
  }
  checkThemeFonts(file, scope, tokens);
}

/* --- Self-hosted fonts --- */
const GOOGLE_FONTS = /fonts\.(googleapis|gstatic)\.com/i;
const SYSTEM_FONTS = new Set([
  'system-ui', '-apple-system', 'blinkmacsystemfont', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded',
  'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'inherit',
  'arial', 'arial narrow', 'helvetica', 'helvetica neue', 'segoe ui', 'roboto', 'georgia', 'times new roman',
  'verdana', 'tahoma', 'trebuchet ms', 'haettenschweiler', 'impact', 'menlo', 'consolas', 'sfmono-regular', 'cascadia mono',
]);
function resolveCssImport(spec, fromFile) {
  if (spec.startsWith('.')) {
    // The example themes in src/styles/themes/ are copied VERBATIM to
    // src/styles/theme.css by the generators, so their relative @import lines
    // (e.g. './variants/lab.css') must resolve from src/styles/, not from the
    // themes/ folder where the model file lives.
    const base = path.dirname(fromFile);
    const asTheme = path.resolve(path.join(SRC, 'styles'), spec);
    if (path.basename(base) === 'themes' && fs.existsSync(asTheme)) return asTheme;
    return path.resolve(base, spec);
  }
  const m = spec.match(/^((?:@[^/]+\/)?[^/]+)(\/.+)?$/);
  if (!m) return null;
  const dir = path.join(ROOT, 'node_modules', m[1]);
  if (m[2]) return path.join(dir, m[2].endsWith('.css') ? m[2] : `${m[2]}.css`);
  const pkg = path.join(dir, 'package.json');
  if (!fs.existsSync(pkg)) return null;
  const main = JSON.parse(read(pkg)).main ?? 'index.css';
  return path.join(dir, main.endsWith('.css') ? main : 'index.css');
}
function checkThemeFonts(file, scope, tokens) {
  const css = stripCssComments(read(file));
  if (GOOGLE_FONTS.test(css)) err(scope, 'Google Fonts URL forbidden: self-host the fonts (@import of @fontsource-variable/…)');
  const provided = new Set();
  for (const m of css.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/g)) {
    const spec = m[1];
    if (/^(https?:)?\/\//.test(spec)) {
      err(scope, `external @import forbidden: "${spec}" (fonts must be self-hosted)`);
      continue;
    }
    const target = resolveCssImport(spec, file);
    if (!target || !fs.existsSync(target)) {
      err(scope, `@import "${spec}" not found — run npm install (package missing from package.json?)`);
      continue;
    }
    for (const ff of read(target).matchAll(/font-family:\s*['"]?([^;'"]+?)['"]?\s*;/g)) provided.add(ff[1].trim().toLowerCase());
  }
  for (const t of ['--font-display', '--font-body', '--font-label']) {
    if (tokens[t] === undefined) continue;
    const first = resolveVars(tokens[t], tokens).split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    if (!provided.has(first.toLowerCase()) && !SYSTEM_FONTS.has(first.toLowerCase())) {
      err(scope, `${t}: the family "${first}" is provided by no theme @import (e.g. @import '@fontsource-variable/inter' => "Inter Variable")`);
    }
  }
}

const themeFiles = [
  path.join(SRC, 'styles', 'theme.css'),
  ...walk(path.join(SRC, 'styles', 'themes'), (p) => p.endsWith('.css')),
];
themeFiles.forEach((f) => (fs.existsSync(f) ? checkTheme(f) : err('theme', `missing file: ${rel(f)}`)));

/* --- Hard-coded colours outside the theme --- */
const NAMED = /\b(white|black|red|green|blue|gray|grey|orange|yellow|purple|pink|silver|navy|teal|maroon|olive|lime|aqua|fuchsia)\b/i;
function hardColor(value) {
  const v = value.replace(/var\([^)]*\)/g, '');
  if (/#[0-9a-f]{3,8}\b/i.test(v)) return 'hex';
  if (/\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i.test(v)) return 'colour function';
  if (NAMED.test(v)) return 'colour name';
  return '';
}
for (const { file, css } of cssSources) {
  for (const d of declarations(css)) {
    if (d.prop.startsWith('--')) {
      if (hardColor(d.value)) err('hard-coded colour', `${rel(file)}: ${d.prop}: ${d.value} (define the token in theme.css)`);
      continue;
    }
    const kind = hardColor(d.value);
    if (kind) err('hard-coded colour', `${rel(file)}: "${d.prop}: ${d.value}" (${kind}) — use a theme.css token`);
  }
}
for (const file of astroFiles) {
  const markup = read(file).replace(/^---[\s\S]*?\n---/, '').replace(/<style[\s\S]*?<\/style>/g, '');
  for (const m of markup.matchAll(/\s(fill|stroke|stop-color|color)="([^"]*)"/g)) {
    if (/var\(|#|rgb|hsl/i.test(m[2])) {
      err('hard-coded colour', `${rel(file)}: SVG attribute ${m[1]}="${m[2]}" — set the colour in CSS (a class), never in an attribute`);
    }
  }
  for (const m of markup.matchAll(/\sstyle="([^"]*)"/g)) {
    if (hardColor(m[1])) err('hard-coded colour', `${rel(file)}: style="${m[1]}"`);
  }
}

/* ================================================================ 4. SOURCES */

const stripEntities = (s) => s.replace(/&[a-z]+;|&#\d+;/gi, ' ');
function hardcodedText(src) {
  const found = [];
  let s = src.replace(/^---[\s\S]*?\n---/, '');
  // Self-closing <script … /> first (otherwise the strip would run to the next </script>).
  s = s.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<script\b[^>]*\/>/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ');
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
  let previous;
  do {
    previous = s;
    s = s.replace(/\{([^{}]*)\}/g, (_, inner) => {
      // JSX text inside an expression: >text< (the arrow => and the resumption
      // of JavaScript after an element, ") : (", ") }", etc., are ignored).
      for (const m of inner.matchAll(/(^|[^=])>([^<>]*)</g)) {
        const text = m[2].trim();
        if (/^[)\]}:?,;|&]/.test(text)) continue;
        if (/\p{L}/u.test(stripEntities(text))) found.push(text);
      }
      return ' ';
    });
  } while (s !== previous);
  s = stripEntities(s.replace(/<[^>]*>/g, ' '));
  for (const line of s.split('\n')) if (/\p{L}/u.test(line)) found.push(line.trim());
  return found;
}
for (const file of astroFiles) {
  const markupOnly = read(file).replace(/^---[\s\S]*?\n---/, '').replace(/<script\b[^>]*\/>/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/g, '');
  if (/<!--/.test(markupOnly)) {
    err('sources', `${rel(file)}: HTML comment <!-- (published depending on context) — use {/* */} or the frontmatter`);
  }
  for (const text of hardcodedText(read(file))) {
    err('hard-coded text', `${rel(file)}: "${text.slice(0, 80)}" — move this text into src/data/`);
  }
}

/* A single placeholder helper */
for (const file of walk(SRC, (p) => /\.(ts|astro|mjs|js)$/.test(p))) {
  if (rel(file) === 'src/lib/utils.ts') continue;
  const code = read(file);
  if (/startsWith\(\s*['"`]TODO/.test(code) || /\b(renderable|isReal)\s*=/.test(code)) {
    err('sources', `${rel(file)}: local placeholder test — use isSet() from src/lib/utils.ts`);
  }
}

/* Icons named in the copy */
const iconSrc = read(path.join(SRC, 'components', 'Icon.astro'));
const iconNames = new Set([...iconSrc.matchAll(/^\s*'([\w-]+)':\s*'</gm)].map((m) => m[1]));
const copySources = ['copy.ts', 'overrides.ts', 'content.ts', 'ui.ts']
  .map((f) => path.join(SRC, 'data', f))
  .filter((f) => fs.existsSync(f));
for (const file of copySources) {
  for (const m of read(file).matchAll(/\bicon:\s*'([\w-]+)'/g)) {
    if (!iconNames.has(m[1])) err('sources', `${rel(file)}: unknown icon "${m[1]}" (missing from Icon.astro)`);
  }
}
/* Icon names passed as literals in the pages (contact channels, etc.). */
for (const file of astroFiles) {
  for (const m of read(file).matchAll(/\bicon:\s*'([\w-]+)'/g)) {
    if (!iconNames.has(m[1])) err('sources', `${rel(file)}: unknown icon "${m[1]}" (missing from Icon.astro)`);
  }
}

/* ----------------------------------------------------- FORBIDDEN VOCABULARY */

/**
 * Unverifiable credentials and superlatives. A company may state what is on
 * its own register entry; it may not claim qualifications, accreditations,
 * rankings or a track record that nobody can check. Publishing those would
 * breach the Consumer Protection from Unfair Trading Regulations 2008.
 */
const CLAIMS =
  /\b(award[- ]?winning|awards?|accredited|accreditation|certified|certification|chartered|licensed|chequered|insured|fully insured|member of|membership of|approved by|endorsed by|trusted by|rated|rating|five[- ]star|5[- ]star|best in|leading|market leader|number one|no\.?\s?1|#1|top[- ]rated|premier|premium quality|world[- ]class|industry[- ]leading|unrivalled|unbeatable|cheapest|lowest price)\b/i;
/** Claims about experience or volume, which are always a number nobody can verify. */
const TRACK_RECORD =
  /\b(\d+\+?\s*(years?|yrs?)\s*(of\s*)?(experience|trading|in business|in the trade)|over\s+\d+\s+(years?|clients?|customers?|projects?|jobs?|homes?|installations?)|\d+\+?\s*(happy\s*)?(clients?|customers?|projects?|jobs?)\s*(completed|served|delivered)?)\b/i;
/** Guarantees and free offers: only ever true if actually contracted. */
const PROMISE =
  /\b(?<!limited by )(?<!company limited by )(guaranteed?|guarantees|warrant(?:y|ies)|free quote|free survey|free consultation|free trial|for free|no obligation|no commitment|money.?back|risk.?free|satisfaction guaranteed)\b/i;
/** Prices and checkout: these are brochure sites, everything is quoted per job. */
const MONEY = /[£$€]\s?\d|\b\d+\s?(?:gbp|pounds?)\b|\bper (?:hour|day|week|month) from\b/i;
const CHECKOUT = /\b(pay online|checkout|add to (?:basket|cart)|buy now|shopping (?:basket|cart)|subscribe now|payment page)\b/i;

/**
 * Prescription-only medicines and medical claims.
 *
 * Regulation 284 of the Human Medicines Regulations 2012 prohibits advertising
 * a prescription-only medicine to the public, which covers botulinum toxin and
 * every brand name it is sold under. A beauty or aesthetics site is exactly
 * where that slips in, so the names are blocked outright rather than reviewed.
 * Outcome claims ("clinically proven", "cures") are blocked for the same
 * reason: they are medical claims no beauty business can substantiate.
 */
const POM = /\b(botox|botulinum|dysport|azzalure|bocouture|vistabel|xeomin|prescription[- ]only|anti[- ]wrinkle injection)\b/i;
const MEDICAL_CLAIM = /\b(clinically proven|medically proven|dermatologically proven|cures?|heals?|permanent results|pain[- ]free|medical[- ]grade)\b/i;

/** Sections whose job is to restate facts or to disclaim: exempt from some rules. */
const FACTUAL_KEYS = ['legal'];
/** A sentence that denies a claim is legitimate ("no accreditation is claimed"). */
const DISCLAIMER = /\b(not|no|never|without|cannot|can.t|isn.t|aren.t|doesn.t|don.t|nothing|unaffected)\b/i;

function walkStrings(value, visit, keyPath = '') {
  if (typeof value === 'string') visit(value, keyPath);
  else if (typeof value === 'function') return;
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, visit, `${keyPath}[${i}]`));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walkStrings(v, visit, keyPath ? `${keyPath}.${k}` : k);
  }
}

for (const [name, value] of Object.entries(content)) {
  const factual = FACTUAL_KEYS.includes(name);
  walkStrings(value, (s, p) => {
    const where = `content.${name}${p ? `.${p}` : ''}`;
    if (MONEY.test(s)) err('scope', `${where}: a currency amount ("${s.match(MONEY)[0]}") — nothing is priced on these sites`);
    // Denying a checkout ("this site has no payment page") is the honest case,
    // so only an affirmative use is an error.
    if (CHECKOUT.test(s) && !DISCLAIMER.test(s)) {
      err('scope', `${where}: checkout wording ("${s.match(CHECKOUT)[0]}") — there is no online payment`);
    }
    if (factual) return;
    if (POM.test(s)) {
      err('content', `${where}: prescription-only medicine named ("${s.match(POM)[0]}") — advertising one to the public breaches reg. 284 of the Human Medicines Regulations 2012`);
    }
    if (MEDICAL_CLAIM.test(s) && !DISCLAIMER.test(s)) {
      err('content', `${where}: medical claim ("${s.match(MEDICAL_CLAIM)[0]}")`);
    }
    if (CLAIMS.test(s) && !DISCLAIMER.test(s)) {
      err('content', `${where}: unverifiable claim ("${s.match(CLAIMS)[0]}") — a real credential belongs in site.ts`);
    }
    if (TRACK_RECORD.test(s)) {
      err('content', `${where}: unverifiable track record ("${s.match(TRACK_RECORD)[0]}")`);
    }
    if (PROMISE.test(s) && !DISCLAIMER.test(s)) {
      err('content', `${where}: commercial promise ("${s.match(PROMISE)[0]}") — only state what is actually contracted`);
    }
  });
}

/* ------------------------------------------------------ site.ts COHERENCE */

const cnamePath = path.join(ROOT, 'public', 'CNAME');
const cname = fs.existsSync(cnamePath) ? read(cnamePath).trim() : '';
if (isSet(site.url)) {
  if (!/^https:\/\/[^/]+$/.test(site.url)) err('site.ts', `url "${site.url}": expected https://domain with no trailing slash`);
  else if (cname && new URL(site.url).hostname !== cname) err('site.ts', `url (${new URL(site.url).hostname}) does not match public/CNAME (${cname})`);
}
if (isSet(site.contact.email) && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(site.contact.email)) {
  err('site.ts', `contact.email is invalid: ${site.contact.email}`);
}
if (isSet(site.seo.ogImage) && !fs.existsSync(path.join(ROOT, 'public', site.seo.ogImage.replace(/^\//, '')))) {
  err('site.ts', `seo.ogImage "${site.seo.ogImage}" not found in public/`);
}
for (const [k, v] of Object.entries(site.social)) {
  if (isSet(v) && !/^https:\/\//.test(v)) err('site.ts', `social.${k} must be a full https:// URL`);
}

/* --- The company block must match the public register --- */
const company = site.company;
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
if (isSet(company.number)) {
  if (!/^[A-Z0-9]{8}$/.test(company.number)) {
    err('company', `company.number "${company.number}": a UK company number is 8 characters (e.g. 14896950 or SC123456)`);
  }
  if (isSet(company.companiesHouseUrl) && !company.companiesHouseUrl.includes(company.number)) {
    err('company', 'company.companiesHouseUrl does not contain company.number — wrong record linked');
  }
}
if (isSet(company.companiesHouseUrl) && !/^https:\/\/find-and-update\.company-information\.service\.gov\.uk\/company\//.test(company.companiesHouseUrl)) {
  err('company', 'company.companiesHouseUrl must point at find-and-update.company-information.service.gov.uk/company/…');
}
if (isSet(company.incorporated)) {
  const m = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(company.incorporated.trim());
  if (!m || !MONTHS.includes(m[2].toLowerCase())) {
    err('company', `company.incorporated "${company.incorporated}": expected a date such as "29 April 2025"`);
  }
}
if (isSet(company.vatNumber) && !/^(GB)?\s?\d[\d\s]{8,}$/i.test(company.vatNumber)) {
  err('company', `company.vatNumber "${company.vatNumber}" does not look like a UK VAT number`);
}
for (const s of company.sic ?? []) {
  if (!/^\d{5}$/.test(String(s.code))) err('company', `SIC code "${s.code}": expected 5 digits`);
}

const NAV_EXPECTED = ['/', '/about', '/services', '/contact'];
const navHrefs = site.nav.map((n) => n.href);
if (navHrefs.join('|') !== NAV_EXPECTED.join('|')) {
  err('scope', `site.nav must contain exactly the pages ${NAV_EXPECTED.join(', ')} (found: ${navHrefs.join(', ')})`);
}
const LEGAL_PAGES = ['/legal-notice', '/privacy'];
for (const href of LEGAL_PAGES) {
  if (!site.legalNav.some((n) => n.href === href)) err('site.ts', `legalNav must contain ${href}`);
}

/* ================================================================== 5. DIST */

const htmlFiles = walk(DIST, (p) => p.endsWith('.html'));
if (htmlFiles.length === 0) err('dist', 'no page generated in dist/');

const pageOf = (file) => {
  const r = rel(file).replace(/^dist\//, '');
  if (r === 'index.html') return '/';
  return `/${r.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
};
for (const file of walk(DIST, (p) => /\.(html|css|js|mjs|json|xml|txt|svg)$/.test(p))) {
  if (GOOGLE_FONTS.test(read(file))) err('fonts', `${rel(file)}: fonts.googleapis.com / fonts.gstatic.com URL — fonts must be self-hosted`);
}
const pages = new Map();
for (const file of htmlFiles) {
  const raw = read(file);
  const jsonLd = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const html = raw.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  const ids = [...html.matchAll(/\sid="([^"]*)"/g)].map((m) => decode(m[1]));
  pages.set(pageOf(file), { file, raw, html, jsonLd, ids: new Set(ids), idList: ids });
}

function resolveTarget(href) {
  const [pathPart] = href.split(/[?#]/);
  let p = decodeURI(pathPart).replace(/\/+$/, '') || '/';
  if (pages.has(p)) return pages.get(p);
  const asset = path.join(DIST, p);
  if (fs.existsSync(asset) && fs.statSync(asset).isFile()) return { asset: true };
  return null;
}

const FORBIDDEN = [
  [/\bTODO/, 'TODO'],
  [/\bundefined\b/i, 'undefined'],
  [/\bnull\b/i, 'null'],
  [/\bNaN\b/, 'NaN'],
  [/\[object Object\]/, '[object Object]'],
  [/lorem/i, 'lorem'],
];
const optionalSeen = new Map();
let missingLegal = 0;

for (const [page, { raw, html, jsonLd, ids, idList }] of pages) {
  const scope = `dist ${page}`;

  for (const href of LEGAL_PAGES) {
    if (!raw.includes(`href="${href}"`)) err(scope, `no link to ${href} (footer)`);
  }

  /* Companies Act 2006 s.82: the disclosure must be on every page.
     Compared against decoded, whitespace-normalised text, because a name such
     as "LK BUILDING & ROOFING LIMITED" is served with &amp; and would never
     match the raw HTML. */
  const plain = decode(html).replace(/\s+/g, ' ');
  const states = (v) => plain.includes(String(v).replace(/\s+/g, ' ').trim());
  if (isSet(company.legalName) && !states(company.legalName)) {
    err(scope, `the registered company name is missing (Companies Act 2006 s.82)`);
  }
  if (isSet(company.number) && !states(company.number)) {
    err(scope, `the company number is missing (Companies Act 2006 s.82)`);
  }
  if (isSet(company.registeredOffice) && !states(company.registeredOffice)) {
    err(scope, `the registered office is missing (Companies Act 2006 s.82)`);
  }

  if (/<!--/.test(html)) err(scope, 'published HTML comment <!-- (use a frontmatter comment or {/* */})');

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) err(scope, `${h1} <h1> (exactly 1 expected)`);

  for (const m of html.matchAll(/<(h[1-6]|p|li|ul|ol|dd|dt|a|button)(\s[^>]*)?>\s*<\/\1>/g)) {
    err(scope, `empty <${m[1]}> element`);
  }

  const dup = idList.filter((id, i) => idList.indexOf(id) !== i);
  if (dup.length) err(scope, `duplicate ids: ${[...new Set(dup)].join(', ')}`);

  for (const m of html.matchAll(/\shref="([^"]*)"/g)) {
    const href = decode(m[1]);
    if (href.startsWith('//')) continue;
    if (href === '#' || href === '') {
      err(scope, `empty link href="${href}"`);
    } else if (href.startsWith('#')) {
      if (!ids.has(href.slice(1))) err(scope, `dead anchor ${href}`);
    } else if (href.startsWith('/')) {
      const target = resolveTarget(href);
      const hash = href.includes('#') ? href.split('#')[1] : '';
      if (!target) err(scope, `dead internal link ${href}`);
      else if (hash && (target.asset || !target.ids.has(hash))) err(scope, `dead anchor ${href}`);
    }
  }
  for (const m of html.matchAll(/\saria-(labelledby|controls|describedby)="([^"]*)"/g)) {
    for (const id of m[2].split(/\s+/).filter(Boolean)) {
      if (!ids.has(id)) err(scope, `aria-${m[1]} references a missing id: ${id}`);
    }
  }

  for (const block of jsonLd) {
    try {
      const data = JSON.parse(block);
      walkStrings(data, (s, p) => {
        for (const [re, label] of FORBIDDEN) if (re.test(s)) err(scope, `JSON-LD ${p} contains "${label}"`);
      });
      JSON.stringify(data, (k, v) => {
        if (v === null) err(scope, `JSON-LD: null value (${k})`);
        return v;
      });
    } catch {
      err(scope, 'invalid JSON-LD');
    }
  }

  const textNodes = [...html.matchAll(/>([^<]+)</g)].map((m) => decode(m[1])).filter((t) => t.trim());
  const attrValues = [...html.matchAll(/\s([\w:-]+)="([^"]*)"/g)].map((m) => ({ name: m[1], value: decode(m[2]) }));
  const readable = [
    ...textNodes,
    ...attrValues.filter((a) => ['aria-label', 'alt', 'title', 'content'].includes(a.name) && !/^(https?:|data:|width=)/.test(a.value)).map((a) => a.value),
  ];

  for (const t of [...textNodes, ...attrValues.map((a) => a.value)]) {
    for (const [re, label] of FORBIDDEN) if (re.test(t)) err(scope, `occurrence of "${label}": "${t.trim().slice(0, 80)}"`);
  }

  for (const t of readable) {
    const excerpt = t.trim().slice(0, 90);
    if (/\s[:;!?](?=\s|$)/.test(t)) err(scope, `space before : ; ! ? : "${excerpt}"`);
    if (/'/.test(t)) err(scope, `straight apostrophe (use the typographic apostrophe): "${excerpt}"`);
    if (MONEY.test(t)) err(scope, `currency amount ("${t.match(MONEY)[0]}"): "${excerpt}"`);
    if (CHECKOUT.test(t) && !DISCLAIMER.test(t)) err(scope, `checkout wording ("${t.match(CHECKOUT)[0]}"): "${excerpt}"`);
    if (POM.test(t)) err(scope, `prescription-only medicine named ("${t.match(POM)[0]}") — see reg. 284, Human Medicines Regulations 2012: "${excerpt}"`);
    if (MEDICAL_CLAIM.test(t) && !DISCLAIMER.test(t)) err(scope, `medical claim ("${t.match(MEDICAL_CLAIM)[0]}"): "${excerpt}"`);
    if (CLAIMS.test(t) && !DISCLAIMER.test(t)) err(scope, `unverifiable claim ("${t.match(CLAIMS)[0]}"): "${excerpt}"`);
    if (TRACK_RECORD.test(t)) err(scope, `unverifiable track record ("${t.match(TRACK_RECORD)[0]}"): "${excerpt}"`);
  }

  for (const m of html.matchAll(/\sdata-optional="([^"]+)"/g)) {
    optionalSeen.set(m[1], [...(optionalSeen.get(m[1]) ?? []), page]);
  }
  missingLegal += (html.match(/class="[^"]*\blegal-missing\b/g) ?? []).length;
}

if (htmlFiles.length) for (const p of [...NAV_EXPECTED, ...LEGAL_PAGES]) if (!pages.has(p)) err('dist', `page ${p} missing`);

/* Optional sections: present if and only if the data exists */
const EXPECTED = {
  social: Object.values(site.social).some((v) => isSet(v)),
  'cta-note': isSet(site.cta.note),
};
for (const [key, expected] of Object.entries(EXPECTED)) {
  const seen = optionalSeen.get(key) ?? [];
  if (!expected && seen.length) err('optional sections', `"${key}" is shown (${seen.join(', ')}) although its data is empty`);
  if (expected && seen.length === 0) err('optional sections', `"${key}" is filled in but never shown`);
}
for (const key of optionalSeen.keys()) {
  if (!(key in EXPECTED)) err('optional sections', `data-optional="${key}" marker unknown to check.mjs`);
}

/* ============================================================== 6. WARNINGS */

const TODO_FIELDS = [
  ['brand.name', 'trading name'],
  ['brand.tagline', 'short descriptor (footer, JSON-LD)'],
  ['url', 'public site URL (https://…)'],
  ['company.legalName', 'registered company name, as filed'],
  ['company.number', 'company number'],
  ['company.registeredOffice', 'registered office address'],
  ['company.incorporated', 'date of incorporation'],
  ['company.status', 'register status at the last check'],
  ['company.companiesHouseUrl', 'link to the public register entry'],
  ['company.recordChecked', 'date the register was last checked'],
  ['contact.email', 'business email address'],
  ['contact.phone', 'telephone number'],
  ['seo.ogImage', '1200x630 sharing image in public/'],
  ['legal.lastUpdated', 'privacy notice: last updated date'],
];
const get = (obj, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
for (const [p, label] of TODO_FIELDS) if (!isSet(get(site, p))) warnings.push(`site.${p} — ${label}`);
if (!cname) warnings.push('public/CNAME — custom domain (e.g. example.shop)');
if (missingLegal > 0) warnings.push(`legal pages — ${missingLegal} disclosure(s) showing "(to be completed)"`);
if ((company.sic ?? []).length === 0) warnings.push('site.company.sic — nature of business (SIC codes) not listed');

const OPTIONAL_FIELDS = [
  ['cta.note', 'note under the buttons (only if genuinely true)'],
  ['contact.address', 'trading address, if different from the registered office'],
  ['contact.area', 'area served'],
  ['contact.hours', 'opening hours'],
  ['contact.responseTime', 'response time actually kept'],
  ['company.director', 'director named on the register'],
  ['company.vatNumber', 'VAT registration number, if registered'],
  ['legal.regulator', 'regulator and registration number, if the activity is regulated'],
];
for (const [p, label] of OPTIONAL_FIELDS) if (!isSet(get(site, p))) optionalInfo.push(`site.${p} — ${label}`);
if (!Object.values(site.social).some((v) => isSet(v))) optionalInfo.push('site.social — no social profile');

/* ================================================================ 7. REPORT */

console.log('\n==================== npm run check ====================');
console.log(`Pages analysed: ${pages.size} · themes checked: ${themeFiles.length}`);

if (warnings.length) {
  console.log(`\nWARNINGS — to fill in before going live (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  - [ ] ${w}`));
}
if (optionalInfo.length) {
  console.log(`\nOptional — empty, therefore hidden (${optionalInfo.length}):`);
  optionalInfo.forEach((w) => console.log(`  - [ ] ${w}`));
}
if (errors.length) {
  console.log(`\nERRORS (${errors.length}):`);
  errors.forEach((e) => console.log(`  x ${e}`));
  console.log('\nResult: FAILED');
  process.exit(1);
}
console.log('\nERRORS: none');
console.log('Result: OK');
