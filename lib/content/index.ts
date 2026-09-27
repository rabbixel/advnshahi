import "server-only";
import { cache } from "react";
import type { Article, ArticleSummary, Category, SearchResult, StaticPage } from "@/types/content";
import { localSource } from "./local";
import type { ContentSource } from "./source";
import { wordpressSource } from "./wordpress";

/**
 * Public content API. UI code must only import from this module.
 * Swapping CONTENT_SOURCE changes where data comes from, not how it is shown.
 */
function activeSource(): ContentSource {
  return process.env.CONTENT_SOURCE === "wordpress" ? wordpressSource : localSource;
}

function byNewest(a: ArticleSummary, b: ArticleSummary): number {
  return b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title);
}

/** Strips heavy fields so lists don't ship full article bodies to components. */
export function toSummary(article: Article): ArticleSummary {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    secondaryCategories: article.secondaryCategories,
    tags: article.tags,
    featuredImage: article.featuredImage,
    author: article.author,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    readingTime: article.readingTime,
    featured: article.featured,
    editorialRank: article.editorialRank,
  };
}

const loadArticles = cache(async (): Promise<Article[]> => {
  const articles = await activeSource().getAllArticles();
  const slugs = new Set<string>();
  for (const a of articles) {
    if (slugs.has(a.slug)) throw new Error(`Duplicate article slug: ${a.slug}`);
    slugs.add(a.slug);
  }
  return articles.sort(byNewest);
});

export async function getArticles(): Promise<ArticleSummary[]> {
  return (await loadArticles()).map(toSummary);
}

export async function getArticleSlugs(): Promise<string[]> {
  return (await loadArticles()).map((a) => a.slug);
}

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  return (await loadArticles()).find((a) => a.slug === slug) ?? null;
});

export const getCategories = cache(async (): Promise<Category[]> => activeSource().getCategories());

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

/** Articles whose primary category matches first, then those listing it as secondary. */
export async function getArticlesByCategory(slug: string): Promise<ArticleSummary[]> {
  const all = await getArticles();
  const primary = all.filter((a) => a.category.slug === slug);
  const secondary = all.filter(
    (a) => a.category.slug !== slug && a.secondaryCategories.some((c) => c.slug === slug),
  );
  return [...primary, ...secondary];
}

/** Categories that have at least one article. Empty hubs are never published. */
export async function getActiveCategories(): Promise<Array<Category & { count: number }>> {
  const [cats, all] = await Promise.all([getCategories(), getArticles()]);
  return cats
    .map((c) => ({
      ...c,
      count: all.filter(
        (a) => a.category.slug === c.slug || a.secondaryCategories.some((s) => s.slug === c.slug),
      ).length,
    }))
    .filter((c) => c.count > 0);
}

export async function getFeaturedArticles(limit = 5): Promise<ArticleSummary[]> {
  const all = await getArticles();
  return all
    .filter((a) => a.featured)
    .sort((a, b) => a.editorialRank - b.editorialRank)
    .slice(0, limit);
}

export async function getLatestArticles(limit = 6, exclude: string[] = []): Promise<ArticleSummary[]> {
  return (await getArticles()).filter((a) => !exclude.includes(a.slug)).slice(0, limit);
}

/**
 * Editor-curated "essential reading". Replace with analytics-driven
 * popularity once real readership data exists; do not fake view counts.
 */
export async function getEssentialArticles(limit = 5, exclude: string[] = []): Promise<ArticleSummary[]> {
  return (await getArticles())
    .filter((a) => !exclude.includes(a.slug))
    .sort((a, b) => a.editorialRank - b.editorialRank)
    .slice(0, limit);
}

/**
 * Related articles, scored by topical relevance:
 * explicit editor picks > same primary category > shared secondary categories > shared tags.
 */
export async function getRelatedArticles(article: Article, limit = 3): Promise<ArticleSummary[]> {
  const all = await getArticles();
  const articleCats = new Set([article.category.slug, ...article.secondaryCategories.map((c) => c.slug)]);
  const tags = new Set(article.tags.map((t) => t.toLowerCase()));

  const scored = all
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      let score = 0;
      const pick = article.relatedArticles.indexOf(a.slug);
      if (pick !== -1) score += 100 - pick;
      if (a.category.slug === article.category.slug) score += 12;
      if (articleCats.has(a.category.slug)) score += 6;
      score += a.secondaryCategories.filter((c) => articleCats.has(c.slug)).length * 4;
      score += a.tags.filter((t) => tags.has(t.toLowerCase())).length * 2;
      return { a, score };
    })
    .filter(({ score }) => score > 0)
    .sort((x, y) => y.score - x.score || byNewest(x.a, y.a));

  return scored.slice(0, limit).map(({ a }) => a);
}

function normalise(text: string): string {
  return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function makeSnippet(text: string, terms: string[], length = 180): string {
  const lower = normalise(text);
  let index = -1;
  for (const term of terms) {
    index = lower.indexOf(term);
    if (index !== -1) break;
  }
  if (index === -1) return text.slice(0, length).trim() + (text.length > length ? "…" : "");
  const start = Math.max(0, index - 60);
  const end = Math.min(text.length, start + length);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/** Simple weighted full-text search across titles, excerpts, categories, tags and body text. */
export async function searchArticles(query: string, limit = 30): Promise<SearchResult[]> {
  const terms = normalise(query)
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9\u0a00-\u0a7f-]/g, ""))
    .filter((t) => t.length > 1);
  if (terms.length === 0) return [];

  const articles = await loadArticles();
  const phrase = normalise(query.trim());

  return articles
    .map((article) => {
      const title = normalise(article.title);
      const excerpt = normalise(article.excerpt);
      const cats = normalise([article.category.name, ...article.secondaryCategories.map((c) => c.name)].join(" "));
      const tags = normalise(article.tags.join(" "));
      const body = normalise(article.plainText);

      let score = 0;
      let matchedTerms = 0;
      for (const term of terms) {
        let termScore = 0;
        if (title.includes(term)) termScore += 10;
        if (excerpt.includes(term)) termScore += 5;
        if (cats.includes(term)) termScore += 4;
        if (tags.includes(term)) termScore += 4;
        const bodyHits = body.split(term).length - 1;
        termScore += Math.min(bodyHits, 10) * 0.5;
        if (termScore > 0) matchedTerms++;
        score += termScore;
      }
      if (matchedTerms < terms.length) score *= 0.35; // favour results matching every term
      if (phrase.length > 3 && title.includes(phrase)) score += 15;
      else if (phrase.length > 3 && body.includes(phrase)) score += 5;

      return { article: toSummary(article), score, snippet: makeSnippet(article.plainText, terms) };
    })
    .filter((r) => r.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function getPage(slug: string): Promise<StaticPage | null> {
  return activeSource().getPage(slug);
}
