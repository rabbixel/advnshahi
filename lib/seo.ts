import type { Metadata } from "next";
import type { Article, Category, FaqItem } from "@/types/content";
import { absoluteUrl, articlePath, categoryPath, siteConfig } from "@/lib/site";

export const DEFAULT_OG_IMAGE = "/opengraph-image";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  type?: "website" | "article";
  noindex?: boolean;
  /** Use the title as-is instead of appending the site name. */
  absoluteTitle?: boolean;
}

/** Builds consistent metadata (canonical, Open Graph, X/Twitter, robots) for any page. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const images = image
    ? [{ url: absoluteUrl(image.src), alt: image.alt, width: image.width, height: image.height }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export function articleMetadata(article: Article): Metadata {
  const base = buildMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: articlePath(article.slug),
    image: article.featuredImage,
    type: "article",
  });
  return {
    ...base,
    // `article.keywords` is search-intent research for writers; it is deliberately not emitted.
    authors: [{ name: article.author.name, url: absoluteUrl("/about") }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category.name,
      authors: [article.author.name],
      tags: article.tags,
    },
  };
}

/* ---------- JSON-LD builders ---------- */

const organizationId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png"), width: 512, height: 512 },
    description: siteConfig.description,
    email: siteConfig.contactEmail,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: Article) {
  const url = absoluteUrl(articlePath(article.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.seoDescription,
    image: [absoluteUrl(article.featuredImage.src)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    wordCount: article.wordCount,
    articleSection: article.category.name,
    keywords: article.tags.join(", "),
    inLanguage: siteConfig.language,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: article.author.name, url: absoluteUrl("/about") },
    publisher: { "@id": organizationId, "@type": "Organization", name: siteConfig.name, logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
    isPartOf: { "@id": websiteId },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Only call when the page visibly renders these same questions and answers. */
export function faqJsonLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function collectionPageJsonLd(category: Category, articleSlugs: string[]) {
  const url = absoluteUrl(categoryPath(category.slug));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: category.name,
    description: category.seoDescription,
    url,
    isPartOf: { "@id": websiteId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articleSlugs.map((slug, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(articlePath(slug)),
      })),
    },
  };
}
