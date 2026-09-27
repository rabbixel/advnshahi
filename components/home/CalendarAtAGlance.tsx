import { nanakshahiMonths, type NanakshahiMonth } from "@/content/calendar";

/** "14 September" -> "14 Sep" for the compact table; the full date is kept for screen readers. */
function shortDate(value: string): string {
  return value.replace(/^(\d+) (\w{3})\w*$/, "$1 $2");
}

function MonthTable({ months, label }: { months: NanakshahiMonth[]; label: string }) {
  return (
    <table className="w-full text-left text-[0.9rem]" aria-label={label}>
      <thead>
        <tr className="border-b border-line text-[0.7rem] uppercase tracking-[0.1em] text-muted">
          <th scope="col" className="py-2 pl-3 pr-2 font-semibold sm:pl-4">Month</th>
          <th scope="col" className="px-2 py-2 font-semibold">
            <span className="sr-only">Name in </span>Gurmukhi
          </th>
          <th scope="col" className="px-2 py-2 text-right font-semibold">Begins</th>
          <th scope="col" className="py-2 pl-2 pr-3 text-right font-semibold sm:pr-4">Days</th>
        </tr>
      </thead>
      <tbody>
        {months.map((m) => (
          <tr key={m.name} className="border-b border-line last:border-b-0">
            <th scope="row" className="whitespace-nowrap py-2.5 pl-3 pr-2 font-medium text-ink sm:pl-4">
              <span className="mr-1.5 inline-block w-5 text-right font-display text-[0.85rem] text-saffron tabular-nums">{m.number}</span>
              {m.name}
            </th>
            <td lang="pa" className="whitespace-nowrap px-2 py-2.5 text-muted">{m.gurmukhi}</td>
            <td className="whitespace-nowrap px-2 py-2.5 text-right text-ink-2 tabular-nums">
              <span aria-hidden="true">{shortDate(m.starts)}</span>
              <span className="sr-only">{m.starts}</span>
            </td>
            <td className="whitespace-nowrap py-2.5 pl-2 pr-3 text-right text-[0.82rem] text-muted tabular-nums sm:pr-4">{m.days}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The twelve Nanakshahi months (original 2003 structure) in two semantic tables. */
export function CalendarAtAGlance() {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="grid overflow-x-auto md:grid-cols-2 md:divide-x md:divide-line">
        <MonthTable months={nanakshahiMonths.slice(0, 6)} label="Nanakshahi months 1 to 6" />
        <div className="border-t border-line md:border-t-0">
          <MonthTable months={nanakshahiMonths.slice(6)} label="Nanakshahi months 7 to 12" />
        </div>
      </div>
      <figcaption className="border-t border-line bg-paper-2 px-4 py-3 text-[0.8rem] leading-relaxed text-muted">
        Month start dates as fixed in the original 2003 Nanakshahi calendar. The amended calendar published
        by the SGPC follows Bikrami reckoning for Sangrand, so its dates can differ by a day. Phagun has 31
        days in leap years.
      </figcaption>
    </figure>
  );
}
