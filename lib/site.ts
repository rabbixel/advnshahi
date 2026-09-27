/**
 * Site-wide configuration. Values that differ between environments come from
 * environment variables; everything else is defined here once.
 */

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const siteConfig = {
  name: "NanakShahi",
  domain: "nanakshahi.in",
  url: stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || "https://nanakshahi.in"),
  tagline: "Nanakshahi calendar, Gurpurab and Sikh heritage, explained with care.",
  description:
    "NanakShahi is an independent publication explaining the Nanakshahi and Punjabi calendars, Gurpurab, Sikh festivals, Guru Nanak Dev Ji, Harmandir Sahib and the daily Hukamnama tradition.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@nanakshahi.in",
  locale: "en_IN",
  language: "en-IN",
  foundingYear: 2026,
} as const;

/** Builds an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalised === "/" ? "" : normalised}` || siteConfig.url;
}

export function articlePath(slug: string): string {
  return `/articles/${slug}`;
}

export function categoryPath(slug: string): string {
  return `/${slug}`;
}
