import type { Metadata } from "next";
import Link from "next/link";
import { getActiveCategories, getEssentialArticles, searchArticles } from "@/lib/content";
import { articlePath, categoryPath } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { SearchForm } from "@/components/ui/SearchForm";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ArticleMeta } from "@/components/ui/ArticleMeta";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArticleCard } from "@/components/cards/ArticleCard";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim();
  return buildMetadata({
    title: query ? `Search results for “${query}”` : "Search",
    description: "Search NanakShahi articles on the Nanakshahi calendar, Gurpurab, Hukamnama, Harmandir Sahib and Sikh festivals.",
    path: "/search",
    // Internal search result pages should not be indexed.
    noindex: true,
  });
}

const suggestions = ["Hukamnama", "Bandi Chhor Divas", "Guru Nanak Jayanti", "Nanakshahi months", "Golden Temple", "Sangrand"];

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = ((Array.isArray(q) ? q[0] : q) ?? "").trim().slice(0, 120);
  const results = query ? await searchArticles(query) : [];
  const [categories, essentials] = await Promise.all([getActiveCategories(), query && results.length === 0 ? getEssentialArticles(3) : Promise.resolve([])]);

  return (
    <div className="container-page pt-10 sm:pt-14">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-[2.3rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[3rem]">
          {query ? "Search results" : "Search NanakShahi"}
        </h1>
        <SearchForm size="lg" id="search-page-q" defaultValue={query} autoFocus={!query} className="mt-7" />
        <p className="mt-4 text-[0.9rem] text-muted" aria-live="polite">
          {query
            ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`
            : "Search across article titles, summaries, topics and full text."}
        </p>
        {!query && (
          <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Suggested searches">
            {suggestions.map((s) => (
              <li key={s}>
                <Link href={`/search?q=${encodeURIComponent(s)}`} prefetch={false} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.85rem] text-ink-2 hover:border-saffron hover:text-saffron">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="mx-auto mt-12 max-w-3xl">
        {query && results.length > 0 && (
          <ol className="divide-y divide-line border-y border-line">
            {results.map(({ article, snippet }) => (
              <li key={article.slug} className="group relative py-7">
                <CategoryLabel category={article.category} />
                <h2 className="mt-2 text-[1.45rem] font-semibold leading-snug">
                  <Link href={articlePath(article.slug)} className="after:absolute after:inset-0 group-hover:text-saffron">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-2">{snippet}</p>
                <ArticleMeta publishedAt={article.publishedAt} readingTime={article.readingTime} className="mt-3" />
              </li>
            ))}
          </ol>
        )}

        {query && results.length === 0 && (
          <>
            <EmptyState
              title="No articles matched your search"
              description={`We couldn't find anything for “${query}”. Try a shorter phrase, a different spelling (for example "Chhor" or "Chhorh"), or browse by topic below.`}
            >
              <ul className="mt-6 flex flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={categoryPath(c.slug)} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.85rem] text-ink-2 hover:border-saffron hover:text-saffron">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </EmptyState>
            {essentials.length > 0 && (
              <section aria-labelledby="try-these" className="mt-16">
                <h2 id="try-these" className="kicker font-sans text-ink">You might be looking for</h2>
                <div className="mt-6 grid gap-8 sm:grid-cols-3">
                  {essentials.map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="standard" showExcerpt={false} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!query && (
          <section aria-labelledby="browse-topics">
            <h2 id="browse-topics" className="kicker font-sans text-ink">Browse by topic</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryPath(c.slug)} className="group block h-full rounded-xl border border-line bg-white p-5 hover:border-saffron">
                    <span className="block font-display text-[1.2rem] font-semibold text-ink group-hover:text-saffron">{c.name}</span>
                    <span className="mt-1 block text-[0.88rem] text-muted">{c.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
