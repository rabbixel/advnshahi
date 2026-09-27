import type { Metadata } from "next";
import Link from "next/link";
import {
  getActiveCategories,
  getArticlesByCategory,
  getEssentialArticles,
  getFeaturedArticles,
  getLatestArticles,
} from "@/lib/content";
import { nanakshahiYearFor } from "@/content/calendar";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { articlePath, categoryPath, siteConfig } from "@/lib/site";
import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CalendarAtAGlance } from "@/components/home/CalendarAtAGlance";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/ui/AdSlot";
import { ArrowRightIcon } from "@/components/ui/Icons";

// Rebuild daily so date-aware details (such as the current Nanakshahi year) stay correct.
export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "NanakShahi: Nanakshahi Calendar, Gurpurab, Hukamnama & Sikh Heritage",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

/**
 * Picks articles for a section, preferring ones not already shown higher on the page.
 * With `fill`, a section that would otherwise look sparse is topped up with
 * already-shown articles from its own pool (never duplicates within the section).
 */
/**
 * Picks up to `count` articles from `pool`, skipping any already shown on the
 * page. With `fill`, a short section is topped up with already-shown articles,
 * preferring ones that are not in the section directly above (`neighbour`) so
 * the same story never appears twice in a row.
 */
function pick(
  pool: ArticleSummary[],
  used: Set<string>,
  count: number,
  fill = false,
  neighbour: ArticleSummary[] = [],
): ArticleSummary[] {
  const chosen: ArticleSummary[] = [];
  const inSection = new Set<string>();
  const adjacent = new Set(neighbour.map((a) => a.slug));
  const take = (accept: (a: ArticleSummary) => boolean) => {
    for (const article of pool) {
      if (chosen.length === count) return;
      if (inSection.has(article.slug) || !accept(article)) continue;
      inSection.add(article.slug);
      chosen.push(article);
    }
  };
  take((a) => !used.has(a.slug));
  if (fill) {
    take((a) => !adjacent.has(a.slug));
    take(() => true);
  }
  inSection.forEach((slug) => used.add(slug));
  return chosen;
}

