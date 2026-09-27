import "server-only";
import type { HukamnamaEntry } from "@/types/content";

/**
 * Official places where the daily Hukamnama from Sri Harmandir Sahib is
 * published. Shown on /hukamnama-today while no verified live feed exists.
 */
export const officialHukamnamaSources = [
  {
    name: "Shiromani Gurdwara Parbandhak Committee (SGPC)",
    url: "https://sgpc.net/",
    description:
      "The SGPC manages Sri Harmandir Sahib and publishes the daily Hukamnama, usually as an image or PDF with Punjabi explanation.",
  },
  {
    name: "SGPC broadcast channel: Sachkhand Sri Harmandir Sahib Sri Amritsar",
    url: "https://www.youtube.com/results?search_query=Sachkhand+Sri+Harmandir+Sahib+Sri+Amritsar",
    description:
      "Since July 2023 the SGPC has broadcast Gurbani from Sri Harmandir Sahib on its own web channel, including the morning Hukamnama.",
  },
] as const;

function isValidEntry(value: unknown): value is HukamnamaEntry {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.date) &&
    typeof v.source === "string" &&
    typeof v.gurmukhi === "string" &&
    v.gurmukhi.trim().length > 0
  );
}

/**
 * Returns today's Hukamnama from the configured backend, or null.
 *
 * NanakShahi never generates or paraphrases Gurbani. If HUKAMNAMA_API_URL is
 * not set, or the backend returns anything that fails validation, this
 * returns null and the page shows its informational state instead.
 */
export async function getTodayHukamnama(): Promise<HukamnamaEntry | null> {
  const endpoint = process.env.HUKAMNAMA_API_URL;
  if (!endpoint) return null;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 900, tags: ["hukamnama"] },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return isValidEntry(data) ? data : null;
  } catch {
    return null;
  }
}
