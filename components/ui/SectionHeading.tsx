import Link from "next/link";
import { ArrowRightIcon } from "./Icons";

interface Props {
  title: string;
  kicker?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  inverted?: boolean;
  id?: string;
  as?: "h2" | "h3";
}

export function SectionHeading({
  title,
  kicker,
  description,
  href,
  linkLabel = "View all",
  inverted = false,
  id,
  as: Tag = "h2",
}: Props) {
  return (
    <div className={`mb-7 flex flex-col gap-3 border-t-2 pt-4 sm:flex-row sm:items-end sm:justify-between ${inverted ? "border-paper/80" : "border-ink"}`}>
      <div className="max-w-2xl">
        {kicker && <p className={`kicker mb-2 ${inverted ? "text-saffron-soft" : "text-saffron"}`}>{kicker}</p>}
        <Tag id={id} className={`text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] sm:text-[2rem] ${inverted ? "text-paper" : "text-ink"}`}>
          {title}
        </Tag>
        {description && (
          <p className={`mt-2 text-[0.98rem] leading-relaxed ${inverted ? "text-paper/75" : "text-muted"}`}>{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-[0.9rem] font-semibold ${inverted ? "text-paper hover:text-saffron-soft" : "text-ink hover:text-saffron"}`}
        >
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
