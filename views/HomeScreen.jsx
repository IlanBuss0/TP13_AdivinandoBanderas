
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";
import Leaderboard from "../components/Leaderboard";

export default function RankingScreen() {
  const { navigateTo, playing } = useGame();

  const handleBack = () => {
    navigateTo(playing ? "Game" : "Home");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        Ranking de jugadores
      </Text>

      <Text style={styles.subtitle}>
        Los mejores puntajes de GeoQuiz
      </Text>

      <Leaderboard />

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
      >
        <Text style={styles.buttonText}>
          {playing ? "Volver al juego" : "Volver al inicio"}
        </Text>
      </TouchableOpacity>
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
    paddingTop: 45,
    paddingBottom: 35,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#38BDF8",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  backButton: {
    backgroundColor: "#0284C7",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
