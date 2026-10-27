
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getCountries,
  getCapitals,
} from "../services/countriesApi";

// Crear el Context
const GameContext = createContext();

// Configuración del juego
const ROUND_TIME = 15;
const STORAGE_KEY = "@geoquiz_leaderboard";

// Normalizar respuestas: ignorar mayúsculas y tildes
const normalizeText = (text = "") => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

// Mezclar elementos de un array
const shuffleArray = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export function GameProvider({ children }) {

  // ==========================
  // ESTADOS DEL JUEGO
  // ==========================

  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);

  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_TIME);

  const [playerName, setPlayerName] = useState("");
  const [playing, setPlaying] = useState(false);

  const [mode, setMode] = useState("flags");
  const [screen, setScreen] = useState("Home");

  const [hints, setHints] = useState([]);

  const [capitalOptions, setCapitalOptions] = useState([]);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const [leaderboard, setLeaderboard] = useState([]);
  const [rankingLoaded, setRankingLoaded] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // CARGAR PAÍSES DESDE LA API
  // ==========================

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      try {
        setLoading(true);
        setError("");

        const [flagsData, capitalsData] = await Promise.all([
          getCountries(),
          getCapitals(),
        ]);

        // Relacionar banderas y capitales por código ISO
        const capitalsMap = new Map();

        capitalsData.forEach((country) => {
          if (country.iso2 && country.capital) {
            capitalsMap.set(
              country.iso2.toUpperCase(),
              country.capital
            );
          }
        });

        const countriesList = flagsData
          .filter((country) => country.name && country.flag)
          .map((country) => ({
            name: country.name,
            flag: country.flag,
            iso2: country.iso2,
            capital:
              capitalsMap.get(
                country.iso2?.toUpperCase()
              ) || null,
          }));

        if (countriesList.length === 0) {
          throw new Error("No se encontraron países");
        }

        if (!active) return;

        setCountries(countriesList);

        // Elegir un país al azar al cargar la app
        const randomIndex = Math.floor(
          Math.random() * countriesList.length
        );

        setCurrentCountry(countriesList[randomIndex]);

      } catch (err) {
        if (active) {
          setError("No se pudieron cargar los países.");
          console.error(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, []);

  // ==========================
  // CARGAR RANKING GUARDADO
  // ==========================

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setLeaderboard(parsed);
          }
        }
      } catch (err) {
        console.error("Error cargando ranking:", err);
      } finally {
        setRankingLoaded(true);
      }
    };

    loadLeaderboard();
  }, []);

  // Guardar ranking cuando cambia
  useEffect(() => {
    if (!rankingLoaded) return;

    const saveLeaderboard = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(leaderboard)
        );
      } catch (err) {
        console.error("Error guardando ranking:", err);
      }
    };

    saveLeaderboard();
  }, [leaderboard, rankingLoaded]);

  // ==========================
  // ELEGIR UN PAÍS NUEVO
  // ==========================

  const chooseCountry = useCallback(
    (selectedMode = mode, previousCountry = currentCountry) => {

      const availableCountries = countries.filter(
        (country) => {
          // Capitales: solamente países con capital conocida
          if (selectedMode === "capitals" && !country.capital) {
            return false;
          }

          // Evitar repetir el mismo país consecutivamente
          if (
            previousCountry &&
            country.iso2 === previousCountry.iso2 &&
            countries.length > 1
          ) {
            return false;
          }

          return true;
        }
      );

      if (availableCountries.length === 0) {
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * availableCountries.length
      );

      const selectedCountry = availableCountries[randomIndex];

      // Reiniciar datos de la ronda
      setCurrentCountry(selectedCountry);
      setSecondsLeft(ROUND_TIME);
      setHints([]);
      setHiddenOptions([]);

      // Preparar opciones en modo capitales
      if (selectedMode === "capitals") {

        const incorrectCapitals = [
          ...new Set(
            countries
              .filter(
                (country) =>
                  country.capital &&
                  country.capital !== selectedCountry.capital
              )
              .map((country) => country.capital)
          ),
        ];

        const randomIncorrect = shuffleArray(
          incorrectCapitals
        ).slice(0, 2);

        const options = shuffleArray([
          selectedCountry.capital,
          ...randomIncorrect,
        ]);

        setCapitalOptions(options);

      } else {
        setCapitalOptions([]);
      }
    },
    [countries, mode, currentCountry]
  );

  const nextCountry = () => {
    chooseCountry(mode, currentCountry);
  };

  // ==========================
  // INICIAR PARTIDA
  // ==========================

  const startGame = (name, selectedMode = "flags") => {
    const cleanName = name.trim();

    if (!cleanName || countries.length === 0) {
      return;
    }

    setPlayerName(cleanName);
    setScore(0);
    setMode(selectedMode);
    setPlaying(true);
    setMessage("");
    setScreen("Game");

    // Registrar jugador o reiniciar su puntaje
    setLeaderboard((previous) => {
      const remaining = previous.filter(
        (player) =>
          normalizeText(player.name) !== normalizeText(cleanName)
      );

      return [
        ...remaining,
        { name: cleanName, score: 0 },
      ];
    });

    chooseCountry(selectedMode, null);
  };

  // ==========================
  // ACTUALIZAR PUNTAJE
  // ==========================

  const updateScore = (points) => {
    setScore((previous) => previous + points);

    setLeaderboard((previous) =>
      previous.map((player) =>
        normalizeText(player.name) === normalizeText(playerName)
          ? {
              ...player,
              score: player.score + points,
            }
          : player
      )
    );
  };

  // ==========================
  // COMPROBAR RESPUESTA
  // ==========================

  const guess = (answer) => {
    if (
      !playing ||
      !currentCountry ||
      secondsLeft <= 0
    ) {
      return false;
    }

    const correctAnswer =
      mode === "flags"
        ? currentCountry.name
        : currentCountry.capital;

    const isCorrect =
      normalizeText(answer) === normalizeText(correctAnswer);

    if (isCorrect) {
      // 10 puntos + segundos restantes
      const points = 10 + secondsLeft;

      updateScore(points);

      setMessage(`¡Correcto! +${points} puntos`);

      nextCountry();
      return true;
    }

    // Respuesta incorrecta
    updateScore(-1);
    setMessage("Incorrecto. -1 punto");

    return false;
  };

  // ==========================
  // SOLICITAR PISTA
  // ==========================

  const requestHint = () => {
    if (
      !playing ||
      mode !== "flags" ||
      !currentCountry ||
      secondsLeft <= 2
    ) {
      return;
    }

    const countryName = currentCountry.name;

    // Buscar posiciones que todavía estén ocultas
    const availablePositions = [...countryName]
      .map((letter, index) => ({ letter, index }))
      .filter(
        ({ letter, index }) =>
          /\p{L}/u.test(letter) &&
          !hints.includes(index)
      );

    if (availablePositions.length === 0) {
      return;
    }

    // Elegir una letra al azar
    const randomIndex = Math.floor(
      Math.random() * availablePositions.length
    );

    const selectedPosition =
      availablePositions[randomIndex].index;

    // Revelar la posición elegida
    setHints((previous) => [
      ...previous,
      selectedPosition,
    ]);

    // Descontar 2 segundos
    setSecondsLeft((previous) =>
      Math.max(0, previous - 2)
    );
  };

  // ==========================
  // TEMPORIZADOR
  // ==========================

  useEffect(() => {
    if (!playing || !currentCountry) {
      return;
    }

    // Al terminar la ronda, pasar al siguiente país
    if (secondsLeft === 0) {
      setMessage(
        `¡Tiempo agotado! Era ${currentCountry.name}.`
      );

      chooseCountry(mode, currentCountry);
      return;
    }

    const timeout = setTimeout(() => {
      setSecondsLeft((previous) =>
        Math.max(0, previous - 1)
      );
    }, 1000);

    return () => clearTimeout(timeout);

  }, [
    playing,
    currentCountry,
    secondsLeft,
    mode,
    chooseCountry,
  ]);

  // ==========================
  // ELIMINAR OPCIONES DE CAPITAL
  // ==========================

  useEffect(() => {
    if (
      !playing ||
      mode !== "capitals" ||
      !currentCountry
    ) {
      return;
    }

    // Eliminar una opción en los segundos 10 y 5
    if (secondsLeft !== 10 && secondsLeft !== 5) {
      return;
    }

    setHiddenOptions((previous) => {
      const incorrectOptions = capitalOptions.filter(
        (capital) =>
          capital !== currentCountry.capital &&
          !previous.includes(capital)
      );

      if (incorrectOptions.length === 0) {
        return previous;
      }

      const selected = incorrectOptions[0];

      return [...previous, selected];
    });

  }, [
    secondsLeft,
    playing,
    mode,
    currentCountry,
    capitalOptions,
  ]);

  // ==========================
  // REINICIAR PUNTAJE
  // ==========================

  const resetScore = () => {
    setScore(0);

    setLeaderboard((previous) =>
      previous.map((player) =>
        normalizeText(player.name) === normalizeText(playerName)
          ? { ...player, score: 0 }
          : player
      )
    );

    setMessage("");

    if (playing) {
      nextCountry();
    }
  };

  // ==========================
  // TERMINAR PARTIDA
  // ==========================

  const endGame = () => {
    setPlaying(false);
    setCurrentCountry(null);
    setMessage("");
    setScreen("Home");
  };

  // ==========================
  // NAVEGACIÓN
  // ==========================

  const navigateTo = (destination) => {
    setScreen(destination);
  };

  // ==========================
  // VALORES COMPARTIDOS
  // ==========================

  const value = {
    // Estados
    countries,
    currentCountry,
    score,
    secondsLeft,
    playerName,
    playing,
    mode,
    screen,
    hints,
    capitalOptions,
    hiddenOptions,
    leaderboard,
    loading,
    error,
    message,

    // Funciones
    startGame,
    guess,
    nextCountry,
    chooseCountry,
    updateScore,
    requestHint,
    resetScore,
    endGame,
    navigateTo,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Hook personalizado para consumir el Context
export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame debe utilizarse dentro de GameProvider"
    );
  }

  return context;
}
