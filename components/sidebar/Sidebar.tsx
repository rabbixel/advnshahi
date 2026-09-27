import Link from "next/link";
import type { Category } from "@/types/content";
import { getActiveCategories, getEssentialArticles, getLatestArticles } from "@/lib/content";
import { articlePath, categoryPath } from "@/lib/site";
import { formatShortDate } from "@/lib/format";
import { SearchForm } from "@/components/ui/SearchForm";
import { ArticleCard } from "@/components/cards/ArticleCard";

function Module({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t-2 border-ink pt-4">
      <h2 className="kicker font-sans text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

interface Props {
  /** Slug of the current article, excluded from lists. */
  currentSlug?: string;
  /** Topic hubs connected to the current article. */
  relatedCategories?: Category[];
}

/** Editorial sidebar for article pages: search, essential reading, latest, topics. No advertising. */
export async function Sidebar({ currentSlug, relatedCategories = [] }: Props) {
  const exclude = currentSlug ? [currentSlug] : [];
  const [essential, latest, categories] = await Promise.all([
    getEssentialArticles(4, exclude),
    getLatestArticles(5, exclude),
    getActiveCategories(),
  ]);

  return (
    <div className="space-y-12">
      <Module title="Search">
        <SearchForm id="sidebar-search" />
      </Module>

      <Module title="Essential reading">
        <ol className="space-y-6">
          {essential.map((a, i) => (
            <li key={a.slug}>
              <ArticleCard article={a} variant="compact" index={i + 1} />
            </li>
          ))}
        </ol>
      </Module>

      <Module title="Latest articles">
        <ul className="divide-y divide-line">
          {latest.map((a) => (
            <li key={a.slug} className="py-3 first:pt-0">
              <Link href={articlePath(a.slug)} className="group block">
                <span className="block font-display text-[1.05rem] font-semibold leading-snug text-ink group-hover:text-saffron">
                  {a.title}
                </span>
                <time dateTime={a.publishedAt} className="mt-1 block text-[0.78rem] text-muted">
                  {formatShortDate(a.publishedAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </Module>

      <Module title="Topics">
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={categoryPath(c.slug)} className="flex items-center justify-between rounded-md py-1.5 text-[0.95rem] text-ink-2 hover:text-saffron">
                <span>{c.name}</span>
                <span className="text-[0.78rem] tabular-nums text-muted">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Module>

      {relatedCategories.length > 0 && (
        <Module title="Related topics">
          <ul className="space-y-4">
            {relatedCategories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryPath(c.slug)} className="group block rounded-lg border border-line bg-white p-4 hover:border-saffron">
                  <span className="block font-display text-[1.1rem] font-semibold text-ink group-hover:text-saffron">{c.name}</span>
                  <span className="mt-1 block text-[0.85rem] leading-snug text-muted">{c.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Module>
      )}
    </div>
  );
}
