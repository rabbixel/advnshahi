import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
  /** Use "h1" when the empty state is the page's main content (e.g. a not-found page). */
  headingLevel?: "h1" | "h2";
}

/** Branded empty / not-found state used by search, categories and 404s. */
export function EmptyState({ title, description, children, headingLevel: Heading = "h2" }: Props) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-line-strong bg-white/60 px-6 py-12 text-center sm:px-10">
      <LogoMark className="mx-auto h-12 w-12" />
      <Heading className="mt-5 text-[1.7rem] font-semibold leading-tight">{title}</Heading>
      <p className="mt-3 text-[1rem] leading-relaxed text-muted">{description}</p>
      {children ?? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-[0.9rem] font-semibold text-paper hover:bg-saffron">
            Go to the homepage
          </Link>
          <Link href="/articles" className="rounded-full border border-line-strong px-5 py-2.5 text-[0.9rem] font-semibold text-ink hover:border-ink">
            Browse all articles
          </Link>
        </div>
      )}
    </div>
  );
}
