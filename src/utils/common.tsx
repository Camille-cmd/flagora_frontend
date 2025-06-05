
// country code regex
const CC_REGEX = /^[a-z]{2}$/i;

// offset between uppercase ascii and regional indicator symbols
const OFFSET = 127397;

/**
 * Convert country code to corresponding flag emoji.
 * @param code - A two-letter ISO country code (e.g., "FR", "US")
 * @returns {string} The flag emoji or 🤔 if invalid.
 */
export function countryCodeEmoji(code: string): string {
  if (!CC_REGEX.test(code)) {
    return "🤔";
  }

  const codePoints = [...code.toUpperCase()].map(c => (c.codePointAt(0)!) + OFFSET);
  return String.fromCodePoint(...codePoints);
}
