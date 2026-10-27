
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";

export default function Leaderboard() {
  const { leaderboard, playerName } = useGame();

  const sortedPlayers = [...leaderboard].sort(
    (a, b) => b.score - a.score
  );

  const renderPlayer = ({ item, index }) => {
    const isCurrentPlayer = item.name === playerName;

    return (
      <View
        style={[
          styles.playerRow,
          isCurrentPlayer && styles.currentPlayer,
        ]}
      >
        <Text style={styles.position}>
          {index + 1}
        </Text>

        <Text
          style={[
            styles.playerName,
            isCurrentPlayer && styles.highlightText,
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Text style={styles.score}>
          {item.score} pts
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Tabla de posiciones
      </Text>

      <View style={styles.tableHeader}>
        <Text style={styles.headerPosition}>Pos.</Text>
        <Text style={styles.headerName}>Jugador</Text>
        <Text style={styles.headerScore}>Puntos</Text>
      </View>

      {sortedPlayers.length === 0 ? (
        <Text style={styles.emptyMessage}>
          Todavía no hay jugadores registrados.
        </Text>
      ) : (
        <FlatList
          data={sortedPlayers}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.name}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#475569",
  },

  headerPosition: {
    width: 50,
    color: "#38BDF8",
    fontWeight: "bold",
  },

  headerName: {
    flex: 1,
    color: "#38BDF8",
    fontWeight: "bold",
  },

  headerScore: {
    width: 90,
    textAlign: "right",
    color: "#38BDF8",
    fontWeight: "bold",
  },

  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    borderRadius: 6,
  },

  currentPlayer: {
    backgroundColor: "#0C4A6E",
  },

  position: {
    width: 45,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  playerName: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 16,
  },

  highlightText: {
    color: "#7DD3FC",
    fontWeight: "bold",
  },

  score: {
    width: 90,
    textAlign: "right",
    color: "#4ADE80",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyMessage: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 25,
  },
});
