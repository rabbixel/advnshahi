import type { ArticleSummary } from "@/types/content";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function RelatedArticles({ articles, title = "Continue reading" }: { articles: ArticleSummary[]; title?: string }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-20">
      <SectionHeading id="related-heading" kicker="Related" title={title} />
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} variant="standard" />
        ))}
      </div>
    </section>
  );
}
