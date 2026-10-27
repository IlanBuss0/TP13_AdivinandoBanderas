
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";

export default function GuessForm() {
  const { guess, currentCountry } = useGame();

  const [answer, setAnswer] = useState("");

  const handleGuess = () => {
    if (!answer.trim() || !currentCountry) {
      return;
    }

    guess(answer);
    setAnswer("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ¿A qué país pertenece esta bandera?
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Escribí el nombre del país"
        placeholderTextColor="#94A3B8"
        value={answer}
        onChangeText={setAnswer}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={handleGuess}
      />

      <TouchableOpacity
        style={[
          styles.button,
          !answer.trim() && styles.disabledButton,
        ]}
        onPress={handleGuess}
        disabled={!answer.trim() || !currentCountry}
      >
        <Text style={styles.buttonText}>
          Adivinar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 15,
  },

  button: {
    width: "100%",
    backgroundColor: "#0284C7",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
