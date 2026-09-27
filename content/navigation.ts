/**
 * Primary navigation. Every link points at a real page: a topic hub,
 * a specific article or a utility page. No keyword-only entries.
 */
export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  children?: NavLink[];
}

export const primaryNav: NavGroup[] = [
  {
    label: "Calendar",
    href: "/nanakshahi-calendar",
    children: [
      {
        label: "Nanakshahi Calendar",
        href: "/articles/nanakshahi-calendar-history-months",
        description: "History, months and why it matters",
      },
      {
        label: "Punjabi Calendar",
        href: "/articles/punjabi-calendar-nanakshahi-bikrami-gregorian",
        description: "Nanakshahi, Bikrami and Gregorian compared",
      },
      {
        label: "Calendar guide for families",
        href: "/articles/nanakshahi-calendar-sikh-dates-guide",
        description: "Working out Sikh dates in practice",
      },
      { label: "All calendar articles", href: "/nanakshahi-calendar" },
    ],
  },
  {
    label: "Gurpurab",
    href: "/gurpurab",
    children: [
      {
        label: "Guru Nanak Jayanti",
        href: "/articles/guru-nanak-jayanti",
        description: "History and how it is celebrated",
      },
      {
        label: "What is Gurpurab?",
        href: "/articles/what-is-gurpurab",
        description: "Meaning and traditions",
      },
      {
        label: "Guru Nanak Gurpurab",
        href: "/articles/guru-nanak-gurpurab",
        description: "The date, the places and the meaning",
      },
      { label: "All Gurpurab articles", href: "/gurpurab" },
    ],
  },
  {
    label: "Festivals",
    href: "/sikh-festivals",
    children: [
      {
        label: "Bandi Chhor Divas",
        href: "/articles/bandi-chhor-divas-history-meaning",
        description: "History and the story behind it",
      },
      {
        label: "Bandi Chhor Divas & Diwali",
        href: "/articles/bandi-chhor-divas-and-diwali",
        description: "Why they are observed together",
      },
      {
        label: "Sikh festivals guide",
        href: "/articles/sikh-gurpurabs-and-festivals-guide",
        description: "Important observances through the year",
      },
      { label: "All festival articles", href: "/sikh-festivals" },
    ],
  },
  {
    label: "Harmandir Sahib",
    href: "/harmandir-sahib",
    children: [
      {
        label: "Golden Temple names explained",
        href: "/articles/golden-temple-harmandir-sahib-darbar-sahib-names",
        description: "Harmandir Sahib, Darbar Sahib and more",
      },
      {
        label: "History & architecture",
        href: "/articles/golden-temple-amritsar-history-architecture",
        description: "From Guru Ram Das Ji to today",
      },
      {
        label: "Visiting guide",
        href: "/articles/visiting-harmandir-sahib-amritsar-guide",
        description: "Practical and respectful advice",
      },
      {
        label: "Live kirtan",
        href: "/articles/live-kirtan-golden-temple",
        description: "The tradition and the broadcasts",
      },
    ],
  },
  {
    label: "Hukamnama",
    href: "/hukamnama",
    children: [
      {
        label: "Hukamnama today",
        href: "/hukamnama-today",
        description: "Where to find today's Hukamnama",
      },
      {
        label: "Hukamnama explained",
        href: "/articles/hukamnama-sri-darbar-sahib-explained",
        description: "Meaning, role and history",
      },
      {
        label: "How to read the daily Hukamnama",
        href: "/articles/hukamnama-today-golden-temple-how-to-read",
        description: "A step-by-step reader's guide",
      },
      {
        label: "Mukhwak & Hukamnama",
        href: "/articles/mukhwak-and-hukamnama",
        description: "The terms and the daily practice",
      },
    ],
  },
  {
    label: "Sikh History",
    href: "/sikh-history",
    children: [
      {
        label: "Guru Nanak Dev Ji",
        href: "/articles/guru-nanak-dev-ji-life-teachings-legacy",
        description: "Life, teachings and legacy",
      },
      {
        label: "Historic gurdwaras",
        href: "/articles/bangla-sahib-hazur-sahib-historic-gurdwaras",
        description: "Bangla Sahib, Hazur Sahib and the Takhts",
      },
      { label: "Sikh history", href: "/sikh-history" },
      { label: "Sikh culture", href: "/sikh-culture" },
    ],
  },
];

export const utilityNav: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const trendingLinks: NavLink[] = [
  { label: "Hukamnama today", href: "/hukamnama-today" },
  { label: "Bandi Chhor Divas", href: "/articles/bandi-chhor-divas-history-meaning" },
  { label: "Guru Nanak Jayanti", href: "/articles/guru-nanak-jayanti" },
  { label: "Nanakshahi months", href: "/articles/nanakshahi-calendar-history-months#the-twelve-months" },
  { label: "Visiting Amritsar", href: "/articles/visiting-harmandir-sahib-amritsar-guide" },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Editorial Policy", href: "/about#editorial-standards" },
];
