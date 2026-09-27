import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchForm } from "@/components/ui/SearchForm";

export default function ArticleNotFound() {
  return (
    <div className="container-page py-16 sm:py-24">
      <EmptyState
        headingLevel="h1"
        title="Article not found"
        description="This article doesn't exist or may have been renamed. Search for the topic you were reading about, or browse the full library."
      >
        <SearchForm id="article-notfound-search" className="mt-6" />
        <p className="mt-5">
          <Link href="/articles" className="text-[0.95rem] font-semibold text-saffron underline underline-offset-4">
            Browse all articles
          </Link>
        </p>
      </EmptyState>
    </div>
  );
}
