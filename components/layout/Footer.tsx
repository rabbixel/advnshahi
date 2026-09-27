import Link from "next/link";
import { legalNav, primaryNav } from "@/content/navigation";
import { getActiveCategories } from "@/lib/content";
import { categoryPath, siteConfig } from "@/lib/site";
import { Logo } from "./Logo";

export async function Footer() {
  const categories = await getActiveCategories();
  const year = new Date().getFullYear();

  const readingLinks = primaryNav
    .flatMap((g) => g.children ?? [])
    .filter((l) => l.href.startsWith("/articles/") || l.href === "/hukamnama-today")
    .slice(0, 8);

  return (
    <footer className="mt-24 bg-indigo text-paper/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo inverted withGurmukhi />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed">
            An independent publication explaining the Nanakshahi and Punjabi calendars, Gurpurab, Sikh
            festivals, Guru Nanak Dev Ji, Sri Harmandir Sahib and the daily Hukamnama tradition, in clear
            English and with respect.
          </p>
          <p className="mt-4 max-w-sm text-[0.85rem] leading-relaxed text-paper/60">
            NanakShahi is not affiliated with the SGPC, Sri Akal Takht Sahib or any gurdwara management. For
            religious rulings and official dates, please consult those institutions directly.
          </p>
        </div>

        <nav aria-label="Topics" className="lg:col-span-2">
          <h2 className="kicker font-sans text-paper">Topics</h2>
          <ul className="mt-4 space-y-2.5 text-[0.92rem]">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryPath(c.slug)} className="hover:text-paper">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Popular guides" className="lg:col-span-3">
          <h2 className="kicker font-sans text-paper">Guides</h2>
          <ul className="mt-4 space-y-2.5 text-[0.92rem]">
            {readingLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="About NanakShahi" className="lg:col-span-3">
          <h2 className="kicker font-sans text-paper">NanakShahi</h2>
          <ul className="mt-4 space-y-2.5 text-[0.92rem]">
            <li><Link href="/about" className="hover:text-paper">About us</Link></li>
            <li><Link href="/contact" className="hover:text-paper">Contact &amp; corrections</Link></li>
            <li><Link href="/articles" className="hover:text-paper">All articles</Link></li>
            <li><Link href="/search" prefetch={false} className="hover:text-paper">Search</Link></li>
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-paper/15">
        <div className="container-page flex flex-col gap-2 py-6 text-[0.82rem] text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Write to us at{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-paper/85 underline underline-offset-4 hover:text-paper">
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
