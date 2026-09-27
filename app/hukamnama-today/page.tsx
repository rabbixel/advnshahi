import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesByCategory } from "@/lib/content";
import { getTodayHukamnama, officialHukamnamaSources } from "@/lib/hukamnama";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { articlePath } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HukamnamaCard } from "@/components/hukamnama/HukamnamaCard";
import { HukamnamaUnavailable } from "@/components/hukamnama/HukamnamaUnavailable";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Re-check the backend every 15 minutes once a live source is configured.
export const revalidate = 900;

export const metadata: Metadata = buildMetadata({
  title: "Hukamnama Today from Sri Harmandir Sahib: Where to Read It",
  description:
    "Where to find today's Hukamnama from Sri Darbar Sahib, Amritsar, from official sources, and how to read and understand the daily Mukhwak. No generated or unverified text.",
  path: "/hukamnama-today",
});

const plannedFields = [
  ["Date and source", "The Amritsar date of issue and a link to the original publication."],
  ["Gurmukhi text", "The shabad exactly as published, never retyped from memory or generated."],
  ["Punjabi explanation", "The viakhya published alongside the Hukamnama, where available."],
  ["English translation", "Always credited to its translator, so readers know whose interpretation it is."],
  ["Raag and Ang", "Where the shabad sits in Sri Guru Granth Sahib Ji, for readers who want to look it up."],
  ["Audio", "A recording of the reading, where the source provides one."],
];

export default async function HukamnamaTodayPage() {
  const [entry, articles] = await Promise.all([getTodayHukamnama(), getArticlesByCategory("hukamnama")]);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Hukamnama", path: "/hukamnama" },
    { name: "Hukamnama today", path: "/hukamnama-today" },
  ];
  const guides = articles.filter((a) => a.category.slug === "hukamnama");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="container-page pt-8">
        <Breadcrumbs crumbs={crumbs} />

        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <header className="lg:col-span-5">
            <p className="kicker text-saffron">{entry ? "Daily Hukamnama" : "Informational page · live service in development"}</p>
            <h1 className="mt-3 text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[3rem]">
              Hukamnama today from Sri Harmandir Sahib
            </h1>
            <p className="mt-5 font-display text-[1.2rem] leading-relaxed text-ink-2">
              Each morning at Sri Harmandir Sahib in Amritsar, after Sri Guru Granth Sahib Ji is ceremonially
              opened, a shabad is read aloud. This is the day&apos;s Hukamnama, also called the Mukhwak. Sikhs around
              the world read or listen to it as guidance for the day.
            </p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-2">
              This page is built to carry the daily Hukamnama from a verified source. Until that feed is live, it
              tells you exactly where the official text is published and how to read it with understanding.
            </p>
            <nav aria-label="Hukamnama guides" className="mt-8 rounded-xl border border-line bg-paper-2 p-5">
              <p className="kicker text-ink">New to the Hukamnama?</p>
              <ul className="mt-3 space-y-2 text-[0.95rem]">
                {guides.map((a) => (
                  <li key={a.slug}>
                    <Link href={articlePath(a.slug)} className="text-saffron underline decoration-saffron/40 underline-offset-4 hover:decoration-saffron">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <div className="lg:col-span-7">
            {entry ? <HukamnamaCard entry={entry} /> : <HukamnamaUnavailable sources={officialHukamnamaSources} />}
          </div>
        </div>

        <section aria-labelledby="how-read" className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="how-read" kicker="Reading guide" title="How to read the daily Hukamnama" />
          </div>
          <div className="space-y-5 font-display text-[1.12rem] leading-relaxed text-ink-2 lg:col-span-7">
            <p>
              The Hukamnama published from Sri Darbar Sahib usually appears with a heading that names the raag
              (the musical measure in which the shabad is written) and the Guru who composed it, given as
              &ldquo;Mahalla&rdquo; followed by a number. Mahalla 1 refers to Guru Nanak Dev Ji, Mahalla 5 to Guru
              Arjan Dev Ji, and so on. The page number, or Ang, tells you where the shabad appears in the 1,430-Ang
              standard printing of Sri Guru Granth Sahib Ji.
            </p>
            <p>
              Many shabads contain a line marked &ldquo;Rahao&rdquo;, meaning &ldquo;pause&rdquo;. It is widely
              understood as the central idea of the shabad, so reading it first and then the verses around it is a
              helpful way in. If you rely on a translation, remember that every translation is an interpretation;
              comparing the Punjabi explanation published with the Hukamnama and one or two English translations
              gives a fuller picture.
            </p>
            <p>
              <Link href={articlePath("hukamnama-today-golden-temple-how-to-read")} className="text-saffron underline underline-offset-4">
                Read our full step-by-step guide to reading the daily Hukamnama
              </Link>
              .
            </p>
          </div>
        </section>

        {!entry && (
          <section aria-labelledby="planned" className="mt-20">
            <SectionHeading
              id="planned"
              kicker="Coming to this page"
              title="What the live Hukamnama service will include"
              description="When a verified feed is connected, each day's entry will show the following, with the source credited."
            />
            <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {plannedFields.map(([term, desc]) => (
                <div key={term} className="bg-white p-5">
                  <dt className="font-display text-[1.1rem] font-semibold text-ink">{term}</dt>
                  <dd className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{desc}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section aria-labelledby="hk-articles" className="mt-20">
          <SectionHeading id="hk-articles" kicker="Hukamnama" title="Understand the tradition" href="/hukamnama" linkLabel="All Hukamnama articles" />
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" showExcerpt={false} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
