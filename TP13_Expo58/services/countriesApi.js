const BASE_URL = "https://countriesnow.space/api/v0.1/countries";

/** @typedef {{name: string, flag: string, iso2: string, label: string}} Country */

/** @param {string} path @param {AbortSignal} signal */
async function fetchCountries(path, signal) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener("abort", cancel);
  const timeout = setTimeout(cancel, 12000);

  try {
    const response = await fetch(BASE_URL + path, { signal: controller.signal });
    if (!response.ok) throw new Error("La API no respondió correctamente.");

    const result = await response.json();
    if (result.error || !Array.isArray(result.data) || !result.data.length) {
      throw new Error("La API no devolvió los datos del juego.");
    }

    return result.data;
  } finally {
    signal.removeEventListener("abort", cancel);
    clearTimeout(timeout);
  }
}

/** @param {AbortSignal} signal @returns {Promise<Country[]>} */
export async function getCountries(signal) {
  /** @type {{name: string, flag: string, iso2: string}[]} */
  const countries = await fetchCountries("/flag/images", signal);
  const names = typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["es"], { type: "region", fallback: "none" })
    : null;

  return countries
    .filter(({ name, flag }) => name && flag)
    .map(({ name, flag, iso2 }) => ({
      name,
      flag: flag.replace(/^http:/i, "https:"),
      iso2,
      label: /^[A-Z]{2}$/.test(iso2) ? names?.of(iso2) || name : name,
    }));
}

/** @param {AbortSignal} signal @returns {Promise<Record<string, string>>} */
export async function getCapitals(signal) {
  /** @type {{iso2: string, capital: string}[]} */
  const countries = await fetchCountries("/capital", signal);
  return Object.fromEntries(
    countries
      .filter(({ iso2, capital }) => iso2 && capital?.trim())
      .map(({ iso2, capital }) => [iso2, capital.trim()]),
  );
}

