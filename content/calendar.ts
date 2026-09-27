/**
 * Month structure of the original (2003) Nanakshahi calendar as adopted by the
 * SGPC. Month starts are fixed to Gregorian dates in this version. Phagun has
 * 31 days in Gregorian leap years. The amended calendar used by the SGPC since
 * 2010 follows Bikrami reckoning for Sangrand and many observances, so its
 * month starts can differ by a day or so; see the Nanakshahi articles.
 */
export interface NanakshahiMonth {
  number: number;
  name: string;
  gurmukhi: string;
  starts: string; // Gregorian start date in the original calendar
  days: string;
  season: string;
}

export const nanakshahiMonths: NanakshahiMonth[] = [
  { number: 1, name: "Chet", gurmukhi: "ਚੇਤ", starts: "14 March", days: "31", season: "Spring" },
  { number: 2, name: "Vaisakh", gurmukhi: "ਵੈਸਾਖ", starts: "14 April", days: "31", season: "Spring harvest" },
  { number: 3, name: "Jeth", gurmukhi: "ਜੇਠ", starts: "15 May", days: "31", season: "Early summer" },
  { number: 4, name: "Harh", gurmukhi: "ਹਾੜ੍ਹ", starts: "15 June", days: "31", season: "Peak summer" },
  { number: 5, name: "Sawan", gurmukhi: "ਸਾਵਣ", starts: "16 July", days: "31", season: "Monsoon" },
  { number: 6, name: "Bhadon", gurmukhi: "ਭਾਦੋਂ", starts: "16 August", days: "30", season: "Late monsoon" },
  { number: 7, name: "Assu", gurmukhi: "ਅੱਸੂ", starts: "15 September", days: "30", season: "Early autumn" },
  { number: 8, name: "Katak", gurmukhi: "ਕੱਤਕ", starts: "15 October", days: "30", season: "Autumn" },
  { number: 9, name: "Maghar", gurmukhi: "ਮੱਘਰ", starts: "14 November", days: "30", season: "Early winter" },
  { number: 10, name: "Poh", gurmukhi: "ਪੋਹ", starts: "14 December", days: "30", season: "Winter" },
  { number: 11, name: "Magh", gurmukhi: "ਮਾਘ", starts: "13 January", days: "30", season: "Deep winter" },
  { number: 12, name: "Phagun", gurmukhi: "ਫੱਗਣ", starts: "12 February", days: "30 / 31", season: "Late winter" },
];

/** The Nanakshahi year begins on 1 Chet (14 March); year 1 corresponds to 1469 CE. */
export function nanakshahiYearFor(date: Date): number {
  const y = date.getUTCFullYear();
  const beforeChet = date.getUTCMonth() < 2 || (date.getUTCMonth() === 2 && date.getUTCDate() < 14);
  return y - 1468 - (beforeChet ? 1 : 0);
}