export default async function HomePage() {
  const [featured, latestAll, calendar, gurpurab, guruNanak, hukamnama, harmandir, festivals, history, culture, essentials, categories] =
    await Promise.all([
      getFeaturedArticles(6),
      getLatestArticles(20),
      getArticlesByCategory("nanakshahi-calendar"),
      getArticlesByCategory("gurpurab"),
      getArticlesByCategory("guru-nanak-dev-ji"),
      getArticlesByCategory("hukamnama"),
      getArticlesByCategory("harmandir-sahib"),
      getArticlesByCategory("sikh-festivals"),
      getArticlesByCategory("sikh-history"),
      getArticlesByCategory("sikh-culture"),
      getEssentialArticles(6),
      getActiveCategories(),
    ]);

  const used = new Set<string>();
  const [lead, ...heroList] = pick(featured, used, 5);
  const latest = pick(latestAll, used, 4);
  // Primary-topic calendar articles first, then ones filed there as a secondary topic.
  const calendarPicks = pick(
    [...calendar.filter((a) => a.category.slug === "nanakshahi-calendar"), ...calendar],
    used,
    3,
    true,
    latest,
  );
  const gurpurabPicks = pick([...gurpurab, ...guruNanak], used, 4, true, calendarPicks);
  const hukamnamaPicks = hukamnama.filter((a) => a.category.slug === "hukamnama").slice(0, 4);
  hukamnamaPicks.forEach((a) => used.add(a.slug));
  const harmandirPicks = pick(harmandir, used, 4, true, hukamnamaPicks);
  const festivalPicks = pick(festivals, used, 3, true, harmandirPicks);
  const historyPicks = pick([...history, ...culture], used, 4, true, festivalPicks);
  const nsYear = nanakshahiYearFor(new Date());

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />

      {/* Intro + featured story */}
      <section aria-labelledby="home-title" className="container-page pt-8 sm:pt-10">
        <div className="flex flex-col gap-3 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h1 id="home-title" className="max-w-3xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.6rem]">
            The Nanakshahi calendar, Gurpurab and Sikh heritage, <span className="italic text-saffron">explained with care.</span>
          </h1>
          <p className="max-w-md text-[0.98rem] leading-relaxed text-muted">
            Clear, carefully researched guides to Sikh dates and festivals, Guru Nanak Dev Ji, Sri Harmandir Sahib
            and the daily Hukamnama, for families, students and curious readers.
          </p>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-12 lg:grid-cols-12">
          {lead && <ArticleCard article={lead} variant="lead" priority headingLevel="h2" className="lg:col-span-8" />}
          <aside aria-labelledby="featured-guides" className="lg:col-span-4 lg:border-l lg:border-line lg:pl-10">
            <h2 id="featured-guides" className="kicker flex items-center gap-2 font-sans text-ink">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-saffron-bright" /> Featured guides
            </h2>
            <ol className="mt-5 divide-y divide-line">
              {heroList.map((a, i) => (
                <li key={a.slug} className="py-5 first:pt-0">
                  <ArticleCard article={a} variant="compact" index={i + 1} />
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* Latest */}
      <section aria-labelledby="latest" className="container-page mt-20">
        <SectionHeading id="latest" kicker="Just published" title="Latest articles" href="/articles" linkLabel="All articles" />
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="standard" />
          ))}
        </div>
      </section>

      {/* Nanakshahi Calendar */}
      <section aria-labelledby="calendar" className="mt-20 border-y border-line bg-paper-2 py-16">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <p className="kicker text-saffron">Nanakshahi Calendar</p>
              <h2 id="calendar" className="mt-2 text-[2rem] font-semibold leading-tight tracking-[-0.01em] sm:text-[2.4rem]">
                Twelve months, counted from 1469
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-2">
                The Nanakshahi calendar numbers its years from the birth of Guru Nanak Dev Ji and keeps the Punjabi
                month names, from Chet in spring to Phagun in late winter. Its year begins on 1 Chet, 14 March in the
                original version.
              </p>
              <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-[0.95rem] text-ink-2">
                The current Nanakshahi year is <strong className="font-semibold text-ink">{nsYear}</strong>.
              </p>
              <ul className="mt-7 space-y-5">
                {calendarPicks.map((a) => (
                  <li key={a.slug}>
                    <ArticleCard article={a} variant="horizontal" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <CalendarAtAGlance />
              <p className="mt-4 text-[0.9rem] text-muted">
                Why do some gurdwaras mark the same Gurpurab on different days?{" "}
                <Link href={articlePath("punjabi-calendar-nanakshahi-bikrami-gregorian")} className="font-medium text-saffron underline underline-offset-4">
                  Read our explainer on the Nanakshahi, Bikrami and Gregorian calendars
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gurpurab */}
      {gurpurabPicks.length > 0 && (
        <section aria-labelledby="gurpurab" className="container-page mt-20">
          <SectionHeading
            id="gurpurab"
            kicker="Gurpurab"
            title="Gurpurab and Guru Nanak Dev Ji"
            description="The days on which Sikhs remember the lives of the Gurus, and the life of the first Guru."
            href={categoryPath("gurpurab")}
            linkLabel="All Gurpurab articles"
          />
          <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12">
            <ArticleCard article={gurpurabPicks[0]} variant="standard" className="lg:col-span-5" />
            <ul className="space-y-7 lg:col-span-7">
              {gurpurabPicks.slice(1).map((a) => (
                <li key={a.slug} className="border-b border-line pb-7 last:border-0 last:pb-0">
                  <ArticleCard article={a} variant="horizontal" showExcerpt />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="container-page">
        <AdSlot position="home-mid" />
      </div>

      {/* Hukamnama */}
      <section aria-labelledby="hukamnama" className="mt-20 bg-indigo py-16 text-paper">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-saffron-soft">Hukamnama &amp; Mukhwak</p>
            <h2 id="hukamnama" className="mt-2 text-[2rem] font-semibold leading-tight text-paper sm:text-[2.4rem]">
              The daily Hukamnama from Sri Darbar Sahib
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-paper/80">
              Every morning a shabad is read from Sri Guru Granth Sahib Ji at Sri Harmandir Sahib, and Sikhs around
              the world take it as guidance for the day. Our guides explain what the Hukamnama is, how it is taken
              and how to read it with understanding.
            </p>
            <div className="mt-7 rounded-xl border border-paper/15 bg-paper/5 p-5">
              <p className="text-[0.95rem] leading-relaxed text-paper/85">
                Looking for today&apos;s Hukamnama? We point you to the official publication rather than reproducing
                unverified text.
              </p>
              <Link
                href="/hukamnama-today"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-saffron-bright px-5 py-2.5 text-[0.92rem] font-semibold text-ink transition-colors hover:bg-paper"
              >
                Where to find today&apos;s Hukamnama <ArrowRightIcon />
              </Link>
            </div>
          </div>
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-7">
            {hukamnamaPicks.map((a) => (
              <div key={a.slug} className="border-t border-paper/20 pt-5">
                <ArticleCard article={a} variant="compact" showExcerpt inverted />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Harmandir Sahib */}
      {harmandirPicks.length > 0 && (
        <section aria-labelledby="harmandir" className="container-page mt-20">
          <SectionHeading
            id="harmandir"
            kicker="Harmandir Sahib"
            title="The Golden Temple, Amritsar"
            description="History, architecture, daily worship and a respectful guide for visitors."
            href={categoryPath("harmandir-sahib")}
            linkLabel="Explore Harmandir Sahib"
          />
          <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12">
            <ArticleCard article={harmandirPicks[0]} variant="overlay" className="lg:col-span-7" />
            <ul className="space-y-7 lg:col-span-5">
              {harmandirPicks.slice(1).map((a) => (
                <li key={a.slug} className="border-b border-line pb-7 last:border-0 last:pb-0">
                  <ArticleCard article={a} variant="horizontal" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Sikh festivals */}
      {festivalPicks.length > 0 && (
        <section aria-labelledby="festivals" className="container-page mt-20">
          <SectionHeading
            id="festivals"
            kicker="Sikh festivals"
            title="Bandi Chhor Divas and the Sikh year"
            href={categoryPath("sikh-festivals")}
            linkLabel="All festival guides"
          />
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {festivalPicks.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* Sikh history & culture */}
      {historyPicks.length > 0 && (
        <section aria-labelledby="history" className="container-page mt-20">
          <SectionHeading
            id="history"
            kicker="Sikh history & culture"
            title="Places, people and living traditions"
            href={categoryPath("sikh-history")}
            linkLabel="Sikh history"
          />
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {historyPicks.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="horizontal" showExcerpt className="border-b border-line pb-8" />
            ))}
          </div>
        </section>
      )}

      {/* Essential reading */}
      <section aria-labelledby="essential" className="container-page mt-20">
        <SectionHeading
          id="essential"
          kicker="Start here"
          title="Essential reading"
          description="The guides our editors recommend first if you are new to the subject."
        />
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {essentials.map((a, i) => (
            <li key={a.slug} className="border-t border-line py-6">
              <ArticleCard article={a} variant="compact" index={i + 1} />
            </li>
          ))}
        </ol>
      </section>

      {/* Topics + corrections CTA */}
      <section aria-labelledby="explore" className="container-page mt-20">
        <div className="grid overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-12">
          <div className="p-7 sm:p-10 lg:col-span-7">
            <h2 id="explore" className="text-[1.8rem] font-semibold leading-tight">Explore by topic</h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryPath(c.slug)}
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.92rem] text-ink-2 transition-colors hover:border-saffron hover:text-saffron"
                  >
                    {c.name}
                    <span className="text-[0.75rem] text-muted tabular-nums">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line bg-saffron-soft/60 p-7 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0">
            <p className="kicker text-saffron">Help us get it right</p>
            <p className="mt-3 font-display text-[1.35rem] font-semibold leading-snug text-ink">
              Know a tradition we should include, or spotted an error?
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
              Sikh practice varies between families, gurdwaras and regions. We welcome corrections and suggestions
              from readers, and we update articles when they help us improve.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-ink px-5 py-2.5 text-[0.9rem] font-semibold text-paper hover:bg-saffron">
                Contact the editors
              </Link>
              <Link href="/about#editorial-standards" className="rounded-full border border-ink/25 px-5 py-2.5 text-[0.9rem] font-semibold text-ink hover:border-ink">
                Our editorial standards
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
