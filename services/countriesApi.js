
const FLAGS_URL =
  "https://countriesnow.space/api/v0.1/countries/flag/images";

const CAPITALS_URL =
  "https://countriesnow.space/api/v0.1/countries/capital";

// Obtener todos los países con sus banderas
export const getCountries = async () => {
  try {
    const response = await fetch(FLAGS_URL);

    if (!response.ok) {
      throw new Error("Error al obtener los países");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.msg || "Error en la API");
    }

    return data.data;
  } catch (error) {
    console.error("Error al cargar países:", error);
    throw error;
  }
};

// Obtener todos los países con sus capitales
export const getCapitals = async () => {
  try {
    const response = await fetch(CAPITALS_URL);

    if (!response.ok) {
      throw new Error("Error al obtener las capitales");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.msg || "Error en la API");
    }

    return data.data;
  } catch (error) {
    console.error("Error al cargar capitales:", error);
    throw error;
  }
};
