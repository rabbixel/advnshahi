import Link from "next/link";
import { primaryNav, trendingLinks, utilityNav } from "@/content/navigation";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchIcon, ChevronDownIcon } from "@/components/ui/Icons";

export function Header() {
  return (
    <header className="relative z-40">
      {/* Top strip */}
      <div className="hidden border-b border-line bg-paper-2 md:block">
        <div className="container-page flex h-9 items-center justify-between text-[0.8rem] text-muted">
          <p>An independent guide to the Nanakshahi calendar, Gurpurab and Sikh heritage</p>
          <nav aria-label="Utility">
            <ul className="flex items-center gap-5">
              {utilityNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Masthead + primary navigation */}
      <div className="border-b border-line bg-paper">
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1.5">
              {primaryNav.map((group) => (
                <li key={group.href} className="group relative">
                  <Link
                    href={group.href}
                    className="flex items-center gap-1 rounded-md px-2.5 py-2 text-[0.92rem] font-medium text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink xl:px-3"
                  >
                    {group.label}
                    {group.children && <ChevronDownIcon className="h-3.5 w-3.5 text-muted transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />}
                  </Link>
                  {group.children && (
                    <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="rounded-xl border border-line bg-white p-2 shadow-[0_18px_40px_-18px_rgba(23,23,27,0.35)]">
                        {group.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-paper-2 focus-visible:bg-paper-2"
                            >
                              <span className="block text-[0.92rem] font-medium text-ink">{child.label}</span>
                              {child.description && (
                                <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted">
                                  {child.description}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/search"
              prefetch={false}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
              aria-label="Search NanakShahi"
            >
              <SearchIcon className="h-5 w-5" />
            </Link>
            <MobileMenu />
          </div>
        </div>
      </div>

      {/* Explore strip */}
      <div className="border-b border-line bg-paper">
        <div className="container-page flex h-11 items-center gap-4 overflow-hidden">
          <span className="kicker shrink-0 text-saffron">Explore</span>
          <ul className="no-scrollbar flex min-w-0 items-center gap-5 overflow-x-auto text-[0.85rem] text-ink-2 [scrollbar-width:none]">
            {trendingLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link href={link.href} className="hover:text-saffron">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
