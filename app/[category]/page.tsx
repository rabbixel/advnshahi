import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveCategories, getArticlesByCategory, getCategoryBySlug } from "@/lib/content";
import { categoryPath } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, type Crumb } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Categories with published articles are pre-rendered. Other paths render on
 * demand: unknown slugs 404 via notFound(), and a known category that has no
 * articles yet (e.g. after a CMS change) shows a noindexed empty state.
 */
export async function generateStaticParams() {
  return (await getActiveCategories()).map((c) => ({ category: c.slug }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Topic not found", robots: { index: false } };
  const articles = await getArticlesByCategory(slug);
  return buildMetadata({
    title: category.seoTitle,
    description: category.seoDescription,
    path: categoryPath(category.slug),
    image: articles[0]?.featuredImage,
    noindex: articles.length === 0,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [articles, allCategories] = await Promise.all([getArticlesByCategory(slug), getActiveCategories()]);
  const primary = articles.filter((a) => a.category.slug === slug);
  const alsoRelevant = articles.filter((a) => a.category.slug !== slug);
  const [lead, ...rest] = primary.length > 0 ? primary : alsoRelevant;
  const remainingAlso = primary.length > 0 ? alsoRelevant : [];
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: category.name, path: categoryPath(category.slug) },
  ];

  return (
    <>
      <JsonLd data={[collectionPageJsonLd(category, articles.map((a) => a.slug)), breadcrumbJsonLd(crumbs)]} />
      <div className="border-b border-line bg-paper-2">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="kicker text-saffron">Topic</p>
              <h1 className="mt-2 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[3.4rem]">{category.name}</h1>
              <p className="mt-4 font-display text-[1.2rem] leading-snug text-ink-2">{category.tagline}</p>
              <p className="mt-4 text-[0.88rem] text-muted">
                {articles.length} {articles.length === 1 ? "article" : "articles"}
              </p>
            </div>
            <div className="space-y-4 text-[1.02rem] leading-relaxed text-ink-2 lg:col-span-7 lg:pt-8">
              {category.intro.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-12 sm:py-16">
        {!lead ? (
          <EmptyState
            title="No articles in this topic yet"
            description="We are still writing for this section. In the meantime, explore our other topics or search the site."
          />
        ) : (
          <>
            <section aria-labelledby="start-here">
              <h2 id="start-here" className="sr-only">Start here</h2>
              <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
                <ArticleCard article={lead} variant="lead" priority headingLevel="h3" className="lg:col-span-7" />
                {rest.length > 0 && (
                  <ul className="space-y-8 lg:col-span-5 lg:border-l lg:border-line lg:pl-10">
                    {rest.map((a) => (
                      <li key={a.slug} className="border-b border-line pb-8 last:border-b-0 last:pb-0">
                        <ArticleCard article={a} variant="horizontal" showExcerpt />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {remainingAlso.length > 0 && (
              <section aria-labelledby="also-relevant" className="mt-20">
                <SectionHeading id="also-relevant" kicker="From other sections" title={`Also relevant to ${category.name}`} />
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {remainingAlso.map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="standard" />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section aria-labelledby="other-topics" className="mt-20">
          <SectionHeading id="other-topics" kicker="Keep exploring" title="Other topics" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allCategories
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <li key={c.slug}>
                  <Link href={categoryPath(c.slug)} className="group block h-full rounded-xl border border-line bg-white p-5 transition-colors hover:border-saffron">
                    <span className="block font-display text-[1.2rem] font-semibold text-ink group-hover:text-saffron">{c.name}</span>
                    <span className="mt-1.5 block text-[0.88rem] leading-snug text-muted">{c.tagline}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </>
  );
}
