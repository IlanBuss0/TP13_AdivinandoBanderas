
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";

import Flag from "../components/Flag";
import GuessForm from "../components/GuessForm";
import ScoreBoard from "../components/ScoreBoard";
import Timer from "../components/Timer";
import Hints from "../components/Hints";
import CapitalOptions from "../components/CapitalOptions";

export default function GameScreen() {
  const {
    mode,
    message,
    endGame,
    navigateTo,
  } = useGame();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>GeoQuiz</Text>

      <Text style={styles.subtitle}>
        {mode === "flags"
          ? "Modo: Adivinar banderas"
          : "Modo: Adivinar capitales"}
      </Text>

      <ScoreBoard />

      <Timer />

      <Flag />

      {mode === "flags" ? (
        <>
          <GuessForm />
          <Hints />
        </>
      ) : (
        <CapitalOptions />
      )}

      <Text style={styles.message}>
        {message}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.rankingButton}
          onPress={() => navigateTo("Ranking")}
        >
          <Text style={styles.buttonText}>
            Ver ranking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endButton}
          onPress={endGame}
        >
          <Text style={styles.buttonText}>
            Terminar partida
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#38BDF8",
    textAlign: "center",
    marginTop: 15,
  },

  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },

  message: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FACC15",
    textAlign: "center",
    marginVertical: 20,
    minHeight: 25,
  },

  actions: {
    gap: 12,
    marginTop: 10,
  },

  rankingButton: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  endButton: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
