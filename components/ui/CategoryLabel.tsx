import Link from "next/link";
import type { Category, CategoryAccent } from "@/types/content";
import { categoryPath } from "@/lib/site";

const accentClass: Record<CategoryAccent, string> = {
  saffron: "text-saffron",
  indigo: "text-indigo-2",
  green: "text-green",
  maroon: "text-maroon",
  teal: "text-teal",
  ochre: "text-ochre",
};

const dotClass: Record<CategoryAccent, string> = {
  saffron: "bg-saffron-bright",
  indigo: "bg-indigo-2",
  green: "bg-green",
  maroon: "bg-maroon",
  teal: "bg-teal",
  ochre: "bg-ochre",
};

interface Props {
  category: Category;
  /** Render as plain text (e.g. inside another link). */
  asText?: boolean;
  inverted?: boolean;
  className?: string;
}

export function CategoryLabel({ category, asText = false, inverted = false, className = "" }: Props) {
  const classes = `kicker inline-flex items-center gap-1.5 ${inverted ? "text-saffron-soft" : accentClass[category.accent]} ${className}`;
  const content = (
    <>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${inverted ? "bg-saffron-bright" : dotClass[category.accent]}`} />
      {category.name}
    </>
  );
  if (asText) return <span className={classes}>{content}</span>;
  return (
    <Link href={categoryPath(category.slug)} className={`${classes} relative z-10 hover:underline`}>
      {content}
    </Link>
  );
}
