import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from "@/lib/content";
import { absoluteUrl, articlePath, categoryPath } from "@/lib/site";
import { articleJsonLd, articleMetadata, breadcrumbJsonLd, faqJsonLd, type Crumb } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ClockIcon } from "@/components/ui/Icons";
import { AdSlot } from "@/components/ui/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Prose } from "@/components/article/Prose";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ShareButtons } from "@/components/article/ShareButtons";
import { FaqSection } from "@/components/article/FaqSection";
import { EditorialNote } from "@/components/article/EditorialNote";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { Sidebar } from "@/components/sidebar/Sidebar";

// Known articles are pre-rendered; unknown slugs render on demand and 404 via notFound().
// This also lets a future CMS source publish new articles without a full rebuild.

export async function generateStaticParams() {
  return (await getArticleSlugs()).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };
  return articleMetadata(article);
}

/** Splits article HTML before the nth H2 so a mid-article slot can be placed between sections. */
function splitBeforeHeading(html: string, n: number): [string, string] {
  let index = -1;
  let from = 0;
  for (let i = 0; i < n; i++) {
    index = html.indexOf("<h2", from);
    if (index === -1) return [html, ""];
    from = index + 3;
  }
  return [html.slice(0, index), html.slice(index)];
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article, 3);
  const url = absoluteUrl(articlePath(article.slug));
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: article.category.name, path: categoryPath(article.category.slug) },
    { name: article.title, path: articlePath(article.slug) },
  ];
  const [firstPart, secondPart] = splitBeforeHeading(article.content, 4);
  const jsonLd: object[] = [articleJsonLd(article), breadcrumbJsonLd(crumbs)];
  if (article.faq.length > 0) jsonLd.push(faqJsonLd(article.faq));

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container-page pt-6 sm:pt-8">
        <Breadcrumbs crumbs={crumbs} />

        <div className="mt-8 grid gap-x-14 gap-y-16 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
          <article className="min-w-0">
            <header>
              <CategoryLabel category={article.category} />
              <h1 className="mt-3 text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[2.9rem] lg:text-[3.2rem]">
                {article.title}
              </h1>
              <p className="mt-5 max-w-3xl font-display text-[1.2rem] leading-relaxed text-ink-2 sm:text-[1.35rem]">
                {article.excerpt}
              </p>

              <div className="mt-7 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[0.85rem] text-muted">
                  <p>
                    By{" "}
                    <Link href="/about" className="font-semibold text-ink hover:text-saffron">
                      {article.author.name}
                    </Link>
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    </span>
                    {article.updatedAt !== article.publishedAt && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>
                          Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                        </span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon /> {article.readingTime} min read
                    </span>
                  </p>
                </div>
                <ShareButtons url={url} title={article.title} />
              </div>
            </header>

            <figure className="mt-8">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-paper-3">
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 860px, (min-width: 1024px) 65vw, 100vw"
                  className="object-cover"
                />
              </div>
              {(article.featuredImage.caption || article.featuredImage.credit) && (
                <figcaption className="mt-3 flex flex-col gap-0.5 text-[0.84rem] leading-relaxed text-muted sm:flex-row sm:justify-between sm:gap-6">
                  {article.featuredImage.caption && <span>{article.featuredImage.caption}</span>}
                  {article.featuredImage.credit && <span className="shrink-0 italic">{article.featuredImage.credit}</span>}
                </figcaption>
              )}
            </figure>

            <AdSlot position="article-top" />

            <div className="mx-auto mt-10 max-w-(--container-prose)">
              <TableOfContents toc={article.toc} />
              <Prose html={firstPart} className="mt-8" />
              {secondPart && (
                <>
                  <AdSlot position="article-mid" />
                  <Prose html={secondPart} />
                </>
              )}

              <FaqSection faq={article.faq} />

              {article.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap items-center gap-2">
                  <span className="kicker mr-1 text-muted">Topics</span>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      prefetch={false}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-[0.82rem] text-ink-2 hover:border-saffron hover:text-saffron"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <ShareButtons url={url} title={article.title} className="mt-8 border-t border-line pt-6" />
              <EditorialNote author={article.author} publishedAt={article.publishedAt} updatedAt={article.updatedAt} />
              <AdSlot position="article-bottom" />
            </div>
          </article>

          <aside aria-label="Sidebar" className="min-w-0">
            <Sidebar currentSlug={article.slug} relatedCategories={[article.category, ...article.secondaryCategories]} />
          </aside>
        </div>

        <RelatedArticles articles={related} />
      </div>
    </>
  );
}
