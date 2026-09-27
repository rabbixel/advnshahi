import type { Metadata } from "next";
import Link from "next/link";
import { getEssentialArticles } from "@/lib/content";
import { articlePath } from "@/lib/site";
import { SearchForm } from "@/components/ui/SearchForm";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const essentials = await getEssentialArticles(5);
  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="kicker text-saffron">Error 404</p>
        <h1 className="mt-3 text-[2.5rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[3.4rem]">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 font-display text-[1.2rem] leading-relaxed text-ink-2">
          The link may be out of date, or the page may have moved. Try searching, or start with one of the
          guides below.
        </p>
        <SearchForm size="lg" id="notfound-search" className="mt-8" />
      </div>
      <nav aria-label="Suggested articles" className="mx-auto mt-14 max-w-2xl">
        <h2 className="kicker font-sans text-ink">Popular starting points</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {essentials.map((a) => (
            <li key={a.slug}>
              <Link href={articlePath(a.slug)} className="group flex items-baseline justify-between gap-4 py-4">
                <span className="font-display text-[1.15rem] font-semibold text-ink group-hover:text-saffron">{a.title}</span>
                <span className="shrink-0 text-[0.78rem] text-muted">{a.category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-[0.9rem] font-semibold text-paper hover:bg-saffron">
            Back to the homepage
          </Link>
        </p>
      </nav>
    </div>
  );
}
