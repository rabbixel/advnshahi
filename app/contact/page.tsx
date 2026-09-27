import { StaticPageView, staticPageMetadata } from "@/components/page/StaticPageView";
import { MailIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/lib/site";

export function generateMetadata() {
  return staticPageMetadata("contact");
}

const topics = [
  { label: "Corrections", subject: "Correction", hint: "Tell us the article, the passage and what should change." },
  { label: "Suggest a topic", subject: "Topic suggestion", hint: "Questions you would like us to explain." },
  { label: "General enquiries", subject: "Enquiry", hint: "Anything else about NanakShahi." },
];

export default function ContactPage() {
  return (
    <StaticPageView
      slug="contact"
      aside={
        <div className="mb-10 rounded-2xl border border-line bg-white p-6 sm:p-8">
          <p className="kicker text-saffron">Email the editorial team</p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="mt-3 inline-flex items-center gap-2.5 break-all font-display text-[1.5rem] font-semibold text-ink underline decoration-saffron/50 underline-offset-[6px] hover:text-saffron sm:text-[1.8rem]"
          >
            <MailIcon className="h-6 w-6 shrink-0 text-saffron" />
            {siteConfig.contactEmail}
          </a>
          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {topics.map((t) => (
              <li key={t.label}>
                <a
                  href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`${t.subject}: NanakShahi`)}`}
                  className="group block h-full rounded-xl border border-line p-4 transition-colors hover:border-saffron"
                >
                  <span className="block font-semibold text-ink group-hover:text-saffron">{t.label}</span>
                  <span className="mt-1 block text-[0.85rem] leading-snug text-muted">{t.hint}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
