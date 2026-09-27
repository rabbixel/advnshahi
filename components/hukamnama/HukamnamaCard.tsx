import type { HukamnamaEntry } from "@/types/content";
import { formatDate } from "@/lib/format";

/**
 * Displays a verified Hukamnama entry supplied by the backend.
 * Every field is rendered exactly as received; nothing is generated here.
 */
export function HukamnamaCard({ entry }: { entry: HukamnamaEntry }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white" aria-labelledby="hukamnama-title">
      <header className="border-b border-line bg-paper-2 px-6 py-5 sm:px-8">
        <p className="kicker text-saffron">Hukamnama · {formatDate(entry.date)}</p>
        <h2 id="hukamnama-title" className="mt-1 text-2xl font-semibold">
          {entry.source}
        </h2>
        {(entry.raag || entry.ang) && (
          <p className="mt-1 text-[0.9rem] text-muted">
            {entry.raag}
            {entry.raag && entry.ang ? " · " : ""}
            {entry.ang ? `Ang ${entry.ang}` : ""}
          </p>
        )}
      </header>

      <div className="space-y-8 px-6 py-8 sm:px-8">
        <section aria-label="Gurmukhi text">
          <p lang="pa" className="whitespace-pre-line text-[1.35rem] leading-[1.9] text-ink">
            {entry.gurmukhi}
          </p>
        </section>

        {entry.transliteration && (
          <section aria-labelledby="hk-translit">
            <h3 id="hk-translit" className="kicker font-sans text-muted">Transliteration</h3>
            <p className="mt-2 whitespace-pre-line font-display text-[1.1rem] italic leading-relaxed text-ink-2">{entry.transliteration}</p>
          </section>
        )}

        {entry.punjabiExplanation && (
          <section aria-labelledby="hk-viakhya">
            <h3 id="hk-viakhya" className="kicker font-sans text-muted">Punjabi explanation</h3>
            <p lang="pa" className="mt-2 whitespace-pre-line text-[1.05rem] leading-[1.9] text-ink-2">{entry.punjabiExplanation}</p>
          </section>
        )}

        {entry.englishTranslation && (
          <section aria-labelledby="hk-english">
            <h3 id="hk-english" className="kicker font-sans text-muted">English translation</h3>
            <p className="mt-2 whitespace-pre-line font-display text-[1.1rem] leading-relaxed text-ink-2">{entry.englishTranslation}</p>
            {entry.translationCredit && <p className="mt-2 text-[0.82rem] text-muted">Translation: {entry.translationCredit}</p>}
          </section>
        )}

        {entry.explanation && (
          <section aria-labelledby="hk-notes">
            <h3 id="hk-notes" className="kicker font-sans text-muted">Reader&apos;s notes</h3>
            <p className="mt-2 whitespace-pre-line text-[1rem] leading-relaxed text-ink-2">{entry.explanation}</p>
          </section>
        )}

        {entry.audioUrl && (
          <section aria-labelledby="hk-audio">
            <h3 id="hk-audio" className="kicker font-sans text-muted">Listen</h3>
            <audio controls preload="none" src={entry.audioUrl} className="mt-3 w-full">
              Your browser does not support audio playback.
            </audio>
          </section>
        )}
      </div>

      {entry.sourceUrl && (
        <footer className="border-t border-line px-6 py-4 text-[0.88rem] sm:px-8">
          Source:{" "}
          <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-saffron underline underline-offset-4">
            {entry.source}
          </a>
        </footer>
      )}
    </article>
  );
}
