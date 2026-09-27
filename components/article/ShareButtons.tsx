import { FacebookIcon, MailIcon, WhatsAppIcon, XLogoIcon } from "@/components/ui/Icons";
import { CopyLinkButton } from "./CopyLinkButton";

interface Props {
  url: string;
  title: string;
  className?: string;
}

const buttonClass =
  "inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white px-3 text-ink-2 transition-colors hover:border-ink hover:text-ink";

/** Plain share links (no third-party scripts or tracking). */
export function ShareButtons({ url, title, className = "" }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, Icon: WhatsAppIcon },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, Icon: XLogoIcon },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: FacebookIcon },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="kicker mr-1 text-muted">Share</span>
      {links.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} className={`${buttonClass} w-9 justify-center px-0`}>
          <Icon />
        </a>
      ))}
      <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email" className={`${buttonClass} w-9 justify-center px-0`}>
        <MailIcon />
      </a>
      <CopyLinkButton url={url} className={buttonClass} />
    </div>
  );
}
