import type { Article, Author, Category, StaticPage } from "@/types/content";

/**
 * A ContentSource provides fully-normalised content. The rest of the app only
 * talks to the functions in `lib/content/index.ts`, which delegate to the
 * active source. To move to WordPress, implement this interface (see
 * `wordpress.ts`) and set CONTENT_SOURCE=wordpress.
 */
export interface ContentSource {
  readonly name: string;
  getAllArticles(): Promise<Article[]>;
  getCategories(): Promise<Category[]>;
  getAuthors(): Promise<Author[]>;
  getPage(slug: string): Promise<StaticPage | null>;
}
