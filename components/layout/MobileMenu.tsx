"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { primaryNav, utilityNav } from "@/content/navigation";
import { ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";

/**
 * Accessible mobile navigation drawer.
 * - toggle button exposes aria-expanded / aria-controls
 * - Escape closes and returns focus to the toggle
 * - page scroll is locked while open
 * - sub-menus use native <details> so they work with keyboard and screen readers
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("input, a, button")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      // Keep keyboard focus inside the open dialog.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>("a[href], button, input, summary"),
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function closeOnNavigate(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-2"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        onClick={closeOnNavigate}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-0 z-50 animate-fade-in overflow-y-auto overscroll-contain bg-paper"
      >
        <div className="container-page flex h-16 items-center justify-between border-b border-line">
          <span className="font-display text-2xl font-semibold text-ink">
            Nanak<span className="text-saffron-bright">Shahi</span>
          </span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-2"
            aria-label="Close menu"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile" className="container-page pb-16 pt-5">
          <form action="/search" method="get" role="search" className="relative mb-6">
            <label htmlFor={`${panelId}-q`} className="sr-only">
              Search articles
            </label>
            <input
              id={`${panelId}-q`}
              name="q"
              type="search"
              placeholder="Search articles"
              className="h-12 w-full rounded-full border border-line-strong bg-white pl-11 pr-4 text-base text-ink placeholder:text-muted focus:border-saffron focus:outline-none"
            />
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          </form>

          <ul className="divide-y divide-line border-y border-line">
            <li>
              <Link href="/" className="block py-4 font-display text-xl font-semibold text-ink">
                Home
              </Link>
            </li>
            {primaryNav.map((group) => (
              <li key={group.href}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-xl font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {group.label}
                    <ChevronDownIcon className="h-5 w-5 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="mb-4 space-y-1 border-l-2 border-saffron-bright/60 pl-4">
                    <li>
                      <Link href={group.href} className="block py-2 text-[0.95rem] font-semibold text-saffron">
                        {group.label} overview
                      </Link>
                    </li>
                    {group.children?.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-2 text-[0.95rem] text-ink-2">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] text-ink-2">
            {utilityNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline decoration-line-strong underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/articles" className="underline decoration-line-strong underline-offset-4">
                All articles
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
