import Link from "next/link";

interface LogoProps {
  className?: string;
  /** Show the Gurmukhi name under the wordmark. */
  withGurmukhi?: boolean;
  inverted?: boolean;
}

/** The brand mark: a rising sun over a horizon (for "calendar" and "dawn"), deliberately not a religious emblem. */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7" fill="#1d2d4a" />
      <path d="M8 21a8 8 0 0 1 16 0" fill="#e0781f" />
      <path d="M5.5 21h21" stroke="#faf7f1" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 25h14" stroke="#faf7f1" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
      <path d="M16 6.5v3M9.3 9.3l2 2M22.7 9.3l-2 2" stroke="#e0781f" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "", withGurmukhi = false, inverted = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="NanakShahi home"
    >
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.6rem] font-semibold tracking-[-0.015em] ${inverted ? "text-paper" : "text-ink"}`}
        >
          Nanak<span className={inverted ? "text-saffron-bright" : "text-[#c96410]"}>Shahi</span>
        </span>
        {withGurmukhi && (
          <span lang="pa" className={`mt-1 text-[0.8rem] ${inverted ? "text-paper/70" : "text-muted"}`}>
            ਨਾਨਕਸ਼ਾਹੀ
          </span>
        )}
      </span>
    </Link>
  );
}
