
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";

export default function Hints() {
  const {
    currentCountry,
    hints,
    requestHint,
    secondsLeft,
    mode,
  } = useGame();

  if (!currentCountry || mode !== "flags") {
    return null;
  }

  const countryName = currentCountry.name;

  // Mostrar letras reveladas y ocultar las demás
  const hiddenName = [...countryName]
    .map((letter, index) => {
      // Mantener espacios, guiones y otros símbolos
      if (!/\p{L}/u.test(letter)) {
        return letter;
      }

      // Mostrar la letra si ya fue revelada
      if (hints.includes(index)) {
        return letter;
      }

      return "_";
    })
    .join(" ");

  const canRequestHint =
    secondsLeft > 2 &&
    [...countryName].some(
      (letter, index) =>
        /\p{L}/u.test(letter) &&
        !hints.includes(index)
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pistas
      </Text>

      <Text style={styles.description}>
        Revelá letras del nombre del país.
      </Text>

      <View style={styles.wordContainer}>
        <Text style={styles.hiddenWord}>
          {hiddenName}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !canRequestHint && styles.disabledButton,
        ]}
        onPress={requestHint}
        disabled={!canRequestHint}
      >
        <Text style={styles.buttonText}>
          Pedir pista (-2 segundos)
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Tiempo disponible: {secondsLeft}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginVertical: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 20,
  },

  wordContainer: {
    width: "100%",
    backgroundColor: "#0F172A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },

  hiddenWord: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#38BDF8",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 36,
  },

  button: {
    width: "100%",
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  info: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 12,
  },
});
