
import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";

export default function Timer() {
  const { secondsLeft } = useGame();

  const progress = (secondsLeft / 15) * 100;

  const getTimerColor = () => {
    if (secondsLeft <= 5) {
      return "#EF4444";
    }

    if (secondsLeft <= 10) {
      return "#FACC15";
    }

    return "#22C55E";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Tiempo restante
      </Text>

      <Text
        style={[
          styles.time,
          { color: getTimerColor() },
        ]}
      >
        {secondsLeft}s
      </Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: getTimerColor(),
            },
          ]}
        />
      </View>
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
    marginBottom: 20,
  },

  title: {
    fontSize: 16,
    color: "#CBD5E1",
    marginBottom: 10,
  },

  time: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 15,
  },

  progressBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#475569",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 10,
  },
});
