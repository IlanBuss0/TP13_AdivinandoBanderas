
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

import { GameProvider, useGame } from "./context/GameContext";

import HomeScreen from "./views/HomeScreen";
import GameScreen from "./views/GameScreen";
import RankingScreen from "./views/RankingScreen";

function AppContent() {
  const { screen } = useGame();

  const renderScreen = () => {
    switch (screen) {
      case "Game":
        return <GameScreen />;

      case "Ranking":
        return <RankingScreen />;

      case "Home":
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0F172A"
      />
      {renderScreen()}
    </View>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
});
