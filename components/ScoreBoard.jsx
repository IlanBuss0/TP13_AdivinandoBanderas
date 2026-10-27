
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";

export default function ScoreBoard() {
  const { score, playerName, resetScore } = useGame();

  return (
    <View style={styles.container}>
      <View style={styles.playerInfo}>
        <Text style={styles.label}>Jugador</Text>
        <Text style={styles.playerName}>
          {playerName}
        </Text>
      </View>

      <View style={styles.scoreInfo}>
        <Text style={styles.label}>Puntaje</Text>
        <Text style={styles.score}>
          {score}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetScore}
      >
        <Text style={styles.resetButtonText}>
          Reiniciar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  playerInfo: {
    flex: 1,
  },

  scoreInfo: {
    flex: 1,
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 5,
  },

  playerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  score: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4ADE80",
  },

  resetButton: {
    backgroundColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
