interface Source {
  name: string;
  url: string;
  description: string;
}

/**
 * Honest informational state shown while no verified live Hukamnama feed is
 * connected. It points readers to official sources instead of inventing text.
 */
export function HukamnamaUnavailable({ sources }: { sources: readonly Source[] }) {
  return (
    <section aria-labelledby="hk-status" className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="border-b border-line bg-paper-2 px-6 py-5 sm:px-8">
        <p className="kicker text-saffron">Status</p>
        <h2 id="hk-status" className="mt-1 text-2xl font-semibold">
          The daily text is not published on NanakShahi yet
        </h2>
      </div>
      <div className="space-y-5 px-6 py-7 text-[1rem] leading-relaxed text-ink-2 sm:px-8">
        <p>
          We are building a verified daily Hukamnama service. Until it is connected to an authoritative source,
          this page does not display, summarise or paraphrase the day&apos;s Hukamnama. We will not publish
          Gurbani that has not come directly from its source.
        </p>
        <p className="font-medium text-ink">To read or hear today&apos;s Hukamnama from Sri Harmandir Sahib now:</p>
        <ul className="space-y-4">
          {sources.map((s) => (
            <li key={s.url} className="rounded-xl border border-line p-4">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-saffron underline underline-offset-4">
                {s.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <p className="mt-1 text-[0.93rem] text-muted">{s.description}</p>
            </li>
          ))}
          <li className="rounded-xl border border-line p-4">
            <p className="font-semibold text-ink">Your local gurdwara</p>
            <p className="mt-1 text-[0.93rem] text-muted">
              Many gurdwaras display the Hukamnama from Sri Harmandir Sahib, or take their own Hukamnama at the
              morning diwan. Both are part of daily Sikh practice.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
