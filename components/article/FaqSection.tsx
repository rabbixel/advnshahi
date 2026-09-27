import type { FaqItem } from "@/types/content";

/** Visible FAQ block. The same items feed FAQPage JSON-LD on the page. */
export function FaqSection({ faq }: { faq: FaqItem[] }) {
  if (faq.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2 id="faq-heading" className="border-t border-line pt-8 text-[1.85rem] font-semibold leading-tight">
        Frequently asked questions
      </h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {faq.map((item) => (
          <details key={item.question} className="group py-1">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 font-display text-[1.2rem] font-semibold leading-snug text-ink [&::-webkit-details-marker]:hidden">
              {item.question}
              <span aria-hidden="true" className="mt-1 text-xl leading-none text-saffron transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="pb-5 pr-8 font-display text-[1.08rem] leading-relaxed text-ink-2">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
