import Link from "next/link";
import type { Author } from "@/types/content";
import { formatDate } from "@/lib/format";
import { LogoMark } from "@/components/layout/Logo";

interface Props {
  author: Author;
  publishedAt: string;
  updatedAt: string;
}

/** Author box plus a transparent note on how the article is maintained. */
export function EditorialNote({ author, publishedAt, updatedAt }: Props) {
  return (
    <aside aria-label="About this article" className="mt-14 rounded-xl border border-line bg-paper-2 p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <LogoMark className="h-11 w-11 shrink-0" />
        <div>
          <p className="kicker text-saffron">Written by</p>
          <p className="mt-1 font-display text-xl font-semibold text-ink">{author.name}</p>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-2">{author.bio}</p>
          <p className="mt-3 text-[0.85rem] text-muted">
            Published {formatDate(publishedAt)}
            {updatedAt !== publishedAt && <> · Last reviewed {formatDate(updatedAt)}</>}
          </p>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-2">
            Spotted an error, or know of a tradition we should mention?{" "}
            <Link href="/contact" className="font-medium text-saffron underline underline-offset-4">
              Send us a correction
            </Link>
            . Read our <Link href="/about#editorial-standards" className="font-medium text-saffron underline underline-offset-4">editorial standards</Link>.
          </p>
        </div>
      </div>
    </aside>
  );
}
