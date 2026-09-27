import type { Metadata } from "next";
import { getActiveCategories, getArticlesByCategory } from "@/lib/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { categoryPath } from "@/lib/site";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "All Articles: Sikh Calendar, Gurpurab, Hukamnama & Heritage",
  description:
    "Every NanakShahi article in one place, arranged by topic: the Nanakshahi calendar, Gurpurab, Guru Nanak Dev Ji, Hukamnama, Harmandir Sahib, Sikh festivals and history.",
  path: "/articles",
});

export default async function ArticlesIndexPage() {
  const categories = await getActiveCategories();
  const sections = await Promise.all(
    categories.map(async (c) => ({
      category: c,
      articles: (await getArticlesByCategory(c.slug)).filter((a) => a.category.slug === c.slug),
    })),
  );
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "All articles", path: "/articles" },
  ];

  return (
    <div className="container-page pt-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-[2.4rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[3.2rem]">All articles</h1>
        <p className="mt-4 font-display text-[1.2rem] leading-relaxed text-ink-2">
          Our complete library of explanatory articles, grouped by topic. Each one is written to answer a real
          question clearly, from how the Nanakshahi months work to what happens at Sri Harmandir Sahib each morning.
        </p>
      </header>

      {sections
        .filter((s) => s.articles.length > 0)
        .map(({ category, articles }) => (
          <section key={category.slug} aria-labelledby={`sec-${category.slug}`} className="mt-16">
            <SectionHeading
              id={`sec-${category.slug}`}
              title={category.name}
              description={category.tagline}
              href={categoryPath(category.slug)}
              linkLabel={`${category.name} overview`}
            />
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="standard" />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
