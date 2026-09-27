import type { Category } from "@/types/content";

/**
 * Editorial categories (topic hubs). Each is published at /{slug}.
 * Order here is the order used in navigation and the footer.
 */
export const categories: Category[] = [
  {
    id: "cat-nanakshahi-calendar",
    slug: "nanakshahi-calendar",
    name: "Nanakshahi Calendar",
    tagline: "How Sikh dates are counted, and why they sometimes differ.",
    intro: [
      "The Nanakshahi calendar is a solar calendar introduced in the Sikh community at the turn of the twenty-first century. Its years are counted from 1469, the year of Guru Nanak Dev Ji's birth, and its twelve months carry the familiar Punjabi names, from Chet to Phagun.",
      "Few subjects cause more confusion for families than dates. The same Gurpurab can be marked on different days in different gurdwaras, depending on whether a community follows the original 2003 Nanakshahi calendar, the amended calendar published by the Shiromani Gurdwara Parbandhak Committee, or older Bikrami reckoning. The articles in this section explain the systems side by side, without taking sides, so that you can read any jantri (almanac) with confidence.",
    ],
    seoTitle: "Nanakshahi Calendar & Punjabi Calendar Guides",
    seoDescription:
      "Understand the Nanakshahi calendar, the Bikrami and Gregorian systems, Punjabi month names and why Sikh dates can differ between gurdwaras.",
    accent: "saffron",
  },
  {
    id: "cat-gurpurab",
    slug: "gurpurab",
    name: "Gurpurab",
    tagline: "The meaning of Gurpurab and how the Sikh Gurus are remembered.",
    intro: [
      "A Gurpurab is a day of remembrance connected with the lives of the Sikh Gurus: the anniversary of a Guru's birth (Prakash Purab), of their accession to Guruship (Gurgaddi), of their passing (Jyoti Jot), or of a martyrdom (Shaheedi Purab). The best known in the wider world is the Gurpurab of Guru Nanak Dev Ji, often called Guru Nanak Jayanti.",
      "This section explains what the word means, where it comes from and how sangats observe these days, from the continuous Akhand Path and early-morning Prabhat Pheris to Nagar Kirtan processions and langar that is open to everyone.",
    ],
    seoTitle: "Gurpurab: Meaning, History and Sikh Traditions",
    seoDescription:
      "What Gurpurab means, how Sikhs observe the Gurpurabs of the Gurus, and a clear guide to Guru Nanak Jayanti, Akhand Path, Nagar Kirtan and langar.",
    accent: "maroon",
  },
  {
    id: "cat-guru-nanak-dev-ji",
    slug: "guru-nanak-dev-ji",
    name: "Guru Nanak Dev Ji",
    tagline: "The life, journeys and teachings of the first Sikh Guru.",
    intro: [
      "Guru Nanak Dev Ji (1469–1539) is revered by Sikhs as the first of the ten Gurus and the founder of the Sikh tradition. Born in Rai Bhoi di Talwandi, today's Nankana Sahib in Pakistan, he travelled widely, composed hymns that are preserved in Sri Guru Granth Sahib Ji, and in his later years settled at Kartarpur on the banks of the Ravi.",
      "Our articles set out what is known from the Guru's own compositions, what comes from the later janamsakhi traditions, and where historians and traditions differ. We do not attribute words to the Guru unless they are established, and we point readers towards reliable ways of reading Gurbani for themselves.",
    ],
    seoTitle: "Guru Nanak Dev Ji: Life, Teachings and Gurpurab",
    seoDescription:
      "A careful introduction to Guru Nanak Dev Ji: his life, travels, teachings, compositions in Sri Guru Granth Sahib Ji and the celebration of his Gurpurab.",
    accent: "ochre",
  },
  {
    id: "cat-hukamnama",
    slug: "hukamnama",
    name: "Hukamnama",
    tagline: "Understanding the daily Hukamnama and Mukhwak from Sri Darbar Sahib.",
    intro: [
      "Every morning at Sri Harmandir Sahib in Amritsar, a shabad is read from Sri Guru Granth Sahib Ji after the scripture is ceremonially opened. This reading is the Hukamnama, also called the Mukhwak or Vak, and many Sikhs around the world begin their day by reading or listening to it.",
      "This section explains the practice in depth: what the words mean, how the reading is taken, how to understand the structure of a shabad, and where to find the day's Hukamnama from official sources. NanakShahi does not reproduce or paraphrase the daily text itself unless it comes from a verified source, and we never generate religious text.",
    ],
    seoTitle: "Hukamnama & Mukhwak: Daily Hukamnama Explained",
    seoDescription:
      "What the daily Hukamnama from Sri Darbar Sahib is, how the Mukhwak is taken, how to read a shabad and where to find today's Hukamnama from official sources.",
    accent: "indigo",
  },
  {
    id: "cat-harmandir-sahib",
    slug: "harmandir-sahib",
    name: "Harmandir Sahib",
    tagline: "The Golden Temple, Sri Darbar Sahib, and the city around it.",
    intro: [
      "Sri Harmandir Sahib in Amritsar, known around the world as the Golden Temple and to many Sikhs simply as Darbar Sahib, is the most visited Sikh shrine. Its origins lie in the work of Guru Ram Das Ji and Guru Arjan Dev Ji in the late sixteenth century, and its gilded upper storeys date from the time of Maharaja Ranjit Singh.",
      "Here you will find explanations of its many names, its history and architecture, the daily routine of worship, and practical, respectful guidance for anyone planning a visit.",
    ],
    seoTitle: "Harmandir Sahib (Golden Temple, Amritsar): History & Guide",
    seoDescription:
      "Harmandir Sahib, the Golden Temple or Sri Darbar Sahib in Amritsar: its names, history, architecture, daily routine and a respectful guide for visitors.",
    accent: "green",
  },
  {
    id: "cat-sikh-festivals",
    slug: "sikh-festivals",
    name: "Sikh Festivals",
    tagline: "Bandi Chhor Divas, Vaisakhi, Hola Mohalla and other observances.",
    intro: [
      "Sikh festivals combine remembrance, worship and community. Some are Gurpurabs tied to the lives of the Gurus; others, such as Vaisakhi, Hola Mohalla and Bandi Chhor Divas, are gatherings that grew out of events in Sikh history and the seasonal rhythm of Punjab.",
      "Our festival guides explain the history behind each observance, where accounts differ, how it is marked in gurdwaras today, and how it relates to festivals of other traditions that fall at the same time of year.",
    ],
    seoTitle: "Sikh Festivals: Bandi Chhor Divas, Vaisakhi & More",
    seoDescription:
      "Guides to Sikh festivals including Bandi Chhor Divas, Vaisakhi, Hola Mohalla and the Gurpurabs: history, meaning and how each is observed today.",
    accent: "saffron",
  },
  {
    id: "cat-sikh-history",
    slug: "sikh-history",
    name: "Sikh History",
    tagline: "Historic gurdwaras, the Takhts and the places that shaped the Panth.",
    intro: [
      "Sikh history is written in its places as much as in its texts. Gurdwaras such as Nankana Sahib, Sri Harmandir Sahib, Bangla Sahib and Hazur Sahib mark moments in the lives of the Gurus and the growth of the Sikh community.",
      "This section brings together our historical articles. Where dates or accounts are contested, we say so, and we distinguish between what is documented and what comes from later tradition.",
    ],
    seoTitle: "Sikh History and Heritage: Gurdwaras, Takhts and Places",
    seoDescription:
      "Articles on Sikh history and heritage: historic gurdwaras, the five Takhts, Sri Harmandir Sahib and the lives of the Sikh Gurus, written with care for accuracy.",
    accent: "teal",
  },
  {
    id: "cat-sikh-culture",
    slug: "sikh-culture",
    name: "Sikh Culture",
    tagline: "Kirtan, language and the everyday practice of Sikh life.",
    intro: [
      "Sikh culture lives in daily practice: in kirtan sung in raag, in the Punjabi and Gurmukhi vocabulary families pass on, in langar and seva, and in the way festivals are explained to children and friends.",
      "These articles look at that living culture, from how devotees listen to live kirtan from Sri Harmandir Sahib to explaining Sikh observances clearly in English.",
    ],
    seoTitle: "Sikh Culture: Kirtan, Language and Everyday Practice",
    seoDescription:
      "Explore Sikh culture: Gurbani kirtan and live broadcasts from Sri Harmandir Sahib, Punjabi terminology, and explaining Sikh festivals in English.",
    accent: "teal",
  },
];
