import { formatDate, formatShortDate } from "@/lib/format";
import { ClockIcon } from "./Icons";

interface Props {
  publishedAt: string;
  readingTime?: number;
  author?: string;
  short?: boolean;
  inverted?: boolean;
  className?: string;
}

/** Compact byline: author · date · reading time. */
export function ArticleMeta({ publishedAt, readingTime, author, short = true, inverted = false, className = "" }: Props) {
  const tone = inverted ? "text-paper/75" : "text-muted";
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] ${tone} ${className}`}>
      {author && (
        <>
          <span className={inverted ? "text-paper" : "text-ink-2"}>By {author}</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <time dateTime={publishedAt}>{short ? formatShortDate(publishedAt) : formatDate(publishedAt)}</time>
      {readingTime !== undefined && (
        <>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon />
            {readingTime} min read
          </span>
        </>
      )}
    </p>
  );
}
