import "server-only";
import { authors as localAuthors } from "@/content/authors";
import { categories as localCategories } from "@/content/categories";
import { readingTimeFromWords, renderMarkdown, stripHtml, countWords } from "@/lib/markdown";
import type { Article, Author, Category, StaticPage, TocEntry } from "@/types/content";
import type { ContentSource } from "./source";

/**
 * WordPress REST API adapter (future backend).
 *
 * Not active by default. Enable with CONTENT_SOURCE=wordpress and
 * WORDPRESS_API_URL=https://cms.example.com/wp-json
 *
 * Expected WordPress setup (documented in README):
 * - Standard posts, with categories whose slugs match `content/categories.ts`
 * - Featured images (`_embed` exposes wp:featuredmedia)
 * - Optional ACF / meta fields exposed via REST: seo_title, seo_description,
 *   keywords (comma separated), faq (array of {question, answer}),
 *   related (array of slugs), featured (bool), editorial_rank (number)
 */

interface WpRendered {
  rendered: string;
}

interface WpPost {
  id: number;
  slug: string;
  date_gmt: string;
  modified_gmt: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  categories: number[];
  tags: number[];
  meta?: Record<string, unknown>;
  acf?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
      caption?: WpRendered;
      media_details?: { width?: number; height?: number };
    }>;
    "wp:term"?: Array<Array<{ id: number; slug: string; name: string; taxonomy: string }>>;
  };
}

interface WpPage {
  slug: string;
  modified_gmt: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
}

const REVALIDATE_SECONDS = 600;

function apiBase(): string {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new Error("WORDPRESS_API_URL must be set when CONTENT_SOURCE=wordpress");
  return base.replace(/\/$/, "");
}

async function wpFetch<T>(pathAndQuery: string): Promise<T> {
  const res = await fetch(`${apiBase()}${pathAndQuery}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["wordpress"] },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`WordPress request failed: ${res.status} ${pathAndQuery}`);
  return (await res.json()) as T;
}

async function wpFetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = [];
  for (let page = 1; page < 50; page++) {
    const sep = endpoint.includes("?") ? "&" : "?";
    const batch = await wpFetch<T[]>(`${endpoint}${sep}per_page=100&page=${page}`).catch((e: Error) => {
      if (page > 1 && e.message.includes("400")) return [] as T[];
      throw e;
    });
    results.push(...batch);
    if (batch.length < 100) break;
  }
  return results;
}

/** Adds ids to H2/H3 in CMS HTML and extracts a table of contents. */
function addHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (_m, level: string, attrs: string, inner: string) => {
    const text = stripHtml(inner);
    const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    toc.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
  return { html: out, toc };
}

function field<T>(post: WpPost, key: string): T | undefined {
  return (post.acf?.[key] ?? post.meta?.[key]) as T | undefined;
}

function mapPost(post: WpPost, fallbackAuthor: Author): Article | null {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const catTerms = terms.filter((t) => t.taxonomy === "category");
  const matched = catTerms
    .map((t) => localCategories.find((c) => c.slug === t.slug))
    .filter((c): c is Category => Boolean(c));
  if (matched.length === 0) return null;

  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const { html, toc } = addHeadingIds(post.content.rendered);
  const plainText = stripHtml(html);
  const wordCount = countWords(plainText);
  const keywords = String(field<string>(post, "keywords") ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    id: `wp-${post.id}`,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    category: matched[0],
    secondaryCategories: matched.slice(1),
    tags: terms.filter((t) => t.taxonomy === "post_tag").map((t) => t.name),
    featuredImage: {
      src: media?.source_url ?? "/images/fallback.jpg",
      alt: media?.alt_text || stripHtml(post.title.rendered),
      caption: media?.caption ? stripHtml(media.caption.rendered) : undefined,
      width: media?.media_details?.width ?? 1376,
      height: media?.media_details?.height ?? 768,
    },
    author: fallbackAuthor,
    publishedAt: post.date_gmt.slice(0, 10),
    updatedAt: post.modified_gmt.slice(0, 10),
    readingTime: readingTimeFromWords(wordCount),
    featured: Boolean(field<boolean>(post, "featured")),
    editorialRank: Number(field<number>(post, "editorial_rank") ?? 100),
    content: html,
    plainText,
    wordCount,
    toc,
    seoTitle: field<string>(post, "seo_title") ?? stripHtml(post.title.rendered),
    seoDescription: field<string>(post, "seo_description") ?? stripHtml(post.excerpt.rendered),
    keywords,
    relatedArticles: field<string[]>(post, "related") ?? [],
    faq: field<Array<{ question: string; answer: string }>>(post, "faq") ?? [],
  };
}

export const wordpressSource: ContentSource = {
  name: "wordpress",

  async getAllArticles() {
    const posts = await wpFetchAll<WpPost>("/wp/v2/posts?_embed=1&status=publish");
    const author = localAuthors[0];
    return posts.map((p) => mapPost(p, author)).filter((a): a is Article => a !== null);
  },

  async getCategories() {
    // Category copy (intros, SEO text) stays editorially controlled in the repo.
    return localCategories;
  },

  async getAuthors() {
    return localAuthors;
  },

  async getPage(slug: string): Promise<StaticPage | null> {
    const pages = await wpFetch<WpPage[]>(`/wp/v2/pages?slug=${encodeURIComponent(slug)}`);
    const page = pages[0];
    if (!page) return null;
    const { html, toc } = addHeadingIds(page.content.rendered);
    return {
      slug,
      title: stripHtml(page.title.rendered),
      description: stripHtml(page.excerpt.rendered),
      updatedAt: page.modified_gmt.slice(0, 10),
      content: html,
      toc,
    };
  },
};

// Re-exported so Markdown stored in WordPress (e.g. via a Markdown block) can reuse the renderer.
export { renderMarkdown };
