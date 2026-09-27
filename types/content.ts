/**
 * Content model for NanakShahi.
 *
 * These types are deliberately source-agnostic: the local Markdown source and
 * the future WordPress source must both map their data onto these shapes, so
 * UI components never need to know where content came from.
 */

export interface ImageAsset {
  /** Public path (e.g. /images/articles/foo.jpg) or absolute URL for remote sources. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional visible caption. */
  caption?: string;
  /** Credit line, e.g. "Illustration: NanakShahi". */
  credit?: string;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  /** Short factual description. Never invent credentials. */
  bio: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Short line used in cards, nav and meta descriptions. */
  tagline: string;
  /** Longer introduction shown at the top of the category page (Markdown-free plain paragraphs). */
  intro: string[];
  seoTitle: string;
  seoDescription: string;
  /** Accent token used for category labels. */
  accent: CategoryAccent;
}

export type CategoryAccent = "saffron" | "indigo" | "green" | "maroon" | "teal" | "ochre";

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  secondaryCategories: Category[];
  tags: string[];
  featuredImage: ImageAsset;
  author: Author;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  readingTime: number; // minutes
  featured: boolean;
  /** Editorial ordering for "Essential reading". Lower is more prominent. */
  editorialRank: number;
}

export interface Article extends ArticleSummary {
  /** Rendered, sanitised HTML body. */
  content: string;
  /** Plain-text body used by search. */
  plainText: string;
  wordCount: number;
  toc: TocEntry[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  /** Explicit related article slugs chosen by editors (optional). */
  relatedArticles: string[];
  faq: FaqItem[];
}

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  content: string;
  toc: TocEntry[];
}

/**
 * Shape of a daily Hukamnama entry supplied by a future backend
 * (WordPress custom post type or dedicated API). Nothing in this project
 * generates these values; they must come from a verified source.
 */
export interface HukamnamaEntry {
  /** ISO date the Hukamnama was issued (Amritsar local date). */
  date: string;
  /** Human-readable source, e.g. "Sri Harmandir Sahib, Amritsar". */
  source: string;
  /** URL of the original publication. */
  sourceUrl?: string;
  /** Gurmukhi text exactly as published by the source. */
  gurmukhi: string;
  /** Optional transliteration. */
  transliteration?: string;
  /** Punjabi explanation (viakhya) if published by the source. */
  punjabiExplanation?: string;
  /** English translation, with its translator credited in `translationCredit`. */
  englishTranslation?: string;
  translationCredit?: string;
  /** Optional editorial explanation written by NanakShahi. */
  explanation?: string;
  /** e.g. "Raag Sorath, Mahalla 5". */
  raag?: string;
  /** Ang (page) number of Sri Guru Granth Sahib Ji. */
  ang?: number;
  audioUrl?: string;
  image?: ImageAsset;
}

export interface SearchResult {
  article: ArticleSummary;
  score: number;
  snippet: string;
}
