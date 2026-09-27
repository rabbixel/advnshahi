import Link from "next/link";
import type { Crumb } from "@/lib/seo";

/** Visible breadcrumb trail. Pair with breadcrumbJsonLd() using the same crumbs. */
export function Breadcrumbs({ crumbs, className = "" }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] text-muted">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex min-w-0 items-center gap-2">
              {last ? (
                <span aria-current="page" className="line-clamp-1 text-ink-2">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.path} className="hover:text-saffron hover:underline">
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="text-line-strong">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
