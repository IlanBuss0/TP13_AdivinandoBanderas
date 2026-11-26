/** @typedef {import("../services/countriesApi").Country} Country */
/** @typedef {"flags" | "capitals"} GameMode */
/**
 * @typedef {object} Round
 * @property {object} id
 * @property {Country} country
 * @property {string | null} capital
 * @property {string[]} options
 * @property {string[]} wrongCapitals
 * @property {number | null} deadline
 * @property {number} seconds
 * @property {number[]} revealed
 * @property {boolean} imageError
 * @property {number} imageAttempt
 */

export const ROUND_SECONDS = 15;

/** @param {string} text */
export function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

/** @param {string[]} items */
function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * @param {Country[]} countries
 * @param {Record<string, string>} capitals
 * @param {GameMode} mode
 * @param {Country} [previousCountry]
 * @returns {Round}
 */
export function makeRound(countries, capitals, mode, previousCountry) {
  const eligible = mode === "capitals"
    ? countries.filter((country) => capitals[country.iso2])
    : countries;
  const alternatives = eligible.filter((country) => country !== previousCountry);
  const pool = alternatives.length ? alternatives : eligible;
  const country = pool[Math.floor(Math.random() * pool.length)];
  const capital = mode === "capitals" ? capitals[country.iso2] : null;
  const wrongCapitals = capital
    ? shuffle([...new Set(Object.values(capitals))].filter((item) => item !== capital)).slice(0, 2)
    : [];

  return {
    id: {},
    country,
    capital,
    options: capital ? shuffle([capital, ...wrongCapitals]) : [],
    wrongCapitals,
    deadline: null,
    seconds: ROUND_SECONDS,
    revealed: [],
    imageError: false,
    imageAttempt: 0,
  };
}

/** @param {number} deadline @param {number} now */
export function secondsLeft(deadline, now) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

/** @param {Round} round */
export function visibleOptions(round) {
  const removed = Math.floor((ROUND_SECONDS - round.seconds) / 5);
  return round.options.filter((option) => !round.wrongCapitals.slice(0, removed).includes(option));
}

/** @param {Round} round */
export function hiddenLetters(round) {
  return Array.from(round.country.label).flatMap((letter, index) =>
    /\p{L}/u.test(letter) && !round.revealed.includes(index) ? [index] : [],
  );
}

