import { SearchIcon } from "./Icons";

interface Props {
  defaultValue?: string;
  size?: "md" | "lg";
  id?: string;
  autoFocus?: boolean;
  className?: string;
}

/** Plain GET form to /search. Works without JavaScript. */
export function SearchForm({ defaultValue = "", size = "md", id = "site-search", autoFocus = false, className = "" }: Props) {
  const large = size === "lg";
  return (
    <form action="/search" method="get" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search NanakShahi articles
      </label>
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder={large ? "Search Gurpurab, Hukamnama, calendar…" : "Search articles"}
        className={`w-full rounded-full border border-line-strong bg-white text-ink placeholder:text-muted focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20 ${
          large ? "h-14 pl-13 pr-32 text-[1.05rem]" : "h-11 pl-11 pr-4 text-[0.95rem]"
        }`}
      />
      <SearchIcon className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${large ? "left-5 h-5 w-5" : "left-4 h-4.5 w-4.5"}`} />
      {large && (
        <button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-ink px-5 text-[0.9rem] font-semibold text-paper transition-colors hover:bg-saffron">
          Search
        </button>
      )}
    </form>
  );
}
