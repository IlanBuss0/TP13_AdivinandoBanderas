
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";

export default function CapitalOptions() {
  const {
    currentCountry,
    capitalOptions,
    hiddenOptions,
    guess,
    secondsLeft,
    mode,
  } = useGame();

  // Mostrar solamente en modo capitales
  if (!currentCountry || mode !== "capitals") {
    return null;
  }

  const handleAnswer = (capital) => {
    if (secondsLeft <= 0) {
      return;
    }

    guess(capital);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ¿Cuál es la capital de este país?
      </Text>

      <Text style={styles.subtitle}>
        Seleccioná la respuesta correcta
      </Text>

      <View style={styles.optionsContainer}>
        {capitalOptions.map((capital, index) => {
          const isHidden = hiddenOptions.includes(capital);

          return (
            <TouchableOpacity
              key={`${capital}-${index}`}
              style={[
                styles.optionButton,
                isHidden && styles.hiddenOption,
              ]}
              onPress={() => handleAnswer(capital)}
              disabled={isHidden || secondsLeft <= 0}
            >
              <Text
                style={[
                  styles.optionText,
                  isHidden && styles.hiddenText,
                ]}
              >
                {isHidden
                  ? "Opción eliminada"
                  : capital}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.info}>
        Cada 5 segundos se elimina una opción incorrecta.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 15,
  },

  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 25,
  },

  optionsContainer: {
    width: "100%",
    gap: 12,
  },

  optionButton: {
    width: "100%",
    backgroundColor: "#0284C7",
    paddingVertical: 17,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },

  optionText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  hiddenOption: {
    backgroundColor: "#334155",
    opacity: 0.4,
  },

  hiddenText: {
    color: "#94A3B8",
  },

  info: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
  },
});
