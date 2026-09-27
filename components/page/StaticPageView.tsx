import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Prose } from "@/components/article/Prose";
import { JsonLd } from "@/components/seo/JsonLd";

export async function staticPageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug);
  if (!page) return { title: "Page not found", robots: { index: false } };
  return buildMetadata({ title: page.title, description: page.description, path: `/${slug}` });
}

/** Shared layout for trust pages (About, Privacy, Terms, Disclaimer, Contact). */
export async function StaticPageView({ slug, aside }: { slug: string; aside?: React.ReactNode }) {
  const page = await getPage(slug);
  if (!page) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: page.title, path: `/${slug}` },
  ];

  return (
    <div className="container-page pt-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="mt-8 grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <h1 className="text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[3rem]">{page.title}</h1>
          <p className="mt-4 font-display text-[1.15rem] leading-relaxed text-ink-2">{page.description}</p>
          <p className="mt-4 text-[0.85rem] text-muted">
            Last updated <time dateTime={page.updatedAt}>{formatDate(page.updatedAt)}</time>
          </p>
          {page.toc.filter((t) => t.level === 2).length > 2 && (
            <nav aria-label="On this page" className="mt-8 hidden border-t border-line pt-5 lg:block">
              <p className="kicker text-ink">On this page</p>
              <ul className="mt-3 space-y-2 text-[0.92rem]">
                {page.toc
                  .filter((t) => t.level === 2)
                  .map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-ink-2 hover:text-saffron hover:underline">
                        {t.text}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>
          )}
        </header>
        <div className="min-w-0 lg:col-span-8">
          {aside}
          <Prose html={page.content} className="max-w-(--container-prose) [&>h2:first-child]:mt-0 [&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0" />
        </div>
      </div>
    </div>
  );
}
