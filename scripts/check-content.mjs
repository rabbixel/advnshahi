/**
 * Content QA for the local Markdown source.
 *
 *   npm run check:content
 *
 * Fails (exit 1) on: missing required fields, unknown categories, duplicate
 * slugs/titles/SEO titles/descriptions, related slugs that don't exist,
 * internal links to unknown routes, missing image files, missing alt text,
 * H1s inside article bodies, and updatedAt earlier than publishedAt.
 * Warns on: SEO title/description lengths and short articles.
 */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const articlesDir = path.join(root, "content", "articles");
const pagesDir = path.join(root, "content", "pages");

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// Category slugs are read from content/categories.ts without executing TypeScript.
const categoriesSource = await fs.readFile(path.join(root, "content", "categories.ts"), "utf8");
const categorySlugs = [...categoriesSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const articleFiles = (await fs.readdir(articlesDir)).filter((f) => f.endsWith(".md"));
const pageFiles = (await fs.readdir(pagesDir)).filter((f) => f.endsWith(".md"));
const articleSlugs = new Set(articleFiles.map((f) => f.replace(/\.md$/, "")));

const staticRoutes = new Set([
  "/",
  "/articles",
  "/search",
  "/hukamnama-today",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/disclaimer",
  ...categorySlugs.map((s) => `/${s}`),
]);

function checkLinks(file, body) {
  for (const match of body.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const [pathname] = match[1].split("#");
    const clean = pathname.split("?")[0].replace(/\/$/, "") || "/";
    if (staticRoutes.has(clean)) continue;
    const articleMatch = clean.match(/^\/articles\/([^/]+)$/);
    if (articleMatch && articleSlugs.has(articleMatch[1])) continue;
    err(file, `broken internal link ${match[1]}`);
  }
}

const seen = { title: new Map(), seoTitle: new Map(), seoDescription: new Map() };
function unique(kind, value, file) {
  if (!value) return;
  const key = value.trim().toLowerCase();
  if (seen[kind].has(key)) err(file, `duplicate ${kind} (also in ${seen[kind].get(key)})`);
  else seen[kind].set(key, file);
}

let totalWords = 0;

for (const file of articleFiles) {
  const raw = await fs.readFile(path.join(articlesDir, file), "utf8");
  const { data, content } = matter(raw);

  for (const key of ["title", "excerpt", "category", "image", "publishedAt", "seoTitle", "seoDescription"]) {
    if (!data[key]) err(file, `missing "${key}"`);
  }
  if (data.category && !categorySlugs.includes(data.category)) err(file, `unknown category "${data.category}"`);
  for (const s of data.secondaryCategories ?? []) {
    if (!categorySlugs.includes(s)) err(file, `unknown secondary category "${s}"`);
    if (s === data.category) err(file, `secondary category repeats primary "${s}"`);
  }

  if (data.image) {
    if (!data.image.alt || data.image.alt.length < 20) err(file, "image alt text missing or too short");
    if (data.image.src?.startsWith("/")) {
      try {
        await fs.access(path.join(root, "public", data.image.src));
      } catch {
        err(file, `image not found: public${data.image.src}`);
      }
    }
  }

  const published = new Date(data.publishedAt);
  const updated = new Date(data.updatedAt ?? data.publishedAt);
  if (updated < published) err(file, "updatedAt is earlier than publishedAt");

  for (const slug of data.related ?? []) {
    if (!articleSlugs.has(slug)) err(file, `related slug "${slug}" does not exist`);
    if (`${slug}.md` === file) err(file, "article lists itself as related");
  }

  for (const item of data.faq ?? []) {
    if (!item.question || !item.answer) err(file, "FAQ item missing question or answer");
  }

  if (/^#\s/m.test(content)) err(file, "body contains an H1; the page title is the only H1");

  unique("title", data.title, file);
  unique("seoTitle", data.seoTitle, file);
  unique("seoDescription", data.seoDescription, file);

  const titleLength = (data.seoTitle ?? "").length + " | NanakShahi".length;
  if (titleLength > 75) warn(file, `SEO title is long (${titleLength} chars with suffix)`);
  const descLength = (data.seoDescription ?? "").length;
  if (descLength < 110 || descLength > 170) warn(file, `SEO description length ${descLength}`);

  const words = content.split(/\s+/).filter(Boolean).length;
  totalWords += words;
  if (words < 1200) warn(file, `only ${words} words`);

  checkLinks(file, content);
}

for (const file of pageFiles) {
  const raw = await fs.readFile(path.join(pagesDir, file), "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.description) err(`pages/${file}`, "missing title or description");
  if (/^#\s/m.test(content)) err(`pages/${file}`, "body contains an H1");
  checkLinks(`pages/${file}`, content);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(
  `\nChecked ${articleFiles.length} articles (${totalWords.toLocaleString("en")} words) and ${pageFiles.length} pages: ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length ? 1 : 0);
