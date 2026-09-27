import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { authors } from "@/content/authors";
import { categories } from "@/content/categories";
import { readingTimeFromWords, renderMarkdown } from "@/lib/markdown";
import type { Article, Author, Category, FaqItem, StaticPage } from "@/types/content";
import type { ContentSource } from "./source";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const PAGES_DIR = path.join(CONTENT_DIR, "pages");

const PUBLIC_DIR = path.join(process.cwd(), "public");
export const FALLBACK_IMAGE = "/images/fallback.jpg";

const DEFAULT_IMAGE_WIDTH = 1376;
const DEFAULT_IMAGE_HEIGHT = 768;

interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  secondaryCategories?: string[];
  tags?: string[];
  image: { src: string; alt: string; caption?: string; credit?: string; width?: number; height?: number };
  author?: string;
  publishedAt: string | Date;
  updatedAt?: string | Date;
  featured?: boolean;
  editorialRank?: number;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  related?: string[];
  faq?: FaqItem[];
}

function toIsoDate(value: string | Date | undefined, fallback: string): string {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${String(value)}`);
  return date.toISOString().slice(0, 10);
}

/**
 * Local images are checked at build time. If a referenced file is missing the
 * article falls back to a neutral branded image instead of a broken <img>.
 */
async function resolveLocalImage(src: string): Promise<string> {
  if (!src.startsWith("/")) return src;
  try {
    await fs.access(path.join(PUBLIC_DIR, src));
    return src;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[content] Missing image ${src}; using ${FALLBACK_IMAGE}`);
    }
    return FALLBACK_IMAGE;
  }
}

function findCategory(slug: string, file: string): Category {
  const category = categories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Unknown category "${slug}" in ${file}`);
  return category;
}

function findAuthor(slug: string | undefined, file: string): Author {
  const author = authors.find((a) => a.slug === (slug ?? "editorial-team"));
  if (!author) throw new Error(`Unknown author "${slug}" in ${file}`);
  return author;
}

async function parseArticle(file: string): Promise<Article> {
  const raw = await fs.readFile(path.join(ARTICLES_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;
  const slug = file.replace(/\.md$/, "");

  for (const key of ["title", "excerpt", "category", "image", "publishedAt"] as const) {
    if (!fm[key]) throw new Error(`Missing "${key}" in ${file}`);
  }

  const rendered = renderMarkdown(content);
  const publishedAt = toIsoDate(fm.publishedAt, "");
  const category = findCategory(fm.category, file);
  const imageSrc = await resolveLocalImage(fm.image.src);

  return {
    id: `article-${slug}`,
    slug,
    title: fm.title,
    excerpt: fm.excerpt,
    category,
    secondaryCategories: (fm.secondaryCategories ?? []).map((s) => findCategory(s, file)),
    tags: fm.tags ?? [],
    featuredImage: {
      src: imageSrc,
      alt: fm.image.alt,
      caption: fm.image.caption,
      credit: fm.image.credit ?? "Illustration: NanakShahi",
      width: fm.image.width ?? DEFAULT_IMAGE_WIDTH,
      height: fm.image.height ?? DEFAULT_IMAGE_HEIGHT,
    },
    author: findAuthor(fm.author, file),
    publishedAt,
    updatedAt: toIsoDate(fm.updatedAt, publishedAt),
    readingTime: readingTimeFromWords(rendered.wordCount),
    featured: Boolean(fm.featured),
    editorialRank: fm.editorialRank ?? 100,
    content: rendered.html,
    plainText: rendered.plainText,
    wordCount: rendered.wordCount,
    toc: rendered.toc,
    seoTitle: fm.seoTitle ?? fm.title,
    seoDescription: fm.seoDescription ?? fm.excerpt,
    keywords: fm.keywords ?? [],
    relatedArticles: fm.related ?? [],
    faq: fm.faq ?? [],
  };
}

export const localSource: ContentSource = {
  name: "local",

  async getAllArticles() {
    const files = (await fs.readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".md"));
    return Promise.all(files.map(parseArticle));
  },

  async getCategories() {
    return categories;
  },

  async getAuthors() {
    return authors;
  },

  async getPage(slug: string): Promise<StaticPage | null> {
    try {
      const raw = await fs.readFile(path.join(PAGES_DIR, `${slug}.md`), "utf8");
      const { data, content } = matter(raw);
      const rendered = renderMarkdown(content);
      return {
        slug,
        title: String(data.title),
        description: String(data.description),
        updatedAt: toIsoDate(data.updatedAt, "2026-09-27"),
        content: rendered.html,
        toc: rendered.toc,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  },
};
