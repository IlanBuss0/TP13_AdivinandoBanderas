
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useGame } from "../context/GameContext";

export default function Flag() {
  const { currentCountry } = useGame();

  if (!currentCountry) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Cargando bandera...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: currentCountry.flag }}
        style={styles.flag}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  flag: {
    width: "100%",
    height: 180,
  },
  message: {
    fontSize: 16,
    color: "#64748B",
  },
});
