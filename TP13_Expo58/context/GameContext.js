import { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCapitals, getCountries } from "../services/countriesApi";
import { hiddenLetters, makeRound, normalize, ROUND_SECONDS, secondsLeft, visibleOptions } from "./gameRules";

/** @typedef {import("../services/countriesApi").Country} Country */
/** @typedef {import("./gameRules").GameMode} GameMode */
/** @typedef {import("./gameRules").Round} Round */
/** @typedef {{player: string, mode: GameMode, score: number}} Session */
/** @typedef {Session & {id: string}} RankingEntry */

const GameContext = createContext(/** @type {ReturnType<typeof useGameState> | null} */ (null));
const RANKING_KEY = "tp13:ranking:v1";

function useGameState() {
  const [countries, setCountries] = useState(/** @type {Country[]} */ ([]));
  const [capitals, setCapitals] = useState(/** @type {Record<string, string>} */ ({}));
  const [loading, setLoading] = useState(true);
  const [countriesError, setCountriesError] = useState(false);
  const [capitalsError, setCapitalsError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [session, setSession] = useState(/** @type {Session | null} */ (null));
  const [round, setRound] = useState(/** @type {Round | null} */ (null));
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [ranking, setRanking] = useState(/** @type {RankingEntry[]} */ ([]));
  const [rankingReady, setRankingReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const rankingWrites = useRef(Promise.resolve());

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getCountries(signal)
      .then((data) => {
        if (signal.aborted) return;
        if (!data.length) throw new Error("No hay banderas disponibles.");
        setCountries(data);
        setRound((previous) => previous ?? makeRound(data, {}, "flags"));
      })
      .catch(() => { if (!signal.aborted) setCountriesError(true); })
      .finally(() => { if (!signal.aborted) setLoading(false); });

    getCapitals(signal)
      .then((data) => {
        if (signal.aborted) return;
        if (new Set(Object.values(data)).size < 3) throw new Error("Faltan capitales.");
        setCapitals(data);
      })
      .catch(() => { if (!signal.aborted) setCapitalsError(true); });

    return () => controller.abort();
  }, [loadAttempt]);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(RANKING_KEY)
      .then((value) => { if (active && value) setRanking(JSON.parse(value)); })
      .catch(() => { if (active) setStorageError(true); })
      .finally(() => { if (active) setRankingReady(true); });
    return () => { active = false; };
  }, []);

  const mode = session?.mode;
  const country = round?.country;
  const deadline = round?.deadline;

  useEffect(() => {
    if (!mode || !deadline || !country) return;

    const timer = setInterval(() => {
      const seconds = secondsLeft(deadline, Date.now());
      if (seconds > 0) {
        setRound((previous) => previous?.deadline === deadline && previous.seconds !== seconds
          ? { ...previous, seconds }
          : previous);
        return;
      }

      clearInterval(timer);
      const next = makeRound(countries, capitals, mode, country);
      setRound((previous) => previous?.deadline === deadline ? next : previous);
      setAnswer("");
      setMessage("Se acabó el tiempo. " + (mode === "flags" ? country.label : capitals[country.iso2]) + ".");
    }, 200);

    return () => clearInterval(timer);
  }, [capitals, countries, country, deadline, mode]);

  function reloadCountries() {
    setLoading(!countries.length);
    setCountriesError(false);
    setCapitalsError(false);
    setLoadAttempt((attempt) => attempt + 1);
  }

  /** @param {GameMode} nextMode */
  function startGame(nextMode) {
    const name = playerName.trim();
    if (!name || !countries.length || !rankingReady) return false;
    if (nextMode === "capitals" && !countries.some((item) => capitals[item.iso2])) return false;

    setSession({ player: name, mode: nextMode, score: 0 });
    setRound((previous) => nextMode === "flags" && !previous?.deadline && previous?.imageAttempt === 0
      ? previous
      : makeRound(countries, capitals, nextMode));
    setAnswer("");
    setMessage("");
    return true;
  }

  function nextCountry() {
    if (!mode) return;
    setRound(makeRound(countries, capitals, mode, country));
    setAnswer("");
  }

  /** @param {Round} shownRound */
  function flagLoaded(shownRound) {
    const nextDeadline = Date.now() + ROUND_SECONDS * 1000;
    setRound((previous) => (
      previous?.id === shownRound.id
      && previous.imageAttempt === shownRound.imageAttempt
      && !previous.deadline
      && !previous.imageError
        ? { ...previous, deadline: nextDeadline }
        : previous
    ));
  }

  /** @param {Round} shownRound @param {boolean} tryBackup */
  function flagFailed(shownRound, tryBackup) {
    setRound((previous) => (
      previous?.id === shownRound.id && previous.imageAttempt === shownRound.imageAttempt
        ? { ...previous, imageError: !tryBackup, imageAttempt: previous.imageAttempt + Number(tryBackup), deadline: null }
        : previous
    ));
  }

  function retryFlag() {
    setRound((previous) => previous && { ...previous, imageError: false, imageAttempt: previous.imageAttempt + 1 });
  }

  function guess(value = answer) {
    const seconds = deadline ? secondsLeft(deadline, Date.now()) : 0;
    if (!round || !country || !seconds || !value.trim()) return;

    const normalized = normalize(value);
    if (mode === "capitals" && !visibleOptions({ ...round, seconds }).includes(value)) return;
    const correct = mode === "flags"
      ? [country.name, country.label].some((name) => normalize(name) === normalized)
      : value === round.capital;

    const points = correct ? 10 + seconds : -1;
    setSession((previous) => previous && { ...previous, score: previous.score + points });
    setMessage(correct ? `${value.trim()} es correcto. +${points} puntos.` : "Respuesta incorrecta. −1 punto.");
    setAnswer("");
    if (correct) nextCountry();
  }

  function requestHint() {
    const now = Date.now();
    if (mode !== "flags" || !round || !deadline || !secondsLeft(deadline, now)) return;
    const hidden = hiddenLetters(round);
    if (!hidden.length) return;

    const chosen = hidden[Math.floor(Math.random() * hidden.length)];
    const newDeadline = deadline - 2000;
    setRound({
      ...round,
      deadline: newDeadline,
      seconds: secondsLeft(newDeadline, now),
      revealed: [...round.revealed, chosen],
    });
  }

  function finishGame() {
    if (!session) return;
    const id = normalize(session.player) + ":" + session.mode;
    const entry = { id, ...session };
    const best = ranking.find((item) => item.id === id);

    if (!best || entry.score > best.score) {
      const updated = [...ranking.filter((item) => item.id !== id), entry]
        .sort((first, second) => second.score - first.score);
      setRanking(updated);
      rankingWrites.current = rankingWrites.current
        .then(() => AsyncStorage.setItem(RANKING_KEY, JSON.stringify(updated)))
        .then(() => setStorageError(false))
        .catch(() => setStorageError(true));
    }

    setSession(null);
    setRound(makeRound(countries, {}, "flags", country));
    setAnswer("");
    setMessage("");
  }

  const query = normalize(answer);
  const suggestions = query && mode === "flags"
    ? countries.filter((item) => [item.label, item.name].some((name) => normalize(name).startsWith(query))).slice(0, 4)
    : [];
  const canGuess = Boolean(round && deadline && round.seconds > 0);

  return {
    loading, countriesError, capitalsError, reloadCountries,
    playerName, setPlayerName, rankingReady, ranking, storageError, startGame, finishGame,
    canPlayCapitals: countries.some((item) => capitals[item.iso2]),
    session, round, message, answer, setAnswer, suggestions, canGuess, guess,
    nextCountry, flagLoaded, flagFailed, retryFlag, requestHint,
    hintAvailable: canGuess && round !== null && mode === "flags" && hiddenLetters(round).length > 0,
    capitalOptions: round && mode === "capitals" ? visibleOptions(round) : [],
  };
}

/** @param {{children: import("react").ReactNode}} props */
export function GameProvider({ children }) {
  const game = useGameState();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGame() {
  const game = useContext(GameContext);
  if (!game) throw new Error("Falta GameProvider.");
  return game;
}

