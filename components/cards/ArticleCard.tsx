import Image from "next/image";
import Link from "next/link";
import type { ArticleSummary } from "@/types/content";
import { articlePath } from "@/lib/site";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ArticleMeta } from "@/components/ui/ArticleMeta";

export type CardVariant = "lead" | "standard" | "horizontal" | "compact" | "overlay";

interface Props {
  article: ArticleSummary;
  variant?: CardVariant;
  /** Show the excerpt (defaults depend on variant). */
  showExcerpt?: boolean;
  /** Optional ordinal for ranked lists. */
  index?: number;
  /** Load the image eagerly (use for above-the-fold cards only). */
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  inverted?: boolean;
  className?: string;
}

const imageSizes: Record<CardVariant, string> = {
  lead: "(min-width: 1024px) 760px, 100vw",
  standard: "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
  horizontal: "(min-width: 640px) 176px, 112px",
  compact: "0px",
  overlay: "(min-width: 1024px) 800px, 100vw",
};

/**
 * One card component with several editorial layouts, so card markup lives in
 * a single place. The title link is "stretched" over the card so the whole
 * card is clickable while the category label stays independently focusable.
 */
export function ArticleCard({
  article,
  variant = "standard",
  showExcerpt,
  index,
  priority = false,
  headingLevel: Heading = "h3",
  inverted = false,
  className = "",
}: Props) {
  const href = articlePath(article.slug);
  const excerptVisible = showExcerpt ?? (variant === "lead" || variant === "standard");
  const titleTone = inverted ? "text-paper" : "text-ink";
  const excerptTone = inverted ? "text-paper/75" : "text-muted";

  const titleLink = (
    <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
      <span className="link-underline">{article.title}</span>
    </Link>
  );

  if (variant === "overlay") {
    return (
      <article className={`group relative isolate overflow-hidden rounded-xl bg-ink focus-within:ring-2 focus-within:ring-saffron ${className}`}>
        <div className="relative aspect-[4/5] sm:aspect-[16/10]">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            fill
            sizes={imageSizes.overlay}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" aria-hidden="true" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <CategoryLabel category={article.category} inverted />
          <Heading className="mt-3 max-w-2xl text-2xl font-semibold leading-[1.15] text-paper sm:text-[2.1rem]">{titleLink}</Heading>
          {excerptVisible && <p className="mt-3 hidden max-w-xl text-[0.98rem] leading-relaxed text-paper/80 sm:block">{article.excerpt}</p>}
          <ArticleMeta publishedAt={article.publishedAt} readingTime={article.readingTime} inverted className="mt-4" />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={`group relative flex gap-4 ${className}`}>
        {index !== undefined && (
          <span aria-hidden="true" className="font-display text-[2.2rem] font-semibold leading-none text-saffron-bright/80 tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
        )}
        <div className="min-w-0">
          <CategoryLabel category={article.category} inverted={inverted} />
          <Heading className={`mt-1.5 text-[1.08rem] font-semibold leading-snug ${titleTone}`}>{titleLink}</Heading>
          {excerptVisible && <p className={`mt-1.5 line-clamp-2 text-[0.9rem] leading-relaxed ${excerptTone}`}>{article.excerpt}</p>}
          <ArticleMeta publishedAt={article.publishedAt} readingTime={article.readingTime} inverted={inverted} className="mt-2" />
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className={`group relative flex items-start gap-4 ${className}`}>
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-paper-3 sm:w-44">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            fill
            sizes={imageSizes.horizontal}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="min-w-0">
          <CategoryLabel category={article.category} inverted={inverted} />
          <Heading className={`mt-1.5 text-[1.05rem] font-semibold leading-snug sm:text-[1.15rem] ${titleTone}`}>{titleLink}</Heading>
          {excerptVisible && <p className={`mt-1.5 line-clamp-2 hidden text-[0.9rem] leading-relaxed sm:block ${excerptTone}`}>{article.excerpt}</p>}
          <ArticleMeta publishedAt={article.publishedAt} readingTime={article.readingTime} inverted={inverted} className="mt-2" />
        </div>
      </article>
    );
  }

  const isLead = variant === "lead";
  return (
    <article className={`group relative flex flex-col ${className}`}>
      <div className={`relative overflow-hidden rounded-xl bg-paper-3 ${isLead ? "aspect-[16/10]" : "aspect-[3/2]"}`}>
        <Image
          src={article.featuredImage.src}
          alt={article.featuredImage.alt}
          fill
          sizes={imageSizes[variant]}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className={isLead ? "mt-6" : "mt-4"}>
        <CategoryLabel category={article.category} inverted={inverted} />
        <Heading
          className={`mt-2 font-semibold ${titleTone} ${
            isLead ? "text-[1.9rem] leading-[1.12] tracking-[-0.015em] sm:text-[2.5rem]" : "text-[1.3rem] leading-snug"
          }`}
        >
          {titleLink}
        </Heading>
        {excerptVisible && (
          <p className={`mt-3 leading-relaxed ${excerptTone} ${isLead ? "text-[1.05rem] sm:text-[1.1rem]" : "line-clamp-3 text-[0.95rem]"}`}>
            {article.excerpt}
          </p>
        )}
        <ArticleMeta
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          author={isLead ? article.author.name : undefined}
          inverted={inverted}
          className={isLead ? "mt-4" : "mt-3"}
        />
      </div>
    </article>
  );
}
