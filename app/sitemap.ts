import type { MetadataRoute } from "next";
import { getActiveCategories, getArticles } from "@/lib/content";
import { absoluteUrl, articlePath, categoryPath } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([getArticles(), getActiveCategories()]);
  const latest = articles.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), "2026-09-01");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/articles"), lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/hukamnama-today"), lastModified: latest, changeFrequency: "daily", priority: 0.8 },
    ...["/about", "/contact", "/privacy-policy", "/terms-and-conditions", "/disclaimer"].map((path) => ({
      url: absoluteUrl(path),
      lastModified: "2026-09-27",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => {
    const inCat = articles.filter((a) => a.category.slug === c.slug || a.secondaryCategories.some((s) => s.slug === c.slug));
    return {
      url: absoluteUrl(categoryPath(c.slug)),
      lastModified: inCat.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), "2026-09-01"),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(articlePath(a.slug)),
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
    images: [absoluteUrl(a.featuredImage.src)],
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
