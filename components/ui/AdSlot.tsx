/**
 * Reserved placement for a future Google AdSense unit.
 *
 * Renders NOTHING until NEXT_PUBLIC_ADSENSE_CLIENT is configured and a slot id
 * is mapped below, so the site never shows fake or placeholder advertising.
 * When enabled, the wrapper reserves a min-height to avoid layout shift and is
 * clearly labelled "Advertisement" in line with AdSense policies.
 *
 * To enable: set NEXT_PUBLIC_ADSENSE_CLIENT, add slot ids here, and load the
 * AdSense script once in app/layout.tsx (see README, "AdSense").
 */
export type AdPosition = "home-mid" | "article-top" | "article-mid" | "article-bottom" | "sidebar";

const SLOT_IDS: Partial<Record<AdPosition, string>> = {
  // "article-top": "1234567890",
};

const MIN_HEIGHT: Record<AdPosition, string> = {
  "home-mid": "min-h-[250px]",
  "article-top": "min-h-[100px]",
  "article-mid": "min-h-[250px]",
  "article-bottom": "min-h-[250px]",
  sidebar: "min-h-[250px]",
};

export function AdSlot({ position, className = "" }: { position: AdPosition; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = SLOT_IDS[position];
  if (!client || !slot) return null;

  return (
    <aside aria-label="Advertisement" className={`my-8 ${MIN_HEIGHT[position]} ${className}`} data-ad-position={position}>
      <p className="kicker mb-2 text-center text-muted">Advertisement</p>
      <ins
        className="adsbygoogle block"
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
