import type { TocEntry } from "@/types/content";

/** Collapsible "In this article" list. Uses native <details>: no JavaScript required. */
export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const entries = toc.filter((t) => t.level === 2);
  if (entries.length < 3) return null;

  return (
    <details open className="group rounded-xl border border-line bg-white/60 p-5 sm:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        <span className="kicker text-ink">In this article</span>
        <span aria-hidden="true" className="text-sm text-muted group-open:hidden">Show</span>
        <span aria-hidden="true" className="hidden text-sm text-muted group-open:inline">Hide</span>
      </summary>
      <ol className="mt-4 grid gap-x-8 gap-y-2 text-[0.95rem] sm:grid-cols-2">
        {entries.map((entry, i) => (
          <li key={entry.id} className="flex gap-2.5">
            <span aria-hidden="true" className="w-5 shrink-0 font-display text-saffron tabular-nums">{i + 1}.</span>
            <a href={`#${entry.id}`} className="text-ink-2 hover:text-saffron hover:underline">
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
